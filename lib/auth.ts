/**
 * lib/auth.ts
 * Shared authentication utilities for API routes (Node.js runtime).
 *
 * Limitation connue : la vérification JWT est locale (pas d'appel réseau à Payload).
 * Un utilisateur désactivé ou dont le rôle est retiré conserve l'accès jusqu'à
 * l'expiration du token (2h par défaut). Pour réduire cette fenêtre, baisser
 * tokenExpiration dans la collection Payload ou implémenter une liste de révocation.
 *
 * NE PAS importer ce fichier dans des composants client ou des pages publiques.
 * Ce fichier est exclusivement destiné aux routes API (Node.js) et à middleware.ts (Edge).
 */

import { jwtVerify } from 'jose';
import { timingSafeEqual } from 'crypto';
import type { NextApiRequest } from 'next';

// ─── Constants ────────────────────────────────────────────────────────────────

export const SESSION_COOKIE_NAME = 'admin_session';

/**
 * Durée de vie du cookie en secondes.
 * Doit correspondre à la valeur de tokenExpiration dans Payload (défaut : 7200s = 2h).
 */
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 jours pour confort (JWT valide 2h)

/**
 * Attributs du cookie de session.
 * Sécurité : HttpOnly empêche l'accès JS, SameSite=lax bloque les POST cross-site.
 */
export function buildSetCookieHeader(token: string, clear = false): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = clear ? 0 : SESSION_MAX_AGE;
  const parts = [
    `${SESSION_COOKIE_NAME}=${clear ? '' : token}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (isProduction) parts.push('Secure');
  return parts.join('; ');
}

// ─── JWT verification ─────────────────────────────────────────────────────────

function getJwtKey(): Uint8Array {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret) throw new Error('PAYLOAD_SECRET non défini');
  return new TextEncoder().encode(secret);
}

export interface AdminTokenPayload {
  id: string;
  email: string;
  collection: string;
  role?: string;
  exp: number;
  iat: number;
}

/**
 * Vérifie un JWT émis par Payload CMS.
 * Valide : signature (HS256), expiration, collection === 'users', role === 'admin'.
 * Lance une exception si l'une de ces conditions n'est pas remplie.
 */
export async function verifyPayloadJwt(token: string): Promise<AdminTokenPayload> {
  const key = getJwtKey();
  const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });

  const p = payload as Record<string, unknown>;

  if (p['collection'] !== 'users') {
    throw new Error(`Collection invalide: ${p['collection']}`);
  }
  if (p['role'] !== 'admin') {
    throw new Error(`Rôle insuffisant: ${p['role'] ?? 'absent'}`);
  }

  return payload as unknown as AdminTokenPayload;
}

// ─── Timing-safe SCRAPER_SECRET comparison ────────────────────────────────────

/**
 * Compare le Bearer token reçu avec SCRAPER_SECRET de manière résistante aux
 * attaques temporelles. Ne journalise jamais la valeur du secret.
 */
function isValidScraperSecret(provided: string): boolean {
  const expected = process.env.SCRAPER_SECRET;
  if (!expected || !provided) return false;
  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ─── CSRF Origin check ────────────────────────────────────────────────────────

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Pour les méthodes mutantes authentifiées par cookie, vérifie l'Origin
 * contre ADMIN_ALLOWED_ORIGINS (liste CSV) ou NEXT_PUBLIC_SITE_URL.
 * Renvoie true si la requête est autorisée.
 */
export function isOriginAllowed(req: NextApiRequest): boolean {
  if (!MUTATING_METHODS.has(req.method || '')) return true;

  const origin = (req.headers['origin'] || req.headers['referer'] || '') as string;
  if (!origin) return false;

  const rawList = process.env.ADMIN_ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_SITE_URL || '';
  const allowed = rawList
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return allowed.some((o) => origin.startsWith(o));
}

// ─── Dual-auth helper ─────────────────────────────────────────────────────────

export type AuthResult =
  | { ok: true; method: 'cookie'; user: AdminTokenPayload }
  | { ok: true; method: 'bearer' }
  | { ok: false; status: 401 | 403; error: string };

/**
 * Stratégie d'autorisation pour les routes API admin :
 *
 * 1. Cookie admin_session (dashboard humain)
 *    - JWT vérifié localement (HS256, PAYLOAD_SECRET)
 *    - collection === 'users' + role === 'admin' requis
 *    - Pour méthodes mutantes : Origin vérifié contre ADMIN_ALLOWED_ORIGINS
 *
 * 2. Bearer SCRAPER_SECRET (CLI, cron, n8n, serveur-à-serveur)
 *    - Comparaison timing-safe
 *    - Pas de vérification Origin (appels serveur légitimes sans navigateur)
 *
 * Renvoie AuthResult — jamais de valeur du secret dans les messages d'erreur.
 */
export async function verifyAdminRequest(req: NextApiRequest): Promise<AuthResult> {
  // — Path 1 : session cookie —
  const sessionToken = req.cookies?.[SESSION_COOKIE_NAME];
  if (sessionToken) {
    try {
      const user = await verifyPayloadJwt(sessionToken);
      // CSRF : vérification Origin sur méthodes mutantes
      if (!isOriginAllowed(req)) {
        return { ok: false, status: 403, error: 'Origin non autorisé' };
      }
      return { ok: true, method: 'cookie', user };
    } catch (e: any) {
      // Token invalide/expiré → on n'essaie pas le Bearer pour ne pas permettre
      // un repli silencieux sur un autre mécanisme si le cookie est présent mais corrompu.
      return { ok: false, status: 401, error: 'Session expirée ou invalide' };
    }
  }

  // — Path 2 : Bearer SCRAPER_SECRET —
  const authHeader = (req.headers['authorization'] || '') as string;
  const bearer = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (bearer && isValidScraperSecret(bearer)) {
    return { ok: true, method: 'bearer' };
  }

  return { ok: false, status: 401, error: 'Non authentifié' };
}
