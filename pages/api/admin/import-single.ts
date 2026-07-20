/**
 * POST /api/admin/import-single
 * Proxy sécurisé vers /api/import-single du backend.
 * Auth : cookie admin_session (dashboard) ou Bearer SCRAPER_SECRET (scripts).
 * SCRAPER_SECRET n'est jamais exposé au navigateur.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminRequest } from '../../../lib/auth';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await verifyAdminRequest(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  const secret = process.env.SCRAPER_SECRET;
  if (!secret) return res.status(500).json({ error: 'Configuration serveur incomplète' });

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND}/api/import-single`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-secret': secret },
      body: JSON.stringify(req.body),
    });
  } catch {
    return res.status(502).json({ error: 'Backend inaccessible' });
  }

  const data = await backendRes.json().catch(() => ({ error: 'Réponse backend invalide' }));
  return res.status(backendRes.status).json(data);
}
