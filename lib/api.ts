import { ApiClientConfig, ApiResponse, RequestConfig } from '../types/api';

// Configuration par défaut
const defaultConfig: ApiClientConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  retries: 3,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

class ApiClient {
  private config: ApiClientConfig;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  private async makeRequest<T>(
    endpoint: string,
    requestConfig: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method: requestConfig.method,
        headers: {
          ...this.config.defaultHeaders,
          ...requestConfig.headers,
        },
        body: requestConfig.body
          ? JSON.stringify(requestConfig.body)
          : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  async get<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async post<T>(
    endpoint: string,
    data: Record<string, unknown> | FormData,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data,
      headers,
    });
  }

  async put<T>(
    endpoint: string,
    data: Record<string, unknown> | FormData,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data,
      headers,
    });
  }

  async patch<T>(
    endpoint: string,
    data: Record<string, unknown> | FormData,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data,
      headers,
    });
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

// Instance par défaut
export const apiClient = new ApiClient();

// Instance pour les requêtes authentifiées
export const authenticatedApiClient = new ApiClient({
  defaultHeaders: {
    'Content-Type': 'application/json',
    // L'authentification sera ajoutée via un interceptor
  },
});

/**
 * Construit une URL complète pour l'API backend Payload
 * @param path - Le chemin de l'endpoint (ex: '/api/vehicles')
 * @returns URL complète vers le backend
 */
export const buildApiUrl = (path: string): string => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn('⚠️ NEXT_PUBLIC_API_URL non défini, utilisation de http://localhost:4200');
  }
  // Normaliser le path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Enlever le slash final du base si présent
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;

  return `${normalizedBase}${normalizedPath}`;
};

export default apiClient;
