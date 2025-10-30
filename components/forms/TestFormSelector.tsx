import React, { useState } from 'react';
import TestContactForm from './TestContactForm';
import TestNewsletterForm from './TestNewsletterForm';
import TestRegistrationDocumentsForm from './TestRegistrationDocumentsForm';
import TestTestimonialForm from './TestTestimonialForm';
import TestVehicleRequestForm from './TestVehicleRequestForm';

type FormType =
  | 'contact'
  | 'vehicle'
  | 'documents'
  | 'testimonial'
  | 'newsletter';

interface TestFormSelectorProps {
  onFormSelect?: (formType: string) => void;
}

const TestFormSelector: React.FC<TestFormSelectorProps> = ({
  onFormSelect,
}) => {
  const [selectedForm, setSelectedForm] = useState<FormType>('contact');

  const handleFormSelect = (formType: FormType) => {
    setSelectedForm(formType);
    if (onFormSelect) {
      onFormSelect(formType);
    }
  };

  const forms = [
    {
      id: 'contact' as FormType,
      title: 'Contact général',
      description: "Demande d'information ou de renseignements",
      icon: '📞',
      color: 'blue',
    },
    {
      id: 'vehicle' as FormType,
      title: 'Demande de véhicule',
      description: 'Recherche personnalisée selon vos critères',
      icon: '🚗',
      color: 'yellow',
    },
    {
      id: 'documents' as FormType,
      title: "Documents d'immatriculation",
      description: 'Demande avec pièces jointes pour vos démarches',
      icon: '📄',
      color: 'green',
    },
    {
      id: 'testimonial' as FormType,
      title: 'Témoignage client',
      description: 'Partagez votre expérience avec Vanalexcars',
      icon: '⭐',
      color: 'purple',
    },
    {
      id: 'newsletter' as FormType,
      title: 'Newsletter',
      description: 'Restez informé de nos actualités',
      icon: '📧',
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses =
      'border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg';

    if (isSelected) {
      switch (color) {
        case 'blue':
          return `${baseClasses} border-blue-400 bg-blue-50`;
        case 'yellow':
          return `${baseClasses} border-yellow-400 bg-yellow-50`;
        case 'green':
          return `${baseClasses} border-green-400 bg-green-50`;
        case 'purple':
          return `${baseClasses} border-purple-400 bg-purple-50`;
        case 'orange':
          return `${baseClasses} border-orange-400 bg-orange-50`;
        default:
          return `${baseClasses} border-gray-400 bg-gray-50`;
      }
    }

    return `${baseClasses} border-gray-200 hover:border-gray-300`;
  };

  const renderForm = () => {
    switch (selectedForm) {
      case 'contact':
        return <TestContactForm />;
      case 'vehicle':
        return <TestVehicleRequestForm />;
      case 'documents':
        return <TestRegistrationDocumentsForm />;
      case 'testimonial':
        return <TestTestimonialForm />;
      case 'newsletter':
        return <TestNewsletterForm />;
      default:
        return <TestContactForm />;
    }
  };

  return (
    <div className='max-w-6xl mx-auto'>
      {/* Sélecteur de formulaires */}
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6 text-center'>
          Choisissez votre formulaire
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {forms.map(form => (
            <div
              key={form.id}
              onClick={() => handleFormSelect(form.id)}
              className={getColorClasses(form.color, selectedForm === form.id)}
            >
              <div className='text-center'>
                <div className='text-4xl mb-3'>{form.icon}</div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  {form.title}
                </h3>
                <p className='text-sm text-gray-600'>{form.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire sélectionné */}
      <div className='bg-white rounded-lg shadow-lg'>{renderForm()}</div>
    </div>
  );
};

export default TestFormSelector;
