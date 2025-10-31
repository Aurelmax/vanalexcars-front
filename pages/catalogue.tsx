import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Vehicle {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  brand?: string;
  category?: string;
  status: string;
  imageUrls?: Array<{ url: string }>;
}

interface CatalogueProps {
  vehicles: Vehicle[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: {
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    fuel?: string;
    transmission?: string;
  };
}

export default function Catalogue({
  vehicles,
  totalCount,
  currentPage,
  totalPages,
  filters,
}: CatalogueProps) {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState(filters.brand ?? '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category ?? '');
  const [selectedFuel, setSelectedFuel] = useState(filters.fuel ?? '');
  const [selectedTransmission, setSelectedTransmission] = useState(
    filters.transmission ?? ''
  );
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice ?? '',
    max: filters.maxPrice ?? '',
  });

  const brands = ['Audi', 'BMW', 'Mercedes', 'Porsche', 'Volkswagen', 'Mini'];
  const categories = ['SUV', 'Berline', 'Coupé', 'Break', 'Monospace', 'Cabriolet'];
  const fuels = ['Essence', 'Diesel', 'Électrique', 'Hybride'];
  const transmissions = ['Manuelle', 'Automatique'];

  const applyFilters = () => {
    const query: any = {};

    if (selectedBrand) query.brand = selectedBrand.toLowerCase();
    if (selectedCategory) query.category = selectedCategory.toLowerCase();
    if (selectedFuel) query.fuel = selectedFuel.toLowerCase();
    if (selectedTransmission) query.transmission = selectedTransmission.toLowerCase();
    if (priceRange.min) query.minPrice = priceRange.min;
    if (priceRange.max) query.maxPrice = priceRange.max;

    router.push({
      pathname: '/catalogue',
      query,
    });
  };

  const resetFilters = () => {
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedFuel('');
    setSelectedTransmission('');
    setPriceRange({ min: '', max: '' });
    router.push('/catalogue');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Catalogue de véhicules
          </h1>
          <p className='text-gray-600'>
            {totalCount} véhicule{totalCount > 1 ? 's' : ''} disponible
            {totalCount > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Sidebar Filtres */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-sm p-6 sticky top-4'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-900'>Filtres</h2>
                <button
                  onClick={resetFilters}
                  className='text-sm text-yellow-600 hover:text-yellow-700 font-medium'
                >
                  Réinitialiser
                </button>
              </div>

              {/* Marque */}
              <div className='mb-6'>
                <label className='block text-sm font-semibold text-gray-900 mb-3'>
                  Marque
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                >
                  <option value=''>Toutes les marques</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand.toLowerCase()}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Catégorie */}
              <div className='mb-6'>
                <label className='block text-sm font-semibold text-gray-900 mb-3'>
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                >
                  <option value=''>Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prix */}
              <div className='mb-6'>
                <label className='block text-sm font-semibold text-gray-900 mb-3'>
                  Fourchette de prix (€)
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  <input
                    type='number'
                    placeholder='Min'
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                    className='p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                  />
                  <input
                    type='number'
                    placeholder='Max'
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                    className='p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                  />
                </div>
              </div>

              {/* Carburant */}
              <div className='mb-6'>
                <label className='block text-sm font-semibold text-gray-900 mb-3'>
                  Carburant
                </label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                >
                  <option value=''>Tous les carburants</option>
                  {fuels.map((fuel) => (
                    <option key={fuel} value={fuel.toLowerCase()}>
                      {fuel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div className='mb-6'>
                <label className='block text-sm font-semibold text-gray-900 mb-3'>
                  Transmission
                </label>
                <select
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                >
                  <option value=''>Toutes</option>
                  {transmissions.map((transmission) => (
                    <option key={transmission} value={transmission.toLowerCase()}>
                      {transmission}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bouton Appliquer */}
              <button
                onClick={applyFilters}
                className='w-full bg-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors'
              >
                Appliquer les filtres
              </button>
            </div>
          </div>

          {/* Liste des véhicules */}
          <div className='lg:col-span-3'>
            {vehicles.length === 0 ? (
              <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
                <svg
                  className='w-16 h-16 text-gray-400 mx-auto mb-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  Aucun véhicule trouvé
                </h3>
                <p className='text-gray-600 mb-4'>
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={resetFilters}
                  className='text-yellow-600 hover:text-yellow-700 font-medium'
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {vehicles.map((vehicle) => (
                    <Link
                      key={vehicle.id}
                      href={`/vehicles/${vehicle.id}`}
                      className='group bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden'
                    >
                      {/* Image du véhicule */}
                      <div className='aspect-video bg-linear-to-br from-gray-200 to-gray-300 relative'>
                        {vehicle.imageUrls?.[0]?.url ? (
                          <img
                            src={vehicle.imageUrls[0].url}
                            alt={vehicle.title}
                            className='w-full h-full object-cover'
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextElementSibling) {
                                (e.currentTarget.nextElementSibling as HTMLElement).style.display =
                                  'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className='w-full h-full flex items-center justify-center absolute top-0 left-0'
                          style={{ display: vehicle.imageUrls?.[0]?.url ? 'none' : 'flex' }}
                        >
                          <svg
                            className='w-12 h-12 text-gray-400'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z' />
                          </svg>
                        </div>
                      </div>

                      {/* Détails */}
                      <div className='p-4'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors'>
                          {vehicle.title}
                        </h3>

                        <div className='flex items-center text-sm text-gray-600 mb-3 space-x-3'>
                          <span>{vehicle.year}</span>
                          <span>•</span>
                          <span>{vehicle.mileage.toLocaleString('fr-FR')} km</span>
                          <span>•</span>
                          <span className='capitalize'>{vehicle.fuel}</span>
                        </div>

                        <div className='flex items-center justify-between'>
                          <div className='text-2xl font-bold text-yellow-600'>
                            {vehicle.price.toLocaleString('fr-FR')} €
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              vehicle.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {vehicle.status === 'active' ? 'Disponible' : 'Vendu'}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='mt-8 flex justify-center gap-2'>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => {
                            router.push({
                              pathname: '/catalogue',
                              query: { ...router.query, page },
                            });
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-yellow-500 text-black'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const {
    brand,
    category,
    minPrice,
    maxPrice,
    fuel,
    transmission,
    page = '1',
  } = query;

  let vehicles: Vehicle[] = [];
  let totalCount = 0;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

    // Construire les paramètres de requête
    const params = new URLSearchParams();
    params.append('limit', '12');
    params.append('page', page as string);
    params.append('sort', '-createdAt');

    // Ajouter les filtres
    if (brand) params.append('where[brand][equals]', brand as string);
    if (category) params.append('where[category][equals]', category as string);
    if (fuel) params.append('where[fuel][equals]', fuel as string);
    if (transmission)
      params.append('where[transmission][equals]', transmission as string);
    if (minPrice)
      params.append('where[price][greater_than_equal]', minPrice as string);
    if (maxPrice)
      params.append('where[price][less_than_equal]', maxPrice as string);

    const response = await fetch(`${backendUrl}/api/vehicles?${params.toString()}`);

    if (response.ok) {
      const data = await response.json();
      vehicles = data.docs || [];
      totalCount = data.totalDocs || 0;
      console.log(`✅ ${vehicles.length} véhicules récupérés pour le catalogue`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des véhicules:', error);
  }

  const totalPages = Math.ceil(totalCount / 12);

  return {
    props: {
      vehicles,
      totalCount,
      currentPage: parseInt(page as string, 10),
      totalPages,
      filters: {
        brand: brand ?? null,
        category: category ?? null,
        minPrice: minPrice ? parseInt(minPrice as string, 10) : null,
        maxPrice: maxPrice ? parseInt(maxPrice as string, 10) : null,
        fuel: fuel ?? null,
        transmission: transmission ?? null,
      },
    },
  };
};
