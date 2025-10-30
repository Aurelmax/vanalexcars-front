import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  features: string[];
}

const services: Service[] = [
  {
    id: 'import-service',
    title: "Service d'import complet",
    description:
      "Importation de véhicules premium depuis l'Allemagne avec vérification experte",
    icon: '🚗',
    href: '/services/import',
    features: [
      'Vérification technique complète',
      'Accompagnement administratif',
      'Transport sécurisé',
      'Garantie qualité',
    ],
  },
  {
    id: 'expertise',
    title: 'Expertise automobile',
    description: 'Contrôle technique approfondi par nos experts certifiés',
    icon: '🔍',
    href: '/services/expertise',
    features: [
      'Inspection détaillée',
      'Rapport complet',
      'Conseils personnalisés',
      'Certification qualité',
    ],
  },
  {
    id: 'financing',
    title: 'Solutions de financement',
    description: 'Accompagnement pour le financement de votre véhicule premium',
    icon: '💰',
    href: '/services/financement',
    features: [
      'Simulation personnalisée',
      'Taux préférentiels',
      'Accompagnement complet',
      'Délais optimisés',
    ],
  },
  {
    id: 'maintenance',
    title: 'Maintenance premium',
    description:
      'Service après-vente et maintenance pour véhicules haut de gamme',
    icon: '🔧',
    href: '/services/maintenance',
    features: [
      "Pièces d'origine",
      'Techniciens spécialisés',
      'Garantie étendue',
      'Service mobile',
    ],
  },
];

export default function ServicesSection() {
  return (
    <section className='py-16 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Découvrez nos services
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Vanalexcars vous accompagne dans toutes les étapes de votre projet
            automobile
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {services.map(service => (
            <div
              key={service.id}
              className='bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100'
            >
              <div className='text-center mb-4'>
                <div className='text-4xl mb-3'>{service.icon}</div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {service.title}
                </h3>
                <p className='text-gray-600 text-sm'>{service.description}</p>
              </div>

              <ul className='space-y-2 mb-6'>
                {service.features.map((feature, index) => (
                  <li
                    key={index}
                    className='flex items-center text-sm text-gray-600'
                  >
                    <svg
                      className='w-4 h-4 text-premium-gold mr-2 flex-shrink-0'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={service.href}
                className='block w-full bg-premium-gold text-premium-black text-center py-2 px-4 rounded font-semibold hover:bg-yellow-400 transition-colors duration-300'
              >
                En savoir plus
              </Link>
            </div>
          ))}
        </div>

        <div className='text-center mt-12'>
          <Link
            href='/services'
            className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-premium-gold hover:bg-yellow-400 transition-colors duration-300'
          >
            Voir tous nos services
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
