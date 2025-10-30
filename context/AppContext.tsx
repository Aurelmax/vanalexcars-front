import React, { ReactNode, createContext, useContext, useReducer } from 'react';

// Types pour le contexte global
export interface AppState {
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en';
  user: {
    isAuthenticated: boolean;
    profile: {
      id: string;
      name: string;
      email: string;
      phone?: string;
    } | null;
  };
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
  }>;
  loading: {
    global: boolean;
    vehicles: boolean;
    contact: boolean;
    content: boolean;
  };
  cache: {
    vehicles: Record<string, unknown>;
    content: Record<string, unknown>;
    lastUpdated: Record<string, number>;
  };
}

export type AppAction =
  | { type: 'SET_THEME'; payload: AppState['theme'] }
  | { type: 'SET_LANGUAGE'; payload: AppState['language'] }
  | { type: 'SET_USER'; payload: AppState['user'] }
  | {
      type: 'ADD_NOTIFICATION';
      payload: Omit<AppState['notifications'][0], 'id' | 'timestamp' | 'read'>;
    }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | {
      type: 'SET_LOADING';
      payload: { key: keyof AppState['loading']; value: boolean };
    }
  | { type: 'SET_CACHE'; payload: { key: string; data: unknown } }
  | { type: 'CLEAR_CACHE'; payload?: string }
  | { type: 'RESET_APP' };

// État initial
const initialState: AppState = {
  theme: 'auto',
  language: 'fr',
  user: {
    isAuthenticated: false,
    profile: null,
  },
  notifications: [],
  loading: {
    global: false,
    vehicles: false,
    contact: false,
    content: false,
  },
  cache: {
    vehicles: {},
    content: {},
    lastUpdated: {},
  },
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };

    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'ADD_NOTIFICATION':
      const newNotification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        read: false,
      };
      return {
        ...state,
        notifications: [...state.notifications, newNotification],
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'SET_CACHE':
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.payload.key]: action.payload.data,
          lastUpdated: {
            ...state.cache.lastUpdated,
            [action.payload.key]: Date.now(),
          },
        },
      };

    case 'CLEAR_CACHE':
      if (action.payload) {
        const { [action.payload]: _removed, ...remaining } =
          state.cache as Record<string, unknown>;
        return {
          ...state,
          cache: remaining,
        };
      }
      return {
        ...state,
        cache: {
          vehicles: {},
          content: {},
          lastUpdated: {},
        },
      };

    case 'RESET_APP':
      return initialState;

    default:
      return state;
  }
}

// Contexte
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook pour utiliser le contexte
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Hooks spécialisés
export function useTheme() {
  const { state, dispatch } = useApp();

  const setTheme = (theme: AppState['theme']) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  return {
    theme: state.theme,
    setTheme,
  };
}

export function useLanguage() {
  const { state, dispatch } = useApp();

  const setLanguage = (language: AppState['language']) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  return {
    language: state.language,
    setLanguage,
  };
}

export function useUser() {
  const { state, dispatch } = useApp();

  const setUser = (user: AppState['user']) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    dispatch({
      type: 'SET_USER',
      payload: { isAuthenticated: false, profile: null },
    });
  };

  return {
    user: state.user,
    setUser,
    logout,
  };
}

export function useNotifications() {
  const { state, dispatch } = useApp();

  const addNotification = (
    notification: Omit<
      AppState['notifications'][0],
      'id' | 'timestamp' | 'read'
    >
  ) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
  };
}

export function useLoading() {
  const { state, dispatch } = useApp();

  const setLoading = (key: keyof AppState['loading'], value: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { key, value } });
  };

  return {
    loading: state.loading,
    setLoading,
  };
}

export function useCache() {
  const { state, dispatch } = useApp();

  const setCache = (key: string, data: unknown) => {
    dispatch({ type: 'SET_CACHE', payload: { key, data } });
  };

  const clearCache = (key?: string) => {
    dispatch({ type: 'CLEAR_CACHE', payload: key });
  };

  const getCache = (key: string) => {
    return (state.cache as Record<string, unknown>)[key];
  };

  const isCacheValid = (key: string, maxAge: number = 5 * 60 * 1000) => {
    const lastUpdated = state.cache.lastUpdated[key];
    if (!lastUpdated) return false;
    return Date.now() - lastUpdated < maxAge;
  };

  return {
    cache: state.cache,
    setCache,
    clearCache,
    getCache,
    isCacheValid,
  };
}

export default AppContext;
