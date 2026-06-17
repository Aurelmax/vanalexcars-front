/**
 * Scraper AutoScout24 via Firecrawl
 * Source primaire — données dealer réelles, catégories fiables
 */

import FirecrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

// Mapping body type AutoScout24 (param URL) → valeur Payload
export const AS24_BODY_MAP: Record<string, string> = {
  '1': 'berline',
  '2': 'cabriolet',
  '3': 'break',
  '4': 'suv',
  '5': 'berline', // citadine → berline
  '6': 'berline', // kleinwagen
  '7': 'monospace',
  '8': 'monospace', // van
  '9': 'coupe',
  '10': 'other',
};

const AS24VehicleListSchema = z.object({
  vehicles: z.array(z.object({
    title: z.string().describe('Titre complet de l\'annonce (ex: "Porsche 911 Carrera S Cabriolet")'),
    brand: z.string().describe('Marque du véhicule'),
    model: z.string().describe('Modèle (ex: "911 Carrera S Cabriolet")'),
    price: z.number().describe('Prix en euros'),
    year: z.number().optional().describe('Année de première immatriculation'),
    mileage: z.number().optional().describe('Kilométrage en km'),
    fuel: z.string().optional().describe('Carburant : Benzin, Diesel, Elektro, Hybrid'),
    transmission: z.string().optional().describe('Boîte : Automatik, Schaltgetriebe'),
    power: z.string().optional().describe('Puissance (ex: "450 PS" ou "331 kW")'),
    bodyType: z.string().optional().describe('Type de carrosserie tel qu\'affiché sur la page'),
    exteriorColor: z.string().optional().describe('Couleur extérieure'),
    // Concessionnaire réel — AutoScout24 affiche toujours le vendeur
    dealerName: z.string().optional().describe('Nom exact du concessionnaire ou vendeur particulier'),
    dealerCity: z.string().optional().describe('Ville du concessionnaire'),
    dealerCountry: z.string().optional().describe('Pays (Deutschland, Allemagne)'),
    dealerPhone: z.string().optional().describe('Téléphone du concessionnaire si affiché'),
    // URLs
    listingUrl: z.string().optional().describe('URL complète de la fiche véhicule sur AutoScout24'),
    imageUrl: z.string().optional().describe('URL de la première image du véhicule'),
  }))
});

export type AS24Vehicle = z.infer<typeof AS24VehicleListSchema>['vehicles'][0];

/**
 * Scrape une page de résultats AutoScout24
 */
export async function scrapeAutoScout24Page(url: string): Promise<AS24Vehicle[]> {
  console.log(`🔥 Firecrawl AS24: ${url}`);

  try {
    const result = await app.scrapeUrl(url, {
      formats: [{
        type: 'json',
        prompt: `Extrait la liste complète de tous les véhicules affichés sur cette page AutoScout24.
Pour chaque véhicule, extrais : titre complet, marque, modèle, prix, année, kilométrage, carburant, boîte de vitesses, puissance, type de carrosserie, couleur extérieure.
Pour le concessionnaire : extrait le NOM EXACT du garage/concession, la ville, et le téléphone si visible.
Extrait aussi l'URL de la fiche véhicule et l'URL de l'image principale.`,
        schema: AS24VehicleListSchema,
      }],
    } as any);

    const vehicles = (result as any).json?.vehicles || [];
    console.log(`✅ ${vehicles.length} véhicules extraits — ${(result as any).metadata?.creditsUsed || 0} crédits`);
    return vehicles;
  } catch (error: any) {
    console.error(`❌ Erreur Firecrawl AS24:`, error.message);
    return [];
  }
}

/**
 * Scrape plusieurs pages AutoScout24 à partir d'une URL de recherche
 */
export async function scrapeAutoScout24(
  searchUrl: string,
  maxPages: number = 3
): Promise<AS24Vehicle[]> {
  const allVehicles: AS24Vehicle[] = [];
  console.log(`\n🚀 AutoScout24 (${maxPages} pages)`);

  // Extraire le bodyType depuis l'URL pour info
  const bodyMatch = searchUrl.match(/[?&]body=(\d+)/);
  const bodyParam = bodyMatch?.[1] || '';
  const category = AS24_BODY_MAP[bodyParam] || 'other';
  console.log(`📋 Catégorie: ${category} (body=${bodyParam})`);

  for (let page = 1; page <= maxPages; page++) {
    // AutoScout24 pagination : &page=2
    const pageUrl = page === 1
      ? searchUrl
      : searchUrl.includes('&page=')
        ? searchUrl.replace(/&page=\d+/, `&page=${page}`)
        : `${searchUrl}&page=${page}`;

    const vehicles = await scrapeAutoScout24Page(pageUrl);
    if (vehicles.length === 0) {
      console.log(`⚠️ Aucun véhicule page ${page}, arrêt.`);
      break;
    }
    allVehicles.push(...vehicles);
    if (page < maxPages) await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`🎉 Total: ${allVehicles.length} véhicules AutoScout24`);
  return allVehicles;
}

// CLI: tsx scripts/scrape-autoscout24.ts "https://www.autoscout24.de/lst?body=2&..."
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2] || 'https://www.autoscout24.de/lst?body=2&fregfrom=2023&cy=D&damaged_listing=exclude&ustate=N%2CU&atype=C';
  const pages = parseInt(process.argv[3] || '1', 10);

  scrapeAutoScout24(url, pages).then(vehicles => {
    console.log('\n📊 Résumé:');
    console.log(`   Véhicules: ${vehicles.length}`);
    if (vehicles.length > 0) {
      console.log(`   Prix moyen: ${Math.round(vehicles.reduce((s, v) => s + (v.price || 0), 0) / vehicles.length)}€`);
      console.log('\n📋 Exemples:');
      vehicles.slice(0, 5).forEach(v =>
        console.log(`  - ${v.title} | ${v.price}€ | ${v.dealerName || '?'} | ${v.dealerCity || '?'}`)
      );
    }
  }).catch(err => { console.error('❌', err); process.exit(1); });
}
