import React from 'react';
import Link from 'next/link';

interface ForfaitProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  isVip?: boolean;
}

function ForfaitCard({
  title,
  description,
  price,
  features,
  isPopular = false,
  isVip = false,
}: ForfaitProps) {
  return (
    <div
      className={`relative bg-premium-gray-dark rounded-lg p-8 border-2 transition-all duration-300 hover:scale-105 ${
        isPopular ? 'border-premium-gold' : 'border-premium-gray'
      } ${isVip ? 'bg-gradient-to-br from-premium-gray-dark to-premium-black' : ''}`}
    >
      {isPopular && (
        <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
          <span className='bg-premium-gold text-premium-black px-4 py-1 rounded-full text-sm font-semibold'>
            Plus Populaire
          </span>
        </div>
      )}

      {isVip && (
        <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
          <span className='bg-gradient-to-r from-premium-gold to-yellow-400 text-premium-black px-4 py-1 rounded-full text-sm font-semibold'>
            VIP Premium
          </span>
        </div>
      )}

      <div className='text-center mb-6'>
        <h3 className='text-2xl font-bold text-premium-white mb-2'>{title}</h3>
        <p className='text-premium-gray-light mb-4'>{description}</p>
        <div className='text-3xl font-bold text-premium-gold'>{price}</div>
      </div>

      <ul className='space-y-3 mb-8'>
        {features.map((feature, index) => (
          <li key={index} className='flex items-start'>
            <svg
              className='w-5 h-5 text-premium-gold mt-0.5 mr-3 flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            <span className='text-premium-gray-light'>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href='/demande'
        className={`block w-full text-center py-3 px-6 rounded font-semibold transition ${
          isPopular || isVip
            ? 'bg-premium-gold text-premium-black hover:bg-yellow-400'
            : 'bg-premium-gray text-premium-white hover:bg-premium-gray-light'
        }`}
      >
        Choisir ce forfait
      </Link>
    </div>
  );
}

export default function Forfaits() {
  const forfaits = [
    {
      title: 'Forfait Essentiel',
      description: 'Vérification & Achat sur Place',
      price: 'Sur devis',
      features: [
        'Déplacement personnalisé en Allemagne',
        'Vérification et essai du véhicule',
        'Paiement sécurisé sur place',
        'Accompagnement administratif',
        'Obtention des documents (COC, carte grise)',
        'Rapport complet de vérification',
      ],
    },
    {
      title: 'Forfait Confort',
      description: 'Import & Rapatriement',
      price: 'Sur devis',
      features: [
        'Tous les services du forfait Essentiel',
        'Organisation du rapatriement',
        'Transport routier ou camion spécialisé',
        'Suivi en temps réel du transport',
        'Livraison sécurisée',
        'Assistance quitus fiscal',
        'Finalisation carte grise française',
      ],
      isPopular: true,
    },
    {
      title: 'Forfait VIP Premium',
      description: 'Tout Inclus',
      price: 'Sur devis',
      features: [
        'Tous les services du forfait Confort',
        'Assistance personnalisée 24/7',
        'Négociation prix avec le vendeur',
        'Expertise technique approfondie',
        'Contrôle qualité poussé',
        'Gestion complète administrative',
        'Assurance provisoire incluse',
        'Démarches douanières si besoin',
        'Priorité sur les rendez-vous',
      ],
      isVip: true,
    },
  ];

  return (
    <div className='py-16'>
      <div className='text-center mb-12'>
        <h2 className='text-4xl font-bold text-premium-white mb-4'>
          Nos Forfaits Premium
        </h2>
        <p className='text-xl text-premium-gray-light max-w-3xl mx-auto'>
          Service de proximité et d&apos;expertise en face-à-face en Allemagne,
          gage de confiance et sécurité accrue pour votre import automobile.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
        {forfaits.map((forfait, index) => (
          <ForfaitCard
            key={index}
            title={forfait.title}
            description={forfait.description}
            price={forfait.price}
            features={forfait.features}
            isPopular={forfait.isPopular}
            isVip={forfait.isVip}
          />
        ))}
      </div>

      <div className='mt-16 bg-premium-gray-dark rounded-lg p-8 max-w-4xl mx-auto'>
        <h3 className='text-2xl font-bold text-premium-white mb-6 text-center'>
          Points Forts Vanalexcars
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex items-start'>
            <svg
              className='w-6 h-6 text-premium-gold mt-1 mr-3 flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            <div>
              <h4 className='text-premium-white font-semibold mb-2'>
                Service de proximité
              </h4>
              <p className='text-premium-gray-light'>
                Expertise en face-à-face en Allemagne, gage de confiance et
                sécurité accrue
              </p>
            </div>
          </div>

          <div className='flex items-start'>
            <svg
              className='w-6 h-6 text-premium-gold mt-1 mr-3 flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            <div>
              <h4 className='text-premium-white font-semibold mb-2'>
                Paiement sécurisé
              </h4>
              <p className='text-premium-gray-light'>
                Paiement garanti uniquement une fois que le client est satisfait
                du véhicule
              </p>
            </div>
          </div>

          <div className='flex items-start'>
            <svg
              className='w-6 h-6 text-premium-gold mt-1 mr-3 flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            <div>
              <h4 className='text-premium-white font-semibold mb-2'>
                Flexibilité logistique
              </h4>
              <p className='text-premium-gray-light'>
                Rapatriement adapté à chaque demande selon vos préférences
              </p>
            </div>
          </div>

          <div className='flex items-start'>
            <svg
              className='w-6 h-6 text-premium-gold mt-1 mr-3 flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            <div>
              <h4 className='text-premium-white font-semibold mb-2'>
                Transparence totale
              </h4>
              <p className='text-premium-gray-light'>
                Suivi et documents remis au client à chaque étape
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
