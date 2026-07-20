/**
 * GET /api/auth/me
 *
 * Vérifie le cookie admin_session et retourne les informations de l'utilisateur.
 * Utilisé par useAuth pour hydrater l'état client sans exposer le JWT.
 *
 * Réponse OK : { id, email, name, role }
 * Réponse KO : 401
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { SESSION_COOKIE_NAME, verifyPayloadJwt } from '../../../lib/auth';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  let tokenPayload;
  try {
    tokenPayload = await verifyPayloadJwt(token);
  } catch {
    return res.status(401).json({ error: 'Session expirée' });
  }

  // Récupérer le nom depuis Payload (non stocké dans le JWT par défaut)
  let name = '';
  try {
    const userRes = await fetch(`${BACKEND}/api/users/${tokenPayload.id}`, {
      headers: { Authorization: `JWT ${token}` },
    });
    if (userRes.ok) {
      const userData = await userRes.json();
      name = userData?.name ?? '';
    }
  } catch {
    // Non bloquant — le nom est optionnel
  }

  return res.status(200).json({
    id: tokenPayload.id,
    email: tokenPayload.email,
    name,
    role: tokenPayload.role ?? 'admin',
  });
}
