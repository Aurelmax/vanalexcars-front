import { useCallback, useEffect, useState } from 'react';
import { ApiResponse } from '../types/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch?: number;
}

export interface UseApiOptions {
  immediate?: boolean;
  refetchOnMount?: boolean;
  cacheTime?: number;
  staleTime?: number;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const {
    immediate = true,
    refetchOnMount = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 1 * 60 * 1000, // 1 minute
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const [lastFetch, setLastFetch] = useState<number | null>(null);

  const execute = useCallback(async () => {
    // Vérifier le cache
    if (lastFetch && Date.now() - lastFetch < staleTime) {
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();

      if (response.success) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetch: Date.now(),
        });
        setLastFetch(Date.now());
      } else {
        setState({
          data: null,
          loading: false,
          error: response.message || 'Une erreur est survenue',
          lastFetch: Date.now(),
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Une erreur inattendue est survenue',
        lastFetch: Date.now(),
      });
    }
  }, [apiCall, lastFetch, staleTime]);

  const refetch = useCallback(() => {
    setLastFetch(null);
    return execute();
  }, [execute]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
    setLastFetch(null);
  }, []);

  useEffect(() => {
    if (immediate && refetchOnMount) {
      execute();
    }
  }, [execute, immediate, refetchOnMount]);

  // Nettoyer le cache après cacheTime
  useEffect(() => {
    if (lastFetch) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, data: null }));
      }, cacheTime);

      return () => clearTimeout(timer);
    }
  }, [lastFetch, cacheTime]);

  return {
    ...state,
    refetch,
    reset,
    execute,
  };
}

export default useApi;
