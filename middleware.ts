/**
 * middleware.ts — Unified admin authentication (Edge runtime)
 *
 * Protège :
 *   - /admin/* (toutes les pages admin, sauf /admin/login)
 *   - /api/admin/* (toutes les routes API admin)
 *
 * Vérification locale du JWT Payload (HS256, PAYLOAD_SECRET) — aucun appel réseau.
 * Claims vérifiés : signature, expiration, collection === 'users', role === 'admin'.
 *
 * Limite connue : un utilisateur révoqué dans Payload conserve l'accès jusqu'à
 * l'expiration du token (2h). Réduire tokenExpiration dans Payload si nécessaire.
 */

import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';

function getKey(): Uint8Array {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret) throw new Error('PAYLOAD_SECRET non défini dans les variables d\'environnement');
  return new TextEncoder().encode(secret);
}

/**
 * Vérifie le JWT et ses claims métier.
 * Renvoie true uniquement si : signature valide + non expiré + collection users + role admin.
 */
async function isValidAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ['HS256'] });
    return payload['collection'] === 'users' && payload['role'] === 'admin';
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Sécurité basique (hérité de middleware.js) ──────────────────────────
  if (pathname.includes('..') || pathname.includes('//')) {
    return new NextResponse('Bad Request', { status: 400 });
  }
  if (/\.(env|config|log|sql|bak)$/.test(pathname)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const isApiRoute = pathname.startsWith('/api/admin/');
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  // ── Routes API admin ─────────────────────────────────────────────────────
  // Le middleware ajoute une première couche. Chaque route API vérifie aussi
  // individuellement (dual-auth avec Bearer SCRAPER_SECRET en fallback).
  if (isApiRoute) {
    // Laisser passer les requêtes portant un Bearer token (scripts/cron/n8n)
    // La route API elle-même validera le token SCRAPER_SECRET.
    const authHeader = req.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      return NextResponse.next();
    }

    if (!token || !(await isValidAdminToken(token))) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // ── Pages admin ──────────────────────────────────────────────────────────
  if (!token || !(await isValidAdminToken(token))) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Pages admin — toutes sauf /admin/login (et variantes i18n)
    '/admin/((?!login$|login/).*)',
    '/(fr|en|es|it)/admin/((?!login$|login/).*)',
    // Routes API admin
    '/api/admin/:path*',
  ],
};
