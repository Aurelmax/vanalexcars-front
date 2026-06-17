/**
 * GET /api/admin/stats
 * Auth: Authorization: Bearer {SCRAPER_SECRET} OR ?secret=xxx
 * Returns vehicle list with completion scores sorted by score ASC
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { calcCompletionScore } from '../../../lib/completion-score';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth: Bearer token or query param
  const secret = process.env.SCRAPER_SECRET;
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader?.replace('Bearer ', '').trim();
  const querySecret = req.query.secret as string | undefined;
  const token = bearerToken || querySecret;

  if (!secret || token !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { brand, category, sourcePlatform } = req.query as {
    brand?: string;
    category?: string;
    sourcePlatform?: string;
  };

  try {
    let fetchUrl = `${BACKEND}/api/vehicles?limit=500`;
    if (brand) fetchUrl += `&where[brand][equals]=${encodeURIComponent(brand)}`;
    if (category) fetchUrl += `&where[category][equals]=${encodeURIComponent(category)}`;
    if (sourcePlatform) fetchUrl += `&where[sourcePlatform][equals]=${encodeURIComponent(sourcePlatform)}`;

    const fetchRes = await fetch(fetchUrl);
    if (!fetchRes.ok) {
      return res.status(502).json({ error: `Backend error: ${fetchRes.status}` });
    }

    const { docs: vehicles, totalDocs } = await fetchRes.json();

    const scored = vehicles.map((v: any) => {
      const { score, missingFields } = calcCompletionScore(v);
      return {
        id: v.id,
        title: v.title || '',
        brand: v.brand || '',
        category: v.category || '',
        dealer: v.dealer || '',
        dealerCity: v.dealerCity || '',
        price: v.price || 0,
        score,
        missingFields,
        sourcePlatform: v.sourcePlatform || '',
      };
    });

    // Sort by score ascending (worst first)
    scored.sort((a: any, b: any) => a.score - b.score);

    const total = scored.length;
    const avgScore = total > 0
      ? Math.round(scored.reduce((s: number, v: any) => s + v.score, 0) / total)
      : 0;
    const below80 = scored.filter((v: any) => v.score < 80).length;
    const below90 = scored.filter((v: any) => v.score < 90).length;

    return res.status(200).json({
      vehicles: scored,
      stats: { total, avgScore, below80, below90 },
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
