/**
 * Parser pour extraire les équipements depuis les descriptions HTML d'ImporteMoi
 * Compatible avec Next.js API et CLI tsx
 */

export interface ParsedEquipment {
  features: string[];
  packages: string[];
  exteriorColor?: string;
  interiorColor?: string;
  upholstery?: string;
}

/**
 * Parse la description HTML pour extraire les équipements
 */
export function parseEquipmentFromDescription(htmlDescription: string): ParsedEquipment {
  if (!htmlDescription) {
    return { features: [], packages: [] };
  }

  const features: string[] = [];
  const packages: string[] = [];
  let exteriorColor: string | undefined;
  let interiorColor: string | undefined;
  let upholstery: string | undefined;

  // Nettoyer le HTML: remplacer les balises par des retours à la ligne
  let cleanText = htmlDescription
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<ul>/gi, '')
    .replace(/<\/ul>/gi, '')
    .replace(/<strong>/gi, '')
    .replace(/<\/strong>/gi, '')
    .replace(/<[^>]+>/g, '') // Supprimer toutes les autres balises HTML
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .trim();

  // Séparer les lignes
  const lines = cleanText.split('\n').map((line) => line.trim()).filter(Boolean);

  let currentSection = '';

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    // Détecter les sections
    if (
      lowerLine.includes('ausstattung') ||
      lowerLine.includes('sonderausstattung') ||
      lowerLine.includes('serienausstattung')
    ) {
      currentSection = 'equipment';
      continue;
    }

    if (lowerLine.includes('paket') && lowerLine.length < 50) {
      currentSection = 'packages';
      // Ajouter le package
      const packageName = line.replace(/^•\s*/, '').trim();
      if (packageName && !packages.includes(packageName)) {
        packages.push(packageName);
      }
      continue;
    }

    // Ignorer les lignes trop courtes ou les numéros de véhicule
    if (line.length < 10 || lowerLine.includes('fahrzeug-nr')) {
      continue;
    }

    // Extraire la couleur extérieure
    if (
      lowerLine.includes('lackierung') ||
      lowerLine.includes('außenfarbe') ||
      (lowerLine.includes('farbe') && !lowerLine.includes('innen'))
    ) {
      exteriorColor = line.replace(/^•\s*/, '').trim();
      continue;
    }

    // Extraire la couleur intérieure / sellerie
    if (
      lowerLine.includes('sitzbezug') ||
      lowerLine.includes('polsterung') ||
      lowerLine.includes('innenausstattung:')
    ) {
      interiorColor = line.replace(/^•\s*/, '').trim();
      upholstery = line.replace(/^•\s*/, '').trim();
      continue;
    }

    // Ajouter comme équipement si c'est une ligne valide
    if (line.startsWith('•') || currentSection === 'equipment') {
      const feature = line.replace(/^•\s*/, '').trim();

      // Filtrer les lignes trop longues (descriptions)
      if (feature.length > 5 && feature.length < 150) {
        // Ne pas ajouter les doublons
        if (!features.includes(feature)) {
          features.push(feature);
        }
      }
    }
  }

  return {
    features,
    packages,
    exteriorColor,
    interiorColor,
    upholstery,
  };
}

/**
 * Mapping des codes couleurs ImporteMoi
 */
export const BODY_COLOR_MAP: Record<number, string> = {
  1: 'Beige',
  2: 'Bleu',
  3: 'Marron',
  4: 'Jaune',
  5: 'Or',
  6: 'Gris',
  7: 'Vert',
  8: 'Orange',
  9: 'Rouge',
  10: 'Noir',
  11: 'Argent',
  12: 'Violet',
  13: 'Blanc',
  14: 'Autre',
};

/**
 * Mapping des types de carrosserie ImporteMoi
 */
export const BODY_TYPE_MAP: Record<number, string> = {
  0: 'sedan', // Berline
  1: 'wagon', // Break
  2: 'suv', // SUV
  3: 'sportback', // Sportback / Hatchback
  4: 'touring', // Touring
  5: 'coupe', // Coupé
  6: 'convertible', // Cabriolet
  7: 'van', // Monospace
  8: 'other', // Autre
};

/**
 * Mapping des types de carburant ImporteMoi
 */
export const FUEL_TYPE_MAP: Record<number, string> = {
  1: 'essence', // Essence
  2: 'diesel', // Diesel
  3: 'electric', // Électrique
  4: 'hybrid', // Hybride
  5: 'plugin-hybrid', // Hybride rechargeable
  6: 'other', // Autre
};

/**
 * Nettoie et formate le texte pour l'affichage
 */
export function cleanText(text: string): string {
  if (!text) return '';

  return text
    .replace(/<[^>]+>/g, '') // Supprimer les balises HTML
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extrait le modèle simplifié depuis le model_version_input
 */
export function extractSimpleModel(modelVersionInput: string): string {
  if (!modelVersionInput) return '';

  // Prendre seulement les premiers mots (généralement le modèle principal)
  const parts = modelVersionInput.split(' ');
  const mainModel = parts.slice(0, 3).join(' ');

  return mainModel;
}
