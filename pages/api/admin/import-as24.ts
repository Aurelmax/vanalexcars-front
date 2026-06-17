/**
 * SSE streaming endpoint — Import AutoScout24 → Payload CMS
 * POST /api/admin/import-as24
 * Auth: Authorization: Bearer {SCRAPER_SECRET}
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeAutoScout24Page, AS24_BODY_MAP } from '../../../scripts/scrape-autoscout24';

export const config = { api: { responseLimit: false } };

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

// ─── Inline mapping functions (copied from scripts/import-autoscout24.ts) ────

const VALID_BRANDS = new Set([
  'audi', 'bmw', 'mercedes', 'porsche', 'volkswagen', 'mini',
  'alfa-romeo', 'aston-martin', 'bentley', 'ferrari', 'ford',
  'jaguar', 'lamborghini', 'land-rover', 'lexus', 'maserati',
  'mazda', 'mclaren', 'mg', 'opel', 'renault', 'rolls-royce',
  'toyota', 'volvo', 'other',
]);

function normalizeBrand(brand: string): string {
  const b = (brand || '').toLowerCase()
    .replace('mercedes-benz', 'mercedes')
    .replace('mercedes amg', 'mercedes')
    .replace('vw', 'volkswagen')
    .replace('alfa romeo', 'alfa-romeo')
    .replace('aston martin', 'aston-martin')
    .replace('land rover', 'land-rover')
    .replace('rolls royce', 'rolls-royce')
    .trim();
  return VALID_BRANDS.has(b) ? b : 'other';
}

function mapFuel(fuel?: string): string {
  const f = (fuel || '').toLowerCase();
  if (f.includes('elektro') || f.includes('electric')) return 'electric';
  if (f.includes('plugin') || f.includes('plug-in') || f.includes('phev')) return 'plugin-hybrid';
  if (f.includes('hybrid')) return 'hybrid';
  if (f.includes('diesel')) return 'diesel';
  return 'essence';
}

function mapTransmission(t?: string): string {
  const v = (t || '').toLowerCase();
  if (v.includes('auto') || v.includes('dsg') || v.includes('pdk') || v.includes('steptronic')) return 'automatic';
  return 'manual';
}

function mapBodyType(bodyType?: string, bodyParam?: string): string {
  if (bodyParam && AS24_BODY_MAP[bodyParam]) return AS24_BODY_MAP[bodyParam];
  const b = (bodyType || '').toLowerCase();
  if (b.includes('cabrio') || b.includes('roadster') || b.includes('spider')) return 'cabriolet';
  if (b.includes('suv') || b.includes('gelände')) return 'suv';
  if (b.includes('kombi') || b.includes('break') || b.includes('touring')) return 'break';
  if (b.includes('coup')) return 'coupe';
  if (b.includes('van') || b.includes('minibus')) return 'monospace';
  if (b.includes('limousine') || b.includes('sedan') || b.includes('hatchback')) return 'berline';
  return 'other';
}

function extractBodyParam(url: string): string {
  return url.match(/[?&]body=(\d+)/)?.[1] || '';
}

// ─── SSE helper ──────────────────────────────────────────────────────────────

function sendEvent(res: NextApiResponse, event: object) {
  res.write('data: ' + JSON.stringify(event) + '\n\n');
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ─── Main handler ────────────────────────────────────────────────────────────

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

  const { searchUrl, maxPages = 2 } = req.body as { searchUrl: string; maxPages?: number };

  if (!searchUrl) {
    return res.status(400).json({ error: 'searchUrl is required' });
  }

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const stats = { total: 0, created: 0, updated: 0, errors: 0 };
  const bodyParam = extractBodyParam(searchUrl);

  sendEvent(res, { type: 'log', message: `Démarrage import AS24 — ${maxPages} page(s)` });
  sendEvent(res, { type: 'log', message: `URL: ${searchUrl}` });
  sendEvent(res, { type: 'log', message: `Body param: ${bodyParam || 'non défini'} → ${AS24_BODY_MAP[bodyParam] || 'other'}` });

  try {
    for (let page = 1; page <= maxPages; page++) {
      const pageUrl = page === 1
        ? searchUrl
        : searchUrl.includes('&page=')
          ? searchUrl.replace(/&page=\d+/, `&page=${page}`)
          : `${searchUrl}&page=${page}`;

      sendEvent(res, { type: 'log', message: `Page ${page}/${maxPages}: ${pageUrl}` });

      const vehicles = await scrapeAutoScout24Page(pageUrl);

      if (vehicles.length === 0) {
        sendEvent(res, { type: 'log', message: `Aucun véhicule trouvé page ${page}, arrêt.` });
        break;
      }

      sendEvent(res, { type: 'log', message: `${vehicles.length} véhicules extraits page ${page}` });
      stats.total += vehicles.length;

      for (const v of vehicles) {
        try {
          const cleanBrand = normalizeBrand(v.brand || '');
          const externalRef = v.listingUrl
            ? v.listingUrl.split('/').filter(Boolean).pop() || `as24-${Date.now()}`
            : `as24-${Date.now()}`;

          // Check if already imported
          const checkRes = await fetch(`${BACKEND}/api/vehicles?where[externalReference][equals]=${externalRef}`);
          let existing = null;
          if (checkRes.ok) {
            const data = await checkRes.json();
            existing = data.docs?.[0] || null;
          }

          const realDealer = v.dealerName && !/importemoi/i.test(v.dealerName) ? v.dealerName : null;
          const brandLabel = cleanBrand.charAt(0).toUpperCase() + cleanBrand.slice(1);

          const allImageUrls = (v.imageUrls && v.imageUrls.length > 0)
            ? v.imageUrls.map((url: string) => ({ url }))
            : v.imageUrl ? [{ url: v.imageUrl }] : [];

          const equipmentFeatures = Array.isArray(v.equipment)
            ? v.equipment.filter(Boolean).map((f: string) => ({ feature: f }))
            : [];

          const vehicleData = {
            title: `${brandLabel} ${v.model || v.title}`,
            brand: cleanBrand,
            model: v.model || v.title,
            category: mapBodyType(v.bodyType, bodyParam),
            price: v.price || 0,
            year: v.year || new Date().getFullYear(),
            mileage: v.mileage || 0,
            fuel: mapFuel(v.fuel),
            transmission: mapTransmission(v.transmission),
            specifications: v.power ? { power: v.power } : {},
            exteriorColor: (v as any).exteriorColor || null,
            interiorColor: (v as any).interiorColor || null,
            doors: (v as any).doors || null,
            seats: (v as any).seats || null,
            location: v.dealerCountry || 'Allemagne',
            dealer: realDealer,
            dealerCity: v.dealerCity || null,
            dealerContact: v.dealerPhone || null,
            status: 'active',
            description: (v as any).description || '',
            externalId: externalRef,
            externalReference: externalRef,
            sourceUrl: v.listingUrl || searchUrl,
            sourcePlatform: 'autoscout24.de',
            originalListingUrl: v.listingUrl || null,
            lastScrapedAt: new Date().toISOString(),
            imageUrls: allImageUrls,
            features: equipmentFeatures,
          };

          const method = existing ? 'PATCH' : 'POST';
          const url = existing
            ? `${BACKEND}/api/vehicles/${existing.id}`
            : `${BACKEND}/api/vehicles`;

          const saveRes = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehicleData),
          });

          if (saveRes.ok) {
            const status = existing ? 'updated' : 'created';
            existing ? stats.updated++ : stats.created++;
            sendEvent(res, {
              type: 'vehicle',
              title: vehicleData.title,
              status,
              dealer: realDealer || '?',
              city: v.dealerCity || '?',
            });
          } else {
            stats.errors++;
            const errText = await saveRes.text();
            sendEvent(res, {
              type: 'vehicle',
              title: vehicleData.title,
              status: 'error',
              message: errText.substring(0, 120),
            });
          }

          await sleep(300);
        } catch (e: any) {
          stats.errors++;
          sendEvent(res, {
            type: 'vehicle',
            title: v.title || 'Véhicule inconnu',
            status: 'error',
            message: e.message,
          });
        }
      }

      if (page < maxPages) {
        sendEvent(res, { type: 'log', message: `Pause 2s avant page suivante…` });
        await sleep(2000);
      }
    }
  } catch (e: any) {
    sendEvent(res, { type: 'log', message: `Erreur fatale: ${e.message}` });
  }

  sendEvent(res, { type: 'done', stats });
  res.end();
}
