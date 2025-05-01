
/**
 * PII Protection Service
 * 
 * Utilities for masking and protecting personally identifiable information (PII)
 * and other sensitive data in API requests and responses.
 */

import { logger } from '@/services/logging/loggingService';

/**
 * Types of data that can be masked
 */
export enum SensitiveDataType {
  ACCOUNT_NUMBER = 'accountNumber',
  CREDIT_CARD = 'creditCard',
  SSN = 'ssn',
  EMAIL = 'email',
  PHONE = 'phone',
  ADDRESS = 'address',
  NAME = 'name',
  CUSTOM = 'custom'
}

/**
 * Configuration for masking data
 */
export interface MaskingConfig {
  type: SensitiveDataType;
  pattern?: RegExp; // Custom pattern for CUSTOM type
  replacement?: string; // Custom replacement for CUSTOM type
  keepStartChars?: number; // Number of characters to keep at start
  keepEndChars?: number; // Number of characters to keep at end
}

/**
 * Default patterns for masking different types of data
 */
const DEFAULT_PATTERNS: Record<SensitiveDataType, { pattern: RegExp, replacement: string }> = {
  [SensitiveDataType.ACCOUNT_NUMBER]: {
    pattern: /\b(\d{4})\d{4,8}(\d{4})\b/g,
    replacement: '$1********$2'
  },
  [SensitiveDataType.CREDIT_CARD]: {
    pattern: /\b(\d{4})[- ]?\d{4}[- ]?\d{4}[- ]?(\d{4})\b/g,
    replacement: '$1-****-****-$2'
  },
  [SensitiveDataType.SSN]: {
    pattern: /\b\d{3}[-]?\d{2}[-]?(\d{4})\b/g,
    replacement: '***-**-$1'
  },
  [SensitiveDataType.EMAIL]: {
    pattern: /\b([^@\s]{1,3})([^@\s]+)@([^\s]+)\b/g,
    replacement: '$1***@$3'
  },
  [SensitiveDataType.PHONE]: {
    pattern: /\b(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?(\d{4})\b/g,
    replacement: '***-***-$2'
  },
  [SensitiveDataType.ADDRESS]: {
    pattern: /\b\d+\s+([^\s,]+\s+){1,4},\s+[^\s,]+,\s+[A-Z]{2}\s+\d{5}\b/gi,
    replacement: '[REDACTED ADDRESS]'
  },
  [SensitiveDataType.NAME]: {
    pattern: /\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g,
    replacement: '$1 [REDACTED]'
  },
  [SensitiveDataType.CUSTOM]: {
    pattern: /.*/g,
    replacement: '[REDACTED]'
  }
};

/**
 * Mask sensitive data in a string
 * @param text String containing sensitive data
 * @param config Configuration for masking
 * @returns Masked string
 */
export function maskSensitiveData(text: string, config: MaskingConfig): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  try {
    // Get pattern and replacement
    let pattern: RegExp;
    let replacement: string;

    if (config.type === SensitiveDataType.CUSTOM && config.pattern) {
      pattern = config.pattern;
      replacement = config.replacement || '[REDACTED]';
    } else {
      const defaultConfig = DEFAULT_PATTERNS[config.type];
      pattern = defaultConfig.pattern;
      replacement = defaultConfig.replacement;
    }

    // Apply masking
    return text.replace(pattern, replacement);
  } catch (error) {
    logger.error('Error masking sensitive data', error, 'PiiProtection');
    return '[MASKING ERROR]';
  }
}

/**
 * Mask multiple sensitive data points in an object
 * @param data Object containing sensitive data
 * @param configMap Mapping of field paths to masking configurations
 * @returns Masked object
 */
export function maskSensitiveObject(
  data: Record<string, any>, 
  configMap: Record<string, MaskingConfig>
): Record<string, any> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return data;
  }

  const maskedData = { ...data };

  try {
    // Apply masking to each field
    Object.entries(configMap).forEach(([path, config]) => {
      const keys = path.split('.');
      let current = maskedData;
      
      // Navigate to the nested property
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined || current[keys[i]] === null) {
          return; // Skip if path doesn't exist
        }
        current = current[keys[i]];
      }
      
      const lastKey = keys[keys.length - 1];
      if (current[lastKey] === undefined || current[lastKey] === null) {
        return; // Skip if field doesn't exist
      }
      
      // Apply masking if the field is a string
      if (typeof current[lastKey] === 'string') {
        current[lastKey] = maskSensitiveData(current[lastKey], config);
      }
    });
    
    return maskedData;
  } catch (error) {
    logger.error('Error masking sensitive object', error, 'PiiProtection');
    return data; // Return original on error to avoid data loss
  }
}

/**
 * Logger-safe stringification of objects with PII redaction
 * @param obj Object to stringify
 * @param sensitiveKeys Array of sensitive key names to mask
 * @returns Safe string representation
 */
export function safeStringify(
  obj: any, 
  sensitiveKeys: string[] = ['password', 'token', 'secret', 'key', 'credential', 'auth']
): string {
  if (!obj) return String(obj);
  
  try {
    return JSON.stringify(obj, (key, value) => {
      // Check if the current key contains any sensitive keywords
      const isSensitive = sensitiveKeys.some(sensKey => 
        key.toLowerCase().includes(sensKey.toLowerCase())
      );
      
      if (isSensitive && typeof value === 'string') {
        return '[REDACTED]';
      }
      return value;
    });
  } catch (error) {
    return '[Object cannot be safely stringified]';
  }
}

/**
 * Create a redacted copy of an error object safe for logging
 * @param error Error to redact
 * @returns Safe error object for logging
 */
export function createSafeError(error: any): Record<string, any> {
  const safeError: Record<string, any> = {
    message: error.message || 'Unknown error',
  };
  
  if (error.name) safeError.name = error.name;
  if (error.code) safeError.code = error.code;
  if (error.status) safeError.status = error.status;
  
  // Safely add stack trace for non-production environments
  if (process.env.NODE_ENV !== 'production' && error.stack) {
    safeError.stack = error.stack;
  }
  
  return safeError;
}
