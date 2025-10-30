import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  short_description?: string;
  description?: any;
  category: string;
  icon?: string;
  image?: any;
  price_info?: {
    has_price: boolean;
    price?: number;
    price_type?: string;
  };
  features?: Array<{ feature: string }>;
  featured: boolean;
  order?: number;
}

interface ServicesGridProps {
  services: Service[];
  title?: string;
  showLoadMore?: boolean;
  limit?: number;
}

export default function ServicesGrid({
  services,
  title = 'Nos Services',
  showLoadMore = true,
  limit = 6,
}: ServicesGridProps) {
  const displayedServices = services.slice(0, limit);

  if (displayedServices.length === 0) {
    return (
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <p className='text-gray-600'>
              Aucun service disponible pour le moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-12 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {title && (
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Découvrez nos services d&apos;import automobile premium
            </p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {displayedServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {showLoadMore && services.length > limit && (
          <div className='text-center mt-12'>
            <Link
              href='/services'
              className='bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors'
            >
              Voir tous les services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
      <div className='p-6'>
        <div className='flex items-center mb-4'>
          {service.icon && (
            <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4'>
              <span className='text-2xl'>{service.icon}</span>
            </div>
          )}
          <div>
            <h3 className='text-xl font-semibold text-gray-900'>
              {service.title}
            </h3>
            <span className='inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
              {service.category}
            </span>
          </div>
        </div>

        {service.short_description && (
          <p className='text-gray-600 mb-4'>{service.short_description}</p>
        )}

        {service.price_info?.has_price && (
          <div className='mb-4'>
            <div className='text-2xl font-bold text-yellow-600'>
              €{service.price_info.price?.toLocaleString('fr-FR')}
            </div>
            <div className='text-sm text-gray-500'>
              {service.price_info.price_type === 'fixed' && 'Forfait'}
              {service.price_info.price_type === 'hourly' && "À l'heure"}
              {service.price_info.price_type === 'quote' && 'Sur devis'}
            </div>
          </div>
        )}

        {service.features && service.features.length > 0 && (
          <div className='mb-4'>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>
              Fonctionnalités :
            </h4>
            <ul className='text-sm text-gray-600 space-y-1'>
              {service.features.slice(0, 3).map((feature, index) => (
                <li key={index} className='flex items-center'>
                  <svg
                    className='w-4 h-4 text-green-500 mr-2'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {feature.feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href={`/services/${service.id}`}
          className='inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium'
        >
          En savoir plus
          <svg
            className='w-4 h-4 ml-1'
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
        </Link>
      </div>
    </div>
  );
}
