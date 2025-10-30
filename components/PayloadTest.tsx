import { useEffect, useState } from 'react';

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
  images?: Array<{
    image: {
      url: string;
      alt: string;
    };
    alt: string;
    isMain: boolean;
  }>;
  description?: any;
  specifications?: {
    engine?: string;
    power?: string;
    consumption?: string;
    acceleration?: string;
    color?: string;
    interior?: string;
  };
  features?: Array<{
    feature: string;
  }>;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export default function PayloadTest() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        console.log('Fetching vehicles from Payload...');

        // Test avec l'API Payload (version simplifiée pour le test)
        const response = await fetch('/api/test-payload');
        console.log('Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Payload vehicles data:', data);

          if (data.success) {
            setVehicles(data.data);
          } else {
            setError(data.error || 'Erreur API Payload');
          }
        } else {
          setError(`Erreur HTTP: ${response.status}`);
        }
      } catch (err) {
        console.error('Error fetching vehicles from Payload:', err);
        setError('Erreur de connexion à Payload');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
            <p className='mt-4 text-gray-600'>
              Chargement des véhicules depuis Payload...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
              <strong>Erreur Payload:</strong> {error}
            </div>
            <p className='text-gray-600'>
              Vérifiez que Payload est correctement configuré et que MongoDB est
              accessible.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) {
    return (
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <div className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4'>
              <strong>Aucun véhicule trouvé</strong>
            </div>
            <p className='text-gray-600 mb-4'>
              Aucun véhicule n'a été trouvé dans Payload. Ajoutez-en via
              l'interface d'administration.
            </p>
            <a
              href='/admin'
              className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors'
            >
              Accéder à l'admin Payload
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-12 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Test Payload CMS - Véhicules
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            {vehicles.length} véhicule(s) chargé(s) depuis Payload CMS
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {vehicles.map(vehicle => (
            <div
              key={vehicle.id}
              className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group'
            >
              {/* Image du véhicule */}
              <div className='relative h-48 bg-gray-200 overflow-hidden'>
                {vehicle.images && vehicle.images.length > 0 ? (
                  <img
                    src={vehicle.images[0].image?.url || '/placeholder-car.jpg'}
                    alt={vehicle.images[0].alt || vehicle.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-300 flex items-center justify-center'>
                    <span className='text-gray-500'>Pas d&apos;image</span>
                  </div>
                )}

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

              {/* Contenu de la carte */}
              <div className='p-4'>
                <h3 className='text-xl font-semibold text-gray-900 mb-2 line-clamp-2'>
                  {vehicle.title}
                </h3>

                <p className='text-2xl font-bold text-blue-600 mb-3'>
                  € {vehicle.price?.toLocaleString('fr-FR')}
                </p>

                <div className='space-y-1 text-sm text-gray-600'>
                  <div className='flex justify-between'>
                    <span>Année:</span>
                    <span className='font-medium'>{vehicle.year}</span>
                  </div>
                  {vehicle.mileage && (
                    <div className='flex justify-between'>
                      <span>Kilométrage:</span>
                      <span className='font-medium'>
                        {vehicle.mileage.toLocaleString('fr-FR')} km
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between'>
                    <span>Carburant:</span>
                    <span className='font-medium capitalize'>
                      {vehicle.fuel}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Transmission:</span>
                    <span className='font-medium capitalize'>
                      {vehicle.transmission}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Localisation:</span>
                    <span className='font-medium'>{vehicle.location}</span>
                  </div>
                </div>

                {vehicle.specifications?.power && (
                  <div className='mt-3 pt-3 border-t border-gray-200'>
                    <p className='text-sm text-gray-600'>
                      <span className='font-medium'>Puissance:</span>{' '}
                      {vehicle.specifications.power}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className='text-center mt-12'>
          <a
            href='/admin'
            className='bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors'
          >
            Gérer les véhicules dans Payload Admin
          </a>
        </div>
      </div>
    </section>
  );
}
