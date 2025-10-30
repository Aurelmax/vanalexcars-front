import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-black border-t border-gray-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Logo et description */}
          <div className='col-span-1 md:col-span-2'>
            <Link href='/' className='flex items-center mb-4'>
              <span className='text-2xl font-bold text-premium-gold'>
                Vanalexcars
              </span>
            </Link>
            <p className='text-gray-300 mb-6 max-w-md leading-relaxed'>
              Votre expert en import automobile haut de gamme basé à Antibes.
              Spécialiste Porsche et véhicules de prestige avec plus de 5 ans
              d&apos;expérience.
            </p>
            <div className='space-y-3'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-premium-gold rounded-full flex items-center justify-center'>
                  <span className='text-premium-black font-bold text-sm'>
                    📍
                  </span>
                </div>
                <div>
                  <p className='text-white font-medium'>Antibes, France</p>
                  <p className='text-gray-300 text-sm'>
                    Déplacements en Allemagne
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-premium-gold rounded-full flex items-center justify-center'>
                  <span className='text-premium-black font-bold text-sm'>
                    ✉️
                  </span>
                </div>
                <div>
                  <p className='text-white font-medium'>
                    contact@vanalexcars.fr
                  </p>
                  <p className='text-gray-300 text-sm'>Réponse sous 24h</p>
                </div>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-premium-gold rounded-full flex items-center justify-center'>
                  <span className='text-premium-black font-bold text-sm'>
                    📞
                  </span>
                </div>
                <div>
                  <p className='text-white font-medium'>+33 6 12 34 56 78</p>
                  <p className='text-gray-300 text-sm'>Disponible 7j/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Navigation</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/'
                  className='text-gray-300 hover:text-premium-gold transition'
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href='/services'
                  className='text-gray-300 hover:text-premium-gold transition'
                >
                  Mes Services
                </Link>
              </li>
              <li>
                <Link
                  href='/demande'
                  className='text-gray-300 hover:text-premium-gold transition'
                >
                  Demande
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-gray-300 hover:text-premium-gold transition'
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href='/demande-upload'
                  className='text-gray-300 hover:text-premium-gold transition flex items-center space-x-2'
                >
                  <span>📄</span>
                  <span>Documents Cartes Grises</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className='text-white font-semibold mb-6'>Informations</h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/mentions-legales'
                  className='text-gray-300 hover:text-premium-gold transition flex items-center space-x-2'
                >
                  <span>📄</span>
                  <span>Mentions légales</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/cgv'
                  className='text-gray-300 hover:text-premium-gold transition flex items-center space-x-2'
                >
                  <span>📋</span>
                  <span>CGV</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/politique-confidentialite'
                  className='text-gray-300 hover:text-premium-gold transition flex items-center space-x-2'
                >
                  <span>🔒</span>
                  <span>Confidentialité</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/conditions-utilisation'
                  className='text-gray-300 hover:text-premium-gold transition flex items-center space-x-2'
                >
                  <span>⚖️</span>
                  <span>Conditions d&apos;utilisation</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className='border-t border-gray-800 mt-12 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <div className='text-center md:text-left'>
              <p className='text-gray-300 text-sm mb-1'>
                © 2024 Vanalexcars. Tous droits réservés.
              </p>
              <p className='text-gray-400 text-xs'>
                Import automobile haut de gamme à Antibes
              </p>
            </div>
            <div className='flex items-center space-x-6'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-premium-gold rounded-full'></div>
                <span className='text-gray-300 text-xs'>En ligne</span>
              </div>
              <div className='text-gray-300 text-xs'>
                SIRET: 123 456 789 00012
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
