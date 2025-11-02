import { useState, useCallback } from 'react';
import { ApiError, ApiResponse } from '../services/api';

/**
 * Hook for managing API call states (loading, error, data)
 * @returns Object with loading state, error, data, and execute function
 */
export function useApiCall<T>() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [data, setData] = useState<T | null>(null);

    const execute = useCallback(async (apiFunction: () => Promise<T>) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const result = await apiFunction();
            setData(result);
            return result;
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError);
            throw apiError;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return {
        loading,
        error,
        data,
        execute,
        reset,
    };
}

/**
 * Hook for managing API call states with safe response handling
 * Never throws errors, returns them in the response object
 */
export function useSafeApiCall<T>() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<ApiResponse<T> | null>(null);

    const execute = useCallback(async (apiFunction: () => Promise<T>) => {
        setLoading(true);
        setResponse(null);

        try {
            const result = await apiFunction();
            const successResponse: ApiResponse<T> = {
                data: result,
                isSuccess: true,
            };
            setResponse(successResponse);
            return successResponse;
        } catch (err) {
            const errorResponse: ApiResponse<T> = {
                error: err as ApiError,
                isSuccess: false,
            };
            setResponse(errorResponse);
            return errorResponse;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setLoading(false);
        setResponse(null);
    }, []);

    return {
        loading,
        response,
        execute,
        reset,
    };
}

/**
 * Format API error for display to users
 */
export const formatErrorMessage = (error: ApiError | null): string => {
    if (!error) {
        return 'An unknown error occurred';
    }
    return error.message;
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: ApiError): boolean => {
    return error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED';
};

/**
 * Check if error is a timeout error
 */
export const isTimeoutError = (error: ApiError): boolean => {
    return error.code === 'ECONNABORTED' || error.message.includes('timeout');
};

/**
 * Check if error is a not found error
 */
export const isNotFoundError = (error: ApiError): boolean => {
    return error.status === 404;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: ApiError): boolean => {
    return error.status === 401 || error.status === 403;
};

/**
 * Check if error is a server error (5xx)
 */
export const isServerError = (error: ApiError): boolean => {
    return (error.status ?? 0) >= 500 && (error.status ?? 0) < 600;
};

/**
 * Retry helper with exponential backoff
 * @param apiFunction - The API function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise with the result
 */
export async function retryWithBackoff<T>(
    apiFunction: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await apiFunction();
        } catch (error) {
            lastError = error;
            const apiError = error as ApiError;

            // Don't retry on client errors (4xx) except 429 (rate limit)
            if (
                apiError.status &&
                apiError.status >= 400 &&
                apiError.status < 500 &&
                apiError.status !== 429
            ) {
                throw error;
            }

            // If this is the last attempt, throw the error
            if (attempt === maxRetries - 1) {
                throw error;
            }

            // Calculate delay with exponential backoff
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);

            // Wait before retrying
            await new Promise<void>(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

/**
 * Debounce helper for search/filter API calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle helper for API calls that should not be called too frequently
 * @param func - Function to throttle
 * @param limit - Minimum time between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number,
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Cache helper for API responses
 */
class ApiCache<T> {
    private cache: Map<string, { data: T; timestamp: number }>;
    private ttl: number; // Time to live in milliseconds

    constructor(ttl: number = 5 * 60 * 1000) {
        // Default 5 minutes
        this.cache = new Map();
        this.ttl = ttl;
    }

    set(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    get(key: string): T | null {
        const item = this.cache.get(key);

        if (!item) {
            return null;
        }

        // Check if cache has expired
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    clear(): void {
        this.cache.clear();
    }

    delete(key: string): void {
        this.cache.delete(key);
    }
}

// Export singleton cache instance
export const apiCache = new ApiCache();

/**
 * Cached API call wrapper
 * @param key - Cache key
 * @param apiFunction - The API function to call
 * @param forceRefresh - Force refresh ignoring cache
 * @returns Promise with the result (from cache or API)
 */
export async function cachedApiCall<T>(
    key: string,
    apiFunction: () => Promise<T>,
    forceRefresh: boolean = false,
): Promise<T> {
    // Check cache first
    if (!forceRefresh) {
        const cachedData = apiCache.get(key);
        if (cachedData !== null) {
            console.log(`Cache hit for key: ${key}`);
            return cachedData as T;
        }
    }

    // Fetch from API
    console.log(`Cache miss for key: ${key}, fetching from API`);
    const data = await apiFunction();
    apiCache.set(key, data);
    return data;
}

