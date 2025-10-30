import Link from 'next/link';
import React, { useState } from 'react';
import {
  formService,
  VehicleRequestFormData,
} from '../../lib/services/formService';

interface TestVehicleRequestFormProps {
  onSubmit?: (data: VehicleRequestFormData) => void;
  onSuccess?: () => void;
}

const TestVehicleRequestForm: React.FC<TestVehicleRequestFormProps> = ({
  onSubmit,
  onSuccess,
}) => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    budget: '',
    message: '',
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

    if (!values.vehicle_make.trim()) {
      newErrors.vehicle_make = 'La marque est requise';
    }

    if (!values.vehicle_model.trim()) {
      newErrors.vehicle_model = 'Le modèle est requis';
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
      // Envoi réel vers l'API
      const formData: VehicleRequestFormData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        vehicle_make: values.vehicle_make,
        vehicle_model: values.vehicle_model,
        vehicle_year: values.vehicle_year,
        budget: values.budget,
        message: values.message,
      };

      const result = await formService.submitVehicleRequest(formData);
      console.log('Demande de véhicule envoyée avec succès:', result);

      setSubmitStatus('success');

      if (onSubmit) {
        onSubmit(values);
      }

      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      setValues({
        name: '',
        email: '',
        phone: '',
        vehicle_make: '',
        vehicle_model: '',
        vehicle_year: '',
        budget: '',
        message: '',
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

  return (
    <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
        Demande de véhicule personnalisée
      </h2>

      {submitStatus === 'success' && (
        <div className='mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
          ✅ Votre demande a été envoyée avec succès ! Nous vous contacterons
          sous 24h.
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
              Email *
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
            placeholder='06 12 34 56 78'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label
              htmlFor='vehicle_make'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Marque du véhicule *
            </label>
            <select
              id='vehicle_make'
              name='vehicle_make'
              value={values.vehicle_make}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                errors.vehicle_make ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value=''>Sélectionnez une marque</option>
              <option value='Porsche'>Porsche</option>
              <option value='BMW'>BMW</option>
              <option value='Mercedes-Benz'>Mercedes-Benz</option>
              <option value='Audi'>Audi</option>
              <option value='Volkswagen'>Volkswagen</option>
              <option value='Ferrari'>Ferrari</option>
              <option value='Lamborghini'>Lamborghini</option>
              <option value='Maserati'>Maserati</option>
              <option value='Bentley'>Bentley</option>
              <option value='Rolls-Royce'>Rolls-Royce</option>
              <option value='Autre'>Autre</option>
            </select>
            {errors.vehicle_make && (
              <p className='mt-1 text-sm text-red-600'>{errors.vehicle_make}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='vehicle_model'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Modèle *
            </label>
            <input
              type='text'
              id='vehicle_model'
              name='vehicle_model'
              value={values.vehicle_model}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                errors.vehicle_model ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='911, Cayenne, Macan...'
            />
            {errors.vehicle_model && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.vehicle_model}
              </p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label
              htmlFor='vehicle_year'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Année souhaitée
            </label>
            <select
              id='vehicle_year'
              name='vehicle_year'
              value={values.vehicle_year}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
            >
              <option value=''>Toutes les années</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor='budget'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Budget (€)
            </label>
            <input
              type='number'
              id='budget'
              name='budget'
              value={values.budget}
              onChange={handleChange}
              min='0'
              step='1000'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
              placeholder='50000'
            />
          </div>
        </div>

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
            placeholder='Couleur souhaitée, options particulières, kilométrage maximum, etc.'
          />
        </div>

        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <h3 className='text-sm font-semibold text-yellow-800 mb-2'>
            💡 Notre service
          </h3>
          <ul className='text-sm text-yellow-700 space-y-1'>
            <li>• Recherche personnalisée selon vos critères</li>
            <li>• Vérification technique complète</li>
            <li>• Négociation des prix</li>
            <li>• Accompagnement jusqu&apos;à la livraison</li>
          </ul>
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
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </button>
      </form>
    </div>
  );
};

export default TestVehicleRequestForm;
