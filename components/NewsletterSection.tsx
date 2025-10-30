import React, { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'inscription
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className='py-16 bg-gradient-to-r from-premium-gold to-yellow-500'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-2xl shadow-2xl overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            {/* Contenu texte */}
            <div className='p-8 lg:p-12 flex flex-col justify-center'>
              <div className='mb-6'>
                <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                  Les actualités automobiles les plus importantes
                </h2>
                <p className='text-lg text-gray-600 mb-6'>
                  Restez informé des dernières tendances, nouveautés et conseils
                  d&apos;experts dans votre boîte mail. Recevez nos sélections
                  de véhicules premium.
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='flex flex-col sm:flex-row gap-4'>
                  <input
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Votre adresse e-mail'
                    className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                    required
                  />
                  <button
                    type='submit'
                    disabled={isSubscribed}
                    className='bg-premium-gold text-premium-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isSubscribed ? 'Inscrit !' : "S'abonner"}
                  </button>
                </div>

                <p className='text-sm text-gray-500'>
                  En vous abonnant, vous acceptez de recevoir nos newsletters.
                  Vous pouvez vous désabonner à tout moment.
                </p>
              </form>

              {isSubscribed && (
                <div className='mt-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
                  <p className='text-green-800 text-sm'>
                    ✅ Merci ! Vous êtes maintenant abonné à notre newsletter.
                  </p>
                </div>
              )}
            </div>

            {/* Image illustrative */}
            <div className='relative h-64 lg:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
              <div className='text-center'>
                <div className='text-6xl mb-4'>📧</div>
                <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                  Newsletter Vanalexcars
                </h3>
                <p className='text-gray-600'>
                  Actualités • Conseils • Sélections premium
                </p>
              </div>

              {/* Éléments décoratifs */}
              <div className='absolute top-4 right-4 w-16 h-16 bg-premium-gold bg-opacity-20 rounded-full'></div>
              <div className='absolute bottom-4 left-4 w-12 h-12 bg-premium-gold bg-opacity-30 rounded-full'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
