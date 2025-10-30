import { authService } from './authService';

// Types pour les formulaires
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  vehicleId?: string;
}

// Type compatible avec useForm
export type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  vehicleId: string;
};

export interface VehicleRequestFormData {
  name: string;
  email: string;
  phone: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year?: string;
  budget?: string;
  message: string;
  [key: string]: string | number | boolean | File[] | null | undefined;
}

export interface TestimonialFormData {
  name: string;
  email: string;
  location?: string;
  vehicle_purchased?: string;
  rating: number;
  title: string;
  testimonial: string;
  photos?: File[];
  consent?: boolean;
  [key: string]: string | number | boolean | File[] | null | undefined;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
  interests?: string[];
}

// Type compatible avec useForm
export type NewsletterFormValues = {
  email: string;
  name: string;
  interests: string;
};

export interface RegistrationDocumentsFormData {
  name: string;
  email: string;
  phone?: string;
  request_type: 'search' | 'advice' | 'quote';
  urgency: 'low' | 'medium' | 'high';
  message?: string;
  documents: {
    identity: File[];
    proof_of_address: File[];
    mandate: File[];
  };
}

// Type compatible avec useForm
export type RegistrationDocumentsFormValues = Record<
  string,
  string | number | boolean | File[] | null
>;

export interface FormSubmission {
  id: number;
  type:
    | 'contact'
    | 'vehicle_request'
    | 'testimonial'
    | 'newsletter'
    | 'registration_documents';
  data:
    | ContactFormData
    | VehicleRequestFormData
    | TestimonialFormData
    | NewsletterFormData
    | RegistrationDocumentsFormData;
  status: 'new' | 'read' | 'replied' | 'archived';
  date: string;
  ip?: string;
  userAgent?: string;
  success?: boolean;
}

// Interface étendue pour les données réelles de l'API
export interface ExtendedFormSubmission extends FormSubmission {
  form_type: string;
  form_data: Record<string, string | number | boolean | File[]>;
  form_status: string;
  meta?: Record<string, string | number | boolean>;
}

// Service pour gérer les formulaires
class FormService {
  private baseUrl: string;

  constructor() {
    // Utiliser les endpoints Next.js pour éviter les problèmes CORS
    this.baseUrl = '/api/forms';
  }

  // Soumettre un formulaire de contact
  async submitContactForm(data: ContactFormData): Promise<FormSubmission> {
    const response = await fetch(`${this.baseUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi du formulaire");
    }

    const result = await response.json();
    return result.data;
  }

  // Soumettre une demande de véhicule
  async submitVehicleRequest(
    data: VehicleRequestFormData
  ): Promise<FormSubmission> {
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({
        title: `Demande véhicule: ${data.vehicle_make} ${data.vehicle_model}`,
        content: data.message,
        status: 'publish',
        meta: {
          form_type: 'vehicle_request',
          form_data: data,
          submission_date: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi de la demande");
    }

    const result = await response.json();
    return result.data;
  }

  // Récupérer les soumissions (admin)
  async getFormSubmissions(params?: {
    type?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<FormSubmission[]> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('meta_key', 'form_type');
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString());

    const response = await fetch(`${this.baseUrl}/submissions?${queryParams}`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des soumissions');
    }

    return response.json();
  }

  // Marquer une soumission comme lue
  async markAsRead(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/submissions/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({
        meta: {
          form_status: 'read',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour');
    }
  }

  // Envoyer un email de notification
  async sendNotificationEmail(submission: FormSubmission): Promise<void> {
    // Intégration avec un service d'email (SendGrid, Mailgun, etc.)
    // Ou utilisation d'un service d'email externe (SendGrid, Mailgun, etc.)
    console.log('Email de notification envoyé pour:', submission);
  }

  // Soumettre un témoignage
  async submitTestimonial(data: TestimonialFormData): Promise<FormSubmission> {
    const response = await fetch(`${this.baseUrl}/testimonial`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi du témoignage");
    }

    const result = await response.json();
    return result.data;
  }

  // S'inscrire à la newsletter
  async submitNewsletter(data: NewsletterFormData): Promise<FormSubmission> {
    const response = await fetch(`${this.baseUrl}/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'inscription à la newsletter");
    }

    const result = await response.json();
    return result.data;
  }

  // Soumettre des documents d'immatriculation
  async submitRegistrationDocuments(
    data: RegistrationDocumentsFormData
  ): Promise<FormSubmission> {
    const response = await fetch(`${this.baseUrl}/registration-documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la soumission des documents');
    }

    const result = await response.json();
    return result.data;
  }
}

export const formService = new FormService();
export default formService;
