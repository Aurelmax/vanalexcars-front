import React, { useState } from 'react';
import Link from 'next/link';
import Confetti from '../components/Confetti';
import Hero from '../components/Hero';

export default function FormulaireDemande() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    voiture: '',
    budget: '',
    urgence: '',
    message: '',
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Stocker dans Payload CMS (lead entrant)
      const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.import-voiture-allemagne.fr';
      await fetch(`${BACKEND}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          vehicleSearched: formData.voiture,
          budget: formData.budget || undefined,
          timeline: formData.urgence || undefined,
          message: formData.message || undefined,
          status: 'new',
        }),
      });

      // 2. Notification email via Web3Forms (alerte immédiate)
      const data = new FormData();
      data.append('access_key', '6f11c5bf-fe47-4bdc-90af-114658ee3a64');
      data.append('subject', `Nouvelle demande Vanalexcars — ${formData.voiture || 'sans modèle'}`);
      data.append('from_name', 'Vanalexcars');
      data.append('replyto', formData.email);
      data.append('name', formData.name);
      data.append('email', formData.email);
      if (formData.phone) data.append('phone', formData.phone);
      data.append('voiture', formData.voiture);
      data.append('budget', formData.budget);
      data.append('urgence', formData.urgence);
      if (formData.message) data.append('message', formData.message);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Erreur Web3Forms');

      setShowConfetti(true);
      setSuccess(true);
      setFormData({
        name: '', email: '', phone: '',
        voiture: '', budget: '', urgence: '', message: '',
      });
    } catch {
      alert("Erreur lors de l'envoi. Veuillez réessayer ou nous contacter directement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div className='min-h-screen flex items-center justify-center px-6'>
          <div className='max-w-lg w-full text-center'>
            <div className='w-20 h-20 bg-premium-gold/10 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg className='w-10 h-10 text-premium-gold' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <h2 className='text-3xl font-bold text-gray-900 mb-3'>Demande reçue !</h2>
            <p className='text-gray-600 mb-2'>
              Merci pour votre confiance. Je reviens vers vous sous <strong>24h</strong> pour discuter de votre projet.
            </p>
            <p className='text-sm text-gray-400 mb-8'>Un email de confirmation vous a été envoyé.</p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <a
                href='https://wa.me/33646022468?text=Bonjour%2C%20je%20viens%20de%20soumettre%20une%20demande%20sur%20vanalexcars.fr%20et%20je%20souhaite%20en%20discuter.'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                </svg>
                Discuter sur WhatsApp
              </a>
              <Link href='/catalogue' className='border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition'>
                Voir le catalogue
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Hero
        title='Demandez votre véhicule'
        subtitle="Service personnalisé d'import automobile"
        description="Décrivez le véhicule de vos rêves et je m'occupe de tout : recherche, vérification, achat et livraison en France."
        primaryButton={{ text: 'Voir mes services', href: '/services' }}
        secondaryButton={{ text: 'Me contacter', href: '/contact' }}
      />

      <div className='px-6 py-16'>
        <div className='max-w-3xl mx-auto'>

          <h1 className='text-3xl font-bold mb-2 text-center'>Votre demande personnalisée</h1>
          <p className='text-gray-500 text-center mb-6'>Je vous recontacte sous 24h pour discuter de votre projet.</p>

          {/* Entretien de découverte */}
          <div className='bg-green-50 border border-green-200 rounded-lg p-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div>
              <p className='font-semibold text-gray-900 mb-0.5'>Vous préférez en parler directement ?</p>
              <p className='text-sm text-gray-600'>Contactez-moi sur WhatsApp pour un entretien de découverte rapide.</p>
            </div>
            <a
              href='https://wa.me/33646022468?text=Bonjour%2C%20je%20souhaite%20discuter%20d%27un%20projet%20d%27import%20automobile.'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-600 transition shrink-0'
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
              </svg>
              WhatsApp
            </a>
          </div>

          <form onSubmit={handleSubmit} className='space-y-8'>

            {/* Informations personnelles */}
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>Vos coordonnées</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Nom complet *</label>
                  <input
                    type='text' name='name' placeholder='Votre nom complet'
                    value={formData.name} onChange={handleChange} required
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Adresse e-mail *</label>
                  <input
                    type='email' name='email' placeholder='votre@email.com'
                    value={formData.email} onChange={handleChange} required
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Téléphone</label>
                  <input
                    type='tel' name='phone' placeholder='+33 6 46 02 24 68'
                    value={formData.phone} onChange={handleChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Délai souhaité</label>
                  <select
                    name='urgence' value={formData.urgence} onChange={handleChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  >
                    <option value=''>Sélectionnez</option>
                    <option value='immediate'>Dès que possible (1-2 semaines)</option>
                    <option value='normale'>Sous 1-2 mois</option>
                    <option value='flexible'>Flexible (3+ mois)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Véhicule recherché */}
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>Le véhicule recherché</h2>
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Marque, modèle, version *</label>
                  <input
                    type='text' name='voiture'
                    placeholder='Ex: Porsche 911 Carrera S, BMW M3, Mercedes-AMG GT...'
                    value={formData.voiture} onChange={handleChange} required
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Budget véhicule</label>
                  <select
                    name='budget' value={formData.budget} onChange={handleChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  >
                    <option value=''>Sélectionnez votre budget</option>
                    <option value='<30k'>Moins de 30 000 €</option>
                    <option value='30-50k'>30 000 € – 50 000 €</option>
                    <option value='50-80k'>50 000 € – 80 000 €</option>
                    <option value='80-120k'>80 000 € – 120 000 €</option>
                    <option value='120k+'>Plus de 120 000 €</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Précisez vos critères</label>
                  <textarea
                    name='message' value={formData.message} onChange={handleChange}
                    rows={5}
                    placeholder="Couleur, kilométrage max, année, options souhaitées, usage prévu..."
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent'
                  />
                </div>
              </div>
            </div>

            {/* Soumission */}
            <div className='text-center'>
              <button
                type='submit' disabled={isSubmitting}
                className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-premium-gold text-premium-black hover:bg-yellow-400'
                }`}
              >
                {isSubmitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
              </button>
              <p className='text-sm text-gray-400 mt-4'>Je vous recontacte sous 24h — aucun engagement de votre part.</p>
            </div>

          </form>
        </div>
      </div>

      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
    </>
  );
}
