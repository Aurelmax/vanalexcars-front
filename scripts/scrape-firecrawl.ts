/**
 * Scraper importemoi.fr via Firecrawl
 * Extraction structurée avec LLM + résistance Cloudflare
 *
 * IMPORTANT: ImporteMoi est la SOURCE de scraping, pas le vendeur.
 * Le dealer réel est le concessionnaire allemand qui publie l'annonce sur AutoScout24.
 */

import FirecrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

const VehicleListSchema = z.object({
  vehicles: z.array(z.object({
    title: z.string().describe('Titre complet du véhicule'),
    brand: z.string().describe('Marque (BMW, Audi, Mini, Porsche, etc.)'),
    model: z.string().describe('Modèle du véhicule (ex: 911 Carrera S, A4 Avant, Série 3)'),
    price: z.number().describe('Prix en euros'),
    year: z.number().optional().describe('Année de mise en circulation'),
    mileage: z.number().optional().describe('Kilométrage'),
    fuel: z.string().optional().describe('Carburant (essence, diesel, hybride, électrique)'),
    transmission: z.string().optional().describe('Boîte (manuelle, automatique)'),
    power: z.string().optional().describe('Puissance (ex: "450 ch" ou "331 kW / 450 PS")'),
    bodyType: z.string().optional().describe('Type de carrosserie : berline, break, suv, coupe, cabriolet, monospace, citadine, pickup'),
    exteriorColor: z.string().optional().describe('Couleur extérieure du véhicule'),
    interiorColor: z.string().optional().describe('Couleur ou matière de la sellerie intérieure'),
    doors: z.number().optional().describe('Nombre de portes'),
    seats: z.number().optional().describe('Nombre de places'),
    description: z.string().optional().describe('Description ou équipements principaux mentionnés dans l\'annonce'),
    equipment: z.array(z.string()).optional().describe('Liste des équipements et options du véhicule'),
    imageUrls: z.array(z.string()).optional().describe('URLs des images du véhicule (jusqu\'à 6)'),
    // Concessionnaire RÉEL — jamais ImporteMoi
    dealerName: z.string().optional().describe('Nom du concessionnaire réel en Allemagne. NE PAS mettre "ImporteMoi".'),
    dealerCity: z.string().optional().describe('Ville du concessionnaire'),
    dealerCountry: z.string().optional().describe('Pays du concessionnaire'),
    originalListingUrl: z.string().optional().describe('Lien vers l\'annonce originale AutoScout24 si présent'),
    imageUrl: z.string().optional().describe('URL de la première image du véhicule'),
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
        prompt: `Extrait la liste complète de tous les véhicules sur cette page avec :
- titre, marque, modèle, prix, année, kilométrage
- carburant, transmission, puissance, type de carrosserie
- couleur extérieure, couleur intérieure / sellerie
- nombre de portes, nombre de places
- description ou équipements mentionnés dans l'annonce
- liste des équipements et options
- URLs des images (jusqu'à 6)
- concessionnaire RÉEL (le garage allemand qui vend la voiture, PAS "ImporteMoi")
- ville et pays du concessionnaire
- lien vers l'annonce AutoScout24 si présent
- URL de la fiche véhicule sur importemoi.fr`,
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
      vehicles.slice(0, 3).forEach(v => console.log(`  - ${v.title} | ${v.price}€ | dealer: ${v.dealerName || '?'} | power: ${v.power || '?'} | color: ${v.exteriorColor || '?'}`));
    }
  }).catch(err => { console.error('❌', err); process.exit(1); });
}
