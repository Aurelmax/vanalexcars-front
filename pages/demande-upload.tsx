import React, { useState } from 'react';
import Hero from '../components/Hero';

export default function FormulaireDemandeUpload() {
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

  const [uploadedFiles, setUploadedFiles] = useState({
    identity: null as File | null,
    domicile: null as File | null,
    mandat: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: 'identity' | 'domicile' | 'mandat'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles({ ...uploadedFiles, [fileType]: file });
    }
  };

  const removeFile = (fileType: 'identity' | 'domicile' | 'mandat') => {
    setUploadedFiles({ ...uploadedFiles, [fileType]: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Demande envoyée, merci !');
    // A remplacer par appel API réel
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
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-200 hover:border-yellow-500/50'
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
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-200 hover:border-yellow-500/50'
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
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-200 hover:border-yellow-500/50'
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
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
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
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
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
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
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
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                  >
                    <option value=''>Sélectionnez l&apos;urgence</option>
                    <option value='immediate'>Immédiate (1-2 semaines)</option>
                    <option value='normale'>Normale (1-2 mois)</option>
                    <option value='flexible'>Flexible (3+ mois)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Composant RGPD */}
            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 border border-blue-200 mb-8'>
              <div className='flex items-start space-x-4'>
                <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    🔒 Protection de vos données personnelles
                  </h3>
                  <p className='text-gray-700 mb-4'>
                    Vos documents et informations sont protégés par les plus
                    hauts standards de sécurité.
                  </p>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div className='flex items-center space-x-2'>
                      <svg
                        className='w-5 h-5 text-green-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-sm text-gray-700'>
                        Chiffrement SSL/TLS
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <svg
                        className='w-5 h-5 text-green-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-sm text-gray-700'>
                        Stockage sécurisé
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <svg
                        className='w-5 h-5 text-green-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-sm text-gray-700'>
                        Accès restreint
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <svg
                        className='w-5 h-5 text-green-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-sm text-gray-700'>
                        Conformité RGPD
                      </span>
                    </div>
                  </div>

                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <div className='flex items-start space-x-3'>
                      <svg
                        className='w-5 h-5 text-blue-500 mt-0.5'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <div>
                        <p className='text-sm text-blue-800 font-medium mb-1'>
                          Vos données sont utilisées uniquement pour votre
                          demande d&apos;import automobile
                        </p>
                        <p className='text-xs text-blue-600'>
                          Aucune donnée n&apos;est partagée avec des tiers.
                          Suppression automatique après 3 ans.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Collecte des documents d'immatriculation */}
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
                    Téléchargez vos documents directement ici
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                {/* Pièce d'identité */}
                <div className='bg-white rounded-lg p-6 border-2 border-dashed border-gray-300 hover:border-yellow-500 transition-colors'>
                  <div className='text-center'>
                    <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <span className='text-green-600 font-bold text-lg'>
                        1
                      </span>
                    </div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Pièce d&apos;identité
                    </h3>
                    <p className='text-sm text-gray-600 mb-4'>
                      CNI, Passeport, etc.
                    </p>

                    {uploadedFiles.identity ? (
                      <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            <svg
                              className='w-5 h-5 text-green-500'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='text-sm text-green-700 font-medium'>
                              {uploadedFiles.identity.name}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile('identity')}
                            className='text-red-500 hover:text-red-700'
                          >
                            <svg
                              className='w-4 h-4'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className='cursor-pointer'>
                        <input
                          type='file'
                          accept='.pdf,.jpg,.jpeg,.png'
                          onChange={e => handleFileUpload(e, 'identity')}
                          className='hidden'
                        />
                        <div className='bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors'>
                          📁 Télécharger
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Justificatif de domicile */}
                <div className='bg-white rounded-lg p-6 border-2 border-dashed border-gray-300 hover:border-yellow-500 transition-colors'>
                  <div className='text-center'>
                    <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <span className='text-green-600 font-bold text-lg'>
                        2
                      </span>
                    </div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Justificatif de domicile
                    </h3>
                    <p className='text-sm text-gray-600 mb-4'>
                      Facture, quittance, etc.
                    </p>

                    {uploadedFiles.domicile ? (
                      <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            <svg
                              className='w-5 h-5 text-green-500'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='text-sm text-green-700 font-medium'>
                              {uploadedFiles.domicile.name}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile('domicile')}
                            className='text-red-500 hover:text-red-700'
                          >
                            <svg
                              className='w-4 h-4'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className='cursor-pointer'>
                        <input
                          type='file'
                          accept='.pdf,.jpg,.jpeg,.png'
                          onChange={e => handleFileUpload(e, 'domicile')}
                          className='hidden'
                        />
                        <div className='bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors'>
                          📁 Télécharger
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Mandat */}
                <div className='bg-white rounded-lg p-6 border-2 border-dashed border-gray-300 hover:border-yellow-500 transition-colors'>
                  <div className='text-center'>
                    <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <span className='text-green-600 font-bold text-lg'>
                        3
                      </span>
                    </div>
                    <h3 className='font-semibold text-gray-900 mb-2'>Mandat</h3>
                    <p className='text-sm text-gray-600 mb-4'>
                      Document de mandat
                    </p>

                    {uploadedFiles.mandat ? (
                      <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            <svg
                              className='w-5 h-5 text-green-500'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='text-sm text-green-700 font-medium'>
                              {uploadedFiles.mandat.name}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile('mandat')}
                            className='text-red-500 hover:text-red-700'
                          >
                            <svg
                              className='w-4 h-4'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className='cursor-pointer'>
                        <input
                          type='file'
                          accept='.pdf,.jpg,.jpeg,.png'
                          onChange={e => handleFileUpload(e, 'mandat')}
                          className='hidden'
                        />
                        <div className='bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors'>
                          📁 Télécharger
                        </div>
                      </label>
                    )}
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
                  <strong>💡 Astuce :</strong> Téléchargez vos documents
                  directement ici. Je m&apos;occupe de toute la complexité
                  administrative pour vous !
                </p>
              </div>
            </div>

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
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                />
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className='text-center'>
              <button
                type='submit'
                className='bg-yellow-500 text-black px-12 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105'
              >
                Envoyer ma demande
              </button>
              <p className='text-sm text-gray-500 mt-4'>
                Je vous recontacte sous 24h pour discuter de votre projet
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
