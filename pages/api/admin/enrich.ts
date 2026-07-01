/**
 * SSE streaming endpoint — Enrich vehicles via AS24 individual listing scrape
 * POST /api/admin/enrich
 * Auth: Authorization: Bearer {SCRAPER_SECRET}
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { calcCompletionScore } from '../../../lib/completion-score';
import { enrichVehicleViaBackend } from '../../../scripts/enrich-vehicles';

export const config = { api: { responseLimit: false } };

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

function sendEvent(res: NextApiResponse, event: object) {
  res.write('data: ' + JSON.stringify(event) + '\n\n');
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function resolveListingUrl(v: any): string | null {
  if (v.originalListingUrl) return v.originalListingUrl;
  if (v.sourceUrl && v.sourceUrl.includes('/angebote/')) return v.sourceUrl;
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Auth check
  const secret = process.env.SCRAPER_SECRET;
  const authHeader = req.headers['authorization'];
  const token = authHeader?.replace('Bearer ', '').trim();

  if (!secret || token !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { minScore = 80, limit = 15, brand, category } = req.body as {
    minScore?: number;
    limit?: number;
    brand?: string;
    category?: string;
  };

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const stats = { total: 0, enriched: 0, skipped: 0, errors: 0 };

  sendEvent(res, { type: 'log', message: `Démarrage enrichissement — score cible: <${minScore}% | limite: ${limit}` });
  if (brand) sendEvent(res, { type: 'log', message: `Filtre marque: ${brand}` });
  if (category) sendEvent(res, { type: 'log', message: `Filtre catégorie: ${category}` });

  try {
    // Build fetch URL with optional filters
    let fetchUrl = `${BACKEND}/api/vehicles?limit=500&where[sourcePlatform][equals]=autoscout24.de`;
    if (brand) fetchUrl += `&where[brand][equals]=${encodeURIComponent(brand)}`;
    if (category) fetchUrl += `&where[category][equals]=${encodeURIComponent(category)}`;

    sendEvent(res, { type: 'log', message: `Récupération des véhicules depuis le backend…` });
    const fetchRes = await fetch(fetchUrl);

    if (!fetchRes.ok) {
      sendEvent(res, { type: 'log', message: `Erreur backend: ${fetchRes.status} ${fetchRes.statusText}` });
      sendEvent(res, { type: 'done', stats });
      return res.end();
    }

    const { docs: vehicles } = await fetchRes.json();
    sendEvent(res, { type: 'log', message: `${vehicles.length} véhicules AutoScout24 récupérés` });

    // Filter: must have a resolvable listing URL and score < minScore
    const toEnrich = vehicles
      .filter((v: any) => resolveListingUrl(v))
      .map((v: any) => ({
        ...v,
        listingUrlResolved: resolveListingUrl(v),
        ...calcCompletionScore(v),
      }))
      .filter((v: any) => v.score < minScore)
      .sort((a: any, b: any) => a.score - b.score)
      .slice(0, limit);

    stats.total = toEnrich.length;
    sendEvent(res, { type: 'log', message: `${toEnrich.length} véhicules à enrichir (score < ${minScore}%)` });

    for (const vehicle of toEnrich) {
      const { score: scoreBefore, missingFields } = calcCompletionScore(vehicle);

      sendEvent(res, {
        type: 'log',
        message: `Traitement: ${vehicle.title} (score: ${scoreBefore}%) — manque: ${missingFields.join(', ')}`,
      });

      // Si originalListingUrl est absent mais sourceUrl pointe vers une fiche individuelle,
      // on le patch en base avant d'appeler le backend d'enrichissement
      if (!vehicle.originalListingUrl && vehicle.sourceUrl?.includes('/angebote/')) {
        await fetch(`${BACKEND}/api/vehicles/${vehicle.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ originalListingUrl: vehicle.sourceUrl }),
        }).catch(() => null);
        sendEvent(res, { type: 'log', message: `→ originalListingUrl récupéré depuis sourceUrl` });
      }

      const result = await enrichVehicleViaBackend(vehicle.id);

      if (!result || 'error' in result) {
        stats.errors++;
        const errorMsg = result && 'error' in result ? result.error : 'Impossible de scraper la fiche (backend)';
        sendEvent(res, {
          type: 'vehicle',
          title: vehicle.title,
          scoreBefore,
          scoreAfter: scoreBefore,
          status: 'error',
          message: errorMsg,
        });
        await sleep(2000);
        continue;
      }

      if (!result.appliedFields || result.appliedFields.length === 0) {
        stats.skipped++;
        sendEvent(res, {
          type: 'vehicle',
          title: vehicle.title,
          scoreBefore,
          scoreAfter: scoreBefore,
          status: 'skipped',
          message: 'Rien à enrichir',
        });
        await sleep(1000);
        continue;
      }

      // Le backend a déjà mis à jour le véhicule — recalculer le score
      const enrichedVehicle = await fetch(`${BACKEND}/api/vehicles/${vehicle.id}`).then(r => r.json()).catch(() => vehicle);
      const scoreAfter = calcCompletionScore(enrichedVehicle).score;
      stats.enriched++;
      sendEvent(res, {
        type: 'vehicle',
        title: vehicle.title,
        scoreBefore,
        scoreAfter,
        status: 'enriched',
      });

      await sleep(1500);
    }
  } catch (e: any) {
    sendEvent(res, { type: 'log', message: `Erreur fatale: ${e.message}` });
  }

  sendEvent(res, { type: 'done', stats });
  res.end();
}
