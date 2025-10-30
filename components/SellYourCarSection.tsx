import Link from 'next/link';

export default function SellYourCarSection() {
  return (
    <section className='py-16 bg-gradient-to-r from-blue-50 to-indigo-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            {/* Contenu texte */}
            <div className='p-8 lg:p-12 flex flex-col justify-center'>
              <div className='mb-6'>
                <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                  Vendre ta voiture
                </h2>
                <p className='text-lg text-gray-600 mb-6'>
                  Vendez votre véhicule rapidement et en toute sécurité avec
                  Vanalexcars. Notre expertise vous garantit le meilleur prix
                  pour votre automobile.
                </p>
              </div>

              <div className='space-y-4 mb-8'>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 text-green-600'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <span className='text-gray-700'>
                    Évaluation gratuite en 24h
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 text-green-600'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <span className='text-gray-700'>Paiement sécurisé</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 text-green-600'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <span className='text-gray-700'>Reprise immédiate</span>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <Link
                  href='/vendre'
                  className='inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300'
                >
                  Vendre ma voiture
                  <svg
                    className='ml-2 w-5 h-5'
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
                <Link
                  href='/estimation'
                  className='inline-flex items-center justify-center border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300'
                >
                  Estimation gratuite
                </Link>
              </div>
            </div>

            {/* Image illustrative */}
            <div className='relative h-64 lg:h-auto bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center'>
              <div className='text-center'>
                <div className='text-6xl mb-4'>🔑</div>
                <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                  Vendez avec Vanalexcars
                </h3>
                <p className='text-gray-600'>Expertise • Sécurité • Rapidité</p>
              </div>

              {/* Éléments décoratifs */}
              <div className='absolute top-4 right-4 w-16 h-16 bg-blue-200 bg-opacity-50 rounded-full'></div>
              <div className='absolute bottom-4 left-4 w-12 h-12 bg-indigo-200 bg-opacity-50 rounded-full'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
