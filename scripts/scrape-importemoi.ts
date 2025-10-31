/**
 * Script de scraping ImporteMoi
 * Extrait les données JSON embarquées dans les pages de véhicules
 */

import {
  parseEquipmentFromDescription,
  BODY_COLOR_MAP,
  BODY_TYPE_MAP,
  FUEL_TYPE_MAP,
  cleanText,
} from './parse-equipment';

interface ScrapedVehicle {
  externalId: string;
  externalReference: string;
  mongoId: string;
  title: string;
  brand: string;
  model: string;
  category?: string;
  price: number;
  year: number;
  mileage: number;
  doors?: number;
  seats?: number;
  bodyType?: string;
  fuel: string;
  transmission: string;
  power?: string;
  location?: string;
  dealer?: string;
  dealerCity?: string;
  dealerContact?: string;
  description?: string;
  exteriorColor?: string;
  interiorColor?: string;
  images: string[];
  imageUrls: string[]; // URLs absolues des images du véhicule
  sourceUrl: string;
  sourcePlatform: string;
  publishedDate?: string;
  specifications?: {
    engine?: string;
    power?: string;
    powerKw?: number;
    powerHp?: number;
    consumption?: string;
    acceleration?: string;
    co2?: string;
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
  body_color?: number; // Couleur de carrosserie
  hp?: number; // Puissance
  fuel_category?: number; // Type de carburant
  description?: string;
  image?: string; // Nom du fichier image (ex: "mini-one-2022-1.webp")
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

      // Debug: sauvegarder le premier véhicule brut
      if (vehicles.length > 0) {
        const fs = await import('fs/promises');
        await fs.writeFile(
          './debug-vehicle.json',
          JSON.stringify(vehicles[0], null, 2)
        );
        console.log('🔍 DEBUG - Premier véhicule sauvegardé dans debug-vehicle.json');
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

      // Parser la description HTML pour extraire les équipements
      const parsedEquipment = parseEquipmentFromDescription(vehicle.description || '');

      // Mapper le type de carrosserie
      const bodyType = vehicle.body_type !== undefined
        ? BODY_TYPE_MAP[vehicle.body_type]
        : undefined;

      // Mapper le type de carburant
      const fuel = vehicle.fuel_category !== undefined
        ? FUEL_TYPE_MAP[vehicle.fuel_category] || 'essence'
        : 'essence';

      // Mapper la couleur extérieure
      const exteriorColor = vehicle.body_color !== undefined
        ? BODY_COLOR_MAP[vehicle.body_color]
        : parsedEquipment.exteriorColor;

      // Couleur intérieure depuis le parsing
      const interiorColor = parsedEquipment.interiorColor || parsedEquipment.upholstery;

      // Créer la description nettoyée
      const cleanDescription = cleanText(vehicle.description || '');

      // Puissance en kW (si hp disponible: 1 ch ≈ 0.7355 kW)
      const powerKw = vehicle.hp ? Math.round(vehicle.hp * 0.7355) : undefined;

      // Générer les URLs d'images
      const imageUrls = generateImageUrls(vehicle.mongo_id, vehicle.image);

      // Log du nombre d'images (seulement pour le premier véhicule pour éviter spam)
      if (vehicles.indexOf(vehicle) === 0) {
        logImageCount(imageUrls.length, title);
      }

      return {
        externalId: vehicle.id.toString(),
        externalReference: `IMP-${vehicle.id}`,
        mongoId: vehicle.mongo_id,
        title: title,
        brand: brand,
        model: modelText,
        category: bodyType,
        price: vehicle.total_price || 0,
        year: vehicle.first_registration_date || new Date().getFullYear(),
        mileage: vehicle.mileage || 0,
        doors: vehicle.number_of_doors,
        seats: vehicle.number_of_seats,
        bodyType: bodyType,
        fuel: fuel,
        transmission: TRANSMISSION_IDS[vehicle.transmission_type] || 'automatic',
        power: vehicle.hp ? `${vehicle.hp} ch` : undefined,
        location: 'Allemagne',
        description: cleanDescription,
        exteriorColor: exteriorColor,
        interiorColor: interiorColor,
        images: [],
        imageUrls: imageUrls,
        sourceUrl: `https://importemoi.fr/vehicule/${brand}-${vehicle.id}`,
        sourcePlatform: 'importemoi.fr',
        specifications: {
          power: vehicle.hp ? `${vehicle.hp} ch` : undefined,
          powerKw: powerKw,
          powerHp: vehicle.hp,
        },
        features: parsedEquipment.features.length > 0
          ? parsedEquipment.features.slice(0, 30).map(f => ({ feature: f })) // Format Payload
          : [],
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

/**
 * Génère les URLs d'images pour un véhicule ImporteMoi
 * Pattern découvert: https://storage.importemoi.fr/ad/{mongo_id}/{base_filename}-{index}.webp
 *
 * @param mongoId - ID MongoDB du véhicule
 * @param imageFilename - Nom du fichier image (ex: "mini-one-2022-1.webp")
 * @returns Tableau d'URLs d'images (max 6)
 */
function generateImageUrls(mongoId: string, imageFilename: string | undefined): string[] {
  const imageUrls: string[] = [];

  if (!imageFilename) {
    return imageUrls;
  }

  // Extraire le nom de base (enlever -1.webp pour obtenir mini-one-2022)
  const baseFilename = imageFilename.replace(/-\d+\.webp$/, '');

  // Pattern: https://storage.importemoi.fr/ad/{mongo_id}/{base}-{index}.webp
  for (let i = 1; i <= 6; i++) {
    imageUrls.push(`https://storage.importemoi.fr/ad/${mongoId}/${baseFilename}-${i}.webp`);
  }

  return imageUrls;
}

/**
 * Log du nombre d'images trouvées pour un véhicule
 */
function logImageCount(count: number, vehicleTitle: string): void {
  if (count > 0) {
    console.log(`🖼️  ${count} images générées pour ${vehicleTitle}`);
  } else {
    console.warn(`⚠️  Aucune image disponible pour ${vehicleTitle}`);
  }
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
