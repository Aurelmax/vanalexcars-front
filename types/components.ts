// Types pour les composants React

import { CSSProperties, ReactNode } from 'react';

// Types de base pour les composants
export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Types pour les boutons
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

// Types pour les inputs
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helper?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface TextareaProps extends BaseComponentProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helper?: string;
  rows?: number;
  cols?: number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface SelectProps extends BaseComponentProps {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helper?: string;
  placeholder?: string;
  multiple?: boolean;
  onChange?: (value: string | string[]) => void;
}

export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helper?: string;
  onChange?: (checked: boolean) => void;
}

export interface RadioProps extends BaseComponentProps {
  name: string;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helper?: string;
  onChange?: (value: string) => void;
}

// Types pour les cartes
export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  actions?: ReactNode;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// Types pour les modales
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  backdrop?: boolean;
  keyboard?: boolean;
}

// Types pour les notifications
export interface ToastProps extends BaseComponentProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
}

// Types pour les formulaires
export interface FormProps extends BaseComponentProps {
  onSubmit: (data: Record<string, string | number | boolean | File[]>) => void;
  onReset?: () => void;
  loading?: boolean;
  error?: string;
  success?: string;
  validation?: Record<string, (value: unknown) => boolean | string>;
}

export interface FormFieldProps extends BaseComponentProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  helper?: string;
}

// Types pour les listes
export interface ListProps extends BaseComponentProps {
  items: Array<{
    id: string;
    content: ReactNode;
    actions?: ReactNode;
  }>;
  empty?: ReactNode;
  loading?: boolean;
  onItemClick?: (id: string) => void;
}

export interface ListItemProps extends BaseComponentProps {
  id: string;
  content: ReactNode;
  actions?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

// Types pour les tables
export interface TableProps extends BaseComponentProps {
  columns: Array<{
    key: string;
    title: string;
    sortable?: boolean;
    render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
  }>;
  data: Record<string, unknown>[];
  loading?: boolean;
  empty?: ReactNode;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: Record<string, unknown>) => void;
}

// Types pour les navigation
export interface NavProps extends BaseComponentProps {
  items: Array<{
    label: string;
    href: string;
    active?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
  }>;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'tabs';
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: Array<{
    label: string;
    href?: string;
    active?: boolean;
  }>;
  separator?: ReactNode;
}

// Types pour les layouts
export interface LayoutProps extends BaseComponentProps {
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export interface ContainerProps extends BaseComponentProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
}

// Types pour les icônes
export interface IconProps extends BaseComponentProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  spin?: boolean;
  pulse?: boolean;
}

// Types pour les avatars
export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

// Types pour les badges
export interface BadgeProps extends BaseComponentProps {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  dot?: boolean;
  count?: number;
  max?: number;
}

// Types pour les tooltips
export interface TooltipProps extends BaseComponentProps {
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  disabled?: boolean;
}

// Types pour les dropdowns
export interface DropdownProps extends BaseComponentProps {
  trigger: ReactNode;
  items: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    divider?: boolean;
  }>;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
}

// Types pour les accordions
export interface AccordionProps extends BaseComponentProps {
  items: Array<{
    title: string;
    content: ReactNode;
    defaultOpen?: boolean;
  }>;
  multiple?: boolean;
  onToggle?: (index: number, isOpen: boolean) => void;
}

// Types pour les tabs
export interface TabsProps extends BaseComponentProps {
  items: Array<{
    label: string;
    content: ReactNode;
    disabled?: boolean;
  }>;
  defaultActive?: number;
  onTabChange?: (index: number) => void;
}

// Types pour les carousels
export interface CarouselProps extends BaseComponentProps {
  items: ReactNode[];
  autoplay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  onSlideChange?: (index: number) => void;
}

// Types pour les paginations
export interface PaginationProps extends BaseComponentProps {
  current: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisible?: number;
}

// Types pour les skeletons
export interface SkeletonProps extends BaseComponentProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | 'none';
}

// Types pour les progress bars
export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  striped?: boolean;
  animated?: boolean;
  label?: string;
}

// Types pour les spinners
export interface SpinnerProps extends BaseComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

// Types pour les alertes
export interface AlertProps extends BaseComponentProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  closable?: boolean;
  onClose?: () => void;
  actions?: ReactNode;
}
