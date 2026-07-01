/**
 * Script d'enrichissement 2ème passe — visite les fiches AS24 individuelles
 * pour compléter les données manquantes des véhicules déjà importés.
 *
 * Utilise le backend Playwright (/api/enrich-vehicle) pour récupérer
 * images + données texte en une seule passe. Firecrawl n'est plus utilisé
 * pour l'enrichissement individuel.
 *
 * Usage: tsx scripts/enrich-vehicles.ts [minScore] [limit]
 * Exemple: tsx scripts/enrich-vehicles.ts 70 50
 *   → enrichit les véhicules avec score < 70, max 50 véhicules
 *
 * Règle: le backend ne remplace jamais une donnée fiable déjà présente.
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';
const SCRAPER_SECRET = process.env.SCRAPER_SECRET || '';

// ─── Score de complétude ─────────────────────────────────────────────────────

interface VehicleFields {
  price?: number;
  title?: string;
  year?: number;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  imageUrls?: any[];
  processedImages?: any;
  dealer?: string;
  power?: string;
  exteriorColor?: string;
  doors?: number;
  seats?: number;
  features?: any[];
  description?: string;
  interiorColor?: string;
  dealerCity?: string;
  originalListingUrl?: string;
}

const SCORE_WEIGHTS = {
  price:           { weight: 10, label: 'Prix' },
  title:           { weight: 10, label: 'Titre' },
  year:            { weight: 10, label: 'Année' },
  mileage:         { weight: 10, label: 'Kilométrage' },
  fuel:            { weight: 10, label: 'Carburant' },
  transmission:    { weight: 10, label: 'Transmission' },
  images:          { weight: 10, label: 'Images' },
  dealer:          { weight: 10, label: 'Concessionnaire réel' },
  power:           { weight: 5,  label: 'Puissance' },
  exteriorColor:   { weight: 5,  label: 'Couleur extérieure' },
  doors:           { weight: 5,  label: 'Portes' },
  seats:           { weight: 5,  label: 'Places' },
  features:        { weight: 2,  label: 'Équipements' },
  description:     { weight: 2,  label: 'Description' },
  interiorColor:   { weight: 2,  label: 'Couleur intérieure' },
  dealerCity:      { weight: 2,  label: 'Ville concessionnaire' },
  originalListingUrl: { weight: 2, label: 'Lien annonce originale' },
};

const MAX_SCORE = Object.values(SCORE_WEIGHTS).reduce((s, f) => s + f.weight, 0);

export function calcCompletionScore(v: VehicleFields): { score: number; missingFields: string[] } {
  const missing: string[] = [];
  let earned = 0;

  const hasImages = (v.imageUrls && v.imageUrls.length > 0) || !!v.processedImages?.hero;

  const checks: Record<keyof typeof SCORE_WEIGHTS, boolean> = {
    price:           (v.price || 0) > 0,
    title:           !!v.title && v.title.length > 3,
    year:            !!v.year && v.year > 1990,
    mileage:         v.mileage != null && v.mileage >= 0,
    fuel:            !!v.fuel,
    transmission:    !!v.transmission,
    images:          hasImages,
    dealer:          !!v.dealer && !/importemoi/i.test(v.dealer),
    power:           !!v.power,
    exteriorColor:   !!v.exteriorColor,
    doors:           !!v.doors,
    seats:           !!v.seats,
    features:        Array.isArray(v.features) && v.features.length > 0,
    description:     !!v.description && v.description.length > 20,
    interiorColor:   !!v.interiorColor,
    dealerCity:      !!v.dealerCity,
    originalListingUrl: !!v.originalListingUrl,
  };

  for (const [key, present] of Object.entries(checks)) {
    const field = SCORE_WEIGHTS[key as keyof typeof SCORE_WEIGHTS];
    if (present) earned += field.weight;
    else missing.push(field.label);
  }

  return {
    score: Math.round((earned / MAX_SCORE) * 100),
    missingFields: missing,
  };
}

// ─── Appel au backend Playwright ─────────────────────────────────────────────

interface EnrichResult {
  imageUrls: string[];
  scrapedCount: number;
  extractedData: {
    description?: string;
    features?: string[];
    specifications?: { power?: string; powerKw?: number; powerHp?: number };
    exteriorColor?: string;
    interiorColor?: string;
    doors?: number;
    seats?: number;
    dealer?: string;
    dealerCity?: string;
  };
  appliedFields: string[];
}

/**
 * Appelle POST /api/enrich-vehicle.
 * Le backend gère le scraping Playwright + la sauvegarde en base.
 * Retourne null en cas d'erreur.
 */
export async function enrichVehicleViaBackend(vehicleId: string): Promise<EnrichResult | { error: string } | null> {
  try {
    const res = await fetch(`${BACKEND}/api/enrich-vehicle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret': SCRAPER_SECRET,
      },
      body: JSON.stringify({ vehicleId }),
      signal: AbortSignal.timeout(60_000),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`  ❌ Backend ${res.status}: ${errText.substring(0, 120)}`);
      try {
        const errJson = JSON.parse(errText);
        return { error: errJson.error || errText.substring(0, 120) };
      } catch {
        return { error: `${res.status}: ${errText.substring(0, 120)}` };
      }
    }

    return await res.json() as EnrichResult;
  } catch (e: any) {
    console.error(`  ❌ Erreur réseau: ${e.message}`);
    return { error: `Réseau: ${e.message}` };
  }
}

// ─── Script principal ────────────────────────────────────────────────────────

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const minScore = parseInt(process.argv[2] || '80', 10);
  const limit = parseInt(process.argv[3] || '30', 10);

  console.log(`\n🔍 Enrichissement 2ème passe (Playwright backend)`);
  console.log(`📡 Backend: ${BACKEND}`);
  console.log(`🎯 Score cible: <${minScore}% | Limite: ${limit} véhicules\n`);

  // Récupérer les véhicules avec originalListingUrl
  const res = await fetch(
    `${BACKEND}/api/vehicles?limit=500&where[sourcePlatform][equals]=autoscout24.de`
  );
  if (!res.ok) { console.error('❌ Impossible de récupérer les véhicules'); return; }

  const { docs: vehicles } = await res.json();
  console.log(`📦 ${vehicles.length} véhicules AutoScout24 trouvés\n`);

  const resolveListingUrl = (v: any): string | null => {
    if (v.originalListingUrl) return v.originalListingUrl;
    if (v.sourceUrl && v.sourceUrl.includes('/angebote/')) return v.sourceUrl;
    return null;
  };

  const withScores = vehicles
    .filter((v: any) => resolveListingUrl(v))
    .map((v: any) => ({ ...v, ...calcCompletionScore(v) }))
    .filter((v: any) => v.score < minScore)
    .sort((a: any, b: any) => a.score - b.score)
    .slice(0, limit);

  console.log(`🎯 ${withScores.length} véhicules à enrichir (score < ${minScore}%)\n`);

  let enriched = 0, skipped = 0, errors = 0;

  for (const vehicle of withScores) {
    const { score, missingFields } = calcCompletionScore(vehicle);
    console.log(`\n📋 ${vehicle.title}`);
    console.log(`   Score: ${score}% | Manque: ${missingFields.join(', ')}`);
    console.log(`   🎭 Playwright: ${vehicle.originalListingUrl}`);

    const result = await enrichVehicleViaBackend(vehicle.id);

    if (!result) {
      errors++;
      await sleep(3_000);
      continue;
    }

    if (result.appliedFields.length === 0 && result.scrapedCount === 0) {
      console.log(`  ℹ️  Rien à enrichir (fiche déjà complète ou aucune image trouvée)`);
      skipped++;
    } else {
      // Recalculer le score estimé à partir de ce qu'on vient d'appliquer
      const enrichedVehicle = {
        ...vehicle,
        imageUrls: result.imageUrls.map((url: string) => ({ url })),
        description: result.extractedData.description || vehicle.description,
        features: result.extractedData.features
          ? result.extractedData.features.map((f: string) => ({ feature: f }))
          : vehicle.features,
        exteriorColor: result.extractedData.exteriorColor || vehicle.exteriorColor,
        interiorColor: result.extractedData.interiorColor || vehicle.interiorColor,
        doors: result.extractedData.doors || vehicle.doors,
        seats: result.extractedData.seats || vehicle.seats,
        dealer: result.extractedData.dealer || vehicle.dealer,
        dealerCity: result.extractedData.dealerCity || vehicle.dealerCity,
      };
      const newScore = calcCompletionScore(enrichedVehicle).score;
      console.log(
        `  ✅ Enrichi: ${score}% → ${newScore}% | +${result.scrapedCount} images | ${result.appliedFields.join(', ') || '—'}`
      );
      enriched++;
    }

    await sleep(8_000); // respecter les rate limits AS24
  }

  console.log(`\n📊 Résumé enrichissement:`);
  console.log(`   Enrichis:  ${enriched}`);
  console.log(`   Ignorés:   ${skipped}`);
  console.log(`   Erreurs:   ${errors}`);
  console.log(`   Coût API:  0 crédits (Playwright uniquement)`);
}

main().catch(e => { console.error('❌ Erreur fatale:', e); process.exit(1); });
