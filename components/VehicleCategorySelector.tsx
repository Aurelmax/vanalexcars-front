import Link from 'next/link';
import Image from 'next/image';

interface VehicleCategory {
  name: string;
  displayName: string;
  count: number;
  imageUrl: string;
}

interface VehicleCategorySelectorProps {
  categories?: VehicleCategory[];
  title?: string;
}

const defaultCategories: VehicleCategory[] = [
  {
    name: 'suv',
    displayName: "SUV d'occasion",
    count: 45335,
    imageUrl: '/images/categories/suv.png',
  },
  {
    name: 'berline',
    displayName: "Berline d'occasion",
    count: 24704,
    imageUrl: '/images/categories/berline.png',
  },
  {
    name: 'coupe',
    displayName: "Coupé d'occasion",
    count: 4782,
    imageUrl: '/images/categories/coupe.png',
  },
  {
    name: 'break',
    displayName: "Break d'occasion",
    count: 21844,
    imageUrl: '/images/categories/break.png',
  },
  {
    name: 'monospace',
    displayName: "Monospace d'occasion",
    count: 6845,
    imageUrl: '/images/categories/monospace.png',
  },
  {
    name: 'cabriolet',
    displayName: "Cabriolet d'occasion",
    count: 2430,
    imageUrl: '/images/categories/cabriolet.png',
  },
];

export default function VehicleCategorySelector({
  categories = defaultCategories,
  title = 'Catégories de véhicules',
}: VehicleCategorySelectorProps) {
  return (
    <section className='py-16 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center'>
          {title}
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/catalogue?category=${category.name}`}
              className='group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-500 hover:shadow-lg transition-all duration-300'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='relative w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform'>
                    {/* Placeholder pour l'image du véhicule */}
                    <div className='absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                      <svg
                        className='w-10 h-10 text-gray-400'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z' />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors'>
                      {category.displayName}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {category.count.toLocaleString('fr-FR')} véhicules
                    </p>
                  </div>
                </div>
                <svg
                  className='w-6 h-6 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
