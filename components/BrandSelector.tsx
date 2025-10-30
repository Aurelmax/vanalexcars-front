import Link from 'next/link';
import { BrandLogo } from './BrandLogos';

interface Brand {
  name: string;
  displayName: string;
  count: number;
}

interface BrandSelectorProps {
  brands?: Brand[];
  title?: string;
}

const defaultBrands: Brand[] = [
  {
    name: 'audi',
    displayName: "Audi d'occasion",
    count: 19445,
  },
  {
    name: 'bmw',
    displayName: "BMW d'occasion",
    count: 12955,
  },
  {
    name: 'mercedes',
    displayName: "Mercedes-Benz d'occasion",
    count: 19402,
  },
  {
    name: 'porsche',
    displayName: "Porsche d'occasion",
    count: 1697,
  },
  {
    name: 'volkswagen',
    displayName: "Volkswagen d'occasion",
    count: 33393,
  },
  {
    name: 'mini',
    displayName: "Mini d'occasion",
    count: 1382,
  },
];

export default function BrandSelector({
  brands = defaultBrands,
  title = "Achetez votre prochaine voiture d'occasion.",
}: BrandSelectorProps) {
  return (
    <section className='py-16 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center'>
          {title}
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/catalogue?brand=${brand.name}`}
              className='group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-500 hover:shadow-lg transition-all duration-300'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform'>
                    <BrandLogo brand={brand.name} className='w-12 h-12' />
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors'>
                      {brand.displayName}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {brand.count.toLocaleString('fr-FR')} véhicules
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
