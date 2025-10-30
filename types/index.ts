// Export centralisé de tous les types
export * from './api';
export * from './components';

// Types utilitaires
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Types pour les états
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type FormState = 'idle' | 'submitting' | 'success' | 'error';

// Types pour les thèmes
export type Theme = 'light' | 'dark' | 'auto';
export type ColorScheme = 'premium' | 'standard';

// Types pour les breakpoints
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Types pour les statuts
export type Status = 'active' | 'inactive' | 'pending' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
