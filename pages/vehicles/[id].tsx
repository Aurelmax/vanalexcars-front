import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';

interface Vehicle {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  location: string;
  status: string;
  slug: string;
  description: string;
  specifications?: {
    engine?: string;
    power?: string;
    consumption?: string;
    acceleration?: string;
    color?: string;
    interior?: string;
  };
  features?: (string | { feature: string })[];
  imageUrls?: Array<{ url: string }>;
  createdAt: string;
  updatedAt: string;
}

interface VehicleDetailProps {
  vehicle: Vehicle;
}

function VehicleDetail({ vehicle }: VehicleDetailProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filtrer les images valides
  const validImages = vehicle.imageUrls?.filter((img) => img.url) || [];
  const hasImages = validImages.length > 0;

  const nextImage = () => {
    if (validImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
    }
  };

  const prevImage = () => {
    if (validImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (router.isFallback) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Chargement du véhicule...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Véhicule non trouvé
          </h1>
          <p className='text-gray-600 mb-4'>
            Le véhicule demandé n'existe pas ou n'est plus disponible.
          </p>
          <Link href='/' className='text-yellow-500 hover:underline'>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <Link href='/' className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center'>
                <span className='text-black font-bold text-xl'>V</span>
              </div>
              <span className='text-2xl font-bold bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent'>
                Vanalexcars
              </span>
            </Link>
            <Link href='/' className='text-gray-600 hover:text-gray-900'>
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Images - Carrousel */}
          <div className='space-y-4'>
            {/* Image principale */}
            <div className='relative bg-gray-200 rounded-lg overflow-hidden group'>
              {hasImages ? (
                <>
                  <img
                    src={validImages[currentImageIndex].url}
                    alt={`${vehicle.title} - Image ${currentImageIndex + 1}`}
                    className='w-full h-96 object-cover rounded-lg'
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />

                  {/* Boutons de navigation (gauche/droite) */}
                  {validImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100'
                        aria-label='Image précédente'
                      >
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100'
                        aria-label='Image suivante'
                      >
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Indicateur de position */}
                  {validImages.length > 1 && (
                    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
                      {currentImageIndex + 1} / {validImages.length}
                    </div>
                  )}
                </>
              ) : null}

              {/* Placeholder si pas d'image */}
              <div
                className='w-full h-96 bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center'
                style={{ display: hasImages ? 'none' : 'flex' }}
              >
                <div className='text-center'>
                  <div className='w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <svg
                      className='w-8 h-8 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                  </div>
                  <p className='text-gray-500'>Image du véhicule</p>
                </div>
              </div>
            </div>

            {/* Vignettes */}
            {validImages.length > 1 && (
              <div className='grid grid-cols-6 gap-2'>
                {validImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-yellow-500 ring-2 ring-yellow-500 ring-offset-2'
                        : 'border-gray-300 hover:border-yellow-400'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Vignette ${index + 1}`}
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        e.currentTarget.src = '';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Détails */}
          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                {vehicle.title}
              </h1>
              <div className='flex items-center space-x-4 text-sm text-gray-600'>
                <span>{vehicle.year}</span>
                <span>•</span>
                <span>{vehicle.mileage.toLocaleString('fr-FR')} km</span>
                <span>•</span>
                <span>{vehicle.location}</span>
              </div>
            </div>

            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-2xl font-bold text-gray-900'>Prix</h2>
                <div className='text-3xl font-bold text-yellow-500'>
                  €{vehicle.price.toLocaleString('fr-FR')}
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Carburant:</span>
                  <span className='font-medium capitalize'>{vehicle.fuel}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Transmission:</span>
                  <span className='font-medium capitalize'>
                    {vehicle.transmission}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Statut:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {vehicle.status === 'active' ? 'Disponible' : 'Vendu'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='space-y-3'>
              <button className='w-full bg-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors'>
                Contacter pour ce véhicule
              </button>
              <button className='w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors'>
                Ajouter aux favoris
              </button>
            </div>
          </div>
        </div>

        {/* Description et spécifications */}
        <div className='mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Description */}
          <div className='bg-white rounded-lg p-6 shadow-sm'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>
              Description
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              {vehicle.description}
            </p>
          </div>

          {/* Spécifications */}
          {vehicle.specifications && (
            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>
                Spécifications techniques
              </h2>
              <div className='space-y-3'>
                {vehicle.specifications.engine && (
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Moteur:</span>
                    <span className='font-medium'>{vehicle.specifications.engine}</span>
                  </div>
                )}
                {vehicle.specifications.power && (
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Puissance:</span>
                    <span className='font-medium'>{vehicle.specifications.power}</span>
                  </div>
                )}
                {vehicle.specifications.consumption && (
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Consommation:</span>
                    <span className='font-medium'>{vehicle.specifications.consumption}</span>
                  </div>
                )}
                {vehicle.specifications.acceleration && (
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Accélération 0-100:</span>
                    <span className='font-medium'>{vehicle.specifications.acceleration}</span>
                  </div>
                )}
                {vehicle.specifications.color && (
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Couleur:</span>
                    <span className='font-medium'>{vehicle.specifications.color}</span>
                  </div>
                )}
                {vehicle.specifications.interior && (
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Intérieur:</span>
                    <span className='font-medium'>{vehicle.specifications.interior}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Équipements */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className='mt-8 bg-white rounded-lg p-6 shadow-sm'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Équipements</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
              {vehicle.features.map((feature, index) => (
                <div key={index} className='flex items-center space-x-2'>
                  <svg
                    className='w-4 h-4 text-green-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='text-gray-700'>{typeof feature === 'string' ? feature : feature.feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Désactiver le Layout par défaut pour éviter le double header
VehicleDetail.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default VehicleDetail;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';
    const vehicleId = params?.id;

    if (!vehicleId) {
      return { notFound: true };
    }

    // Récupérer le véhicule directement par son ID
    const response = await fetch(`${backendUrl}/api/vehicles/${vehicleId}`);

    if (!response.ok) {
      console.warn(`⚠️ Véhicule ${vehicleId} non trouvé:`, response.status);
      return { notFound: true };
    }

    const vehicle = await response.json();
    console.log(`✅ Véhicule récupéré: ${vehicle.title || vehicleId}`);

    return {
      props: {
        vehicle,
      },
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du véhicule:', error);
    return {
      notFound: true,
    };
  }
};
