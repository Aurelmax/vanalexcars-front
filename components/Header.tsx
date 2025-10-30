import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-md shadow-lg border-b border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Barre principale */}
        <div className='flex justify-between items-center py-4'>
          {/* Logo moderne */}
          <Link href='/' className='flex items-center space-x-3 group'>
            <div className='relative'>
              <div className='w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105'>
                <span className='text-black font-bold text-xl'>V</span>
              </div>
              <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse'></div>
            </div>
            <div className='flex flex-col'>
              <span className='text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent'>
                Vanalexcars
              </span>
              <span className='text-xs text-gray-400 -mt-1'>
                Import Premium
              </span>
            </div>
          </Link>

          {/* Navigation Desktop moderne */}
          <nav className='hidden lg:flex items-center space-x-1'>
            <Link
              href='/'
              className='relative px-4 py-2 text-white hover:text-yellow-400 transition-all duration-300 font-medium group'
            >
              <span className='relative z-10'>Accueil</span>
              <div className='absolute inset-0 bg-yellow-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300'></div>
            </Link>
            <Link
              href='/services'
              className='relative px-4 py-2 text-white hover:text-yellow-400 transition-all duration-300 font-medium group'
            >
              <span className='relative z-10'>Services</span>
              <div className='absolute inset-0 bg-yellow-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300'></div>
            </Link>
            <Link
              href='/demande'
              className='relative px-4 py-2 text-white hover:text-yellow-400 transition-all duration-300 font-medium group'
            >
              <span className='relative z-10'>Demande</span>
              <div className='absolute inset-0 bg-yellow-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300'></div>
            </Link>
            <Link
              href='/contact'
              className='relative px-4 py-2 text-white hover:text-yellow-400 transition-all duration-300 font-medium group'
            >
              <span className='relative z-10'>Contact</span>
              <div className='absolute inset-0 bg-yellow-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300'></div>
            </Link>
          </nav>

          {/* Actions utilisateur modernes */}
          <div className='hidden md:flex items-center space-x-3'>
            {/* Bouton WhatsApp */}
            <a
              href='https://wa.me/33612345678'
              target='_blank'
              rel='noopener noreferrer'
              className='p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-all duration-300 group'
              title='WhatsApp'
            >
              <svg
                className='w-5 h-5 group-hover:scale-110 transition-transform'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488' />
              </svg>
            </a>

            {/* Lien Administration */}
            <Link
              href='/admin-login'
              className='p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 rounded-lg transition-all duration-300 group'
              title='Administration'
            >
              <svg
                className='w-5 h-5 group-hover:scale-110 transition-transform'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </Link>

            {/* Bouton Téléphone */}
            <a
              href='tel:+33612345678'
              className='p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all duration-300 group'
              title='Appeler'
            >
              <svg
                className='w-5 h-5 group-hover:scale-110 transition-transform'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                />
              </svg>
            </a>

            {/* CTA Principal */}
            <Link
              href='/demande'
              className='relative bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2.5 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group'
            >
              <span className='relative z-10 flex items-center space-x-2'>
                <span>Demander un véhicule</span>
                <svg
                  className='w-4 h-4 group-hover:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 8l4 4m0 0l-4 4m4-4H3'
                  />
                </svg>
              </span>
              <div className='absolute inset-0 bg-white/20 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300'></div>
            </Link>
          </div>

          {/* Menu Mobile Button moderne */}
          <button
            onClick={toggleMenu}
            className='lg:hidden relative w-10 h-10 flex items-center justify-center text-white hover:text-yellow-400 transition-colors duration-300'
            aria-label='Toggle menu'
          >
            <div className='relative w-6 h-6'>
              <span
                className={`absolute top-0 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}
              ></span>
              <span
                className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}
              ></span>
              <span
                className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}
              ></span>
            </div>
          </button>
        </div>

        {/* Navigation Mobile moderne */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className='px-4 py-6 space-y-4 bg-black/90 backdrop-blur-md rounded-2xl mt-4 border border-gray-800'>
            <Link
              href='/'
              className='flex items-center space-x-3 px-4 py-3 text-white hover:text-yellow-400 hover:bg-yellow-400/10 rounded-xl transition-all duration-300 group'
              onClick={() => setIsMenuOpen(false)}
            >
              <div className='w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                  />
                </svg>
              </div>
              <span className='font-medium'>Accueil</span>
            </Link>

            <Link
              href='/services'
              className='flex items-center space-x-3 px-4 py-3 text-white hover:text-yellow-400 hover:bg-yellow-400/10 rounded-xl transition-all duration-300 group'
              onClick={() => setIsMenuOpen(false)}
            >
              <div className='w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                  />
                </svg>
              </div>
              <span className='font-medium'>Services</span>
            </Link>

            <Link
              href='/demande'
              className='flex items-center space-x-3 px-4 py-3 text-white hover:text-yellow-400 hover:bg-yellow-400/10 rounded-xl transition-all duration-300 group'
              onClick={() => setIsMenuOpen(false)}
            >
              <div className='w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
              </div>
              <span className='font-medium'>Demande</span>
            </Link>

            <Link
              href='/contact'
              className='flex items-center space-x-3 px-4 py-3 text-white hover:text-yellow-400 hover:bg-yellow-400/10 rounded-xl transition-all duration-300 group'
              onClick={() => setIsMenuOpen(false)}
            >
              <div className='w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <span className='font-medium'>Contact</span>
            </Link>

            {/* Actions rapides mobile */}
            <div className='pt-4 border-t border-gray-700 space-y-3'>
              <a
                href='https://wa.me/33612345678'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-3 px-4 py-3 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded-xl transition-all duration-300 group'
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488' />
                </svg>
                <span className='font-medium'>WhatsApp</span>
              </a>

              <a
                href='tel:+33612345678'
                className='flex items-center space-x-3 px-4 py-3 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-xl transition-all duration-300 group'
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
                <span className='font-medium'>Appeler</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
