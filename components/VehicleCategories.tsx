import Link from 'next/link';

interface VehicleCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  href: string;
}

const categories: VehicleCategory[] = [
  {
    id: 'berline',
    name: 'Berline',
    icon: '🚗',
    description: 'Élégance et confort',
    href: '/offres?type=berline',
  },
  {
    id: 'suv',
    name: 'SUV',
    icon: '🚙',
    description: 'Polyvalence et espace',
    href: '/offres?type=suv',
  },
  {
    id: 'coupe',
    name: 'Coupé',
    icon: '🏎️',
    description: 'Sport et performance',
    href: '/offres?type=coupe',
  },
  {
    id: 'cabriolet',
    name: 'Cabriolet',
    icon: '🌞',
    description: 'Liberté et plaisir',
    href: '/offres?type=cabriolet',
  },
  {
    id: 'break',
    name: 'Break',
    icon: '🚐',
    description: 'Pratique et familial',
    href: '/offres?type=break',
  },
  {
    id: 'sport',
    name: 'Sport',
    icon: '🏁',
    description: 'Performance pure',
    href: '/offres?type=sport',
  },
  {
    id: 'luxury',
    name: 'Luxe',
    icon: '👑',
    description: 'Prestige et raffinement',
    href: '/offres?type=luxury',
  },
  {
    id: 'classic',
    name: 'Classique',
    icon: '🕰️',
    description: 'Vintage et caractère',
    href: '/offres?type=classic',
  },
];

export default function VehicleCategories() {
  return (
    <section className='py-12 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Rechercher par type de carrosserie
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Découvrez notre sélection de véhicules premium classés par catégorie
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4'>
          {categories.map(category => (
            <Link
              key={category.id}
              href={category.href}
              className='group flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-premium-gold hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50'
            >
              <div className='text-3xl mb-2 group-hover:scale-110 transition-transform duration-300'>
                {category.icon}
              </div>
              <h3 className='font-semibold text-gray-900 text-sm text-center mb-1'>
                {category.name}
              </h3>
              <p className='text-xs text-gray-500 text-center'>
                {category.description}
              </p>
            </Link>
          ))}
        </div>

        <div className='text-center mt-8'>
          <Link
            href='/offres'
            className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-premium-gold hover:bg-yellow-400 transition-colors duration-300'
          >
            Voir tous les véhicules
            <svg
              className='ml-2 -mr-1 w-5 h-5'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
