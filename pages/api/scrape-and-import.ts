import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeImporteMoiBrand } from '../../scripts/scrape-importemoi';
import { scrapeImporteMoiBrandFirecrawl, type FirecrawlVehicle } from '../../scripts/scrape-firecrawl';

/** Génère jusqu'à 6 URLs d'images depuis la première URL importemoi */
function generateImageUrls(firstImageUrl: string): string[] {
  // Pattern: https://storage.importemoi.fr/ad/{uuid}/{base}-1.webp
  const match = firstImageUrl.match(/^(https:\/\/storage\.importemoi\.fr\/ad\/[^/]+\/)(.+)-\d+(\.\w+)$/);
  if (!match) return [firstImageUrl];
  const [, base, name, ext] = match;
  return Array.from({ length: 6 }, (_, i) => `${base}${name}-${i + 1}${ext}`);
}

/** Extrait l'ID depuis l'URL véhicule importemoi */
function extractVehicleId(vehicleUrl: string): string {
  return vehicleUrl?.split('-').pop() || vehicleUrl || String(Date.now());
}

function mapFuel(fuel?: string): string {
  const f = (fuel || '').toLowerCase();
  if (f.includes('électrique') || f.includes('electrique') || f.includes('electric')) return 'electric';
  if (f.includes('plugin') || f.includes('rechargeable') || f.includes('phev')) return 'plugin-hybrid';
  if (f.includes('hybrid') || f.includes('hybride')) return 'hybrid';
  if (f.includes('diesel')) return 'diesel';
  return 'essence';
}

function mapTransmission(transmission?: string): string {
  const t = (transmission || '').toLowerCase();
  if (t.includes('auto') || t.includes('dsg') || t.includes('pdk')) return 'automatic';
  if (t.includes('man') || t.includes('manu')) return 'manual';
  return 'automatic';
}

function mapBodyType(bodyType?: string): string {
  const b = (bodyType || '').toLowerCase();
  if (b.includes('cabrio') || b.includes('convert') || b.includes('spider') || b.includes('roadster')) return 'cabriolet';
  if (b.includes('suv') || b.includes('4x4') || b.includes('crossover')) return 'suv';
  if (b.includes('break') || b.includes('wagon') || b.includes('touring') || b.includes('estate')) return 'break';
  if (b.includes('coupe') || b.includes('coupé')) return 'coupe';
  if (b.includes('monospace') || b.includes('van') || b.includes('minivan')) return 'monospace';
  if (b.includes('berline') || b.includes('sedan') || b.includes('limousine') || b.includes('hatchback') || b.includes('sportback')) return 'berline';
  return 'other';
}

interface ImportStats {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  errorDetails: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Authentification basique (vous devriez améliorer cela)
  const authHeader = req.headers.authorization;
  const expectedAuth = `Bearer ${process.env.SCRAPER_SECRET || 'your-secret-key'}`;

  console.log('🔐 Auth Debug - Header:', authHeader);
  console.log('🔐 Auth Debug - Expected:', expectedAuth);

  if (authHeader !== expectedAuth) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { brand, maxPages, downloadImages, useFirecrawl } = req.body;

    if (!brand) {
      return res.status(400).json({ error: 'Paramètre "brand" requis' });
    }

    console.log(`🚀 Début de l'import pour ${brand.toUpperCase()} (${useFirecrawl ? 'Firecrawl' : 'scraper classique'})`);

    // 1. Scraper les véhicules
    let vehicles: any[] = [];

    if (useFirecrawl) {
      const fcVehicles = await scrapeImporteMoiBrandFirecrawl(brand, maxPages || 2);
      // Mapper les données Firecrawl vers le format attendu
      vehicles = fcVehicles.map((v: FirecrawlVehicle) => {
        const externalRef = extractVehicleId(v.vehicleUrl || '');
        const imageUrls = v.imageUrl ? generateImageUrls(v.imageUrl) : [];
        const cleanBrand = (v.brand || brand).toLowerCase().replace('mercedes-benz', 'mercedes').replace('volkswagen', 'volkswagen');
        const cleanModel = v.model || v.title;
        // Titre propre : "Porsche 911 Carrera S" plutôt que le titre brut Firecrawl
        const brandLabel = cleanBrand.charAt(0).toUpperCase() + cleanBrand.slice(1);
        const cleanTitle = `${brandLabel} ${cleanModel}`;
        return {
          title: cleanTitle,
          brand: cleanBrand,
          model: cleanModel,
          price: v.price || 0,
          year: v.year || new Date().getFullYear(),
          mileage: v.mileage || 0,
          fuel: mapFuel(v.fuel),
          transmission: mapTransmission(v.transmission),
          category: mapBodyType(v.bodyType),
          power: v.power || '',
          location: v.location || 'Allemagne',
          dealer: v.dealer || null,
          description: '',
          externalId: externalRef,
          externalReference: externalRef,
          sourceUrl: v.vehicleUrl || '',
          sourcePlatform: 'importemoi.fr',
          imageUrls,
          features: [],
          specifications: v.power ? { power: v.power } : undefined,
        };
      });
    } else {
      vehicles = await scrapeImporteMoiBrand(brand, maxPages || 2);
    }

    if (vehicles.length === 0) {
      return res.status(404).json({
        message: 'Aucun véhicule trouvé',
        stats: {
          total: 0,
          created: 0,
          updated: 0,
          skipped: 0,
          errors: 0,
          errorDetails: [],
        },
      });
    }

    // 2. Importer dans Payload CMS
    const stats: ImportStats = {
      total: vehicles.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      errorDetails: [],
    };

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

    // Log du premier véhicule scrapé pour debug
    if (vehicles.length > 0) {
      console.log('📝 Premier véhicule scrapé:', JSON.stringify(vehicles[0], null, 2).substring(0, 500));
    }

    for (const vehicle of vehicles) {
      try {
        // Vérifier si le véhicule existe déjà
        const checkResponse = await fetch(
          `${backendUrl}/api/vehicles?where[externalReference][equals]=${vehicle.externalReference}`
        );

        let existingVehicle = null;

        if (checkResponse.ok) {
          const checkData = await checkResponse.json();
          existingVehicle = checkData.docs?.[0];
        }

        // Valeurs valides pour le champ category de Payload
        const validCategories = new Set(['berline', 'break', 'suv', 'coupe', 'cabriolet', 'monospace', 'other']);

        // Mapper bodyType vers les valeurs acceptées par category
        const categoryMap: Record<string, string> = {
          sedan: 'berline',
          wagon: 'break',
          touring: 'break',
          suv: 'suv',
          coupe: 'coupe',
          coupé: 'coupe',
          convertible: 'cabriolet',
          cabrio: 'cabriolet',
          cabriolet: 'cabriolet',
          décapotable: 'cabriolet',
          decapotable: 'cabriolet',
          roadster: 'cabriolet',
          spider: 'cabriolet',
          van: 'monospace',
          monospace: 'monospace',
          sportback: 'berline',
          hatchback: 'berline',
          berline: 'berline',
          break: 'break',
          limousine: 'berline',
          other: 'other',
        };

        // Déterminer la catégorie valide
        // Si vehicle.category est déjà une valeur Payload valide (ex: retourné par mapBodyType), l'utiliser directement
        const rawCategory = (vehicle.bodyType || vehicle.category || '').toLowerCase();
        const validCategory = validCategories.has(rawCategory)
          ? rawCategory
          : categoryMap[rawCategory] || 'other';

        // Préparer les données avec tous les champs structurés
        const vehicleData = {
          title: vehicle.title,
          brand: vehicle.brand,
          model: vehicle.model,
          category: validCategory, // Toujours envoyer une catégorie valide
          price: vehicle.price || 0,
          year: vehicle.year || new Date().getFullYear(),
          mileage: vehicle.mileage || 0,
          doors: vehicle.doors,
          seats: vehicle.seats,
          bodyType: vehicle.bodyType,
          fuel: vehicle.fuel || 'essence', // Valeur par défaut si manquante
          transmission: vehicle.transmission || 'automatic',
          location: vehicle.location || 'Allemagne',
          dealer: vehicle.dealer || null,
          dealerCity: vehicle.dealerCity || null,
          dealerContact: vehicle.dealerContact || null,
          status: 'active',
          description: vehicle.description || '',
          exteriorColor: vehicle.exteriorColor,
          interiorColor: vehicle.interiorColor,
          externalId: vehicle.externalId,
          externalReference: vehicle.externalReference,
          sourceUrl: vehicle.sourceUrl,
          sourcePlatform: vehicle.sourcePlatform,
          publishedDate: vehicle.publishedDate,
          lastScrapedAt: new Date().toISOString(), // Timestamp pour gestion obsolescence
          specifications: vehicle.specifications,
          // Corriger: le scraper retourne déjà features au format {feature: string}[]
          features: Array.isArray(vehicle.features)
            ? vehicle.features.map((f: any) =>
                typeof f === 'string' ? { feature: f } : f
              )
            : [],
          imageUrls: vehicle.imageUrls?.map((url: string) => ({ url })) || [],
        };

        // Log pour debug (premier véhicule uniquement)
        if (stats.created === 0 && stats.updated === 0) {
          console.log('📝 Données envoyées à Payload:', JSON.stringify(vehicleData, null, 2));
        }

        if (existingVehicle) {
          // Mettre à jour
          const updateResponse = await fetch(
            `${backendUrl}/api/vehicles/${existingVehicle.id}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(vehicleData),
            }
          );

          if (updateResponse.ok) {
            stats.updated++;
            console.log(`✅ Mis à jour: ${vehicle.title}`);
          } else {
            stats.errors++;
            const errorText = await updateResponse.text();
            stats.errorDetails.push(
              `Update ${vehicle.title}: ${errorText.substring(0, 100)}`
            );
            console.error(`❌ Erreur update: ${vehicle.title}`);
          }
        } else {
          // Créer
          const createResponse = await fetch(`${backendUrl}/api/vehicles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehicleData),
          });

          if (createResponse.ok) {
            stats.created++;
            console.log(`✅ Créé: ${vehicle.title}`);

            // Télécharger les images si demandé
            if (downloadImages && vehicle.images.length > 0) {
              const createdVehicle = await createResponse.json();
              await downloadAndAttachImages(
                createdVehicle.id,
                vehicle.images.slice(0, 5) // Limite à 5 images
              );
            }
          } else {
            stats.errors++;
            const errorText = await createResponse.text();
            stats.errorDetails.push(
              `Create ${vehicle.title}: ${errorText.substring(0, 100)}`
            );
            console.error(`❌ Erreur création: ${vehicle.title}`);
          }
        }

        // Pause pour éviter de surcharger l'API
        await sleep(500);
      } catch (error: any) {
        stats.errors++;
        stats.errorDetails.push(`${vehicle.title}: ${error.message}`);
        console.error(`❌ Erreur import ${vehicle.title}:`, error);
      }
    }

    console.log('\n📊 Résumé de l\'import:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Créés: ${stats.created}`);
    console.log(`   Mis à jour: ${stats.updated}`);
    console.log(`   Erreurs: ${stats.errors}`);

    return res.status(200).json({
      message: 'Import terminé',
      stats,
    });
  } catch (error: any) {
    console.error('❌ Erreur fatale:', error);
    return res.status(500).json({
      error: 'Erreur lors de l\'import',
      message: error.message,
    });
  }
}

async function downloadAndAttachImages(
  vehicleId: string,
  imageUrls: string[]
): Promise<void> {
  // TODO: Implémenter l'upload d'images vers Payload CMS
  // Nécessite l'utilisation de l'API Payload pour uploader des fichiers
  console.log(`📸 ${imageUrls.length} images à télécharger pour véhicule ${vehicleId}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
