/**
 * POST /api/auth/login
 *
 * Transmet les credentials à Payload CMS, récupère le JWT et le place
 * dans un cookie HttpOnly. Le JWT n'est jamais exposé au client JS.
 *
 * Stratégie : Payload vérifie les credentials et signe le JWT.
 * On décode les claims sans re-vérifier la signature (Payload fait autorité).
 * Le cookie est ensuite vérifié localement par le middleware sur chaque requête.
 *
 * Body : { email: string, password: string }
 * Réponse OK : { success: true, user: { id, email, name, role } }
 * Réponse KO : { error: string }
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { buildSetCookieHeader } from '../../../lib/auth';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

/** Décode un JWT sans vérifier la signature (claims seulement). */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  let payloadRes: Response;
  try {
    payloadRes = await fetch(`${BACKEND}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return res.status(502).json({ error: 'Backend inaccessible' });
  }

  if (!payloadRes.ok) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  let data: any;
  try {
    data = await payloadRes.json();
  } catch {
    return res.status(502).json({ error: 'Réponse backend invalide' });
  }

  const rawToken: string = data?.token;
  if (!rawToken) {
    return res.status(502).json({ error: 'Token absent dans la réponse backend' });
  }

  // Décoder les claims sans vérifier la signature.
  // Payload a déjà validé les credentials — on lui fait confiance pour le login.
  const claims = decodeJwtPayload(rawToken);
  if (!claims) {
    return res.status(502).json({ error: 'JWT malformé dans la réponse backend' });
  }

  // Vérification minimale : doit être un user de la collection 'users'
  if (claims['collection'] !== 'users') {
    return res.status(403).json({ error: 'Accès refusé : collection invalide' });
  }

  // Patch migration : si le rôle est absent, on le patche en base (non bloquant)
  if (!claims['role']) {
    fetch(`${BACKEND}/api/users/${claims['id']}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${rawToken}`,
      },
      body: JSON.stringify({ role: 'admin' }),
    }).catch(() => {});
  }

  // Cookie HttpOnly — le JWT brut ne part jamais dans le body JSON
  res.setHeader('Set-Cookie', buildSetCookieHeader(rawToken));

  return res.status(200).json({
    success: true,
    user: {
      id: claims['id'] as string,
      email: claims['email'] as string ?? email,
      name: data?.user?.name ?? '',
      role: (claims['role'] as string) ?? 'admin',
    },
  });
}
