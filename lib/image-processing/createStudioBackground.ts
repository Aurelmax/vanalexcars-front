/**
 * Génère un fond de studio premium pour VanalexCars
 * Gradient professionnel gris clair avec effet showroom
 */

import sharp from 'sharp';
import path from 'path';

export async function createStudioBackground(
  width: number = 1600,
  height: number = 900
): Promise<Buffer> {
  // Créer un SVG avec gradient premium
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradient principal showroom -->
        <linearGradient id="studioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#e9ecef;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#dee2e6;stop-opacity:1" />
        </linearGradient>

        <!-- Radial gradient pour effet spotlight -->
        <radialGradient id="spotlight" cx="50%" cy="60%" r="60%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.4" />
          <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
        </radialGradient>

        <!-- Effet de réflexion au sol -->
        <linearGradient id="floor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="60%" style="stop-color:#e9ecef;stop-opacity:0" />
          <stop offset="100%" style="stop-color:#adb5bd;stop-opacity:0.15" />
        </linearGradient>
      </defs>

      <!-- Fond principal -->
      <rect width="${width}" height="${height}" fill="url(#studioGradient)"/>

      <!-- Effet spotlight -->
      <rect width="${width}" height="${height}" fill="url(#spotlight)"/>

      <!-- Effet sol/reflet -->
      <rect width="${width}" height="${height}" fill="url(#floor)"/>

      <!-- Ligne d'horizon subtile -->
      <line x1="0" y1="${height * 0.65}" x2="${width}" y2="${height * 0.65}"
            stroke="#dee2e6" stroke-width="1" opacity="0.3"/>
    </svg>
  `;

  return sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toBuffer();
}

// Générer et sauvegarder le fond par défaut
export async function generateDefaultBackground() {
  const bg = await createStudioBackground(1600, 900);

  await sharp(bg)
    .toFile(path.join(process.cwd(), 'assets/backgrounds/vanalexcars-studio.png'));

  console.log('✅ Fond de studio VanalexCars généré !');
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDefaultBackground();
}
