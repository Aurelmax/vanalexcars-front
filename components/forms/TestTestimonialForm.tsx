import React, { useState } from 'react';
import {
  formService,
  TestimonialFormData,
} from '../../lib/services/formService';

interface TestTestimonialFormProps {
  onSubmit?: (data: TestimonialFormData) => void;
  onSuccess?: () => void;
}

const TestTestimonialForm: React.FC<TestTestimonialFormProps> = ({
  onSubmit,
  onSuccess,
}) => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    location: '',
    vehicle_purchased: '',
    rating: 5,
    title: '',
    testimonial: '',
    photos: [] as File[],
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRatingChange = (rating: number) => {
    setValues(prev => ({ ...prev, rating }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValues(prev => ({ ...prev, photos: Array.from(e.target.files!) }));
    }
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

    if (!values.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!values.testimonial.trim()) {
      newErrors.testimonial = 'Le témoignage est requis';
    } else if (values.testimonial.length < 50) {
      newErrors.testimonial = 'Le témoignage doit faire au moins 50 caractères';
    }

    if (!values.consent) {
      newErrors.consent =
        'Vous devez accepter la publication de votre témoignage';
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
      const formData: TestimonialFormData = {
        name: values.name,
        email: values.email,
        location: values.location,
        vehicle_purchased: values.vehicle_purchased,
        rating: values.rating,
        title: values.title,
        testimonial: values.testimonial,
        photos: values.photos,
        consent: values.consent,
      };

      const result = await formService.submitTestimonial(formData);
      console.log('Témoignage envoyé avec succès:', result);

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
        location: '',
        vehicle_purchased: '',
        rating: 5,
        title: '',
        testimonial: '',
        photos: [],
        consent: false,
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
        Partagez votre expérience
      </h2>

      {submitStatus === 'success' && (
        <div className='mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
          ✅ Merci pour votre témoignage ! Il sera publié après validation.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
          ❌ Une erreur est survenue. Veuillez réessayer.
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Informations personnelles */}
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

          <div>
            <label
              htmlFor='location'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Ville
            </label>
            <input
              type='text'
              id='location'
              name='location'
              value={values.location}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
              placeholder='Nice, Cannes, Monaco...'
            />
          </div>

          <div>
            <label
              htmlFor='vehicle_purchased'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Véhicule acheté
            </label>
            <input
              type='text'
              id='vehicle_purchased'
              name='vehicle_purchased'
              value={values.vehicle_purchased}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
              placeholder='Porsche 911, BMW M3...'
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Votre note *
          </label>
          <div className='flex items-center space-x-2'>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type='button'
                onClick={() => handleRatingChange(star)}
                className={`text-2xl ${
                  star <= values.rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              >
                ⭐
              </button>
            ))}
            <span className='ml-2 text-sm text-gray-600'>
              {values.rating}/5 étoiles
            </span>
          </div>
        </div>

        {/* Titre du témoignage */}
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Titre de votre témoignage *
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={values.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='Ex: Service exceptionnel, véhicule parfait...'
          />
          {errors.title && (
            <p className='mt-1 text-sm text-red-600'>{errors.title}</p>
          )}
        </div>

        {/* Témoignage */}
        <div>
          <label
            htmlFor='testimonial'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Votre témoignage *
          </label>
          <textarea
            id='testimonial'
            name='testimonial'
            value={values.testimonial}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              errors.testimonial ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Décrivez votre expérience avec Vanalexcars : qualité du service, processus d'achat, livraison, etc."
          />
          <div className='mt-1 text-sm text-gray-500'>
            {values.testimonial.length}/50 caractères minimum
          </div>
          {errors.testimonial && (
            <p className='mt-1 text-sm text-red-600'>{errors.testimonial}</p>
          )}
        </div>

        {/* Photos */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Photos (optionnel)
          </label>
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
            <div className='text-4xl mb-2'>📸</div>
            <div className='text-sm text-gray-600'>
              Ajoutez des photos de votre véhicule ou de l&apos;expérience
            </div>
            <input
              type='file'
              multiple
              accept='image/*'
              onChange={handlePhotoChange}
              className='mt-2'
            />
            {values.photos && values.photos.length > 0 && (
              <div className='mt-4 text-sm text-gray-600'>
                {values.photos.length} photo(s) sélectionnée(s)
              </div>
            )}
          </div>
        </div>

        {/* Consentement */}
        <div className='flex items-start'>
          <input
            type='checkbox'
            id='consent'
            checked={values.consent}
            onChange={handleChange}
            className={`h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded mt-1 ${
              errors.consent ? 'border-red-500' : ''
            }`}
          />
          <label htmlFor='consent' className='ml-2 block text-sm text-gray-700'>
            J&apos;autorise la publication de mon témoignage sur le site
            Vanalexcars *
          </label>
        </div>
        {errors.consent && (
          <p className='mt-1 text-sm text-red-600'>{errors.consent}</p>
        )}

        {/* Bouton de soumission */}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting ? 'Envoi en cours...' : 'Publier mon témoignage'}
        </button>
      </form>
    </div>
  );
};

export default TestTestimonialForm;
