import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import {
  formService,
  NewsletterFormData,
  NewsletterFormValues,
} from '../../lib/services/formService';

interface NewsletterFormProps {
  onSubmit?: (data: NewsletterFormData) => void;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const { values, errors, getFieldProps, setFieldValue, handleSubmit, reset } =
    useForm<NewsletterFormValues>({
      initialValues: {
        email: '',
        name: '',
        interests: '',
      },
      validate: values => {
        const errors: Partial<Record<keyof NewsletterFormData, string>> = {};

        if (!values.email.trim()) {
          errors.email = "L'email est requis";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
          errors.email = "L'email n'est pas valide";
        }

        return errors;
      },
      onSubmit: async values => {
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
          await formService.submitNewsletter({
            email: values.email,
            name: values.name,
            interests: values.interests ? [values.interests] : [],
          });

          setSubmitStatus('success');

          // Appeler la prop onSubmit si fournie
          if (onSubmit) {
            onSubmit({
              email: values.email,
              name: values.name,
              interests: values.interests ? [values.interests] : [],
            });
          }

          reset();
        } catch (error) {
          console.error("Erreur lors de l'inscription:", error);
          setSubmitStatus('error');
        } finally {
          setIsSubmitting(false);
        }
      },
    });

  const handleInterestChange = (interest: string) => {
    const currentInterests = (values.interests as string)?.split(',').filter(Boolean) || [];
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];

    setFieldValue('interests', updatedInterests.join(','));
  };

  // Helper function to get field props
  const getField = (field: keyof NewsletterFormData) => getFieldProps(field);

  return (
    <div className='bg-linear-to-r from-yellow-500 to-yellow-400 rounded-xl p-8 text-black'>
      <div className='max-w-2xl mx-auto'>
        <h2 className='text-2xl font-bold mb-4 text-center'>
          📧 Restez informé de nos actualités
        </h2>

        {submitStatus === 'success' && (
          <div className='mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
            ✅ Vous êtes maintenant inscrit à notre newsletter !
          </div>
        )}

        {submitStatus === 'error' && (
          <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
            ❌ Une erreur est survenue. Veuillez réessayer.
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-800 mb-2'
              >
                Email *
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={values.email}
                onChange={getField('email').onChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 ${
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
                htmlFor='name'
                className='block text-sm font-medium text-gray-800 mb-2'
              >
                Nom (optionnel)
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={values.name}
                onChange={getField('name').onChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800'
                placeholder='Votre prénom'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-800 mb-3'>
              Vos centres d&apos;intérêt (optionnel)
            </label>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
              {[
                'Porsche',
                'BMW',
                'Mercedes-Benz',
                'Audi',
                'Véhicules de prestige',
                'Import automobile',
                "Conseils d'achat",
                'Actualités auto',
              ].map(interest => (
                <label
                  key={interest}
                  className='flex items-center cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={values.interests?.includes(interest) || false}
                    onChange={() => handleInterestChange(interest)}
                    className='h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300 rounded'
                  />
                  <span className='ml-2 text-sm text-gray-800'>{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <div className='bg-yellow-100 border border-yellow-300 rounded-lg p-4'>
            <h3 className='font-semibold text-gray-800 mb-2'>
              🎯 Ce que vous recevrez :
            </h3>
            <ul className='text-sm text-gray-700 space-y-1'>
              <li>• Nouveaux véhicules disponibles</li>
              <li>• Conseils d&apos;import automobile</li>
              <li>• Actualités du marché allemand</li>
              <li>• Offres exclusives</li>
            </ul>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='privacy'
              required
              className='h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300 rounded'
            />
            <label
              htmlFor='privacy'
              className='ml-2 block text-sm text-gray-800'
            >
              J&apos;accepte de recevoir la newsletter et la{' '}
              <Link
                href='/politique-confidentialite'
                className='text-gray-800 hover:text-gray-600 underline'
              >
                politique de confidentialité
              </Link>
            </label>
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-gray-800 text-yellow-400 py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting
              ? 'Inscription en cours...'
              : "S'inscrire à la newsletter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterForm;
