/**
 * 🎨 VanalexCars Studio Image Processor
 *
 * Transforme les images brutes de véhicules en visuels premium :
 * - Fond studio professionnel
 * - Watermark VanalexCars
 * - Overlay texte avec infos véhicule
 * - Optimisation WebP
 * - Multiples formats (card, detail, social)
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs-extra';
import { createStudioBackground } from './createStudioBackground';

interface VehicleInfo {
  title?: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  reference?: string;
}

interface ProcessOptions {
  addWatermark?: boolean;
  addText?: boolean;
  vehicleInfo?: VehicleInfo;
  format?: 'webp' | 'png' | 'jpeg';
  quality?: number;
}

const SIZES = {
  hero: { width: 1600, height: 900 },
  card: { width: 600, height: 400 },
  thumbnail: { width: 400, height: 300 },
  social: { width: 1200, height: 630 },
} as const;

/**
 * Applique le fond de studio VanalexCars à une image de véhicule
 */
export async function applyStudioBackground(
  inputPath: string,
  outputPath: string,
  options: ProcessOptions = {}
): Promise<void> {
  const {
    addWatermark = true,
    addText = false,
    vehicleInfo = {},
    format = 'webp',
    quality = 90,
  } = options;

  try {
    console.log(`🎨 Traitement: ${path.basename(inputPath)}`);

    // 1. Créer le fond de studio
    const background = await createStudioBackground(
      SIZES.hero.width,
      SIZES.hero.height
    );

    // 2. Charger l'image du véhicule (avec fond transparent après remove.bg)
    const carImage = sharp(inputPath);
    const carMetadata = await carImage.metadata();

    // Calculer la taille de redimensionnement (95% de la largeur du fond max pour un zoom plus serré)
    const targetWidth = Math.floor(SIZES.hero.width * 0.95);
    const targetHeight = Math.floor(SIZES.hero.height * 0.95);
    const carResized = await carImage
      .resize(targetWidth, targetHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer();

    // 3. Préparer les layers de composition
    const compositeArray: sharp.OverlayOptions[] = [
      {
        input: carResized,
        gravity: 'center',
      },
    ];

    // 4. Ajouter le watermark si demandé
    if (addWatermark) {
      const watermarkPath = path.join(
        process.cwd(),
        'assets/logos/vanalexcars-watermark.svg'
      );

      if (await fs.pathExists(watermarkPath)) {
        const watermark = await sharp(watermarkPath)
          .resize(200, null, { fit: 'inside' })
          .png()
          .toBuffer();

        compositeArray.push({
          input: watermark,
          top: SIZES.hero.height - 80,
          left: SIZES.hero.width - 220,
          blend: 'over',
        });
      }
    }

    // 5. Ajouter le texte overlay si demandé
    if (addText && vehicleInfo.title) {
      const textSvg = createTextOverlay(vehicleInfo);
      compositeArray.push({
        input: Buffer.from(textSvg),
        top: SIZES.hero.height - 120,
        left: 60,
      });
    }

    // 6. Composer l'image finale
    let outputImage = sharp(background).composite(compositeArray);

    // 7. Appliquer le format de sortie
    switch (format) {
      case 'webp':
        outputImage = outputImage.webp({ quality });
        break;
      case 'png':
        outputImage = outputImage.png({ quality });
        break;
      case 'jpeg':
        outputImage = outputImage.jpeg({ quality });
        break;
    }

    // 8. Sauvegarder
    await outputImage.toFile(outputPath);

    console.log(`✅ Image studio créée: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Erreur traitement ${inputPath}:`, error);
    throw error;
  }
}

/**
 * Crée un overlay SVG avec les informations du véhicule
 */
function createTextOverlay(vehicle: VehicleInfo): string {
  const { brand = '', model = '', year = '', price = 0, reference = '' } = vehicle;

  // Texte principal (marque + modèle)
  const mainText = `${brand} ${model}`.trim() || vehicle.title || 'Véhicule';

  // Sous-texte (année + prix)
  const subText = [year, price ? `${price.toLocaleString('fr-FR')} €` : '']
    .filter(Boolean)
    .join(' • ');

  return `
    <svg width="600" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Titre principal -->
      <text x="0" y="32"
            font-family="Arial, sans-serif"
            font-size="32"
            font-weight="700"
            fill="#ffffff"
            filter="url(#shadow)">
        ${escapeXml(mainText)}
      </text>

      <!-- Sous-texte -->
      ${
        subText
          ? `<text x="0" y="65"
            font-family="Arial, sans-serif"
            font-size="20"
            font-weight="500"
            fill="#fbbf24"
            filter="url(#shadow)">
        ${escapeXml(subText)}
      </text>`
          : ''
      }

      ${
        reference
          ? `<text x="0" y="90"
            font-family="Arial, sans-serif"
            font-size="14"
            font-weight="400"
            fill="#d1d5db">
        Réf: ${escapeXml(reference)}
      </text>`
          : ''
      }
    </svg>
  `;
}

/**
 * Échappe les caractères spéciaux XML
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Génère plusieurs variantes d'une image (card, thumbnail, social)
 * IMPORTANT: Ajoute le watermark APRÈS redimensionnement pour éviter qu'il soit coupé
 */
export async function generateVariants(
  studioImagePath: string,
  outputDir: string,
  baseName: string
): Promise<void> {
  await fs.ensureDir(outputDir);

  const image = sharp(studioImagePath);

  // Chemin du watermark
  const watermarkPath = path.join(
    process.cwd(),
    'assets/logos/vanalexcars-watermark.svg'
  );
  const watermarkExists = await fs.pathExists(watermarkPath);

  // Générer toutes les tailles
  const variants = [
    { name: 'hero', size: SIZES.hero },
    { name: 'card', size: SIZES.card },
    { name: 'thumbnail', size: SIZES.thumbnail },
    { name: 'social', size: SIZES.social },
  ];

  for (const variant of variants) {
    const outputPath = path.join(
      outputDir,
      `${baseName}-${variant.name}.webp`
    );

    // 1. Redimensionner l'image de base
    const resized = await image
      .clone()
      .resize(variant.size.width, variant.size.height, {
        fit: 'cover',
        position: 'center',
      })
      .toBuffer();

    // 2. Ajouter le watermark adapté à la taille de la variante
    if (watermarkExists) {
      // Taille du watermark proportionnelle à l'image (12.5% de la largeur)
      const watermarkWidth = Math.floor(variant.size.width * 0.125);
      const watermark = await sharp(watermarkPath)
        .resize(watermarkWidth, null, { fit: 'inside' })
        .png()
        .toBuffer();

      const watermarkMetadata = await sharp(watermark).metadata();
      const watermarkHeight = watermarkMetadata.height || 40;

      // Positionner à 20px des bords en bas à droite
      const watermarkTop = variant.size.height - watermarkHeight - 20;
      const watermarkLeft = variant.size.width - watermarkWidth - 20;

      await sharp(resized)
        .composite([
          {
            input: watermark,
            top: watermarkTop,
            left: watermarkLeft,
            blend: 'over',
          },
        ])
        .webp({ quality: 90 })
        .toFile(outputPath);
    } else {
      // Pas de watermark, juste sauvegarder le redimensionnement
      await sharp(resized).webp({ quality: 90 }).toFile(outputPath);
    }

    console.log(`  📐 ${variant.name}: ${variant.size.width}x${variant.size.height} + watermark`);
  }
}

/**
 * Process une image complète : remove.bg + studio + variantes
 */
export async function processVehicleImage(
  inputPath: string,
  outputDir: string,
  vehicleInfo?: VehicleInfo
): Promise<{
  hero: string;
  card: string;
  thumbnail: string;
  social: string;
}> {
  const baseName = path.parse(inputPath).name;

  // 1. Appliquer le fond de studio (SANS watermark, il sera ajouté sur chaque variante)
  const studioPath = path.join(outputDir, `${baseName}-studio.webp`);
  await applyStudioBackground(inputPath, studioPath, {
    addWatermark: false, // Le watermark sera ajouté dans generateVariants
    addText: true,
    vehicleInfo,
  });

  // 2. Générer les variantes (avec watermark adapté à chaque taille)
  await generateVariants(studioPath, outputDir, baseName);

  return {
    hero: `${baseName}-hero.webp`,
    card: `${baseName}-card.webp`,
    thumbnail: `${baseName}-thumbnail.webp`,
    social: `${baseName}-social.webp`,
  };
}

/**
 * Process une image déjà traitée par Remove.bg (avec fond appliqué)
 * Ajoute watermark + texte overlay + génère les variantes
 */
export async function processVehicleImageSimple(
  inputPath: string,
  outputDir: string,
  vehicleInfo?: VehicleInfo
): Promise<{
  hero: string;
  card: string;
  thumbnail: string;
  social: string;
}> {
  const baseName = path.parse(inputPath).name;

  // 1. Ajouter watermark et texte overlay sur l'image originale (avec fond déjà appliqué)
  const studioPath = path.join(outputDir, `${baseName}-studio.webp`);
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const watermarkPath = path.join(
    process.cwd(),
    'assets/logos/vanalexcars-watermark.svg'
  );

  const compositeArray: sharp.OverlayOptions[] = [];

  // Ajouter le watermark si disponible et si l'image est assez grande
  const imgWidth = metadata.width || 1600;
  const imgHeight = metadata.height || 900;

  if (await fs.pathExists(watermarkPath) && imgWidth > 200 && imgHeight > 100) {
    const watermarkWidth = Math.floor(imgWidth * 0.125);
    const watermark = await sharp(watermarkPath)
      .resize(watermarkWidth, null, { fit: 'inside' })
      .png()
      .toBuffer();

    const watermarkMetadata = await sharp(watermark).metadata();
    const watermarkHeight = watermarkMetadata.height || 40;

    // Vérifier que le watermark ne dépasse pas les dimensions
    const watermarkTop = Math.max(0, imgHeight - watermarkHeight - 20);
    const watermarkLeft = Math.max(0, imgWidth - watermarkWidth - 20);

    compositeArray.push({
      input: watermark,
      top: watermarkTop,
      left: watermarkLeft,
      blend: 'over',
    });
  }

  // Note: Le texte overlay est désactivé car il nécessite des dimensions minimales
  // Le watermark Vanalex suffit pour le branding

  // Composer et sauvegarder l'image studio
  await sharp(inputPath)
    .composite(compositeArray)
    .webp({ quality: 90 })
    .toFile(studioPath);

  console.log(`✅ Image studio avec watermark: ${path.basename(studioPath)}`);

  // 2. Générer les variantes (simple redimensionnement, watermark déjà présent)
  await generateVariantsSimple(studioPath, outputDir, baseName);

  return {
    hero: `${baseName}-hero.webp`,
    card: `${baseName}-card.webp`,
    thumbnail: `${baseName}-thumbnail.webp`,
    social: `${baseName}-social.webp`,
  };
}

/**
 * Génère plusieurs variantes sans ajouter de watermark (watermark déjà présent sur l'image source)
 */
export async function generateVariantsSimple(
  studioImagePath: string,
  outputDir: string,
  baseName: string
): Promise<void> {
  await fs.ensureDir(outputDir);

  const image = sharp(studioImagePath);

  const variants = [
    { name: 'hero', size: SIZES.hero },
    { name: 'card', size: SIZES.card },
    { name: 'thumbnail', size: SIZES.thumbnail },
    { name: 'social', size: SIZES.social },
  ];

  for (const variant of variants) {
    const outputPath = path.join(outputDir, `${baseName}-${variant.name}.webp`);

    // Simple redimensionnement (watermark déjà sur l'image source)
    await image
      .clone()
      .resize(variant.size.width, variant.size.height, {
        fit: 'contain', // contain pour garder les proportions
        background: { r: 156, g: 163, b: 175, alpha: 1 }, // gray-400 pour le padding
      })
      .webp({ quality: 90 })
      .toFile(outputPath);

    console.log(`  📐 ${variant.name}: ${variant.size.width}x${variant.size.height}`);
  }
}
