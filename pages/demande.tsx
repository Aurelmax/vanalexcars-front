import React, { useState } from 'react';
import Confetti from '../components/Confetti';
import Hero from '../components/Hero';

export default function FormulaireDemande() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    demandeType: '',
    voiture: '',
    budget: '',
    urgence: '',
    forfait: '',
    message: '',
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simuler l'envoi du formulaire
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Afficher les confettis
      setShowConfetti(true);

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        demandeType: '',
        voiture: '',
        budget: '',
        urgence: '',
        forfait: '',
        message: '',
      });

      // Message de succès
      alert('Demande envoyée, merci ! Je vous recontacte rapidement.');
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Erreur lors de l'envoi de la demande. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Hero
        title='Demandez votre véhicule'
        subtitle="Service personnalisé d'import automobile"
        description="Décrivez le véhicule de vos rêves et je m'occupe de tout : recherche, vérification, achat et livraison en France."
        primaryButton={{
          text: 'Voir mes services',
          href: '/services',
        }}
        secondaryButton={{
          text: 'Me contacter',
          href: '/contact',
        }}
      />

      <div className='px-6 py-16'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-3xl font-bold mb-6 text-center'>
            Formulaire de demande personnalisée
          </h1>

          {/* Type de demande */}
          <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>
              Type de demande
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <label
                className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                  formData.demandeType === 'recherche'
                    ? 'border-premium-gold bg-premium-gold/10'
                    : 'border-gray-200 hover:border-premium-gold/50'
                }`}
              >
                <input
                  type='radio'
                  name='demandeType'
                  value='recherche'
                  checked={formData.demandeType === 'recherche'}
                  onChange={handleChange}
                  className='sr-only'
                />
                <div className='text-center'>
                  <div className='text-3xl mb-2'>🔍</div>
                  <h3 className='font-semibold text-gray-900'>
                    Recherche ciblée
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Je recherche un véhicule spécifique
                  </p>
                </div>
              </label>

              <label
                className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                  formData.demandeType === 'conseil'
                    ? 'border-premium-gold bg-premium-gold/10'
                    : 'border-gray-200 hover:border-premium-gold/50'
                }`}
              >
                <input
                  type='radio'
                  name='demandeType'
                  value='conseil'
                  checked={formData.demandeType === 'conseil'}
                  onChange={handleChange}
                  className='sr-only'
                />
                <div className='text-center'>
                  <div className='text-3xl mb-2'>💡</div>
                  <h3 className='font-semibold text-gray-900'>
                    Conseil & Expertise
                  </h3>
                  <p className='text-sm text-gray-600'>
                    J&apos;ai besoin de conseils pour mon projet
                  </p>
                </div>
              </label>

              <label
                className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                  formData.demandeType === 'devis'
                    ? 'border-premium-gold bg-premium-gold/10'
                    : 'border-gray-200 hover:border-premium-gold/50'
                }`}
              >
                <input
                  type='radio'
                  name='demandeType'
                  value='devis'
                  checked={formData.demandeType === 'devis'}
                  onChange={handleChange}
                  className='sr-only'
                />
                <div className='text-center'>
                  <div className='text-3xl mb-2'>💰</div>
                  <h3 className='font-semibold text-gray-900'>
                    Devis personnalisé
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Je veux un devis pour mes services
                  </p>
                </div>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-8'>
            {/* Informations personnelles */}
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>
                Vos informations
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Nom complet *
                  </label>
                  <input
                    type='text'
                    name='name'
                    placeholder='Votre nom complet'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Adresse e-mail *
                  </label>
                  <input
                    type='email'
                    name='email'
                    placeholder='votre@email.com'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Téléphone
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    placeholder='+33 6 12 34 56 78'
                    value={formData.phone}
                    onChange={handleChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Urgence
                  </label>
                  <select
                    name='urgence'
                    value={formData.urgence}
                    onChange={handleChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  >
                    <option value=''>Sélectionnez l&apos;urgence</option>
                    <option value='immediate'>Immédiate (1-2 semaines)</option>
                    <option value='normale'>Normale (1-2 mois)</option>
                    <option value='flexible'>Flexible (3+ mois)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Détails du véhicule - Affiché seulement si recherche ciblée */}
            {formData.demandeType === 'recherche' && (
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <h2 className='text-xl font-semibold text-gray-900 mb-6'>
                  Détails du véhicule recherché
                </h2>
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Véhicule recherché *
                    </label>
                    <input
                      type='text'
                      name='voiture'
                      placeholder='Ex: Porsche 911 Carrera, BMW M3, Mercedes-AMG GT...'
                      value={formData.voiture}
                      onChange={handleChange}
                      required
                      className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Budget approximatif
                      </label>
                      <select
                        name='budget'
                        value={formData.budget}
                        onChange={handleChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                      >
                        <option value=''>Sélectionnez votre budget</option>
                        <option value='<30k'>Moins de 30 000€</option>
                        <option value='30-50k'>30 000€ - 50 000€</option>
                        <option value='50-80k'>50 000€ - 80 000€</option>
                        <option value='80-120k'>80 000€ - 120 000€</option>
                        <option value='120k+'>Plus de 120 000€</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Forfait souhaité
                      </label>
                      <select
                        name='forfait'
                        value={formData.forfait}
                        onChange={handleChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                      >
                        <option value=''>Sélectionnez un forfait</option>
                        <option value='essentiel'>Forfait Essentiel</option>
                        <option value='confort'>Forfait Confort</option>
                        <option value='vip'>Forfait VIP Premium</option>
                        <option value='sur-mesure'>Sur mesure</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Collecte des documents d'immatriculation */}
            {(formData.demandeType === 'recherche' ||
              formData.demandeType === '') && (
              <div className='bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg shadow-lg p-8 border border-yellow-200'>
                <div className='flex items-center mb-6'>
                  <div className='w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mr-4'>
                    <span className='text-2xl'>📋</span>
                  </div>
                  <div>
                    <h2 className='text-xl font-semibold text-gray-900'>
                      Documents d&apos;immatriculation
                    </h2>
                    <p className='text-gray-600 text-sm'>
                      Collecte simplifiée pour vos démarches administratives
                    </p>
                  </div>
                </div>

                <div className='bg-white rounded-lg p-6 mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    Vous me transmettez :
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                        <span className='text-green-600 font-bold'>1</span>
                      </div>
                      <span className='text-gray-700'>
                        Votre pièce d&apos;identité
                      </span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                        <span className='text-green-600 font-bold'>2</span>
                      </div>
                      <span className='text-gray-700'>
                        Un justificatif de domicile
                      </span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                        <span className='text-green-600 font-bold'>3</span>
                      </div>
                      <span className='text-gray-700'>Le mandat</span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center'>
                        <span className='text-yellow-600 font-bold'>✓</span>
                      </div>
                      <span className='text-gray-700'>
                        Et je m&apos;occupe de tout le reste
                      </span>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    Je m&apos;occupe de tout le reste :
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-center space-x-3'>
                      <svg
                        className='w-5 h-5 text-yellow-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-gray-700'>Documents allemands</span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <svg
                        className='w-5 h-5 text-yellow-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-gray-700'>Quitus fiscal</span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <svg
                        className='w-5 h-5 text-yellow-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-gray-700'>
                        COC (Certificat de Conformité)
                      </span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <svg
                        className='w-5 h-5 text-yellow-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-gray-700'>
                        Démarches ANTS jusqu&apos;à la carte grise définitive
                      </span>
                    </div>
                  </div>
                </div>

                <div className='mt-6 p-4 bg-yellow-500/10 border border-yellow-300 rounded-lg'>
                  <p className='text-sm text-gray-700'>
                    <strong>💡 Astuce :</strong> Vous n&apos;avez qu&apos;à
                    fournir ces 3 documents simples. Je m&apos;occupe de toute
                    la complexité administrative pour vous !
                  </p>
                </div>
              </div>
            )}

            {/* Message personnalisé */}
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>
                {formData.demandeType === 'recherche'
                  ? 'Informations complémentaires'
                  : formData.demandeType === 'conseil'
                    ? 'Décrivez votre projet'
                    : 'Détails de votre demande'}
              </h2>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Message *
                </label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder={
                    formData.demandeType === 'recherche'
                      ? "Décrivez le véhicule de vos rêves, vos critères spécifiques, l'usage prévu..."
                      : formData.demandeType === 'conseil'
                        ? "Expliquez votre projet d'import automobile, vos questions, vos doutes..."
                        : 'Décrivez vos besoins et attentes pour que je puisse vous proposer le meilleur service...'
                  }
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                />
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className='text-center'>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-premium-gold text-premium-black hover:bg-yellow-400'
                }`}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
              </button>
              <p className='text-sm text-gray-500 mt-4'>
                Je vous recontacte sous 24h pour discuter de votre projet
              </p>
            </div>
          </form>
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
