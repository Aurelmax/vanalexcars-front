/**
 * Configuration API pour VanalexCars Frontend
 * Ce fichier contient les configurations et validations pour l'API backend
 */

/**
 * Configuration de l'API
 */
export const apiConfig = {
  // URL de l'API backend (Payload CMS)
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200',

  // URL publique du site frontend
  siteURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3200',

  // Timeout pour les requêtes API (en millisecondes)
  timeout: 30000,

  // Headers par défaut
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Interface pour le résultat de validation
 */
export interface ConfigValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Valide la configuration de l'API
 * @returns Objet avec le statut de validation et les erreurs/avertissements
 */
export function validateConfig(): ConfigValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Vérifier NEXT_PUBLIC_API_URL
  if (!process.env.NEXT_PUBLIC_API_URL) {
    warnings.push(
      'NEXT_PUBLIC_API_URL is not defined. Using default: http://localhost:4200'
    );
  } else {
    try {
      new URL(process.env.NEXT_PUBLIC_API_URL);
    } catch (e) {
      errors.push(
        `NEXT_PUBLIC_API_URL is not a valid URL: ${process.env.NEXT_PUBLIC_API_URL}`
      );
    }
  }

  // Vérifier NEXT_PUBLIC_SITE_URL
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    warnings.push(
      'NEXT_PUBLIC_SITE_URL is not defined. Using default: http://localhost:3200'
    );
  } else {
    try {
      new URL(process.env.NEXT_PUBLIC_SITE_URL);
    } catch (e) {
      errors.push(
        `NEXT_PUBLIC_SITE_URL is not a valid URL: ${process.env.NEXT_PUBLIC_SITE_URL}`
      );
    }
  }

  // Vérifier que les URLs sont différentes
  if (
    process.env.NEXT_PUBLIC_API_URL &&
    process.env.NEXT_PUBLIC_SITE_URL &&
    process.env.NEXT_PUBLIC_API_URL === process.env.NEXT_PUBLIC_SITE_URL
  ) {
    errors.push(
      'NEXT_PUBLIC_API_URL and NEXT_PUBLIC_SITE_URL should be different'
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Construit une URL complète pour un endpoint API
 * @param path - Le chemin de l'endpoint (ex: '/api/users')
 * @returns URL complète
 */
export function buildApiUrl(path: string): string {
  const baseURL = apiConfig.baseURL.endsWith('/')
    ? apiConfig.baseURL.slice(0, -1)
    : apiConfig.baseURL;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseURL}${normalizedPath}`;
}

/**
 * Endpoints de l'API Payload CMS
 */
export const apiEndpoints = {
  auth: {
    login: '/api/users/login',
    logout: '/api/users/logout',
    refresh: '/api/users/refresh-token',
    me: '/api/users/me',
  },
  vehicles: {
    list: '/api/vehicles',
    create: '/api/vehicles',
    get: (id: string) => `/api/vehicles/${id}`,
    update: (id: string) => `/api/vehicles/${id}`,
    delete: (id: string) => `/api/vehicles/${id}`,
  },
  reservations: {
    list: '/api/reservations',
    create: '/api/reservations',
    get: (id: string) => `/api/reservations/${id}`,
    update: (id: string) => `/api/reservations/${id}`,
    delete: (id: string) => `/api/reservations/${id}`,
  },
  users: {
    list: '/api/users',
    create: '/api/users',
    get: (id: string) => `/api/users/${id}`,
    update: (id: string) => `/api/users/${id}`,
    delete: (id: string) => `/api/users/${id}`,
  },
};

export default apiConfig;
