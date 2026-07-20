/**
 * POST /api/auth/login
 *
 * Transmet les credentials à Payload CMS, récupère le JWT et le place
 * dans un cookie HttpOnly. Le JWT n'est jamais exposé au client JS.
 *
 * Body : { email: string, password: string }
 * Réponse OK : { success: true, user: { id, email, name, role } }
 * Réponse KO : { error: string }
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { buildSetCookieHeader, verifyPayloadJwt } from '../../../lib/auth';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

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
    // Ne pas exposer les détails internes de l'erreur Payload
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

  // Vérification locale : collection === 'users' ET role === 'admin'
  let tokenPayload;
  try {
    tokenPayload = await verifyPayloadJwt(rawToken);
  } catch {
    // Authentifié chez Payload mais rôle ou collection insuffisants
    return res.status(403).json({ error: 'Accès refusé : rôle admin requis' });
  }

  // Migration : si le rôle est absent du JWT (utilisateur pré-migration),
  // on le patche immédiatement en base pour que les prochains logins l'incluent.
  if (!tokenPayload.role) {
    fetch(`${BACKEND}/api/users/${tokenPayload.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${rawToken}`,
      },
      body: JSON.stringify({ role: 'admin' }),
    }).catch(() => {}); // Non bloquant
  }

  // Cookie HttpOnly — le JWT brut ne part jamais dans le body JSON
  res.setHeader('Set-Cookie', buildSetCookieHeader(rawToken));

  return res.status(200).json({
    success: true,
    user: {
      id: tokenPayload.id,
      email: tokenPayload.email,
      name: data?.user?.name ?? '',
      role: tokenPayload.role ?? 'admin',
    },
  });
}
