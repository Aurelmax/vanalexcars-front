/**
 * Script de scraping ImporteMoi
 * Extrait les données JSON embarquées dans les pages de véhicules
 */

interface ScrapedVehicle {
  externalId: string;
  externalReference: string;
  mongoId: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  power?: string;
  location?: string;
  dealer?: string;
  description?: string;
  images: string[];
  sourceUrl: string;
  sourcePlatform: string;
  publishedDate?: string;
  specifications?: {
    engine?: string;
    power?: string;
    consumption?: string;
    color?: string;
    interior?: string;
  };
  features?: string[];
}

interface ImporteMoiVehicle {
  id: number;
  mongo_id: string;
  reference?: string;
  make: number; // ID de la marque
  model: number; // ID du modèle
  model_version_input?: string; // Version du modèle (texte)
  total_price: number;
  first_registration_date: number; // Année
  mileage: number;
  transmission_type: number; // 1=auto, 2=manual
  body_type: number; // Type de carrosserie
  hp?: number; // Puissance
  fuel_category?: number; // Type de carburant
  description?: string;
  images?: any[];
  number_of_seats?: number;
  number_of_doors?: number;
  equipments?: string;
  [key: string]: any;
}

// Mapping des IDs marques ImporteMoi (vérifié sur le site)
const BRAND_IDS: Record<number, string> = {
  16338: 'mini',   // MINI
  13: 'bmw',       // BMW
  47: 'mercedes',  // Mercedes-Benz
  9: 'audi',       // Audi
  57: 'porsche',   // Porsche
  74: 'volkswagen', // Volkswagen
};

// Mapping des types de transmission
const TRANSMISSION_IDS: Record<number, string> = {
  1: 'automatic',
  2: 'manual',
};

/**
 * Scrape une page ImporteMoi et extrait les véhicules
 */
export async function scrapeImporteMoiPage(
  url: string
): Promise<ScrapedVehicle[]> {
  try {
    console.log(`🔍 Scraping: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Extraire le JSON Next.js de la page
    // Format: {"props":{"pageProps":{"preloadAds":[...]}}}
    let vehicles: ImporteMoiVehicle[] = [];

    // Chercher l'index de "preloadAds" dans le HTML
    const preloadAdsIndex = html.indexOf('"preloadAds":');

    if (preloadAdsIndex === -1) {
      console.warn('⚠️ Aucun preloadAds trouvé dans la page');
      return [];
    }

    // Trouver le début du tableau [
    const arrayStartIndex = html.indexOf('[', preloadAdsIndex);

    if (arrayStartIndex === -1) {
      console.warn('⚠️ Format preloadAds invalide');
      return [];
    }

    // Extraire le tableau JSON en comptant les crochets
    let depth = 0;
    let arrayEndIndex = arrayStartIndex;
    let inString = false;
    let escapeNext = false;

    for (let i = arrayStartIndex; i < html.length; i++) {
      const char = html[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === '\\') {
        escapeNext = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '[') depth++;
        if (char === ']') {
          depth--;
          if (depth === 0) {
            arrayEndIndex = i + 1;
            break;
          }
        }
      }
    }

    if (arrayEndIndex === arrayStartIndex) {
      console.warn('⚠️ Impossible de trouver la fin du tableau preloadAds');
      return [];
    }

    const jsonString = html.substring(arrayStartIndex, arrayEndIndex);

    try {
      vehicles = JSON.parse(jsonString);
      console.log(`✅ ${vehicles.length} véhicules extraits du JSON`);

      // Debug: afficher le premier véhicule brut
      if (vehicles.length > 0) {
        console.log('🔍 DEBUG - Premier véhicule brut:', JSON.stringify(vehicles[0], null, 2).substring(0, 800));
      }
    } catch (error) {
      console.error('❌ Erreur parsing JSON:', error);
      console.error('Extrait (premiers 500 caractères):', jsonString.substring(0, 500));
      return [];
    }

    if (vehicles.length === 0) {
      console.warn('⚠️ Tableau preloadAds vide');
      return [];
    }

    // Transformer les données au format VanalexCars
    const scrapedVehicles: ScrapedVehicle[] = vehicles.map((vehicle) => {
      const brand = BRAND_IDS[vehicle.make] || 'other';
      const modelText = vehicle.model_version_input || `Model ${vehicle.model}`;
      const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
      const title = `${brandName} ${modelText}`;

      return {
        externalId: vehicle.id.toString(),
        externalReference: `IMP-${vehicle.id}`,
        mongoId: vehicle.mongo_id,
        title: title,
        brand: brand,
        model: modelText,
        price: vehicle.total_price || 0,
        year: vehicle.first_registration_date || new Date().getFullYear(),
        mileage: vehicle.mileage || 0,
        fuel: 'essence', // Par défaut essence (sera amélioré plus tard)
        transmission: TRANSMISSION_IDS[vehicle.transmission_type] || 'automatic',
        power: vehicle.hp ? `${vehicle.hp} ch` : undefined,
        location: 'Allemagne',
        description: vehicle.description || '',
        images: [],
        sourceUrl: `https://importemoi.fr/vehicule/${brand}-${vehicle.id}`,
        sourcePlatform: 'importemoi.fr',
        specifications: {
          power: vehicle.hp ? `${vehicle.hp} ch` : undefined,
        },
        features: [],
      };
    });

    return scrapedVehicles;
  } catch (error) {
    console.error('❌ Erreur lors du scraping:', error);
    throw error;
  }
}

/**
 * Scrape plusieurs pages avec pagination
 */
export async function scrapeImporteMoiBrand(
  brand: string,
  maxPages: number = 5
): Promise<ScrapedVehicle[]> {
  const allVehicles: ScrapedVehicle[] = [];
  const baseUrl = `https://importemoi.fr/${brand}-occasion-allemagne`;

  console.log(`🚀 Début du scraping de ${brand.toUpperCase()}`);
  console.log(`📄 Nombre de pages à scraper: ${maxPages}`);

  for (let page = 1; page <= maxPages; page++) {
    try {
      const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;

      const vehicles = await scrapeImporteMoiPage(url);

      if (vehicles.length === 0) {
        console.log(`⚠️ Aucun véhicule trouvé à la page ${page}, arrêt.`);
        break;
      }

      allVehicles.push(...vehicles);
      console.log(
        `✅ Page ${page}/${maxPages}: ${vehicles.length} véhicules récupérés`
      );

      // Pause entre les requêtes pour éviter le rate limiting
      if (page < maxPages) {
        await sleep(2000); // 2 secondes
      }
    } catch (error) {
      console.error(`❌ Erreur page ${page}:`, error);
      break;
    }
  }

  console.log(
    `🎉 Scraping terminé: ${allVehicles.length} véhicules au total`
  );
  return allVehicles;
}

/**
 * Télécharge une image et retourne le buffer
 */
export async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.warn(`⚠️ Image non disponible: ${url}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`❌ Erreur téléchargement image ${url}:`, error);
    return null;
  }
}

// === Fonctions utilitaires ===

function normalizeFuelType(fuel: string): string {
  if (!fuel) return 'essence'; // Default to essence instead of unknown

  const normalized = fuel.toLowerCase();

  if (normalized.includes('essence') || normalized.includes('petrol') || normalized.includes('gazole'))
    return 'essence';
  if (normalized.includes('diesel'))
    return 'diesel';
  if (normalized.includes('électrique') || normalized.includes('electric') || normalized.includes('elektro'))
    return 'electric';
  if (normalized.includes('hybride') || normalized.includes('hybrid'))
    return 'hybrid';

  // Default fallback
  return 'essence';
}

function normalizeTransmission(transmission: string): string {
  if (!transmission) return 'automatic'; // Default to automatic instead of unknown

  const normalized = transmission.toLowerCase();

  if (normalized.includes('auto') || normalized.includes('automatik'))
    return 'automatic';
  if (normalized.includes('manuel') || normalized.includes('manual') || normalized.includes('schalt'))
    return 'manual';

  // Default fallback
  return 'automatic';
}

function generateSlug(vehicle: ImporteMoiVehicle): string {
  const title = vehicle.title || `${vehicle.brand}-${vehicle.model}`;
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${slug}-${vehicle.reference?.replace('IMP-', '') || vehicle.id}`;
}

function extractSpecifications(vehicle: ImporteMoiVehicle): any {
  return {
    engine: vehicle.engine || undefined,
    power: vehicle.power || undefined,
    consumption: vehicle.consumption || undefined,
    color: vehicle.color || vehicle.exterior_color || undefined,
    interior: vehicle.interior_color || undefined,
  };
}

function extractFeatures(vehicle: ImporteMoiVehicle): string[] {
  const features: string[] = [];

  // Extraire les équipements s'ils existent
  if (vehicle.equipment && Array.isArray(vehicle.equipment)) {
    features.push(...vehicle.equipment);
  }

  if (vehicle.options && Array.isArray(vehicle.options)) {
    features.push(...vehicle.options);
  }

  return features.filter(Boolean);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// === Export pour usage CLI ===
if (import.meta.url === `file://${process.argv[1]}`) {
  const brand = process.argv[2] || 'mini';
  const maxPages = parseInt(process.argv[3] || '2', 10);

  scrapeImporteMoiBrand(brand, maxPages)
    .then((vehicles) => {
      console.log('\n📊 Résumé:');
      console.log(`   Total véhicules: ${vehicles.length}`);
      console.log(
        `   Prix moyen: ${Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length)}€`
      );
      console.log(
        `   Année moyenne: ${Math.round(vehicles.reduce((sum, v) => sum + v.year, 0) / vehicles.length)}`
      );
    })
    .catch((error) => {
      console.error('❌ Erreur fatale:', error);
      process.exit(1);
    });
}
