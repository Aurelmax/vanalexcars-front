/**
 * Script d'enrichissement 2ème passe — visite les fiches AS24 individuelles
 * pour compléter les données manquantes des véhicules déjà importés.
 *
 * Usage: tsx scripts/enrich-vehicles.ts [minScore] [limit]
 * Exemple: tsx scripts/enrich-vehicles.ts 70 50
 *   → enrichit les véhicules avec score < 70, max 50 véhicules
 *
 * Règle: ne jamais écraser une donnée fiable déjà présente par une valeur vide.
 */

import FirecrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });
const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

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
  // Critiques — 10 pts chacun (80 pts max)
  price:           { weight: 10, label: 'Prix' },
  title:           { weight: 10, label: 'Titre' },
  year:            { weight: 10, label: 'Année' },
  mileage:         { weight: 10, label: 'Kilométrage' },
  fuel:            { weight: 10, label: 'Carburant' },
  transmission:    { weight: 10, label: 'Transmission' },
  images:          { weight: 10, label: 'Images' },
  dealer:          { weight: 10, label: 'Concessionnaire réel' },
  // Importants — 5 pts chacun (20 pts max)
  power:           { weight: 5,  label: 'Puissance' },
  exteriorColor:   { weight: 5,  label: 'Couleur extérieure' },
  doors:           { weight: 5,  label: 'Portes' },
  seats:           { weight: 5,  label: 'Places' },
  // Premium — 2 pts chacun (10 pts max)
  features:        { weight: 2,  label: 'Équipements' },
  description:     { weight: 2,  label: 'Description' },
  interiorColor:   { weight: 2,  label: 'Couleur intérieure' },
  dealerCity:      { weight: 2,  label: 'Ville concessionnaire' },
  originalListingUrl: { weight: 2, label: 'Lien annonce originale' },
};

const MAX_SCORE = Object.values(SCORE_WEIGHTS).reduce((s, f) => s + f.weight, 0); // 110

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
    if (present) {
      earned += field.weight;
    } else {
      missing.push(field.label);
    }
  }

  return {
    score: Math.round((earned / MAX_SCORE) * 100),
    missingFields: missing,
  };
}

// ─── Schema Firecrawl fiche individuelle ────────────────────────────────────

const VehicleDetailSchema = z.object({
  power: z.string().optional().describe('Puissance du moteur (ex: "450 PS", "331 kW", "450 ch")'),
  exteriorColor: z.string().optional().describe('Couleur extérieure de la carrosserie'),
  interiorColor: z.string().optional().describe('Couleur ou matière de la sellerie intérieure'),
  doors: z.number().optional().describe('Nombre de portes'),
  seats: z.number().optional().describe('Nombre de places assises'),
  description: z.string().optional().describe('Description complète de l\'annonce'),
  equipment: z.array(z.string()).optional().describe('Liste complète des équipements et options'),
  imageUrls: z.array(z.string()).optional().describe('URLs de toutes les photos du véhicule'),
  dealerName: z.string().optional().describe('Nom du concessionnaire vendeur (pas AutoScout24)'),
  dealerCity: z.string().optional().describe('Ville du concessionnaire'),
  dealerPhone: z.string().optional().describe('Téléphone du concessionnaire'),
  dealerAddress: z.string().optional().describe('Adresse complète du concessionnaire'),
});

type VehicleDetail = z.infer<typeof VehicleDetailSchema>;

export async function scrapeListingDetail(listingUrl: string): Promise<VehicleDetail | null> {
  // Extraire l'UUID de la fiche depuis l'URL AS24 (dernier segment après le dernier tiret)
  const listingUuidMatch = listingUrl.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:[^/]*)?$/i);
  const listingUuid = listingUuidMatch ? listingUuidMatch[1] : null;

  const extractImages = (html: string): string[] => {
    const as24ImgRegex = /https:\/\/prod\.pictures\.autoscout24\.net\/listing-images\/[\w/_-]+\.(?:jpg|jpeg|webp|png)/gi;
    const all = [...new Set([...html.matchAll(as24ImgRegex)].map(m => m[0]))];
    return listingUuid ? all.filter(url => url.includes(listingUuid)) : all;
  };

  try {
    console.log(`  🔥 Firecrawl fiche: ${listingUrl}`);

    // Appel 1 : données structurées uniquement (sans actions — toujours fiable)
    const dataResult: any = await app.scrapeUrl(listingUrl, {
      formats: [{
        type: 'json',
        prompt: `Extrait toutes les informations techniques de cette fiche véhicule :
- puissance moteur (en PS, kW ou ch) — obligatoire
- couleur extérieure de la carrosserie — obligatoire
- couleur/matière de la sellerie intérieure
- nombre de portes et de places
- description complète de l'annonce
- liste COMPLÈTE de tous les équipements et options (chaque item séparé)
- nom exact du concessionnaire vendeur (pas "AutoScout24")
- ville et téléphone du concessionnaire`,
        schema: VehicleDetailSchema,
      }, 'html'],
    } as any);

    const detail = dataResult.json || {};
    let html: string = dataResult.html || '';
    const credits1 = dataResult.metadata?.creditsUsed || 0;

    // Appel 2 : images via Playwright backend (galerie AS24 complète)
    let foundImages = extractImages(html);
    try {
      const playwrightRes = await fetch(`${BACKEND}/api/scrape-gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secret': process.env.SCRAPER_SECRET || '',
        },
        body: JSON.stringify({ url: listingUrl }),
        signal: AbortSignal.timeout(45000),
      });
      if (playwrightRes.ok) {
        const { images } = await playwrightRes.json() as { images: string[]; count: number };
        if (images && images.length > foundImages.length) {
          foundImages = images;
          console.log(`  🎭 Playwright: ${images.length} images`);
        }
      }
    } catch {
      // Playwright indisponible — on garde les images Firecrawl
    }

    if (foundImages.length > 0) {
      detail.imageUrls = foundImages;
      console.log(`  📸 ${foundImages.length} images (UUID ${listingUuid?.substring(0, 8) ?? 'n/a'})`);
    }

    console.log(`  ✅ (${credits1} crédits) — power:${detail?.power || '?'} color:${detail?.exteriorColor || '?'} imgs:${detail?.imageUrls?.length || 0} equip:${detail?.equipment?.length || 0}`);
    return detail;
  } catch (e: any) {
    console.error(`  ❌ Erreur Firecrawl: ${e.message}`);
    return null;
  }
}

// ─── Merge intelligent : ne jamais écraser une valeur existante fiable ───────

export function mergeVehicle(existing: any, detail: VehicleDetail): Record<string, any> {
  const patch: Record<string, any> = {};

  // Valeurs parasites à ignorer (retournées par le LLM quand il ne sait pas)
  const isUseless = (v: any) => !v || v === 'N/A' || v === 'n/a' || v === '?' || v === '-' || String(v).trim() === '';

  // Règle : n'ajouter que si le champ existant est vide/null et la valeur est utile
  const addIfMissing = (field: string, value: any) => {
    if (!isUseless(value) && !existing[field]) patch[field] = value;
  };

  // power → specifications.power (champ imbriqué Payload)
  if (!isUseless(detail.power) && !existing.specifications?.power) {
    patch['specifications'] = { ...(existing.specifications || {}), power: detail.power };
  }
  addIfMissing('exteriorColor', detail.exteriorColor);
  addIfMissing('interiorColor', detail.interiorColor);
  addIfMissing('doors', detail.doors);
  addIfMissing('seats', detail.seats);
  addIfMissing('description', detail.description);
  addIfMissing('dealerCity', detail.dealerCity);
  addIfMissing('dealerContact', detail.dealerPhone);

  // Dealer : enrichir seulement si actuel est vide ou ImporteMoi
  if (detail.dealerName && (!existing.dealer || /importemoi/i.test(existing.dealer))) {
    patch['dealer'] = detail.dealerName;
  }

  // Équipements : enrichir si vide
  if (detail.equipment && detail.equipment.length > 0 && (!existing.features || existing.features.length === 0)) {
    patch['features'] = detail.equipment.map((f: string) => ({ feature: f }));
  }

  // Images : enrichir si moins de 2 images actuelles
  const currentImageCount = existing.imageUrls?.length || 0;
  if (detail.imageUrls && detail.imageUrls.length > currentImageCount) {
    patch['imageUrls'] = detail.imageUrls.map((url: string) => ({ url }));
  }

  patch['lastScrapedAt'] = new Date().toISOString();

  return patch;
}

// ─── Script principal ────────────────────────────────────────────────────────

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const minScore = parseInt(process.argv[2] || '80', 10);
  const limit = parseInt(process.argv[3] || '30', 10);

  console.log(`\n🔍 Enrichissement 2ème passe`);
  console.log(`📡 Backend: ${BACKEND}`);
  console.log(`🎯 Score cible: >${minScore}% | Limite: ${limit} véhicules\n`);

  // Récupérer tous les véhicules avec originalListingUrl
  const res = await fetch(`${BACKEND}/api/vehicles?limit=500&where[sourcePlatform][equals]=autoscout24.de`);
  if (!res.ok) { console.error('❌ Impossible de récupérer les véhicules'); return; }

  const { docs: vehicles } = await res.json();
  console.log(`📦 ${vehicles.length} véhicules AutoScout24 trouvés\n`);

  // Résoudre l'URL individuelle : originalListingUrl prioritaire, sinon sourceUrl si c'est une fiche /angebote/
  const resolveListingUrl = (v: any): string | null => {
    if (v.originalListingUrl) return v.originalListingUrl;
    if (v.sourceUrl && v.sourceUrl.includes('/angebote/')) return v.sourceUrl;
    return null;
  };

  // Calculer le score actuel et trier par score ascendant
  const withScores = vehicles
    .filter((v: any) => resolveListingUrl(v))
    .map((v: any) => ({ ...v, listingUrlResolved: resolveListingUrl(v), ...calcCompletionScore(v) }))
    .filter((v: any) => v.score < minScore)
    .sort((a: any, b: any) => a.score - b.score)
    .slice(0, limit);

  console.log(`🎯 ${withScores.length} véhicules à enrichir (score < ${minScore}%)\n`);

  let enriched = 0, skipped = 0, errors = 0;

  for (const vehicle of withScores) {
    const { score, missingFields } = calcCompletionScore(vehicle);
    console.log(`\n📋 ${vehicle.title}`);
    console.log(`   Score: ${score}% | Manque: ${missingFields.join(', ')}`);

    const detail = await scrapeListingDetail(vehicle.listingUrlResolved);
    if (!detail) { errors++; await sleep(2000); continue; }

    const patch = mergeVehicle(vehicle, detail);
    if (Object.keys(patch).length <= 1) { // seulement lastScrapedAt
      console.log(`  ℹ️  Rien à enrichir`);
      skipped++;
      await sleep(1000);
      continue;
    }

    const patchRes = await fetch(`${BACKEND}/api/vehicles/${vehicle.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });

    if (patchRes.ok) {
      const newScore = calcCompletionScore({ ...vehicle, ...patch }).score;
      console.log(`  ✅ Enrichi: score ${score}% → ${newScore}% (+${newScore - score}pts)`);
      enriched++;
    } else {
      console.error(`  ❌ PATCH échoué: ${(await patchRes.text()).substring(0, 100)}`);
      errors++;
    }

    await sleep(1500); // respecter les rate limits Firecrawl
  }

  console.log(`\n📊 Résumé enrichissement:`);
  console.log(`   Enrichis:  ${enriched}`);
  console.log(`   Ignorés:   ${skipped}`);
  console.log(`   Erreurs:   ${errors}`);
  console.log(`   Crédits utilisés: ~${enriched * 5}`);
}

main().catch(e => { console.error('❌ Erreur fatale:', e); process.exit(1); });
