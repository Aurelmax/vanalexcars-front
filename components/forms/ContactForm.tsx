import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import {
  ContactFormData,
  ContactFormValues,
  formService,
} from '../../lib/services/formService';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const { values, errors, getFieldProps, handleSubmit, reset } =
    useForm<ContactFormValues>({
      initialValues: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        vehicleId: '',
      },
      validate: values => {
        const errors: Partial<Record<keyof ContactFormData, string>> = {};

        if (!values.name?.trim()) {
          errors.name = 'Le nom est requis';
        }

        if (!values.email?.trim()) {
          errors.email = "L'email est requis";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
          errors.email = "L'email n'est pas valide";
        }

        if (!values.subject?.trim()) {
          errors.subject = 'Le sujet est requis';
        }

        if (!values.message?.trim()) {
          errors.message = 'Le message est requis';
        }

        return errors;
      },
      onSubmit: async values => {
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
          await formService.submitContactForm({
            name: values.name,
            email: values.email,
            phone: values.phone || undefined,
            message: values.message,
            subject: values.subject || undefined,
            vehicleId: values.vehicleId || undefined,
          });

          setSubmitStatus('success');

          // Appeler la prop onSubmit si fournie
          if (onSubmit) {
            onSubmit(values);
          }

          reset();
        } catch (error) {
          console.error("Erreur lors de l'envoi:", error);
          setSubmitStatus('error');
        } finally {
          setIsSubmitting(false);
        }
      },
    });

  // Helper function to get field props
  const getField = (field: keyof ContactFormData) => getFieldProps(field);

  return (
    <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
        Contactez-nous
      </h2>

      {submitStatus === 'success' && (
        <div className='mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
          ✅ Votre message a été envoyé avec succès !
        </div>
      )}

      {submitStatus === 'error' && (
        <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
          ❌ Une erreur est survenue. Veuillez réessayer.
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
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
              onChange={getField('name').onChange}
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
              Email *
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={values.email}
              onChange={getField('email').onChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='votre@email.com'
            />
            {errors.email && (
              <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
            )}
          </div>
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
            onChange={getField('phone').onChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
            placeholder='06 12 34 56 78'
          />
        </div>

        <div>
          <label
            htmlFor='subject'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Sujet *
          </label>
          <select
            id='subject'
            name='subject'
            value={values.subject}
            onChange={getField('subject').onChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              errors.subject ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value=''>Sélectionnez un sujet</option>
            <option value='demande-info'>Demande d&apos;information</option>
            <option value='devis'>Demande de devis</option>
            <option value='rendez-vous'>Prise de rendez-vous</option>
            <option value='autre'>Autre</option>
          </select>
          {errors.subject && (
            <p className='mt-1 text-sm text-red-600'>{errors.subject}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='message'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Message *
          </label>
          <textarea
            id='message'
            name='message'
            value={values.message}
            onChange={getField('message').onChange}
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='Décrivez votre demande en détail...'
          />
          {errors.message && (
            <p className='mt-1 text-sm text-red-600'>{errors.message}</p>
          )}
        </div>

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
            </Link>
          </label>
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
