import axios, { AxiosError, AxiosInstance } from 'axios';
import type { Product } from '../types/product.types';

// API Configuration
const API_BASE_URL = 'https://fakestoreapi.com';
const API_TIMEOUT = 10000;

// Custom Error Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  originalError?: unknown;
}

// API Response wrapper for better error handling
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  isSuccess: boolean;
}

/**
 * Create axios instance with base configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request interceptor for adding auth tokens or logging
 */
apiClient.interceptors.request.use(
  config => {
    // Add any request interceptors here (e.g., auth tokens)
    // console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor for global error handling
 */
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Global error handling
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('API No Response:', error.request);
    } else {
      // Error in request setup
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  },
);

/**
 * Transform axios error into standardized ApiError
 */
const handleApiError = (error: unknown, context: string): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Network error
    if (!axiosError.response) {
      return {
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR',
        originalError: error,
      };
    }

    // Server error
    const status = axiosError.response.status;
    let message = `${context} failed`;

    switch (status) {
      case 400:
        message = 'Bad request. Please check your input.';
        break;
      case 401:
        message = 'Unauthorized. Please login again.';
        break;
      case 403:
        message = 'Access forbidden.';
        break;
      case 404:
        message = 'Resource not found.';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      case 503:
        message = 'Service unavailable. Please try again later.';
        break;
      default:
        message = `${context} failed with status ${status}`;
    }

    return {
      message,
      status,
      code: axiosError.code,
      originalError: error,
    };
  }

  // Non-axios error
  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    originalError: error,
  };
};

/**
 * Fetch all products from the API
 * @returns Promise with array of products
 * @throws ApiError on failure
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error, 'Fetching products');
    console.error('fetchProducts error:', apiError.message);
    throw apiError;
  }
};

/**
 * Fetch a single product by ID
 * @param id - Product ID
 * @returns Promise with product details
 * @throws ApiError on failure
 */
export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    if (!id || id <= 0) {
      throw new Error('Invalid product ID');
    }

    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error, `Fetching product ${id}`);
    console.error('fetchProductById error:', apiError.message);
    throw apiError;
  }
};

/**
 * Fetch all unique product categories
 * @returns Promise with array of category names
 * @throws ApiError on failure
 */
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>('/products/categories');
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error, 'Fetching categories');
    console.error('fetchCategories error:', apiError.message);
    throw apiError;
  }
};

/**
 * Fetch products by category
 * @param category - Category name
 * @returns Promise with array of products in the category
 * @throws ApiError on failure
 */
export const fetchProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  try {
    if (!category) {
      throw new Error('Category is required');
    }

    const response = await apiClient.get<Product[]>(
      `/products/category/${category}`,
    );
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error, `Fetching products in category ${category}`);
    console.error('fetchProductsByCategory error:', apiError.message);
    throw apiError;
  }
};

/**
 * Safe wrapper for API calls with structured response
 * Catches errors and returns them in a structured format
 */
export const safeApiCall = async <T>(
  apiFunction: () => Promise<T>,
): Promise<ApiResponse<T>> => {
  try {
    const data = await apiFunction();
    return {
      data,
      isSuccess: true,
    };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      error: apiError,
      isSuccess: false,
    };
  }
};

// Legacy support - keeping old names as aliases
export const productService = {
  getAllProducts: fetchProducts,
  getProductById: fetchProductById,
  getCategories: fetchCategories,
  getProductsByCategory: fetchProductsByCategory,
};

// Export axios instance for advanced use cases
export { apiClient };

