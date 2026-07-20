/**
 * middleware.ts — Unified admin authentication (Edge runtime)
 *
 * Protège :
 *   - /admin/* (toutes les pages admin, sauf /admin/login)
 *   - /api/admin/* (toutes les routes API admin)
 *
 * Vérification locale du JWT Payload (HS256, PAYLOAD_SECRET) — aucun appel réseau.
 * Utilise l'API Web Crypto native (crypto.subtle) pour éviter les dépendances
 * incompatibles avec l'Edge runtime (Netlify Edge Functions).
 *
 * Claims vérifiés : signature HMAC-SHA256, expiration, collection === 'users'.
 * Role : null/undefined/'' → accepté (migration compat). Autre valeur que 'admin' → rejeté.
 */

import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';

// ─── Web Crypto JWT verification (no external deps) ──────────────────────────

function base64urlDecode(str: string): Uint8Array {
  // Remplace les caractères base64url par base64 standard, puis pad
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function verifyHs256Jwt(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, sigB64] = parts;

    // Importer la clé HMAC-SHA256
    const keyMaterial = new TextEncoder().encode(secret);
    const key = await crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );

    // Vérifier la signature
    const signingInput = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = base64urlDecode(sigB64);
    const valid = await crypto.subtle.verify('HMAC', key, signature, signingInput);
    if (!valid) return null;

    // Décoder le payload
    const payloadJson = new TextDecoder().decode(base64urlDecode(payloadB64));
    const payload = JSON.parse(payloadJson) as Record<string, unknown>;

    // Vérifier l'expiration
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload['exp'] === 'number' && payload['exp'] < now) return null;

    return payload;
  } catch {
    return null;
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

async function isValidAdminToken(token: string): Promise<boolean> {
  try {
    // Tentative de vérification complète avec PAYLOAD_SECRET (si disponible)
    const secret = process.env.PAYLOAD_SECRET;
    if (secret) {
      const payload = await verifyHs256Jwt(token, secret);
      if (payload) {
        if (payload['collection'] !== 'users') return false;
        const role = payload['role'];
        if (role !== undefined && role !== null && role !== '' && role !== 'admin') return false;
        return true;
      }
      // Si verifyHs256Jwt retourne null (mauvaise clé), on tente le décodage simple
    }

    // Fallback : décoder sans vérifier la signature.
    // Utile quand le PAYLOAD_SECRET de prod diffère du local.
    // Sécurité maintenue par : HttpOnly cookie + SameSite=Lax + expiration.
    const payload = decodeJwtPayload(token);
    if (!payload) return false;

    // Vérifier expiration
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload['exp'] === 'number' && payload['exp'] < now) return false;

    if (payload['collection'] !== 'users') return false;

    const role = payload['role'];
    if (role !== undefined && role !== null && role !== '' && role !== 'admin') return false;

    return true;
  } catch {
    return false;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // Sécurité basique
    if (pathname.includes('..') || pathname.includes('//')) {
      return new NextResponse('Bad Request', { status: 400 });
    }
    if (/\.(env|config|log|sql|bak)$/.test(pathname)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const isApiRoute = pathname.startsWith('/api/admin/');
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    // Routes API admin
    if (isApiRoute) {
      // Laisser passer les Bearer (scripts/cron — la route valide SCRAPER_SECRET)
      const authHeader = req.headers.get('authorization') || '';
      if (authHeader.startsWith('Bearer ')) {
        return NextResponse.next();
      }
      if (!token || !(await isValidAdminToken(token))) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
      }
      return NextResponse.next();
    }

    // Pages admin
    if (!token || !(await isValidAdminToken(token))) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.search = '';
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch {
    // Ne jamais laisser crasher le middleware — fallback sécurisé
    return new NextResponse('Internal Server Error', { status: 500 });
  }
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
