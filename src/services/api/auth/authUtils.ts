
import { ApiResponse, UserToken } from '@/types/api';
import { logger } from '@/services/logging/loggingService';
import { AuthErrorResponse } from '../types/webhookTypes';

// Constants for security settings
const TOKEN_EXPIRY_BUFFER_MS = 60000; // 1 minute buffer before expiry
const MAX_TOKEN_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Verifies a JWT token and returns the user data if valid
 * Enhanced with additional security checks
 * @param token The JWT token to verify
 * @returns UserToken object if valid, null otherwise
 */
export const verifyToken = (token: string): UserToken | null => {
  try {
    // Security: Basic input validation
    if (!token) {
      logger.warning('Empty token provided for verification', {
        timestamp: new Date().toISOString()
      }, 'AuthService');
      return null;
    }
    
    // Security: Verify token format
    if (!token.startsWith('Bearer ')) {
      logger.warning('Invalid token format (missing Bearer prefix)', {
        timestamp: new Date().toISOString() 
      }, 'AuthService');
      return null;
    }
    
    // Security: Extract the actual token
    const actualToken = token.slice(7); // Remove 'Bearer ' prefix
    
    // Security: Verify token is not empty after prefix removal
    if (!actualToken || actualToken.trim() === '') {
      logger.warning('Empty token after prefix removal', {
        timestamp: new Date().toISOString()
      }, 'AuthService');
      return null;
    }
    
    // Security: Implement token length check to prevent DoS attacks
    if (actualToken.length > 2000) { // Reasonable upper limit for JWT tokens
      logger.warning('Token exceeds maximum allowed length', {
        tokenLength: actualToken.length,
        timestamp: new Date().toISOString()
      }, 'AuthService');
      return null;
    }
    
    // In a real app, this would validate the JWT signature and decode it
    // For demonstration, we'll do a simple check
    
    // Add additional token validation logic here in a real implementation
    // Including signature verification and payload validation
    
    // Mock user data - in a real app, this would come from decoding the JWT
    const mockUser: UserToken = {
      id: 'user-123',
      email: 'user@example.com',
      role: 'user',
      exp: Date.now() + 3600000 // 1 hour from now
    };
    
    // Security: Check token expiration
    if (mockUser.exp < (Date.now() + TOKEN_EXPIRY_BUFFER_MS)) {
      logger.warning('Token has expired or is about to expire', {
        expiryTime: new Date(mockUser.exp).toISOString(),
        currentTime: new Date().toISOString()
      }, 'AuthService');
      return null;
    }
    
    // Security: Check token age (prevent extremely long-lived tokens)
    const tokenAgeTooOld = mockUser.exp - Date.now() > MAX_TOKEN_AGE_MS;
    if (tokenAgeTooOld) {
      logger.warning('Token exceeds maximum allowed age', {
        expiryTime: new Date(mockUser.exp).toISOString(),
        currentTime: new Date().toISOString()
      }, 'AuthService');
      return null;
    }
    
    return mockUser;
  } catch (error) {
    // Security: Log error but don't expose details in the response
    logger.error('Token verification error:', error, 'AuthService');
    return null;
  }
};

/**
 * Authentication middleware function that can be used across API endpoints
 * Enhanced with additional security measures
 * @param token The JWT token to verify
 * @returns ApiResponse with error if token is invalid
 */
export const authenticateRequest = <T>(token: string): { 
  isAuthenticated: boolean; 
  user: UserToken | null;
  errorResponse?: ApiResponse<T>;
} => {
  // Security: Input validation
  if (!token) {
    logger.warning('Authentication attempt with empty token', {
      timestamp: new Date().toISOString()
    }, 'AuthService');
    
    return {
      isAuthenticated: false,
      user: null,
      errorResponse: {
        success: false,
        error: 'Authentication required. Please provide a valid token.',
      }
    };
  }

  // Security: Verify and extract user information from token
  const user = verifyToken(token);
  
  if (!user) {
    // Security: Don't leak specific details about why authentication failed
    logger.warning('Authentication failed - invalid token', { 
      tokenPreview: token.substring(0, 10) + '...',
      timestamp: new Date().toISOString()
    }, 'AuthService');
    
    return {
      isAuthenticated: false,
      user: null,
      errorResponse: {
        success: false,
        error: 'Unauthorized access. Invalid or expired token.',
      }
    };
  }

  // Security: Log successful authentication without sensitive details
  logger.info('User authenticated successfully', { 
    userId: user.id,
    timestamp: new Date().toISOString()
  }, 'AuthService');
  
  return {
    isAuthenticated: true,
    user,
    errorResponse: undefined
  };
};

/**
 * Generate a standardized auth error response with enhanced security
 * @param message Error message
 * @param code Error code
 * @returns Formatted auth error response
 */
export const createAuthError = (
  message: string, 
  code: 'unauthorized' | 'invalid_token' | 'expired_token'
): AuthErrorResponse => {
  // Security: Log error without exposing implementation details
  logger.error(`Auth error: ${message}`, { 
    code,
    timestamp: new Date().toISOString()
  }, 'AuthService');
  
  return {
    status: 'error',
    message,
    code
  };
};

/**
 * Sanitize user data to ensure no sensitive information is leaked
 * @param userData Raw user data
 * @returns Sanitized user data
 */
export const sanitizeUserData = (userData: UserToken): Omit<UserToken, 'exp'> => {
  // Remove sensitive fields
  const { exp, ...sanitizedUser } = userData;
  
  return sanitizedUser;
};
