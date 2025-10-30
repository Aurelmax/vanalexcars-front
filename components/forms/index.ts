// Export de tous les composants de formulaires
export { default as ContactForm } from './ContactForm';
export { default as FileUpload } from './FileUpload';
export { default as FileUploadDemo } from './FileUploadDemo';
export { default as FormSelector } from './FormSelector';
export { default as NewsletterForm } from './NewsletterForm';
export { default as RegistrationDocumentsForm } from './RegistrationDocumentsForm';
export { default as TestFormSelector } from './TestFormSelector';
export { default as TestimonialForm } from './TestimonialForm';
export { default as VehicleRequestForm } from './VehicleRequestForm';

// Export des types
export type {
  ContactFormData,
  FormSubmission,
  NewsletterFormData,
  TestimonialFormData,
  VehicleRequestFormData,
} from '../../lib/services/formService';
