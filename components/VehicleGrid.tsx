import Link from 'next/link';

interface Vehicle {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  fuel: string;
  transmission: string;
  status: string;
  slug: string;
  description?: string;
  specifications?: {
    engine: string;
    power: string;
    consumption: string;
    acceleration: string;
    color: string;
    interior: string;
  };
  features?: string[];
  imageUrls?: Array<{ url: string }>;
  createdAt?: string;
  updatedAt?: string;
}

interface VehicleGridProps {
  vehicles?: Vehicle[];
  title?: string;
  showLoadMore?: boolean;
  featured?: boolean;
  is_new?: boolean;
  limit?: number;
}

export default function VehicleGrid({
  vehicles = [],
  title = 'Nos meilleures offres',
  showLoadMore = true,
  // featured,
  // is_new,
  limit = 8,
}: VehicleGridProps) {
  return (
    <VehicleGridContent
      vehicles={vehicles}
      title={title}
      showLoadMore={showLoadMore}
    />
  );
}

// Composant pour l'ancien système (avec véhicules en props)
function VehicleGridContent({
  vehicles,
  title,
  showLoadMore,
}: {
  vehicles: Vehicle[];
  title: string;
  showLoadMore: boolean;
}) {
  return (
    <div className='py-12 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Découvrez notre sélection de véhicules d'exception, soigneusement
            choisis pour leur qualité et leur performance.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
          {vehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {showLoadMore && (
          <div className='text-center'>
            <button className='bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
              Voir plus de véhicules
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant pour afficher une carte de véhicule
function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  // Récupérer la première image disponible
  const firstImageUrl = vehicle.imageUrls?.[0]?.url;

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
      <div className='relative h-48'>
        {firstImageUrl ? (
          <img
            src={firstImageUrl}
            alt={vehicle.title}
            className='w-full h-full object-cover'
            onError={(e) => {
              // Fallback si l'image ne charge pas
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextElementSibling) {
                (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div
          className='w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center'
          style={{ display: firstImageUrl ? 'none' : 'flex' }}
        >
          <div className='text-center'>
            <div className='w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2'>
              <svg
                className='w-6 h-6 text-white'
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
            <p className='text-gray-500 text-sm'>Image du véhicule</p>
          </div>
        </div>
        {vehicle.status === 'active' && (
          <div className='absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold'>
            Disponible
          </div>
        )}
        {vehicle.status === 'sold' && (
          <div className='absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold'>
            Vendu
          </div>
        )}
      </div>

      <div className='p-4'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          {vehicle.title}
        </h3>
        <div className='text-2xl font-bold text-blue-600 mb-3'>
          €{vehicle.price.toLocaleString('fr-FR')}
        </div>

        <div className='space-y-1 text-sm text-gray-600 mb-4'>
          <div className='flex justify-between'>
            <span>Année:</span>
            <span className='font-medium'>{vehicle.year}</span>
          </div>
          <div className='flex justify-between'>
            <span>Kilométrage:</span>
            <span className='font-medium'>
              {vehicle.mileage.toLocaleString('fr-FR')} km
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Localisation:</span>
            <span className='font-medium'>{vehicle.location}</span>
          </div>
          <div className='flex justify-between'>
            <span>Carburant:</span>
            <span className='font-medium capitalize'>{vehicle.fuel}</span>
          </div>
          <div className='flex justify-between'>
            <span>Transmission:</span>
            <span className='font-medium capitalize'>
              {vehicle.transmission}
            </span>
          </div>
          {vehicle.specifications?.power && (
            <div className='flex justify-between'>
              <span>Puissance:</span>
              <span className='font-medium'>
                {vehicle.specifications.power}
              </span>
            </div>
          )}
        </div>

        <div className='flex space-x-2'>
          <Link
            href={`/vehicles/${vehicle.id}`}
            className='flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors'
          >
            Voir détails
          </Link>
          <button className='bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors'>
            ♥
          </button>
        </div>
      </div>
    </div>
  );
}
