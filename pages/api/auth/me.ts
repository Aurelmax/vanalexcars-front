/**
 * GET /api/auth/me
 *
 * Lit le cookie admin_session et retourne les informations de l'utilisateur.
 * Décode le JWT sans re-vérifier la signature (la vérification se fait dans
 * le middleware Edge à chaque requête admin).
 *
 * Réponse OK : { id, email, name, role }
 * Réponse KO : 401
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { SESSION_COOKIE_NAME } from '../../../lib/auth';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const claims = decodeJwtPayload(token);
  if (!claims) {
    return res.status(401).json({ error: 'Session invalide' });
  }

  // Vérification expiration
  const now = Math.floor(Date.now() / 1000);
  if (typeof claims['exp'] === 'number' && claims['exp'] < now) {
    return res.status(401).json({ error: 'Session expirée' });
  }

  // Récupérer le nom depuis Payload (non stocké dans le JWT par défaut)
  let name = '';
  try {
    const userRes = await fetch(`${BACKEND}/api/users/${claims['id']}`, {
      headers: { Authorization: `JWT ${token}` },
    });
    if (userRes.ok) {
      const userData = await userRes.json();
      name = userData?.name ?? '';
    }
  } catch {
    // Non bloquant
  }

  return res.status(200).json({
    id: claims['id'],
    email: claims['email'],
    name,
    role: claims['role'] ?? 'admin',
  });
}
