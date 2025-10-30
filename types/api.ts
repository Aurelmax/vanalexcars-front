// Types pour les API et requêtes

// Types de base pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
  meta?: {
    pagination?: PaginationMeta;
    filters?: Record<string, string | number | boolean>;
    sorting?: Record<string, 'asc' | 'desc'>;
  };
}

export interface ApiError {
  field?: string;
  code: string;
  message: string;
  details?: Record<string, string | number | boolean>;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  next_page?: number;
  prev_page?: number;
}

// Types pour les requêtes HTTP
export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: string | FormData | Record<string, unknown>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  retries?: number;
}

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  defaultHeaders?: Record<string, string>;
  auth?: {
    type: 'bearer' | 'basic' | 'api-key';
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
  };
}

// Types pour les endpoints
export interface EndpointConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  cache?: {
    enabled: boolean;
    ttl?: number;
    key?: string;
  };
}

// Types pour les formulaires
export interface FormField {
  name: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: unknown) => boolean | string;
  };
  options?: Array<{ value: string; label: string }>;
  defaultValue?: string | number | boolean;
}

export interface FormConfig {
  fields: FormField[];
  submitText?: string;
  resetText?: string;
  loadingText?: string;
  successMessage?: string;
  errorMessage?: string;
}

// Types pour les états de chargement
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: unknown;
  lastUpdated?: number;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch?: number;
}

// Types pour les filtres et recherche
export interface FilterConfig {
  field: string;
  operator:
    | 'equals'
    | 'contains'
    | 'starts_with'
    | 'ends_with'
    | 'greater_than'
    | 'less_than'
    | 'between'
    | 'in'
    | 'not_in';
  value: string | number | boolean | string[];
  caseSensitive?: boolean;
}

export interface SearchConfig {
  query: string;
  fields: string[];
  filters?: FilterConfig[];
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    perPage: number;
  };
}

// Types pour les notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

// Types pour les thèmes et préférences
export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

// Types pour les permissions et rôles
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  level: number;
}

export interface UserPermissions {
  user: {
    id: string;
    email: string;
    name: string;
    roles: Role[];
  };
  permissions: Permission[];
  can: (resource: string, action: string) => boolean;
}

// Types pour les logs et audit
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, string | number | boolean>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

// Types pour les métriques et analytics
export interface Metric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  tags?: Record<string, string>;
}

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, string | number | boolean>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

// Types pour les webhooks
export interface WebhookConfig {
  url: string;
  events: string[];
  secret?: string;
  headers?: Record<string, string>;
  retries?: number;
  timeout?: number;
}

export interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
  signature?: string;
}
