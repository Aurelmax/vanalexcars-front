/**
 * Scraper importemoi.fr via Firecrawl
 * Extraction structurée avec LLM + résistance Cloudflare
 */

import FirecrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

const VehicleListSchema = z.object({
  vehicles: z.array(z.object({
    title: z.string().describe('Titre complet du véhicule'),
    brand: z.string().describe('Marque (BMW, Audi, Mini, Porsche, etc.)'),
    model: z.string().describe('Modèle du véhicule'),
    price: z.number().describe('Prix en euros'),
    year: z.number().optional().describe('Année de mise en circulation'),
    mileage: z.number().optional().describe('Kilométrage'),
    fuel: z.string().optional().describe('Carburant (essence, diesel, hybride, électrique)'),
    transmission: z.string().optional().describe('Boîte (manuelle, automatique)'),
    power: z.string().optional().describe('Puissance en ch'),
    dealer: z.string().optional().describe('Nom du concessionnaire'),
    location: z.string().optional().describe('Ville / pays'),
    imageUrl: z.string().optional().describe('URL de la première image'),
    vehicleUrl: z.string().optional().describe('URL de la page du véhicule sur importemoi.fr'),
  }))
});

export type FirecrawlVehicle = z.infer<typeof VehicleListSchema>['vehicles'][0];

export async function scrapeImporteMoiPageFirecrawl(
  brand: string,
  page: number = 1
): Promise<FirecrawlVehicle[]> {
  const baseUrl = `https://importemoi.fr/${brand}-occasion-allemagne`;
  const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;

  console.log(`🔥 Firecrawl: ${url}`);

  try {
    const result = await app.scrapeUrl(url, {
      formats: [{
        type: 'json',
        prompt: 'Extrait la liste de tous les véhicules visibles sur cette page avec leur titre, marque, modèle, prix, année, kilométrage, carburant, transmission, puissance, concessionnaire, URL image et URL page véhicule.',
        schema: VehicleListSchema,
      }],
    } as any);

    const vehicles = (result as any).json?.vehicles || [];
    console.log(`✅ ${vehicles.length} véhicules extraits (page ${page}) — ${(result as any).metadata?.creditsUsed || 0} crédits`);
    return vehicles;
  } catch (error: any) {
    console.error(`❌ Erreur page ${page}:`, error.message);
    return [];
  }
}

export async function scrapeImporteMoiBrandFirecrawl(
  brand: string,
  maxPages: number = 3
): Promise<FirecrawlVehicle[]> {
  const allVehicles: FirecrawlVehicle[] = [];
  console.log(`\n🚀 Firecrawl: ${brand.toUpperCase()} (${maxPages} pages)`);

  for (let page = 1; page <= maxPages; page++) {
    const vehicles = await scrapeImporteMoiPageFirecrawl(brand, page);
    if (vehicles.length === 0) {
      console.log(`⚠️ Aucun véhicule page ${page}, arrêt.`);
      break;
    }
    allVehicles.push(...vehicles);
    if (page < maxPages) await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`🎉 Total: ${allVehicles.length} véhicules`);
  return allVehicles;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const brand = process.argv[2] || 'porsche';
  const pages = parseInt(process.argv[3] || '1', 10);

  scrapeImporteMoiBrandFirecrawl(brand, pages).then(vehicles => {
    console.log('\n📊 Résumé:');
    console.log(`   Véhicules: ${vehicles.length}`);
    if (vehicles.length > 0) {
      console.log(`   Prix moyen: ${Math.round(vehicles.reduce((s, v) => s + (v.price || 0), 0) / vehicles.length)}€`);
      console.log('\n📋 Exemples:');
      vehicles.slice(0, 3).forEach(v => console.log(`  - ${v.title} | ${v.price}€ | ${v.year} | ${v.mileage}km`));
    }
  }).catch(err => { console.error('❌', err); process.exit(1); });
}
