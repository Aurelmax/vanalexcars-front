/**
 * Module d'extraction des URLs d'images depuis les pages ImporteMoi
 * Compatible avec lazy loading (data-src) et fallback JSON inline
 */

import { load } from 'cheerio';

/**
 * Extrait les URLs des images de véhicules depuis le HTML ImporteMoi
 *
 * @param html - Code HTML de la page véhicule
 * @returns Tableau d'URLs absolues (max 6 images)
 *
 * @example
 * const html = await fetch('https://importemoi.fr/vehicule/bmw-123').then(r => r.text());
 * const images = extractImageUrls(html);
 * console.log(images); // ['https://importemoi.fr/media/vehicles/123/photo-1.webp', ...]
 */
export function extractImageUrls(html: string): string[] {
  const $ = load(html);
  const urls = new Set<string>();

  // 1. Extraction depuis les balises <img>
  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');

    // Filtrer les images valides (formats supportés, pas de miniatures)
    if (src && /\.(jpg|jpeg|png|webp)$/i.test(src) && !src.includes('thumb')) {
      // Convertir en URL absolue si nécessaire
      if (src.startsWith('/')) {
        urls.add(`https://importemoi.fr${src}`);
      } else if (src.startsWith('http')) {
        urls.add(src);
      }
    }
  });

  // 2. Fallback: chercher dans les balises <script> (JSON inline)
  // Certaines pages stockent les images dans du JavaScript
  $('script').each((_, el) => {
    const scriptContent = $(el).html() || '';

    // Regex pour trouver les URLs d'images dans le JSON/JS
    const imageUrlMatches = scriptContent.match(/https?:\/\/[^"']+\.(jpg|jpeg|png|webp)/gi);

    if (imageUrlMatches) {
      imageUrlMatches.forEach((url) => {
        // Filtrer les miniatures
        if (!url.includes('thumb') && !url.includes('thumbnail')) {
          urls.add(url);
        }
      });
    }
  });

  // 3. Convertir le Set en Array et limiter à 6 images
  const imageUrls = Array.from(urls).slice(0, 6);

  return imageUrls;
}

/**
 * Filtre et valide les URLs d'images
 *
 * @param url - URL à valider
 * @returns true si l'URL est valide pour ImporteMoi
 */
export function isValidImageUrl(url: string): boolean {
  // Doit être une URL complète
  if (!url.startsWith('http')) return false;

  // Doit être un format d'image supporté
  if (!/\.(jpg|jpeg|png|webp)$/i.test(url)) return false;

  // Ne doit pas être une miniature
  if (url.includes('thumb') || url.includes('thumbnail')) return false;

  // Doit provenir d'ImporteMoi ou d'un CDN connu
  if (!url.includes('importemoi.fr') && !url.includes('cloudinary') && !url.includes('imgix')) {
    return false;
  }

  return true;
}

/**
 * Extrait les métadonnées EXIF si disponibles dans le HTML
 * (pour usage futur - orientation, dimensions, etc.)
 */
export function extractImageMetadata(html: string): Record<string, any> {
  const $ = load(html);
  const metadata: Record<string, any> = {};

  // Chercher les métadonnées dans le JSON-LD ou data attributes
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || '{}');
      if (json.image) {
        metadata.primaryImage = Array.isArray(json.image) ? json.image[0] : json.image;
      }
    } catch (e) {
      // Ignore les erreurs de parsing JSON
    }
  });

  return metadata;
}
