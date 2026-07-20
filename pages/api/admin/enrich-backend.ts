/**
 * POST /api/admin/enrich-backend
 *
 * Proxy SSE sécurisé : reçoit la requête du dashboard (authentifiée par cookie),
 * ajoute SCRAPER_SECRET côté serveur et transmet au backend Payload.
 *
 * SCRAPER_SECRET n'est jamais envoyé au navigateur ni exposé dans les réponses.
 * En cas d'erreur, aucun message ne peut révéler la valeur du secret.
 *
 * Auth : cookie admin_session (dashboard) OU Bearer SCRAPER_SECRET (scripts/cron)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminRequest } from '../../../lib/auth';

export const config = { api: { responseLimit: false } };

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyAdminRequest(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const secret = process.env.SCRAPER_SECRET;
  if (!secret) {
    // Ne pas révéler que c'est un problème de configuration interne
    return res.status(500).json({ error: 'Configuration serveur incomplète' });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND}/api/bulk-enrich`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret': secret,
      },
      body: JSON.stringify(req.body),
    });
  } catch {
    return res.status(502).json({ error: 'Backend inaccessible' });
  }

  if (!backendRes.ok || !backendRes.body) {
    // Transmettre le statut sans exposer les détails internes
    return res.status(backendRes.status).json({ error: 'Erreur backend enrichissement' });
  }

  // Pipe SSE stream
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const reader = backendRes.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  } catch {
    // Connexion client fermée — normal pour SSE
  } finally {
    res.end();
  }
}
