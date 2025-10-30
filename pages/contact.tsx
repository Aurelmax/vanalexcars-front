import React, { useState } from 'react';
import Confetti from '../components/Confetti';
import Hero from '../components/Hero';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simuler l'envoi du formulaire
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Afficher les confettis avec un petit délai
      console.log('🎉 Déclenchement des confettis !');
      setTimeout(() => {
        setShowConfetti(true);
      }, 100);

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });

      // Message de succès
      alert('Message envoyé ! Je vous recontacte rapidement.');
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Erreur lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Hero
        title='Contactez-moi'
        subtitle='Importateur Automobile Indépendant'
        description="Disponible 7j/7 pour répondre à vos questions et vous accompagner dans votre projet d'import automobile."
        primaryButton={{
          text: 'Demander un véhicule',
          href: '/demande',
        }}
        secondaryButton={{
          text: 'Voir mes services',
          href: '/services',
        }}
      />

      <div className='px-6 py-16'>
        <div className='max-w-4xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Informations de contact */}
            <div className='bg-white rounded-lg shadow-lg p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Mes coordonnées
              </h2>

              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-premium-gold rounded-full flex items-center justify-center'>
                    <span className='text-premium-black font-bold'>A</span>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900'>Alexandre</p>
                    <p className='text-gray-600'>
                      Importateur automobile indépendant
                    </p>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <span className='text-2xl'>📍</span>
                  <div>
                    <p className='font-semibold text-gray-900'>
                      Antibes, France
                    </p>
                    <p className='text-gray-600'>Déplacements en Allemagne</p>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <span className='text-2xl'>📞</span>
                  <div>
                    <p className='font-semibold text-gray-900'>
                      +33 6 12 34 56 78
                    </p>
                    <p className='text-gray-600'>Disponible 7j/7</p>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <span className='text-2xl'>✉️</span>
                  <div>
                    <p className='font-semibold text-gray-900'>
                      contact@vanalexcars.fr
                    </p>
                    <p className='text-gray-600'>Réponse sous 24h</p>
                  </div>
                </div>
              </div>

              <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Disponibilités
                </h3>
                <p className='text-gray-600 text-sm'>
                  • Lundi à Vendredi : 8h - 20h
                  <br />
                  • Week-end : 9h - 18h
                  <br />• Déplacements en Allemagne sur rendez-vous
                </p>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className='bg-white rounded-lg shadow-lg p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Envoyez-moi un message
              </h2>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Nom complet *
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    E-mail *
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Téléphone
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Message *
                  </label>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder='Décrivez le véhicule que vous recherchez...'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  ></textarea>
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-yellow-500 text-black hover:bg-yellow-400'
                  }`}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Confettis */}
      <Confetti
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </>
  );
}
