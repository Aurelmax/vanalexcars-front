import Link from 'next/link';
import React, { useState } from 'react';
import { formService } from '../../lib/services/formService';
import FileUpload from './FileUpload';

interface TestRegistrationDocumentsFormProps {
  onSubmit?: (data: Record<string, string | number | boolean | File[]>) => void;
  onSuccess?: () => void;
}

const TestRegistrationDocumentsForm: React.FC<
  TestRegistrationDocumentsFormProps
> = ({ onSubmit, onSuccess }) => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    request_type: 'search',
    urgency: 'medium',
    message: '',
    documents: {
      identity: [] as File[],
      proof_of_address: [] as File[],
      mandate: [] as File[],
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDocumentsChange = (
    type: 'identity' | 'proof_of_address' | 'mandate',
    files: File[]
  ) => {
    setValues(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: files,
      },
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!values.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!values.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Envoi réel vers l'API avec fichiers
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone || '');
      formData.append('request_type', values.request_type);
      formData.append('urgency', values.urgency);
      formData.append('message', values.message || '');

      // Ajouter les fichiers
      values.documents.identity.forEach((file, index) => {
        formData.append(`identity_${index}`, file);
      });
      values.documents.proof_of_address.forEach((file, index) => {
        formData.append(`proof_of_address_${index}`, file);
      });
      values.documents.mandate.forEach((file, index) => {
        formData.append(`mandate_${index}`, file);
      });

      const result = await formService.submitRegistrationDocuments({
        ...values,
        request_type: values.request_type as 'search' | 'advice' | 'quote',
        urgency: values.urgency as 'low' | 'medium' | 'high',
      });
      console.log("Documents d'immatriculation envoyés avec succès:", result);

      setSubmitStatus('success');

      if (onSubmit) {
        onSubmit({
          name: values.name,
          email: values.email,
          phone: values.phone,
          request_type: values.request_type,
          urgency: values.urgency,
          message: values.message,
          identity: values.documents.identity,
          proof_of_address: values.documents.proof_of_address,
          mandate: values.documents.mandate,
        });
      }

      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      setValues({
        name: '',
        email: '',
        phone: '',
        request_type: 'search',
        urgency: 'medium',
        message: '',
        documents: {
          identity: [],
          proof_of_address: [],
          mandate: [],
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
        Demande avec documents d&apos;immatriculation
      </h2>

      {submitStatus === 'success' && (
        <div className='mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
          ✅ Votre demande et vos documents ont été envoyés avec succès !
        </div>
      )}

      {submitStatus === 'error' && (
        <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
          ❌ Une erreur est survenue. Veuillez réessayer.
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Type de demande */}
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Type de demande
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {[
              {
                value: 'search',
                icon: '🔍',
                title: 'Recherche ciblée',
                description: 'Je recherche un véhicule spécifique',
              },
              {
                value: 'advice',
                icon: '💡',
                title: 'Conseil & Expertise',
                description: "J'ai besoin de conseils pour mon projet",
              },
              {
                value: 'quote',
                icon: '💰',
                title: 'Devis personnalisé',
                description: 'Je veux un devis pour mes services',
              },
            ].map(option => (
              <label
                key={option.value}
                className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                  values.request_type === option.value
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type='radio'
                  name='request_type'
                  value={option.value}
                  checked={values.request_type === option.value}
                  onChange={handleChange}
                  className='sr-only'
                />
                <div className='text-center'>
                  <div className='text-3xl mb-2'>{option.icon}</div>
                  <div className='font-semibold text-gray-900'>
                    {option.title}
                  </div>
                  <div className='text-sm text-gray-600 mt-1'>
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Informations personnelles */}
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Vos informations
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Nom complet *
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={values.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='Votre nom complet'
              />
              {errors.name && (
                <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Adresse e-mail *
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={values.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='votre@email.com'
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Téléphone
              </label>
              <input
                type='tel'
                id='phone'
                name='phone'
                value={values.phone}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
                placeholder='+33 6 12 34 56 78'
              />
            </div>

            <div>
              <label
                htmlFor='urgency'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Urgence
              </label>
              <select
                id='urgency'
                name='urgency'
                value={values.urgency}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
              >
                <option value='low'>Faible</option>
                <option value='medium'>Moyenne</option>
                <option value='high'>Élevée</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents d'immatriculation */}
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
          <div className='flex items-center mb-6'>
            <div className='text-2xl mr-3'>📄</div>
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>
                Documents d&apos;immatriculation
              </h3>
              <p className='text-sm text-gray-600'>
                Collecte simplifiée pour vos démarches administratives
              </p>
            </div>
          </div>

          {/* Section principale avec documents requis */}
          <div className='mb-6'>
            <h4 className='font-semibold text-gray-900 mb-4 flex items-center'>
              <span className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                📋
              </span>
              Vous me transmettez :
            </h4>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Pièce d'identité */}
              <div className='bg-white rounded-lg border border-gray-200 p-4'>
                <div className='flex items-center mb-3'>
                  <div className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                    1
                  </div>
                  <span className='font-medium text-gray-900'>
                    Pièce d&apos;identité
                  </span>
                </div>
                <FileUpload
                  onFilesChange={files =>
                    handleDocumentsChange('identity', files)
                  }
                  maxFiles={2}
                  maxSize={5}
                  acceptedTypes={['image/*', 'application/pdf']}
                  label=''
                  description="Carte d'identité, passeport ou permis de conduire"
                  required
                  customFileName='piece-identite'
                />
              </div>

              {/* Justificatif de domicile */}
              <div className='bg-white rounded-lg border border-gray-200 p-4'>
                <div className='flex items-center mb-3'>
                  <div className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                    2
                  </div>
                  <span className='font-medium text-gray-900'>
                    Justificatif de domicile
                  </span>
                  <div className='ml-2 text-yellow-600'>✓</div>
                </div>
                <FileUpload
                  onFilesChange={files =>
                    handleDocumentsChange('proof_of_address', files)
                  }
                  maxFiles={2}
                  maxSize={5}
                  acceptedTypes={['image/*', 'application/pdf']}
                  label=''
                  description='Facture EDF, téléphone, assurance, etc.'
                  required
                  customFileName='justificatif-domicile'
                />
              </div>

              {/* Mandat */}
              <div className='bg-white rounded-lg border border-gray-200 p-4'>
                <div className='flex items-center mb-3'>
                  <div className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                    3
                  </div>
                  <span className='font-medium text-gray-900'>Le mandat</span>
                </div>
                <FileUpload
                  onFilesChange={files =>
                    handleDocumentsChange('mandate', files)
                  }
                  maxFiles={1}
                  maxSize={5}
                  acceptedTypes={['image/*', 'application/pdf']}
                  label=''
                  description='Document de mandat signé'
                  required
                  customFileName='mandat'
                />
              </div>
            </div>
          </div>

          {/* Résumé des fichiers téléchargés */}
          {(values.documents.identity.length > 0 ||
            values.documents.proof_of_address.length > 0 ||
            values.documents.mandate.length > 0) && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
              <h4 className='font-semibold text-green-800 mb-3 flex items-center'>
                <span className='w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2'>
                  ✓
                </span>
                Fichiers téléchargés
              </h4>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {/* Pièce d'identité */}
                <div className='bg-white rounded-lg border border-green-200 p-3'>
                  <div className='flex items-center mb-2'>
                    <div className='w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2'>
                      1
                    </div>
                    <span className='text-sm font-medium text-gray-900'>
                      Pièce d&apos;identité
                    </span>
                    <div className='ml-auto'>
                      {values.documents.identity.length > 0 ? (
                        <span className='text-green-600 text-sm'>
                          ✓ {values.documents.identity.length} fichier(s)
                        </span>
                      ) : (
                        <span className='text-gray-400 text-sm'>
                          En attente
                        </span>
                      )}
                    </div>
                  </div>
                  {values.documents.identity.length > 0 && (
                    <div className='text-xs text-gray-600'>
                      {values.documents.identity.map((file, index) => (
                        <div key={index} className='truncate'>
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Justificatif de domicile */}
                <div className='bg-white rounded-lg border border-green-200 p-3'>
                  <div className='flex items-center mb-2'>
                    <div className='w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2'>
                      2
                    </div>
                    <span className='text-sm font-medium text-gray-900'>
                      Justificatif de domicile
                    </span>
                    <div className='ml-auto'>
                      {values.documents.proof_of_address.length > 0 ? (
                        <span className='text-green-600 text-sm'>
                          ✓ {values.documents.proof_of_address.length}{' '}
                          fichier(s)
                        </span>
                      ) : (
                        <span className='text-gray-400 text-sm'>
                          En attente
                        </span>
                      )}
                    </div>
                  </div>
                  {values.documents.proof_of_address.length > 0 && (
                    <div className='text-xs text-gray-600'>
                      {values.documents.proof_of_address.map((file, index) => (
                        <div key={index} className='truncate'>
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mandat */}
                <div className='bg-white rounded-lg border border-green-200 p-3'>
                  <div className='flex items-center mb-2'>
                    <div className='w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2'>
                      3
                    </div>
                    <span className='text-sm font-medium text-gray-900'>
                      Mandat
                    </span>
                    <div className='ml-auto'>
                      {values.documents.mandate.length > 0 ? (
                        <span className='text-green-600 text-sm'>
                          ✓ {values.documents.mandate.length} fichier(s)
                        </span>
                      ) : (
                        <span className='text-gray-400 text-sm'>
                          En attente
                        </span>
                      )}
                    </div>
                  </div>
                  {values.documents.mandate.length > 0 && (
                    <div className='text-xs text-gray-600'>
                      {values.documents.mandate.map((file, index) => (
                        <div key={index} className='truncate'>
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Services inclus */}
          <div className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
            <h4 className='font-semibold text-gray-900 mb-4 flex items-center'>
              <span className='w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                🛠️
              </span>
              Je m&apos;occupe de tout le reste :
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {[
                'Documents allemands',
                'Quitus fiscal',
                'COC (Certificat de Conformité)',
                "Démarches ANTS jusqu'à la carte grise définitive",
              ].map((service, index) => (
                <div key={index} className='flex items-center'>
                  <div className='w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3'>
                    ✓
                  </div>
                  <span className='text-gray-700 text-sm'>{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Astuce */}
          <div className='bg-yellow-100 border border-yellow-300 rounded-lg p-4'>
            <div className='flex items-start'>
              <div className='text-yellow-600 mr-3 text-lg'>💡</div>
              <div>
                <div className='font-semibold text-yellow-800 mb-1'>
                  Astuce :
                </div>
                <div className='text-yellow-700 text-sm'>
                  Vous n&apos;avez qu&apos;à fournir ces 3 documents simples. Je
                  m&apos;occupe de toute la complexité administrative pour vous
                  !
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message complémentaire */}
        <div>
          <label
            htmlFor='message'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Informations complémentaires
          </label>
          <textarea
            id='message'
            name='message'
            value={values.message}
            onChange={handleChange}
            rows={4}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
            placeholder='Décrivez votre projet, vos critères, vos contraintes...'
          />
        </div>

        {/* Acceptation des conditions */}
        <div className='flex items-center'>
          <input
            type='checkbox'
            id='privacy'
            required
            className='h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded'
          />
          <label htmlFor='privacy' className='ml-2 block text-sm text-gray-700'>
            J&apos;accepte la{' '}
            <Link
              href='/politique-confidentialite'
              className='text-yellow-600 hover:text-yellow-500'
            >
              politique de confidentialité
            </Link>{' '}
            et les{' '}
            <Link
              href='/conditions-utilisation'
              className='text-yellow-600 hover:text-yellow-500'
            >
              conditions d&apos;utilisation
            </Link>
          </label>
        </div>

        {/* Bouton de soumission */}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting
            ? 'Envoi en cours...'
            : 'Envoyer ma demande avec documents'}
        </button>
      </form>
    </div>
  );
};

export default TestRegistrationDocumentsForm;
