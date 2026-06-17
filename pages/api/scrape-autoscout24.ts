import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeAutoScout24, AS24_BODY_MAP, type AS24Vehicle } from '../../scripts/scrape-autoscout24';

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
  // Priorité au paramètre URL (fiable)
  if (bodyParam && AS24_BODY_MAP[bodyParam]) return AS24_BODY_MAP[bodyParam];

  const b = (bodyType || '').toLowerCase();
  if (b.includes('cabrio') || b.includes('roadster') || b.includes('spider') || b.includes('convert')) return 'cabriolet';
  if (b.includes('suv') || b.includes('gelände') || b.includes('offroad') || b.includes('4x4')) return 'suv';
  if (b.includes('kombi') || b.includes('break') || b.includes('wagon') || b.includes('touring')) return 'break';
  if (b.includes('coup') || b.includes('coupé')) return 'coupe';
  if (b.includes('van') || b.includes('minivan') || b.includes('monospace') || b.includes('minibus')) return 'monospace';
  if (b.includes('limousine') || b.includes('berline') || b.includes('sedan') || b.includes('hatchback') || b.includes('sportback')) return 'berline';
  return 'other';
}

const VALID_BRANDS = new Set([
  'audi','bmw','mercedes','porsche','volkswagen','mini',
  'alfa-romeo','aston-martin','bentley','ferrari','ford',
  'jaguar','lamborghini','land-rover','lexus','maserati',
  'mazda','mclaren','mg','opel','renault','rolls-royce',
  'toyota','volvo','other',
]);

function normalizeBrand(brand: string): string {
  const b = brand.toLowerCase()
    .replace('mercedes-benz', 'mercedes')
    .replace('mercedes amg', 'mercedes')
    .replace('vw', 'volkswagen')
    .replace('alfa romeo', 'alfa-romeo')
    .replace('aston martin', 'aston-martin')
    .replace('land rover', 'land-rover')
    .replace('rolls royce', 'rolls-royce')
    .replace('rolls-royce', 'rolls-royce')
    .trim();
  return VALID_BRANDS.has(b) ? b : 'other';
}

function extractBodyParam(url: string): string {
  const m = url.match(/[?&]body=(\d+)/);
  return m?.[1] || '';
}

interface ImportStats {
  total: number;
  created: number;
  updated: number;
  errors: number;
  errorDetails: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  const expectedAuth = `Bearer ${process.env.SCRAPER_SECRET || 'your-secret-key'}`;
  if (authHeader !== expectedAuth) return res.status(401).json({ error: 'Non autorisé' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { searchUrl, maxPages } = req.body;
  if (!searchUrl) return res.status(400).json({ error: 'Paramètre "searchUrl" requis' });

  console.log(`🚀 AutoScout24 import: ${searchUrl}`);

  const bodyParam = extractBodyParam(searchUrl);
  const vehicles = await scrapeAutoScout24(searchUrl, maxPages || 2);

  if (vehicles.length === 0) {
    return res.status(404).json({
      message: 'Aucun véhicule trouvé',
      stats: { total: 0, created: 0, updated: 0, errors: 0, errorDetails: [] },
    });
  }

  const stats: ImportStats = { total: vehicles.length, created: 0, updated: 0, errors: 0, errorDetails: [] };
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

  for (const v of vehicles) {
    try {
      const cleanBrand = normalizeBrand(v.brand || '');
      const category = mapBodyType(v.bodyType, bodyParam);

      // Générer un externalReference stable depuis l'URL de l'annonce
      const externalRef = v.listingUrl
        ? v.listingUrl.split('/').filter(Boolean).pop() || String(Date.now())
        : String(Date.now());

      // Vérifier si déjà importé
      const checkRes = await fetch(`${backendUrl}/api/vehicles?where[externalReference][equals]=${externalRef}`);
      let existing = null;
      if (checkRes.ok) {
        const data = await checkRes.json();
        existing = data.docs?.[0];
      }

      // Dealer réel AutoScout24 (jamais ImporteMoi)
      const realDealer = v.dealerName && !/importemoi/i.test(v.dealerName) ? v.dealerName : null;

      const vehicleData = {
        title: `${cleanBrand.charAt(0).toUpperCase() + cleanBrand.slice(1)} ${v.model || v.title}`,
        brand: cleanBrand,
        model: v.model || v.title,
        category,
        price: v.price || 0,
        year: v.year || new Date().getFullYear(),
        mileage: v.mileage || 0,
        fuel: mapFuel(v.fuel),
        transmission: mapTransmission(v.transmission),
        power: v.power || '',
        location: v.dealerCountry || 'Allemagne',
        dealer: realDealer,
        dealerCity: v.dealerCity || null,
        dealerContact: v.dealerPhone || null,
        exteriorColor: v.exteriorColor || null,
        status: 'active',
        description: '',
        externalId: externalRef,
        externalReference: externalRef,
        // Source primaire = AutoScout24
        sourceUrl: v.listingUrl || searchUrl,
        sourcePlatform: 'autoscout24.de',
        originalListingUrl: v.listingUrl || null,
        lastScrapedAt: new Date().toISOString(),
        imageUrls: v.imageUrl ? [{ url: v.imageUrl }] : [],
        features: [],
      };

      const method = existing ? 'PATCH' : 'POST';
      const url = existing
        ? `${backendUrl}/api/vehicles/${existing.id}`
        : `${backendUrl}/api/vehicles`;

      const saveRes = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      });

      if (saveRes.ok) {
        existing ? stats.updated++ : stats.created++;
        console.log(`✅ ${method === 'POST' ? 'Créé' : 'MàJ'}: ${vehicleData.title}`);
      } else {
        stats.errors++;
        const err = await saveRes.text();
        stats.errorDetails.push(`${vehicleData.title}: ${err.substring(0, 100)}`);
        console.error(`❌ ${method} ${vehicleData.title}`);
      }

      await new Promise(r => setTimeout(r, 300));
    } catch (error: any) {
      stats.errors++;
      stats.errorDetails.push(`${v.title}: ${error.message}`);
    }
  }

  console.log(`📊 Total:${stats.total} Créés:${stats.created} MàJ:${stats.updated} Erreurs:${stats.errors}`);
  return res.status(200).json({ message: 'Import AutoScout24 terminé', stats });
}
