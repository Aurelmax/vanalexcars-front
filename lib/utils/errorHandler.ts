// Gestionnaire d'erreurs centralisé

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, string | number | boolean>;
  timestamp: number;
  source: 'api' | 'validation' | 'network' | 'unknown';
}

export class CustomError extends Error {
  public code: string;
  public details?: Record<string, string | number | boolean>;
  public source: AppError['source'];

  constructor(
    message: string,
    code: string,
    source: AppError['source'] = 'unknown',
    details?: Record<string, string | number | boolean>
  ) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.source = source;
    this.details = details;
  }
}

// Types d'erreurs API
export const API_ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
} as const;

// Messages d'erreur utilisateur
export const USER_ERROR_MESSAGES = {
  [API_ERROR_CODES.NETWORK_ERROR]:
    'Problème de connexion. Vérifiez votre connexion internet.',
  [API_ERROR_CODES.TIMEOUT]:
    'La requête a pris trop de temps. Veuillez réessayer.',
  [API_ERROR_CODES.UNAUTHORIZED]:
    'Vous devez être connecté pour effectuer cette action.',
  [API_ERROR_CODES.FORBIDDEN]: "Vous n'avez pas les permissions nécessaires.",
  [API_ERROR_CODES.NOT_FOUND]: "La ressource demandée n'a pas été trouvée.",
  [API_ERROR_CODES.VALIDATION_ERROR]:
    'Les données saisies ne sont pas valides.',
  [API_ERROR_CODES.SERVER_ERROR]:
    'Une erreur serveur est survenue. Veuillez réessayer plus tard.',
  [API_ERROR_CODES.RATE_LIMIT]:
    'Trop de requêtes. Veuillez patienter avant de réessayer.',
} as const;

// Fonction pour créer une erreur standardisée
export function createAppError(
  message: string,
  code: string,
  source: AppError['source'] = 'unknown',
  details?: Record<string, string | number | boolean>
): AppError {
  return {
    code,
    message,
    details,
    timestamp: Date.now(),
    source,
  };
}

// Fonction pour gérer les erreurs HTTP
export function handleHttpError(
  error:
    | Error
    | { response?: { status: number; data?: unknown }; message?: string }
): AppError {
  if (error.response) {
    // Erreur HTTP avec réponse
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return createAppError(
          data?.message ||
            USER_ERROR_MESSAGES[API_ERROR_CODES.VALIDATION_ERROR],
          API_ERROR_CODES.VALIDATION_ERROR,
          'api',
          data
        );
      case 401:
        return createAppError(
          USER_ERROR_MESSAGES[API_ERROR_CODES.UNAUTHORIZED],
          API_ERROR_CODES.UNAUTHORIZED,
          'api'
        );
      case 403:
        return createAppError(
          USER_ERROR_MESSAGES[API_ERROR_CODES.FORBIDDEN],
          API_ERROR_CODES.FORBIDDEN,
          'api'
        );
      case 404:
        return createAppError(
          USER_ERROR_MESSAGES[API_ERROR_CODES.NOT_FOUND],
          API_ERROR_CODES.NOT_FOUND,
          'api'
        );
      case 429:
        return createAppError(
          USER_ERROR_MESSAGES[API_ERROR_CODES.RATE_LIMIT],
          API_ERROR_CODES.RATE_LIMIT,
          'api'
        );
      case 500:
      case 502:
      case 503:
      case 504:
        return createAppError(
          USER_ERROR_MESSAGES[API_ERROR_CODES.SERVER_ERROR],
          API_ERROR_CODES.SERVER_ERROR,
          'api'
        );
      default:
        return createAppError(
          data?.message || 'Une erreur inattendue est survenue',
          'UNKNOWN_ERROR',
          'api',
          data
        );
    }
  } else if (error.request) {
    // Erreur réseau
    if (error.code === 'ECONNABORTED') {
      return createAppError(
        USER_ERROR_MESSAGES[API_ERROR_CODES.TIMEOUT],
        API_ERROR_CODES.TIMEOUT,
        'network'
      );
    }
    return createAppError(
      USER_ERROR_MESSAGES[API_ERROR_CODES.NETWORK_ERROR],
      API_ERROR_CODES.NETWORK_ERROR,
      'network'
    );
  } else {
    // Autre erreur
    return createAppError(
      error.message || 'Une erreur inattendue est survenue',
      'UNKNOWN_ERROR',
      'unknown',
      error
    );
  }
}

// Fonction pour gérer les erreurs de validation
export function handleValidationError(
  errors: Record<string, string>
): AppError {
  const firstError = Object.values(errors)[0];
  return createAppError(
    firstError || USER_ERROR_MESSAGES[API_ERROR_CODES.VALIDATION_ERROR],
    API_ERROR_CODES.VALIDATION_ERROR,
    'validation',
    errors
  );
}

// Fonction pour obtenir un message d'erreur utilisateur
export function getUserErrorMessage(error: AppError): string {
  if (error.source === 'validation' && error.details) {
    // Pour les erreurs de validation, retourner le premier message
    const firstError = Object.values(error.details)[0];
    return (firstError as string) || error.message;
  }

  return error.message;
}

// Fonction pour logger les erreurs (à adapter selon vos besoins)
export function logError(error: AppError, context?: string) {
  console.error(`[${error.source.toUpperCase()}] ${error.code}:`, {
    message: error.message,
    details: error.details,
    context,
    timestamp: new Date(error.timestamp).toISOString(),
  });

  // Ici vous pouvez ajouter l'envoi vers un service de monitoring
  // comme Sentry, LogRocket, etc.
}

// Hook pour gérer les erreurs dans les composants
export function useErrorHandler() {
  const handleError = (
    error:
      | Error
      | {
          response?: { status: number; data?: unknown };
          request?: unknown;
          message?: string;
        },
    context?: string
  ) => {
    let appError: AppError;

    if (error instanceof CustomError) {
      appError = createAppError(
        error.message,
        error.code,
        error.source,
        error.details
      );
    } else if (error.response || error.request) {
      appError = handleHttpError(error);
    } else {
      appError = createAppError(
        error.message || 'Une erreur inattendue est survenue',
        'UNKNOWN_ERROR',
        'unknown',
        error
      );
    }

    logError(appError, context);
    return appError;
  };

  const handleAsyncError = async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<{ data?: T; error?: AppError }> => {
    try {
      const data = await asyncFn();
      return { data };
    } catch (error) {
      const appError = handleError(error, context);
      return { error: appError };
    }
  };

  return {
    handleError,
    handleAsyncError,
  };
}

// Fonction utilitaire pour retry avec backoff exponentiel
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      // Attendre avant de réessayer (backoff exponentiel)
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export default {
  createAppError,
  handleHttpError,
  handleValidationError,
  getUserErrorMessage,
  logError,
  useErrorHandler,
  retryWithBackoff,
  API_ERROR_CODES,
  USER_ERROR_MESSAGES,
};
