export default function AnimatedBanner() {
  return (
    <div className='relative bg-gradient-to-r from-premium-black via-premium-gray-dark to-premium-black text-white overflow-hidden'>
      {/* Background Animation */}
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-premium-gold/10 via-transparent to-premium-gold/10 animate-pulse' />
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-premium-gold/5 to-transparent' />
      </div>

      {/* Content */}
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0'>
          {/* Profile Section */}
          <div className='flex items-center space-x-6'>
            <div className='relative'>
              <div className='w-16 h-16 bg-premium-gold rounded-full flex items-center justify-center animate-bounce'>
                <span className='text-2xl font-bold text-premium-black'>A</span>
              </div>
              <div className='absolute -top-1 -right-1 w-6 h-6 bg-premium-gold rounded-full animate-ping' />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-white animate-fade-in'>
                Aurélien LAVAYSSIERE
              </h2>
              <p className='text-premium-gold font-medium animate-slide-in-left'>
                Importateur automobile indépendant
              </p>
              <p className='text-premium-gray-light text-sm animate-slide-in-left delay-200'>
                Spécialiste Porsche & Véhicules de prestige
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className='flex space-x-8'>
            <div className='text-center animate-fade-in-up delay-300'>
              <div className='flex items-center justify-center mb-1'>
                <span className='text-2xl font-bold text-premium-gold'>5</span>
                <span className='text-premium-gold text-xl'>★</span>
              </div>
              <div className='text-xs text-premium-gray-light'>Évaluation</div>
            </div>

            <div className='text-center animate-fade-in-up delay-400'>
              <div className='text-2xl font-bold text-premium-gold'>150+</div>
              <div className='text-xs text-premium-gray-light'>Clients</div>
            </div>

            <div className='text-center animate-fade-in-up delay-500'>
              <div className='text-2xl font-bold text-premium-gold'>24h</div>
              <div className='text-xs text-premium-gray-light'>Réponse</div>
            </div>
          </div>
        </div>

        {/* Animated Elements */}
        <div className='absolute top-4 right-4 w-4 h-4 bg-premium-gold rounded-full animate-ping' />
        <div className='absolute bottom-4 left-4 w-3 h-3 bg-premium-gold rounded-full animate-pulse' />
        <div className='absolute top-1/2 left-1/4 w-2 h-2 bg-premium-gold rounded-full animate-bounce' />
      </div>

      {/* Bottom Wave */}
      <div className='absolute bottom-0 left-0 right-0'>
        <svg
          className='w-full h-8 text-premium-black'
          viewBox='0 0 1200 120'
          preserveAspectRatio='none'
        >
          <path
            d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z'
            fill='currentColor'
          />
        </svg>
      </div>
    </div>
  );
}
