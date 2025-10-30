import Link from 'next/link';

interface HeroProps {
  title: string;
  subtitle: string;
  description?: string;
  primaryButton?: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
  showStats?: boolean;
  showCar?: boolean;
}

export default function Hero({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  backgroundImage,
  showStats = false,
  showCar = false,
}: HeroProps) {
  // Images par défaut selon le contexte
  const defaultImages = {
    car: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    luxury:
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    abstract:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  };

  const selectedImage =
    backgroundImage || (showCar ? defaultImages.car : defaultImages.luxury);
  const stats = [
    { number: '150+', label: 'Véhicules importés' },
    { number: '5 ans', label: "D'expérience" },
    { number: '100%', label: 'Satisfaction client' },
    { number: '24h', label: 'Réponse garantie' },
  ];

  return (
    <section className='relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 z-0'>
        <div
          className='w-full h-full bg-cover bg-center bg-no-repeat opacity-40'
          style={{
            backgroundImage: `url(${selectedImage})`,
            backgroundPosition: showCar ? 'center right' : 'center center',
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60' />
      </div>

      {/* Content */}
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Text Content */}
          <div className='space-y-8'>
            <div>
              <h1 className='text-4xl lg:text-6xl font-bold mb-4 leading-tight text-white drop-shadow-lg'>
                {title}
              </h1>
              <h2 className='text-xl lg:text-2xl text-yellow-400 mb-6 font-medium drop-shadow-md'>
                {subtitle}
              </h2>
              {description && (
                <p className='text-lg text-white leading-relaxed max-w-2xl drop-shadow-md'>
                  {description}
                </p>
              )}
            </div>

            {/* Buttons */}
            {(primaryButton || secondaryButton) && (
              <div className='flex flex-col sm:flex-row gap-4'>
                {primaryButton && (
                  <Link
                    href={primaryButton.href}
                    className='inline-flex items-center justify-center bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg'
                  >
                    {primaryButton.text}
                    <svg
                      className='ml-2 w-5 h-5'
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
                  </Link>
                )}
                {secondaryButton && (
                  <Link
                    href={secondaryButton.href}
                    className='inline-flex items-center justify-center bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-lg'
                  >
                    {secondaryButton.text}
                  </Link>
                )}
              </div>
            )}

            {/* Stats */}
            {showStats && (
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-gray-600'>
                {stats.map((stat, index) => (
                  <div key={index} className='text-center'>
                    <div className='text-2xl lg:text-3xl font-bold text-yellow-400 mb-1 drop-shadow-md'>
                      {stat.number}
                    </div>
                    <div className='text-sm text-gray-300 drop-shadow-sm'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className='absolute bottom-0 left-0 right-0'>
        <svg
          className='w-full h-8 text-gray-800'
          viewBox='0 0 1200 120'
          preserveAspectRatio='none'
        >
          <path
            d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z'
            fill='currentColor'
          />
        </svg>
      </div>
    </section>
  );
}
