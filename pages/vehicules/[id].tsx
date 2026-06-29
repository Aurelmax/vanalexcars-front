import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translateAutoTerms } from '../../lib/translations/auto-terms-de-fr';

// Import dynamique pour éviter les erreurs SSR de Leaflet
const DealerMap = dynamic(() => import('../../components/DealerMap'), { ssr: false });

interface Vehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  category?: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  doors?: number;
  seats?: number;
  power?: string;
  location?: string;
  dealer?: string;
  dealerCity?: string;
  dealerContact?: string;
  dealerAddress?: string;
  dealerPostalCode?: string;
  dealerLat?: number;
  dealerLng?: number;
  description?: string;
  exteriorColor?: string;
  interiorColor?: string;
  sourceUrl?: string;
  originalListingUrl?: string;
  imageUrls?: Array<{ url: string; id: string }>;
  processedImages?: {
    hero?: string;
    card?: string;
    thumbnail?: string;
    social?: string;
  };
  specifications?: {
    power?: string;
    powerKw?: number;
    powerHp?: number;
  };
  features?: Array<{ feature: string }>;
}

// ─── Score de complétude (version allégée pour la PDP) ───────────────────────

function calcScore(v: Vehicle): { score: number; missingFields: string[] } {
  const missing: string[] = [];
  let earned = 0;

  const weights: Array<[string, number, boolean]> = [
    ['Prix',                  10, (v.price || 0) > 0],
    ['Titre',                 10, !!v.title && v.title.length > 3],
    ['Année',                 10, !!v.year && v.year > 1990],
    ['Kilométrage',           10, v.mileage != null && v.mileage >= 0],
    ['Carburant',             10, !!v.fuel],
    ['Transmission',          10, !!v.transmission],
    ['Images',                10, !!(v.imageUrls && v.imageUrls.length > 0) || !!v.processedImages?.hero],
    ['Concessionnaire réel',  10, !!v.dealer && !/importemoi/i.test(v.dealer)],
    ['Puissance',              5, !!(v.specifications?.power || v.power)],
    ['Couleur extérieure',     5, !!v.exteriorColor],
    ['Portes',                 5, !!v.doors],
    ['Places',                 5, !!v.seats],
    ['Équipements',            2, Array.isArray(v.features) && v.features.length > 0],
    ['Description',            2, !!v.description && v.description.length > 20],
    ['Couleur intérieure',     2, !!v.interiorColor],
    ['Ville concessionnaire',  2, !!v.dealerCity],
    ['Lien annonce originale', 2, !!v.originalListingUrl],
  ];

  for (const [label, weight, ok] of weights) {
    if (ok) earned += weight;
    else missing.push(label);
  }

  return { score: Math.round((earned / 110) * 100), missingFields: missing };
}

const FUEL_LABELS: Record<string, string> = {
  essence: 'Essence',
  diesel: 'Diesel',
  electric: 'Électrique',
  hybrid: 'Hybride',
  'plugin-hybrid': 'Hybride rechargeable',
};

const TRANSMISSION_LABELS: Record<string, string> = {
  automatic: 'Automatique',
  manual: 'Manuelle',
};

export default function VehicleDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchVehicle = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200'}/api/vehicles/${id}`);
        if (!response.ok) throw new Error('Véhicule non trouvé');
        const data = await response.json();
        setVehicle(data);
      } catch (error) {
        console.error('Error fetching vehicle:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className='min-h-screen bg-linear-to-b from-premium-black via-gray-950 to-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-premium-gold border-r-transparent'></div>
          <p className='text-white mt-4'>Chargement du véhicule...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className='min-h-screen bg-linear-to-b from-premium-black via-gray-950 to-black'>
        <Header />
        <main className='pt-32 pb-20'>
          <div className='max-w-7xl mx-auto px-4 text-center'>
            <h1 className='text-4xl font-bold text-white mb-4'>Véhicule non trouvé</h1>
            <button
              onClick={() => router.push('/catalogue')}
              className='bg-premium-gold text-premium-black px-6 py-3 rounded-lg font-semibold hover:bg-premium-gold/90 transition'
            >
              Retour au catalogue
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Images: hero traité en premier, puis toutes les photos brutes AS24
  const rawImageUrls = vehicle.imageUrls?.map(img => img.url) || [];
  const displayImages = vehicle.processedImages?.hero
    ? [vehicle.processedImages.hero, ...rawImageUrls].filter(Boolean) as string[]
    : rawImageUrls;

  const mainImage = displayImages[selectedImage] || '/placeholder-car.jpg';

  const power = vehicle.specifications?.power || vehicle.power;
  const features = vehicle.features?.map(f => translateAutoTerms(f.feature)).filter(Boolean) || [];
  const { score: completionScore, missingFields } = calcScore(vehicle);

  // Masquer uniquement les dumps d'équipements (liste de mots-clés sans phrases)
  // Détection : pas de point de fin de phrase, lignes très courtes (≤4 mots en moyenne)
  const isEquipmentDump = (text: string) => {
    if (!text) return false;
    const hasSentences = /[.!?]/.test(text);
    if (hasSentences) return false; // une vraie description a des phrases
    const lines = text.split(/[\n,;]+/).filter(Boolean);
    const avgWords = lines.reduce((s, l) => s + l.trim().split(/\s+/).length, 0) / (lines.length || 1);
    return avgWords <= 3; // listes d'équipements : 1-3 mots par entrée
  };
  const showDescription = vehicle.description && vehicle.description.length > 20 && !isEquipmentDump(vehicle.description);

  return (
    <>
      <Head>
        <title>{vehicle.title} | VanalexCars</title>
        <meta
          name='description'
          content={`${vehicle.brand} ${vehicle.model} - ${vehicle.year} - ${vehicle.mileage?.toLocaleString()} km - ${vehicle.price?.toLocaleString()} €`}
        />
      </Head>

      <div className='min-h-screen bg-linear-to-b from-premium-black via-gray-950 to-black'>
        <Header />

        <main className='pt-28 pb-20'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Breadcrumb + score badge */}
            <div className='mb-6 flex items-center justify-between flex-wrap gap-3'>
              <div className='text-sm text-gray-400'>
                <button onClick={() => router.push('/')} className='hover:text-premium-gold'>
                  Accueil
                </button>
                {' / '}
                <button onClick={() => router.push('/catalogue')} className='hover:text-premium-gold'>
                  Catalogue
                </button>
                {' / '}
                <span className='text-white'>{vehicle.brand}</span>
              </div>
              <span
                title={missingFields.length > 0 ? `Manque : ${missingFields.join(', ')}` : 'Fiche complète'}
                className={`text-xs px-3 py-1 rounded-full font-medium cursor-help ${
                  completionScore >= 80
                    ? 'bg-green-900/60 text-green-400 border border-green-700'
                    : completionScore >= 50
                    ? 'bg-yellow-900/60 text-yellow-400 border border-yellow-700'
                    : 'bg-red-900/60 text-red-400 border border-red-700'
                }`}
              >
                Fiche à {completionScore}%
              </span>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
              {/* Colonne gauche: Images */}
              <div>
                {/* Image principale */}
                <div className='bg-gray-900 rounded-2xl overflow-hidden mb-4 border border-gray-800'>
                  <div className='aspect-4/3 relative'>
                    <img
                      src={mainImage}
                      alt={vehicle.title}
                      className='w-full h-full object-contain'
                    />
                  </div>
                </div>

                {/* Miniatures */}
                {displayImages.length > 1 && (
                  <div className='grid grid-cols-4 gap-3'>
                    {displayImages.slice(0, 8).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`
                          aspect-square rounded-lg overflow-hidden border-2 transition-all
                          ${selectedImage === index ? 'border-premium-gold' : 'border-gray-800 hover:border-gray-700'}
                        `}
                      >
                        <img
                          src={img}
                          alt={`Vue ${index + 1}`}
                          className='w-full h-full object-cover'
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Lien vers l'annonce originale AutoScout24 ou importemoi */}
                {(vehicle.originalListingUrl || vehicle.sourceUrl) && (
                  <div className='mt-4'>
                    <a
                      href={vehicle.originalListingUrl || vehicle.sourceUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-gray-500 hover:text-premium-gold transition-colors flex items-center gap-2'
                    >
                      <span>↗</span>
                      <span>Voir l'annonce originale{vehicle.originalListingUrl ? ' (AutoScout24)' : ''}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Colonne droite: Informations */}
              <div>
                {/* Titre et prix */}
                <div className='mb-8'>
                  <div className='flex items-center flex-wrap gap-2 mb-2'>
                    <span className='px-3 py-1 bg-premium-gold/20 text-premium-gold rounded-full text-sm font-semibold'>
                      {vehicle.brand?.toUpperCase()}
                    </span>
                    {vehicle.year && (
                      <span className='text-gray-400 text-sm'>{vehicle.year}</span>
                    )}
                    {vehicle.category && vehicle.category !== 'other' && (
                      <span className='px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm capitalize'>
                        {translateAutoTerms(vehicle.category)}
                      </span>
                    )}
                  </div>
                  <h1 className='text-3xl lg:text-4xl font-bold text-white mb-4'>
                    {vehicle.model || vehicle.title}
                  </h1>
                  <div className='text-4xl font-bold text-premium-gold'>
                    {vehicle.price?.toLocaleString('fr-FR')} €
                  </div>
                </div>

                {/* Caractéristiques principales */}
                <div className='grid grid-cols-2 gap-4 mb-8'>

                  {/* Champs toujours affichés */}
                  <div className='bg-gray-900/50 border border-gray-800 rounded-lg p-4'>
                    <div className='text-gray-400 text-sm mb-1'>Kilométrage</div>
                    <div className='text-white font-semibold text-lg'>
                      {vehicle.mileage != null ? `${vehicle.mileage.toLocaleString('fr-FR')} km` : '—'}
                    </div>
                  </div>

                  <div className='bg-gray-900/50 border border-gray-800 rounded-lg p-4'>
                    <div className='text-gray-400 text-sm mb-1'>Carburant</div>
                    <div className='text-white font-semibold text-lg'>
                      {FUEL_LABELS[vehicle.fuel] || vehicle.fuel || '—'}
                    </div>
                  </div>

                  <div className='bg-gray-900/50 border border-gray-800 rounded-lg p-4'>
                    <div className='text-gray-400 text-sm mb-1'>Transmission</div>
                    <div className='text-white font-semibold text-lg'>
                      {TRANSMISSION_LABELS[vehicle.transmission] || vehicle.transmission || '—'}
                    </div>
                  </div>

                  <div className='bg-gray-900/50 border border-gray-800 rounded-lg p-4'>
                    <div className='text-gray-400 text-sm mb-1'>Puissance</div>
                    <div className='text-white font-semibold text-lg'>
                      {power || '—'}
                    </div>
                  </div>

                  <div className='bg-gray-900/50 border border-gray-800 rounded-lg p-4'>
                    <div className='text-gray-400 text-sm mb-1'>Année</div>
                    <div className='text-white font-semibold text-lg'>
                      {vehicle.year || '—'}
                    </div>
                  </div>

                  <div className='bg-gray-900/50 border border-gray-800 rounded-lg p-4'>
                    <div className='text-gray-400 text-sm mb-1'>Carrosserie</div>
                    <div className='text-white font-semibold text-lg capitalize'>
                      {({'berline':'Berline','break':'Break','suv':'SUV','coupe':'Coupé','cabriolet':'Cabriolet','monospace':'Monospace','other':'—'} as Record<string,string>)[vehicle.category || ''] || '—'}
                    </div>
                  </div>

                  {/* Champs affichés seulement si disponibles */}
                  {vehicle.doors && (
                    <div className='bg-gray-900/50 border border-gray-800 rounded-lg p-4'>
                      <div className='text-gray-400 text-sm mb-1'>Portes</div>
                      <div className='text-white font-semibold text-lg'>
                        {vehicle.doors}
                      </div>
                    </div>
                  )}

                  {vehicle.seats && (
                    <div className='bg-gray-900/50 border border-gray-800 rounded-lg p-4'>
                      <div className='text-gray-400 text-sm mb-1'>Places</div>
                      <div className='text-white font-semibold text-lg'>
                        {vehicle.seats}
                      </div>
                    </div>
                  )}

                  {vehicle.exteriorColor && (
                    <div className='bg-gray-900/50 border border-gray-800 rounded-lg p-4'>
                      <div className='text-gray-400 text-sm mb-1'>Couleur extérieure</div>
                      <div className='text-white font-semibold text-lg capitalize'>
                        {vehicle.exteriorColor}
                      </div>
                    </div>
                  )}

                  {vehicle.interiorColor && (
                    <div className='bg-gray-900/50 border border-gray-800 rounded-lg p-4'>
                      <div className='text-gray-400 text-sm mb-1'>Sellerie</div>
                      <div className='text-white font-semibold text-lg'>
                        {vehicle.interiorColor}
                      </div>
                    </div>
                  )}

                  {(vehicle.dealerCity || vehicle.location) && (
                    <div className='bg-gray-900/50 border border-gray-800 rounded-lg p-4'>
                      <div className='text-gray-400 text-sm mb-1'>Localisation</div>
                      <div className='text-white font-semibold text-lg'>
                        {vehicle.dealerCity || vehicle.location}
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className='space-y-3'>
                  <a
                    href={`/demande?voiture=${encodeURIComponent(vehicle.title)}`}
                    className='block w-full bg-yellow-500 hover:bg-yellow-400 text-black text-center font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg'
                  >
                    → Demander un mandat pour ce véhicule
                  </a>
                  <p className='text-xs text-gray-400 text-center'>
                    Traitement sous 24h — aucun engagement
                  </p>
                  <a
                    href={`tel:+33646022468`}
                    className='block w-full bg-gray-800 hover:bg-gray-700 text-white text-center font-semibold py-4 rounded-xl transition-all duration-300 border border-gray-700'
                  >
                    📞 Appeler maintenant
                  </a>
                  <a
                    href={`https://wa.me/33646022468?text=${encodeURIComponent(`Bonjour, je suis intéressé par ce véhicule : ${vehicle.title} — pouvez-vous me faire une proposition de mandat ?`)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-4 rounded-xl transition-all duration-300'
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Description */}
            {showDescription && (
              <div className='mt-16'>
                <h2 className='text-3xl font-bold text-white mb-6'>Description</h2>
                <div className='bg-gray-900/50 border border-gray-800 rounded-xl p-6'>
                  <p className='text-gray-300 leading-relaxed whitespace-pre-line'>
                    {vehicle.description}
                  </p>
                </div>
              </div>
            )}

            {/* Section équipements — features stockées dans Payload */}
            {features.length > 0 && (
              <div className='mt-16'>
                <h2 className='text-3xl font-bold text-white mb-8'>Équipements & Options</h2>
                <div className='bg-gray-900/50 border border-gray-800 rounded-xl p-6'>
                  <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {features.map((item, index) => (
                      <li key={index} className='flex items-start space-x-2 text-gray-300 text-sm'>
                        <span className='text-premium-gold mt-0.5 shrink-0'>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Dealer Info — concessionnaire réel AutoScout24 */}
            <div className='mt-12 bg-gray-900/50 border border-gray-800 rounded-xl p-6'>
              <h3 className='text-xl font-bold text-white mb-1'>🏢 Concession</h3>
              <p className='text-xs text-gray-500 mb-4'>Source : AutoScout24</p>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300 mb-6'>
                <div>
                  <div className='text-sm text-gray-400 mb-1'>Nom</div>
                  <div className='font-semibold'>
                    {vehicle.dealer && !/importemoi/i.test(vehicle.dealer)
                      ? vehicle.dealer
                      : 'Concessionnaire non identifié'}
                  </div>
                </div>
                {vehicle.dealerCity && (
                  <div>
                    <div className='text-sm text-gray-400 mb-1'>Ville</div>
                    <div className='font-semibold'>{vehicle.dealerCity}</div>
                  </div>
                )}
                <div>
                  <div className='text-sm text-gray-400 mb-1'>Pays</div>
                  <div className='font-semibold'>{vehicle.location || 'Allemagne'}</div>
                </div>
                {vehicle.dealerContact && (
                  <div>
                    <div className='text-sm text-gray-400 mb-1'>Contact</div>
                    <div className='font-semibold'>{vehicle.dealerContact}</div>
                  </div>
                )}
                {vehicle.originalListingUrl && (
                  <div>
                    <div className='text-sm text-gray-400 mb-1'>Annonce originale</div>
                    <a
                      href={vehicle.originalListingUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-premium-gold hover:underline text-sm font-semibold'
                    >
                      Voir sur AutoScout24 ↗
                    </a>
                  </div>
                )}
              </div>

              {/* Carte de localisation — géocodage via Nominatim (OSM) */}
              {(vehicle.dealerCity || vehicle.dealerLat) && (
                <DealerMap
                  dealerName={vehicle.dealer && !/importemoi/i.test(vehicle.dealer) ? vehicle.dealer : undefined}
                  dealerCity={vehicle.dealerCity}
                  dealerAddress={vehicle.dealerAddress}
                  dealerPostalCode={vehicle.dealerPostalCode}
                  dealerCountry={vehicle.location || 'Allemagne'}
                  dealerLat={vehicle.dealerLat}
                  dealerLng={vehicle.dealerLng}
                />
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
