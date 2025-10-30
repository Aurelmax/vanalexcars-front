// Utilitaires de validation pour les formulaires

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string | number | boolean | File[]) => string | null;
  message?: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

// Messages d'erreur par défaut
const defaultMessages = {
  required: 'Ce champ est obligatoire',
  minLength: (min: number) => `Minimum ${min} caractères requis`,
  maxLength: (max: number) => `Maximum ${max} caractères autorisés`,
  pattern: 'Format invalide',
  email: 'Adresse email invalide',
  phone: 'Numéro de téléphone invalide',
  url: 'URL invalide',
  number: 'Valeur numérique requise',
  min: (min: number) => `Valeur minimale : ${min}`,
  max: (max: number) => `Valeur maximale : ${max}`,
};

// Validateurs individuels
export const validators = {
  required: (
    value: string | number | boolean | File[] | null | undefined
  ): string | null => {
    if (value === null || value === undefined || value === '') {
      return defaultMessages.required;
    }
    return null;
  },

  minLength:
    (min: number) =>
    (value: string): string | null => {
      if (value && value.length < min) {
        return defaultMessages.minLength(min);
      }
      return null;
    },

  maxLength:
    (max: number) =>
    (value: string): string | null => {
      if (value && value.length > max) {
        return defaultMessages.maxLength(max);
      }
      return null;
    },

  pattern:
    (regex: RegExp) =>
    (value: string): string | null => {
      if (value && !regex.test(value)) {
        return defaultMessages.pattern;
      }
      return null;
    },

  email: (value: string): string | null => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return defaultMessages.email;
    }
    return null;
  },

  phone: (value: string): string | null => {
    if (value && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
      return defaultMessages.phone;
    }
    return null;
  },

  url: (value: string): string | null => {
    if (value && !/^https?:\/\/.+/.test(value)) {
      return defaultMessages.url;
    }
    return null;
  },

  number: (value: string | number): string | null => {
    if (value && isNaN(Number(value))) {
      return defaultMessages.number;
    }
    return null;
  },

  min:
    (min: number) =>
    (value: number): string | null => {
      if (value !== null && value !== undefined && value < min) {
        return defaultMessages.min(min);
      }
      return null;
    },

  max:
    (max: number) =>
    (value: number): string | null => {
      if (value !== null && value !== undefined && value > max) {
        return defaultMessages.max(max);
      }
      return null;
    },
};

// Fonction de validation principale
export function validateField(
  value: string | number | boolean | File[] | null | undefined,
  rules: ValidationRule
): string | null {
  // Validation required
  if (rules.required && validators.required(value)) {
    return rules.message || validators.required(value);
  }

  // Si le champ n'est pas requis et est vide, on skip les autres validations
  if (
    !rules.required &&
    (value === null || value === undefined || value === '')
  ) {
    return null;
  }

  // Validation minLength
  if (rules.minLength && typeof value === 'string') {
    const error = validators.minLength(rules.minLength)(value);
    if (error) return rules.message || error;
  }

  // Validation maxLength
  if (rules.maxLength && typeof value === 'string') {
    const error = validators.maxLength(rules.maxLength)(value);
    if (error) return rules.message || error;
  }

  // Validation pattern
  if (rules.pattern && typeof value === 'string') {
    const error = validators.pattern(rules.pattern)(value);
    if (error) return rules.message || error;
  }

  // Validation custom
  if (rules.custom) {
    const error = rules.custom(value);
    if (error) return rules.message || error;
  }

  return null;
}

// Validation d'un objet complet
export function validateForm<
  T extends Record<
    string,
    string | number | boolean | File[] | null | undefined
  >,
>(values: T, schema: ValidationSchema): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  Object.entries(schema).forEach(([field, rules]) => {
    const error = validateField(values[field], rules);
    if (error) {
      errors[field as keyof T] = error;
    }
  });

  return errors;
}

// Schémas de validation prédéfinis
export const validationSchemas = {
  contactForm: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    email: {
      required: true,
      custom: validators.email,
    },
    phone: {
      custom: validators.phone,
    },
    subject: {
      required: true,
      minLength: 5,
      maxLength: 200,
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
    },
  },

  vehicleRequestForm: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    email: {
      required: true,
      custom: validators.email,
    },
    phone: {
      required: true,
      custom: validators.phone,
    },
    voiture: {
      required: true,
      minLength: 3,
      maxLength: 200,
    },
    budget: {
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    message: {
      minLength: 10,
      maxLength: 1000,
    },
  },

  userProfile: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    email: {
      required: true,
      custom: validators.email,
    },
    phone: {
      custom: validators.phone,
    },
  },
};

// Utilitaires pour les validations conditionnelles
export function createConditionalValidator<T>(
  condition: (values: T) => boolean,
  validator: (value: string | number | boolean | File[]) => string | null
) {
  return (
    value: string | number | boolean | File[],
    values: T
  ): string | null => {
    if (condition(values)) {
      return validator(value);
    }
    return null;
  };
}

// Validation de fichiers
export const fileValidators = {
  maxSize:
    (maxSizeInMB: number) =>
    (file: File): string | null => {
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        return `Fichier trop volumineux. Taille maximale : ${maxSizeInMB}MB`;
      }
      return null;
    },

  allowedTypes:
    (allowedTypes: string[]) =>
    (file: File): string | null => {
      if (!allowedTypes.includes(file.type)) {
        return `Type de fichier non autorisé. Types acceptés : ${allowedTypes.join(', ')}`;
      }
      return null;
    },

  imageOnly: (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Seules les images sont autorisées';
    }
    return null;
  },

  documentOnly: (file: File): string | null => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];
    if (!allowedTypes.includes(file.type)) {
      return 'Seuls les fichiers PDF et images sont autorisés';
    }
    return null;
  },
};

export default {
  validators,
  validateField,
  validateForm,
  validationSchemas,
  createConditionalValidator,
  fileValidators,
};
