
import { ApiResponse, UserToken } from '@/types/api';
import { logger } from '@/services/logging/loggingService';
import { AuthErrorResponse } from '../types/webhookTypes';

/**
 * Verifies a JWT token and returns the user data if valid
 * @param token The JWT token to verify
 * @returns UserToken object if valid, null otherwise
 */
export const verifyToken = (token: string): UserToken | null => {
  try {
    // In a real app, this would validate the JWT signature and decode it
    // For demonstration, we'll do a simple check
    if (!token) {
      logger.warning('Empty token provided for verification', {}, 'AuthService');
      return null;
    }
    
    if (!token.startsWith('Bearer ')) {
      logger.warning('Invalid token format (missing Bearer prefix)', {}, 'AuthService');
      return null;
    }
    
    // Add additional token validation logic here in a real implementation
    
    // Mock user data - in a real app, this would come from decoding the JWT
    return {
      id: 'user-123',
      email: 'user@example.com',
      role: 'user',
      exp: Date.now() + 3600000 // 1 hour from now
    };
  } catch (error) {
    logger.error('Token verification error:', error, 'AuthService');
    return null;
  }
};

/**
 * Authentication middleware function that can be used across API endpoints
 * @param token The JWT token to verify
 * @returns ApiResponse with error if token is invalid
 */
export const authenticateRequest = <T>(token: string): { 
  isAuthenticated: boolean; 
  user: UserToken | null;
  errorResponse?: ApiResponse<T>;
} => {
  if (!token) {
    logger.warning('Authentication attempt with empty token', {}, 'AuthService');
    return {
      isAuthenticated: false,
      user: null,
      errorResponse: {
        success: false,
        error: 'Authentication required. Please provide a valid token.',
      }
    };
  }

  const user = verifyToken(token);
  
  if (!user) {
    logger.warning('Authentication failed - invalid token', { token: token.substring(0, 10) + '...' }, 'AuthService');
    return {
      isAuthenticated: false,
      user: null,
      errorResponse: {
        success: false,
        error: 'Unauthorized access. Invalid or expired token.',
      }
    };
  }

  logger.info('User authenticated successfully', { userId: user.id }, 'AuthService');
  return {
    isAuthenticated: true,
    user,
    errorResponse: undefined
  };
};

/**
 * Generate a standardized auth error response
 * @param message Error message
 * @param code Error code
 * @returns Formatted auth error response
 */
export const createAuthError = (
  message: string, 
  code: 'unauthorized' | 'invalid_token' | 'expired_token'
): AuthErrorResponse => {
  logger.error(`Auth error: ${message}`, { code }, 'AuthService');
  return {
    status: 'error',
    message,
    code
  };
};
