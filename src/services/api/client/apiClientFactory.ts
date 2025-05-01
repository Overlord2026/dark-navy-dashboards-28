
/**
 * API Client Factory
 * 
 * Creates secure, resilient API clients with retry logic, circuit breakers,
 * and other security enhancements.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { CircuitBreaker, CircuitBreakerOptions } from '../resilience/circuitBreaker';
import { logger } from '@/services/logging/loggingService';
import { safeStringify, maskSensitiveObject, MaskingConfig } from '../security/piiProtection';

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG = {
  retries: 3,
  retryDelay: 1000,
  retryMultiplier: 2, // Exponential backoff multiplier
  statusCodesToRetry: [408, 500, 502, 503, 504, 429],
  shouldRetry: (error: any) => {
    // Default retry condition: retry on network errors and specific status codes
    if (error.code === 'ECONNABORTED') return true;
    if (!error.response) return true; // Network error
    return DEFAULT_RETRY_CONFIG.statusCodesToRetry.includes(error.response.status);
  }
};

/**
 * Options for creating an API client
 */
export interface ApiClientOptions {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  retryConfig?: Partial<typeof DEFAULT_RETRY_CONFIG>;
  circuitBreakerConfig?: Partial<CircuitBreakerOptions>;
  sensitiveDataFields?: Record<string, MaskingConfig>;
  auth?: {
    username?: string;
    password?: string;
    token?: string;
    tokenType?: string;
  };
}

/**
 * Creates a secure API client with retry logic and circuit breaker
 */
export function createApiClient(options: ApiClientOptions): AxiosInstance {
  const {
    baseURL,
    timeout = 10000,
    headers = {},
    retryConfig = {},
    auth,
    sensitiveDataFields = {}
  } = options;

  // Create base axios instance with secure defaults
  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    },
    // Security settings
    withCredentials: false, // Don't send cookies by default
    maxContentLength: 10 * 1024 * 1024, // 10MB limit
    maxBodyLength: 10 * 1024 * 1024, // 10MB limit
    responseType: 'json',
    validateStatus: (status) => status >= 200 && status < 300
  });

  // Add authentication if provided
  if (auth) {
    if (auth.username && auth.password) {
      client.defaults.auth = {
        username: auth.username,
        password: auth.password
      };
    } else if (auth.token) {
      client.defaults.headers.common['Authorization'] = `${auth.tokenType || 'Bearer'} ${auth.token}`;
    }
  }

  // Set up request interceptor for logging and PII masking
  client.interceptors.request.use(
    (config) => {
      // Log request (with sensitive data masked)
      const maskedData = config.data ? 
        maskSensitiveObject(config.data, sensitiveDataFields) : 
        config.data;
      
      const maskedParams = config.params ?
        maskSensitiveObject(config.params, sensitiveDataFields) :
        config.params;
      
      logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        url: config.url,
        method: config.method,
        params: maskedParams ? safeStringify(maskedParams) : undefined,
        data: maskedData ? safeStringify(maskedData) : undefined
      }, 'ApiClient');
      
      return config;
    },
    (error) => {
      logger.error('API Request Error', error, 'ApiClient');
      return Promise.reject(error);
    }
  );

  // Set up response interceptor for logging
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response (without sensitive data)
      logger.info(`API Response: ${response.status} ${response.config.url}`, {
        url: response.config.url,
        status: response.status,
        statusText: response.statusText,
        responseTime: response.headers['x-response-time'],
      }, 'ApiClient');
      
      return response;
    },
    (error: AxiosError) => {
      // Handle and log error
      if (error.response) {
        logger.error(`API Error: ${error.response.status} ${error.config?.url || 'unknown'}`, {
          url: error.config?.url,
          status: error.response.status,
          statusText: error.response.statusText,
          data: safeStringify(error.response.data)
        }, 'ApiClient');
      } else if (error.request) {
        logger.error(`API Request Failed: ${error.message || 'Unknown error'}`, {
          url: error.config?.url || 'unknown',
          code: error.code,
          message: error.message || 'Unknown error'
        }, 'ApiClient');
      } else {
        logger.error(`API Error: ${error.message || 'Unknown error'}`, {
          code: error.code,
          message: error.message || 'Unknown error'
        }, 'ApiClient');
      }
      
      return Promise.reject(error);
    }
  );

  // Apply retry logic
  const mergedRetryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  let retryCount = 0;

  client.interceptors.response.use(undefined, async (error: AxiosError) => {
    // No retrying if request was cancelled
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // TypeScript fix: Explicitly type the config with _retryCount property
    interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
      _retryCount?: number;
    }

    const config = error.config as ExtendedAxiosRequestConfig | undefined;
    
    if (!config) {
      return Promise.reject(error);
    }

    // Initialize retry count for this request
    config._retryCount = config._retryCount || 0;

    // Check if we should retry
    if (
      config._retryCount < mergedRetryConfig.retries &&
      mergedRetryConfig.shouldRetry(error)
    ) {
      config._retryCount++;
      retryCount = config._retryCount;

      // Log retry attempt
      logger.warning(`API Retry ${retryCount}/${mergedRetryConfig.retries}: ${config.url || 'unknown'}`, {
        url: config.url,
        retryCount,
        error: error.message || 'Unknown error'
      }, 'ApiClient');

      // Calculate delay with exponential backoff
      const delay = mergedRetryConfig.retryDelay * Math.pow(
        mergedRetryConfig.retryMultiplier,
        config._retryCount - 1
      );

      // Wait for the delay
      await new Promise(resolve => setTimeout(resolve, delay));

      // Retry the request
      return client(config);
    }

    // If we've used all retries, reject with the error
    return Promise.reject(error);
  });

  // Create a circuit breaker if config is provided
  let circuitBreaker: CircuitBreaker | null = null;
  if (options.circuitBreakerConfig) {
    const circuitConfig: CircuitBreakerOptions = {
      failureThreshold: 5,
      resetTimeout: 30000,
      name: baseURL,
      ...options.circuitBreakerConfig
    };
    
    circuitBreaker = new CircuitBreaker(circuitConfig);
    
    // Expose circuit breaker on client for monitoring
    (client as any).circuitBreaker = circuitBreaker;
  }

  // Create wrapped client with circuit breaker if available
  if (circuitBreaker) {
    const originalRequest = client.request.bind(client);
    
    // Override request method to use circuit breaker
    client.request = async function(config: AxiosRequestConfig) {
      return circuitBreaker!.execute(originalRequest, config);
    };
  }

  return client;
}

/**
 * Determines if an error is retryable
 * @param error Error to check
 * @returns True if the error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Network errors are retryable
  if (!error.response) return true;
  
  // Check status code
  const retryableCodes = [408, 429, 500, 502, 503, 504];
  return retryableCodes.includes(error.response.status);
}

/**
 * General error handler for API errors with PII protection
 * @param error Error to handle
 * @returns Standardized error object
 */
export function handleApiError(error: any): { message: string; status?: number; code?: string } {
  const errorResponse = {
    message: 'An unexpected error occurred',
    status: error.response?.status,
    code: error.code || 'UNKNOWN_ERROR'
  };

  if (error.response) {
    // Handle API error responses
    errorResponse.message = error.response.data?.message || 
                            error.response.data?.error || 
                            `Server error: ${error.response.status}`;
  } else if (error.request) {
    // Handle network errors
    errorResponse.message = 'Network error: Unable to reach server';
    errorResponse.code = 'NETWORK_ERROR';
  } else {
    // Handle other errors
    errorResponse.message = error.message || errorResponse.message;
  }

  return errorResponse;
}
