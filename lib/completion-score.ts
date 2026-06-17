/**
 * Shared completion score utility
 * Used by admin API routes and vehicle detail page
 */

export interface VehicleForScore {
  price?: number;
  title?: string;
  year?: number;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  imageUrls?: any[];
  processedImages?: any;
  dealer?: string;
  specifications?: { power?: string };
  power?: string;
  exteriorColor?: string;
  doors?: number;
  seats?: number;
  features?: any[];
  description?: string;
  interiorColor?: string;
  dealerCity?: string;
  originalListingUrl?: string;
  sourceUrl?: string;
}

const SCORE_WEIGHTS = {
  // Critical — 10 pts each (80 pts max)
  price:              { weight: 10, label: 'Prix' },
  title:              { weight: 10, label: 'Titre' },
  year:               { weight: 10, label: 'Année' },
  mileage:            { weight: 10, label: 'Kilométrage' },
  fuel:               { weight: 10, label: 'Carburant' },
  transmission:       { weight: 10, label: 'Transmission' },
  images:             { weight: 10, label: 'Images' },
  dealer:             { weight: 10, label: 'Concessionnaire réel' },
  // Important — 5 pts each (20 pts max)
  power:              { weight: 5,  label: 'Puissance' },
  exteriorColor:      { weight: 5,  label: 'Couleur extérieure' },
  doors:              { weight: 5,  label: 'Portes' },
  seats:              { weight: 5,  label: 'Places' },
  // Premium — 2 pts each (10 pts max)
  features:           { weight: 2,  label: 'Équipements' },
  description:        { weight: 2,  label: 'Description' },
  interiorColor:      { weight: 2,  label: 'Couleur intérieure' },
  dealerCity:         { weight: 2,  label: 'Ville concessionnaire' },
  originalListingUrl: { weight: 2,  label: 'Lien annonce originale' },
};

const MAX_SCORE = Object.values(SCORE_WEIGHTS).reduce((s, f) => s + f.weight, 0); // 110

export function calcCompletionScore(v: VehicleForScore): { score: number; missingFields: string[] } {
  const missing: string[] = [];
  let earned = 0;

  const hasImages = (v.imageUrls && v.imageUrls.length > 0) || !!v.processedImages?.hero;
  const hasPower = !!(v.specifications?.power || v.power);
  const hasOriginalUrl = !!(
    v.originalListingUrl ||
    (v.sourceUrl?.includes('/angebote/') ? v.sourceUrl : null)
  );

  const checks: Record<keyof typeof SCORE_WEIGHTS, boolean> = {
    price:              (v.price || 0) > 0,
    title:              !!v.title && v.title.length > 3,
    year:               !!v.year && v.year > 1990,
    mileage:            v.mileage != null && v.mileage >= 0,
    fuel:               !!v.fuel,
    transmission:       !!v.transmission,
    images:             hasImages,
    dealer:             !!v.dealer && !/importemoi/i.test(v.dealer),
    power:              hasPower,
    exteriorColor:      !!v.exteriorColor,
    doors:              !!v.doors,
    seats:              !!v.seats,
    features:           Array.isArray(v.features) && v.features.length > 0,
    description:        !!v.description && v.description.length > 20,
    interiorColor:      !!v.interiorColor,
    dealerCity:         !!v.dealerCity,
    originalListingUrl: hasOriginalUrl,
  };

  for (const [key, present] of Object.entries(checks)) {
    const field = SCORE_WEIGHTS[key as keyof typeof SCORE_WEIGHTS];
    if (present) {
      earned += field.weight;
    } else {
      missing.push(field.label);
    }
  }

  return {
    score: Math.round((earned / MAX_SCORE) * 100),
    missingFields: missing,
  };
}
