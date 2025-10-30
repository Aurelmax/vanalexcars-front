import { ApiResponse } from '../../types/api';
import { apiClient } from '../api';

// Types pour le contenu
export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  popular: boolean;
  category: 'essentiel' | 'confort' | 'vip';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  vehicle: string;
  date: string;
  verified: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
  category: string;
  slug: string;
}

export interface ContentStats {
  totalPosts: number;
  totalFAQs: number;
  totalTestimonials: number;
  recentPosts: number;
}

class ContentService {
  private baseEndpoint = '/content';

  // Services
  async getServices(): Promise<ApiResponse<Service[]>> {
    return apiClient.get<Service[]>(`${this.baseEndpoint}/services`);
  }

  async getServiceById(id: string): Promise<ApiResponse<Service>> {
    return apiClient.get<Service>(`${this.baseEndpoint}/services/${id}`);
  }

  // FAQ
  async getFAQs(category?: string): Promise<ApiResponse<FAQ[]>> {
    const endpoint = category
      ? `${this.baseEndpoint}/faqs?category=${category}`
      : `${this.baseEndpoint}/faqs`;

    return apiClient.get<FAQ[]>(endpoint);
  }

  async getFAQById(id: string): Promise<ApiResponse<FAQ>> {
    return apiClient.get<FAQ>(`${this.baseEndpoint}/faqs/${id}`);
  }

  // Témoignages
  async getTestimonials(limit?: number): Promise<ApiResponse<Testimonial[]>> {
    const endpoint = limit
      ? `${this.baseEndpoint}/testimonials?limit=${limit}`
      : `${this.baseEndpoint}/testimonials`;

    return apiClient.get<Testimonial[]>(endpoint);
  }

  async getFeaturedTestimonials(
    limit: number = 3
  ): Promise<ApiResponse<Testimonial[]>> {
    return apiClient.get<Testimonial[]>(
      `${this.baseEndpoint}/testimonials/featured?limit=${limit}`
    );
  }

  async submitTestimonial(
    data: Omit<Testimonial, 'id' | 'date' | 'verified'>
  ): Promise<ApiResponse<Testimonial>> {
    return apiClient.post<Testimonial>(
      `${this.baseEndpoint}/testimonials`,
      data
    );
  }

  // Blog
  async getBlogPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
  }): Promise<
    ApiResponse<{
      posts: BlogPost[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.tag) searchParams.append('tag', params.tag);
    if (params?.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.baseEndpoint}/blog?${queryString}`
      : `${this.baseEndpoint}/blog`;

    return apiClient.get(endpoint);
  }

  async getBlogPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    return apiClient.get<BlogPost>(`${this.baseEndpoint}/blog/${slug}`);
  }

  async getBlogCategories(): Promise<
    ApiResponse<Array<{ name: string; count: number }>>
  > {
    return apiClient.get(`${this.baseEndpoint}/blog/categories`);
  }

  async getBlogTags(): Promise<
    ApiResponse<Array<{ name: string; count: number }>>
  > {
    return apiClient.get(`${this.baseEndpoint}/blog/tags`);
  }

  // Statistiques
  async getContentStats(): Promise<ApiResponse<ContentStats>> {
    return apiClient.get<ContentStats>(`${this.baseEndpoint}/stats`);
  }
}

export const contentService = new ContentService();
export default contentService;
