/**
 * Script d'import direct AutoScout24 → Payload CMS
 * Usage: tsx scripts/import-autoscout24.ts "<url_recherche>" [maxPages]
 * Contourne l'API Next.js pour éviter les timeouts
 */

import { scrapeAutoScout24, AS24_BODY_MAP } from './scrape-autoscout24';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

const VALID_BRANDS = new Set([
  'audi','bmw','mercedes','porsche','volkswagen','mini',
  'alfa-romeo','aston-martin','bentley','ferrari','ford',
  'jaguar','lamborghini','land-rover','lexus','maserati',
  'mazda','mclaren','mg','opel','renault','rolls-royce',
  'toyota','volvo','other',
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

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const searchUrl = process.argv[2];
  const maxPages = parseInt(process.argv[3] || '3', 10);

  if (!searchUrl) {
    console.error('Usage: tsx scripts/import-autoscout24.ts "<url>" [maxPages]');
    process.exit(1);
  }

  console.log(`\n🚀 Import AutoScout24 → Payload CMS`);
  console.log(`📡 Backend: ${BACKEND}`);
  console.log(`🔗 URL: ${searchUrl}\n`);

  const bodyParam = extractBodyParam(searchUrl);
  const vehicles = await scrapeAutoScout24(searchUrl, maxPages);

  if (!vehicles.length) {
    console.log('⚠️ Aucun véhicule trouvé.');
    return;
  }

  let created = 0, updated = 0, errors = 0;

  for (const v of vehicles) {
    try {
      const cleanBrand = normalizeBrand(v.brand || '');
      const externalRef = v.listingUrl
        ? v.listingUrl.split('/').filter(Boolean).pop() || `as24-${Date.now()}`
        : `as24-${Date.now()}`;

      // Vérifier si déjà importé
      const checkRes = await fetch(`${BACKEND}/api/vehicles?where[externalReference][equals]=${externalRef}`);
      let existing = null;
      if (checkRes.ok) {
        const data = await checkRes.json();
        existing = data.docs?.[0];
      }

      const realDealer = v.dealerName && !/importemoi/i.test(v.dealerName) ? v.dealerName : null;
      const brandLabel = cleanBrand.charAt(0).toUpperCase() + cleanBrand.slice(1);

      // Images : priorité imageUrls[], sinon imageUrl seul
      const allImageUrls = (v.imageUrls && v.imageUrls.length > 0)
        ? v.imageUrls.map((url: string) => ({ url }))
        : v.imageUrl ? [{ url: v.imageUrl }] : [];

      // Équipements
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
        power: v.power || '',
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
      const url = existing ? `${BACKEND}/api/vehicles/${existing.id}` : `${BACKEND}/api/vehicles`;

      const saveRes = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      });

      if (saveRes.ok) {
        existing ? updated++ : created++;
        console.log(`✅ ${method === 'POST' ? 'Créé' : 'MàJ'}: ${vehicleData.title} | ${realDealer || '?'} | ${v.dealerCity || '?'}`);
      } else {
        errors++;
        const err = await saveRes.text();
        console.error(`❌ ${vehicleData.title}: ${err.substring(0, 120)}`);
      }

      await sleep(300);
    } catch (e: any) {
      errors++;
      console.error(`❌ ${v.title}: ${e.message}`);
    }
  }

  console.log(`\n📊 Résumé:`);
  console.log(`   Total:   ${vehicles.length}`);
  console.log(`   Créés:   ${created}`);
  console.log(`   MàJ:     ${updated}`);
  console.log(`   Erreurs: ${errors}`);
}

main().catch(e => { console.error('❌ Erreur fatale:', e); process.exit(1); });
