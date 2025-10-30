import { ApiResponse } from '../../types/api';
import { apiClient } from '../api';

// Types pour les véhicules
export interface Vehicle {
  id: string;
  name: string;
  price: number;
  image: string;
  year: string;
  mileage: number;
  power: number;
  owners: number;
  transmission: string;
  fuel: string;
  consumption?: number;
  co2?: number;
  location: string;
  seller: string;
  sellerType: 'Pro' | 'Particulier';
  features: string[];
  description: string;
  history: string[];
  technicalSpecs: {
    engine: string;
    displacement: string;
    acceleration: string;
    topSpeed: string;
    weight: string;
    dimensions: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilters {
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  transmission?: string;
  fuel?: string;
  sellerType?: 'Pro' | 'Particulier';
  location?: string;
  search?: string;
}

export interface VehicleSearchParams {
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'year' | 'mileage' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  filters?: VehicleFilters;
}

export interface VehicleListResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class VehicleService {
  private baseEndpoint = '/vehicles';

  async getVehicles(
    params?: VehicleSearchParams
  ): Promise<ApiResponse<VehicleListResponse>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.baseEndpoint}?${queryString}`
      : this.baseEndpoint;

    return apiClient.get<VehicleListResponse>(endpoint);
  }

  async getVehicleById(id: string): Promise<ApiResponse<Vehicle>> {
    return apiClient.get<Vehicle>(`${this.baseEndpoint}/${id}`);
  }

  async getFeaturedVehicles(
    limit: number = 4
  ): Promise<ApiResponse<Vehicle[]>> {
    return apiClient.get<Vehicle[]>(
      `${this.baseEndpoint}/featured?limit=${limit}`
    );
  }

  async getVehiclesByCategory(
    category: string,
    limit?: number
  ): Promise<ApiResponse<Vehicle[]>> {
    const endpoint = limit
      ? `${this.baseEndpoint}/category/${category}?limit=${limit}`
      : `${this.baseEndpoint}/category/${category}`;

    return apiClient.get<Vehicle[]>(endpoint);
  }

  async searchVehicles(
    query: string,
    filters?: VehicleFilters
  ): Promise<ApiResponse<VehicleListResponse>> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    return apiClient.get<VehicleListResponse>(
      `${this.baseEndpoint}/search?${searchParams.toString()}`
    );
  }

  async getVehicleStats(): Promise<
    ApiResponse<{
      totalVehicles: number;
      averagePrice: number;
      priceRange: { min: number; max: number };
      popularBrands: Array<{ brand: string; count: number }>;
      recentAdditions: number;
    }>
  > {
    return apiClient.get(`${this.baseEndpoint}/stats`);
  }
}

export const vehicleService = new VehicleService();
export default vehicleService;
