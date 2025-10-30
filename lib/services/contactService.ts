import { ApiResponse } from '../../types/api';
import { apiClient } from '../api';

// Types pour les contacts et demandes
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface VehicleRequestFormData {
  name: string;
  email: string;
  phone: string;
  demandeType: 'recherche' | 'achat' | 'conseil' | 'autre';
  voiture: string;
  budget: string;
  urgence: 'faible' | 'moyenne' | 'haute';
  forfait: 'essentiel' | 'confort' | 'vip';
  message: string;
}

export interface VehicleRequestWithFiles extends VehicleRequestFormData {
  files: {
    identity?: File;
    domicile?: File;
    mandat?: File;
  };
}

export interface ContactSubmission {
  id: string;
  type: 'contact' | 'vehicle_request';
  data: ContactFormData | VehicleRequestFormData;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  id: string;
  message: string;
  estimatedResponseTime: string;
}

class ContactService {
  private baseEndpoint = '/contact';

  async submitContactForm(
    data: ContactFormData
  ): Promise<ApiResponse<ContactResponse>> {
    return apiClient.post<ContactResponse>(`${this.baseEndpoint}/form`, data);
  }

  async submitVehicleRequest(
    data: VehicleRequestFormData
  ): Promise<ApiResponse<ContactResponse>> {
    return apiClient.post<ContactResponse>(
      `${this.baseEndpoint}/vehicle-request`,
      data
    );
  }

  async submitVehicleRequestWithFiles(
    data: VehicleRequestWithFiles
  ): Promise<ApiResponse<ContactResponse>> {
    const formData = new FormData();

    // Ajouter les données du formulaire
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'files' && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Ajouter les fichiers
    if (data.files.identity) {
      formData.append('identity', data.files.identity);
    }
    if (data.files.domicile) {
      formData.append('domicile', data.files.domicile);
    }
    if (data.files.mandat) {
      formData.append('mandat', data.files.mandat);
    }

    return apiClient.post<ContactResponse>(
      `${this.baseEndpoint}/vehicle-request-with-files`,
      formData,
      {
        'Content-Type': 'multipart/form-data',
      }
    );
  }

  async getContactSubmissions(): Promise<ApiResponse<ContactSubmission[]>> {
    return apiClient.get<ContactSubmission[]>(
      `${this.baseEndpoint}/submissions`
    );
  }

  async getContactSubmissionById(
    id: string
  ): Promise<ApiResponse<ContactSubmission>> {
    return apiClient.get<ContactSubmission>(
      `${this.baseEndpoint}/submissions/${id}`
    );
  }

  async updateContactSubmissionStatus(
    id: string,
    status: ContactSubmission['status']
  ): Promise<ApiResponse<ContactSubmission>> {
    return apiClient.patch<ContactSubmission>(
      `${this.baseEndpoint}/submissions/${id}`,
      { status }
    );
  }

  async getContactStats(): Promise<
    ApiResponse<{
      totalSubmissions: number;
      pendingSubmissions: number;
      completedSubmissions: number;
      averageResponseTime: number;
      submissionsByType: Array<{ type: string; count: number }>;
    }>
  > {
    return apiClient.get(`${this.baseEndpoint}/stats`);
  }
}

export const contactService = new ContactService();
export default contactService;
