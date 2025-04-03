import { logger } from '@/services/logging/loggingService';
import { sanitizeUserData } from '../auth/authUtils';
import { ApiResponse } from '@/types/api';

/**
 * Validates tax document file upload
 * @param file The file to validate
 * @returns true if valid, false otherwise
 */
export const validateTaxDocumentFile = (file: File): boolean => {
  try {
    // Check file size (max 10MB)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      logger.warning('Tax document file size exceeds limit', {
        fileName: file.name,
        fileSize: file.size,
        maxSize: maxSizeBytes
      }, 'TaxPlanningService');
      return false;
    }
    
    // Check file type (only PDF and specific image formats)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      logger.warning('Invalid tax document file type', {
        fileName: file.name,
        fileType: file.type,
        allowedTypes
      }, 'TaxPlanningService');
      return false;
    }
    
    // Check file name length to prevent path traversal
    if (file.name.length > 255) {
      logger.warning('Tax document filename too long', {
        fileName: file.name,
        nameLength: file.name.length
      }, 'TaxPlanningService');
      return false;
    }
    
    // Check for malicious file names
    const filenameRegex = /^[a-zA-Z0-9_\-\. ]+$/;
    if (!filenameRegex.test(file.name)) {
      logger.warning('Invalid tax document filename format', {
        fileName: file.name
      }, 'TaxPlanningService');
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error validating tax document file', error, 'TaxPlanningService');
    return false;
  }
};

/**
 * Validates professional access request
 * @param requestData The access request data
 * @returns true if valid, false otherwise
 */
export const validateProfessionalAccessRequest = (requestData: any): boolean => {
  try {
    // Check required fields
    if (!requestData.professionalId || !requestData.documentIds || !requestData.accessLevel) {
      logger.warning('Missing required fields in professional access request', {
        hasProfessionalId: !!requestData.professionalId,
        hasDocumentIds: !!requestData.documentIds,
        hasAccessLevel: !!requestData.accessLevel
      }, 'TaxPlanningService');
      return false;
    }
    
    // Validate professionalId format
    if (typeof requestData.professionalId !== 'string' || requestData.professionalId.trim() === '') {
      logger.warning('Invalid professionalId in access request', {
        professionalId: requestData.professionalId
      }, 'TaxPlanningService');
      return false;
    }
    
    // Validate documentIds is an array
    if (!Array.isArray(requestData.documentIds)) {
      logger.warning('documentIds is not an array in access request', {
        documentIds: requestData.documentIds
      }, 'TaxPlanningService');
      return false;
    }
    
    // Validate all document IDs
    const allValidDocumentIds = requestData.documentIds.every(
      (docId: any) => typeof docId === 'string' && docId.trim() !== ''
    );
    
    if (!allValidDocumentIds) {
      logger.warning('Invalid document IDs in access request', {
        documentIdsCount: requestData.documentIds.length
      }, 'TaxPlanningService');
      return false;
    }
    
    // Validate access level is one of the allowed values
    const allowedAccessLevels = ['view', 'comment', 'edit'];
    if (!allowedAccessLevels.includes(requestData.accessLevel)) {
      logger.warning('Invalid access level in professional access request', {
        accessLevel: requestData.accessLevel,
        allowedLevels: allowedAccessLevels
      }, 'TaxPlanningService');
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error validating professional access request', error, 'TaxPlanningService');
    return false;
  }
};

/**
 * Creates a standardized error response for tax planning API endpoints
 * @param message Error message
 * @param code Error code
 * @returns Formatted error response
 */
export const createTaxPlanningErrorResponse = <T>(
  message: string,
  code = 'error'
): ApiResponse<T> => {
  // Log the error without sensitive details
  logger.error(`Tax planning error: ${message}`, { code }, 'TaxPlanningService');
  
  return {
    success: false,
    error: message,
    errorCode: code
  };
};

/**
 * Sanitizes accounting software credentials
 * @param credentials The accounting software credentials
 * @returns Sanitized credentials object
 */
export const sanitizeAccountingCredentials = (credentials: any): any => {
  try {
    const sanitized = { ...credentials };
    
    // Remove any sensitive fields that shouldn't be logged or stored
    delete sanitized.apiKey;
    delete sanitized.password;
    delete sanitized.secret;
    delete sanitized.accessToken;
    delete sanitized.refreshToken;
    
    // Replace with placeholder for logging purposes
    if (credentials.apiKey) sanitized.hasApiKey = true;
    if (credentials.accessToken) sanitized.hasAccessToken = true;
    if (credentials.refreshToken) sanitized.hasRefreshToken = true;
    
    // Keep safe fields but ensure they're sanitized
    if (typeof sanitized.provider === 'string') {
      sanitized.provider = sanitized.provider.slice(0, 50).trim();
    }
    
    if (typeof sanitized.username === 'string') {
      sanitized.username = sanitized.username.slice(0, 100).trim();
    }
    
    return sanitized;
  } catch (error) {
    logger.error('Error sanitizing accounting credentials', error, 'TaxPlanningService');
    return {}; // Return empty object in case of error
  }
};
