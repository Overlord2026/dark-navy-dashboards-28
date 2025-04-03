
import { ApiResponse, UserToken } from '@/types/api';

/**
 * Verifies a JWT token and returns the user data if valid
 * @param token The JWT token to verify
 * @returns UserToken object if valid, null otherwise
 */
export const verifyToken = (token: string): UserToken | null => {
  try {
    // In a real app, this would validate the JWT signature and decode it
    // For demonstration, we'll do a simple check
    if (!token || !token.startsWith('Bearer ')) {
      return null;
    }
    
    // Mock user data - in a real app, this would come from decoding the JWT
    return {
      id: 'user-123',
      email: 'user@example.com',
      role: 'user',
      exp: Date.now() + 3600000 // 1 hour from now
    };
  } catch (error) {
    console.error('Token verification error:', error);
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
    return {
      isAuthenticated: false,
      user: null,
      errorResponse: {
        success: false,
        error: 'Unauthorized access. Invalid or expired token.',
      }
    };
  }

  return {
    isAuthenticated: true,
    user,
    errorResponse: undefined
  };
};
