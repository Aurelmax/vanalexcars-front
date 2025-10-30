import {
  Vehicle,
  VehicleListResponse,
  VehicleSearchParams,
  vehicleService,
} from '../lib/services/vehicleService';
import { useApi } from './useApi';

export function useVehicles(params?: VehicleSearchParams) {
  return useApi<VehicleListResponse>(() => vehicleService.getVehicles(params), {
    immediate: true,
    refetchOnMount: true,
    cacheTime: 10 * 60 * 1000, // 10 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useVehicle(id: string) {
  return useApi<Vehicle>(() => vehicleService.getVehicleById(id), {
    immediate: !!id,
    refetchOnMount: true,
    cacheTime: 15 * 60 * 1000, // 15 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFeaturedVehicles(limit: number = 4) {
  return useApi<Vehicle[]>(() => vehicleService.getFeaturedVehicles(limit), {
    immediate: true,
    refetchOnMount: true,
    cacheTime: 30 * 60 * 1000, // 30 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useVehiclesByCategory(category: string, limit?: number) {
  return useApi<Vehicle[]>(
    () => vehicleService.getVehiclesByCategory(category, limit),
    {
      immediate: !!category,
      refetchOnMount: true,
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}

export function useVehicleSearch(
  query: string,
  filters?: Record<string, string | number | boolean>
) {
  return useApi<VehicleListResponse>(
    () => vehicleService.searchVehicles(query, filters),
    {
      immediate: !!query,
      refetchOnMount: false,
      cacheTime: 5 * 60 * 1000, // 5 minutes
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  );
}

export function useVehicleStats() {
  return useApi<{
    totalVehicles: number;
    averagePrice: number;
    priceRange: { min: number; max: number };
    popularBrands: Array<{ brand: string; count: number }>;
    recentAdditions: number;
  }>(() => vehicleService.getVehicleStats(), {
    immediate: true,
    refetchOnMount: true,
    cacheTime: 60 * 60 * 1000, // 1 hour
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export default {
  useVehicles,
  useVehicle,
  useFeaturedVehicles,
  useVehiclesByCategory,
  useVehicleSearch,
  useVehicleStats,
};
