
// Type definitions for API Client
export interface ApiConfig {
  baseUrl: string;
  headers: Record<string, string>;
  timeout?: number;
  // Add other config properties as needed
}

export interface ApiClient {
  config: ApiConfig;
  // Add other client methods and properties
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  // Add other error properties
}

export interface ApiClientOptions {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  retryConfig?: {
    retries: number;
    retryDelay?: number;
  };
  circuitBreakerConfig?: {
    failureThreshold: number;
    resetTimeout: number;
    name: string;
  };
}

// API Client Factory
export const createApiClient = (options: ApiClientOptions): ApiClient => {
  return {
    config: {
      baseUrl: options.baseURL,
      headers: options.headers || {
        "Content-Type": "application/json"
      },
      timeout: options.timeout || 30000
    }
    // Other implementation details
  };
};

// Error handling
export const handleApiError = (error: unknown): never => {
  const apiError = error as ApiError;
  console.error(`API Error: ${apiError.message}`);
  throw apiError;
};
