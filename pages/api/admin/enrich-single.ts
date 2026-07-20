/**
 * POST /api/admin/enrich-single
 *
 * Proxy sécurisé pour l'enrichissement d'un véhicule individuel.
 * Ajoute SCRAPER_SECRET côté serveur — jamais exposé au navigateur.
 *
 * Body : { vehicleId: string }
 * Auth : cookie admin_session (dashboard) OU Bearer SCRAPER_SECRET (scripts/cron)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminRequest } from '../../../lib/auth';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyAdminRequest(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const { vehicleId } = req.body as { vehicleId?: string };
  if (!vehicleId) {
    return res.status(400).json({ error: 'vehicleId requis' });
  }

  const secret = process.env.SCRAPER_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Configuration serveur incomplète' });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND}/api/enrich-vehicle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret': secret,
      },
      body: JSON.stringify({ vehicleId }),
    });
  } catch {
    return res.status(502).json({ error: 'Backend inaccessible' });
  }

  let data: any;
  try {
    data = await backendRes.json();
  } catch {
    return res.status(502).json({ error: 'Réponse backend invalide' });
  }

  if (!backendRes.ok) {
    // Transmettre le message d'erreur métier (sans le secret)
    const safeError = typeof data?.error === 'string'
      ? data.error.replace(secret, '[REDACTED]')
      : 'Erreur enrichissement';
    return res.status(backendRes.status).json({ error: safeError });
  }

  return res.status(200).json(data);
}
