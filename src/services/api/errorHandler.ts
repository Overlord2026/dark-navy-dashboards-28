/**
 * API Error Handler
 * 
 * Provides standardized error handling for API requests with
 * appropriate redaction of sensitive information.
 */

import { logger } from '@/services/logging/loggingService';
import { createSafeError, safeStringify } from './security/piiProtection';
import { toast } from 'sonner';

/**
 * Standard API error format
 */
export interface ApiErrorResponse {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, any>;
  retry?: boolean;
}

/**
 * Error codes for API errors
 */
export enum ApiErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  SERVER_ERROR = 'SERVER_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  REQUEST_FAILED = 'REQUEST_FAILED',
  UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  CIRCUIT_OPEN = 'CIRCUIT_OPEN',
  UNKNOWN = 'UNKNOWN_ERROR',
}

/**
 * Status code to API error code mapping
 */
const STATUS_TO_ERROR_CODE: Record<number, ApiErrorCode> = {
  400: ApiErrorCode.VALIDATION_ERROR,
  401: ApiErrorCode.AUTHENTICATION_ERROR,
  403: ApiErrorCode.PERMISSION_DENIED,
  404: ApiErrorCode.RESOURCE_NOT_FOUND,
  408: ApiErrorCode.TIMEOUT,
  429: ApiErrorCode.UNAVAILABLE,
  500: ApiErrorCode.SERVER_ERROR,
  502: ApiErrorCode.SERVER_ERROR,
  503: ApiErrorCode.UNAVAILABLE,
  504: ApiErrorCode.TIMEOUT,
};

/**
 * Determines if an error is retryable
 * @param error Error to check
 * @returns True if the error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Network errors are retryable
  if (error.code === 'ECONNABORTED') return true;
  if (!error.response) return true;
  
  // Check status code
  const retryableCodes = [408, 429, 500, 502, 503, 504];
  return retryableCodes.includes(error.response.status);
}

/**
 * Handle API errors with standardized format and logging
 * @param error Error from API call
 * @param source Source of the error for logging
 * @param showToast Whether to show a toast notification
 * @returns Standardized error response
 */
export function handleApiError(
  error: any, 
  source: string = 'API',
  showToast: boolean = true
): ApiErrorResponse {
  const safeError = createSafeError(error);
  const isRetryable = isRetryableError(error);
  
  // Create standardized error response
  const errorResponse: ApiErrorResponse = {
    message: 'An unexpected error occurred',
    retry: isRetryable
  };
  
  // Handle different types of errors
  if (error.response) {
    // Server returned an error response
    const { status, data } = error.response;
    errorResponse.status = status;
    errorResponse.code = STATUS_TO_ERROR_CODE[status] || ApiErrorCode.UNKNOWN;
    
    // Extract message from response data
    if (data) {
      errorResponse.message = data.message || data.error || `Server error: ${status}`;
      
      // Add sanitized details if available
      if (data.details) {
        errorResponse.details = data.details;
      }
    } else {
      errorResponse.message = `Server error: ${status}`;
    }
  } else if (error.code === 'ECONNABORTED') {
    // Request timeout
    errorResponse.message = 'Request timed out';
    errorResponse.code = ApiErrorCode.TIMEOUT;
  } else if (error.request) {
    // No response received
    errorResponse.message = 'Network error: Unable to reach server';
    errorResponse.code = ApiErrorCode.NETWORK_ERROR;
  } else if (error.message && error.message.includes('circuit')) {
    // Circuit breaker error
    errorResponse.message = 'Service temporarily unavailable';
    errorResponse.code = ApiErrorCode.CIRCUIT_OPEN;
  } else {
    // Other errors
    errorResponse.message = error.message || 'Unknown error occurred';
    errorResponse.code = ApiErrorCode.UNKNOWN;
  }
  
  // Log the error
  logger.error(`${source} Error: ${errorResponse.message}`, {
    code: errorResponse.code,
    status: errorResponse.status,
    error: safeError,
    source,
    retry: isRetryable
  }, source);
  
  // Show toast notification if requested
  if (showToast) {
    toast.error(errorResponse.message);
  }
  
  return errorResponse;
}

/**
 * Utility function for handling errors in async functions
 * @param fn Async function to execute
 * @param errorHandler Custom error handler
 * @returns Promise with result or error
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: any) => T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    // Use default or custom error handler
    if (errorHandler) {
      return errorHandler(error);
    }
    
    // Default handling
    handleApiError(error);
    throw error;
  }
}
