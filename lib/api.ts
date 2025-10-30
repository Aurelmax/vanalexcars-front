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
 * Construit une URL pour l'API proxy Next.js (résout les problèmes CORS)
 * @param path - Le chemin de l'endpoint (ex: '/api/vehicles')
 * @returns URL vers l'API proxy locale de Next.js
 */
export const buildApiUrl = (path: string): string => {
  // Utilise l'API proxy locale de Next.js pour éviter les problèmes CORS
  // Le proxy se charge de transférer la requête vers le backend Payload
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // En production ou si on est côté serveur, utilise le backend direct
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';
    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${normalizedBase}${normalizedPath}`;
  }

  // Côté client en développement, utilise l'API proxy locale
  return normalizedPath;
};

export default apiClient;
