/**
 * Privacy utilities for sanitizing data and preventing PII/PHI leakage
 */

// PII/PHI patterns to detect and sanitize
const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  name: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // Simple first/last name pattern
};

const SENSITIVE_FIELDS = [
  'email', 'phone', 'ssn', 'social_security_number', 'credit_card', 'ccn',
  'password', 'token', 'key', 'secret', 'name', 'first_name', 'last_name',
  'address', 'street', 'city', 'zip', 'postal_code', 'dob', 'date_of_birth',
  'medical_record', 'diagnosis', 'prescription', 'health_data'
];

/**
 * Generate a consistent hash for PII data
 */
export function hashPII(data: string): string {
  // Simple hash for demo - in production use crypto.createHash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `hash_${Math.abs(hash).toString(36)}`;
}

/**
 * Sanitize a string by replacing PII patterns with hashes
 */
export function sanitizeString(input: string): string {
  let sanitized = input;
  
  // Replace email addresses
  sanitized = sanitized.replace(PII_PATTERNS.email, (match) => `email_${hashPII(match)}`);
  
  // Replace phone numbers
  sanitized = sanitized.replace(PII_PATTERNS.phone, (match) => `phone_${hashPII(match)}`);
  
  // Replace SSNs
  sanitized = sanitized.replace(PII_PATTERNS.ssn, (match) => `ssn_${hashPII(match)}`);
  
  // Replace credit card numbers
  sanitized = sanitized.replace(PII_PATTERNS.creditCard, (match) => `card_${hashPII(match)}`);
  
  return sanitized;
}

/**
 * Recursively sanitize an object, replacing PII with hashes
 */
export function sanitizeObject(obj: any, depth = 0): any {
  if (depth > 10) return '[max_depth_reached]'; // Prevent infinite recursion
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth + 1));
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      
      // Check if field name suggests sensitive data
      const isSensitiveField = SENSITIVE_FIELDS.some(field => 
        lowerKey.includes(field) || key.includes('pii') || key.includes('phi')
      );
      
      if (isSensitiveField && typeof value === 'string') {
        sanitized[key] = `${key}_${hashPII(value)}`;
      } else {
        sanitized[key] = sanitizeObject(value, depth + 1);
      }
    }
    
    return sanitized;
  }
  
  return obj;
}

/**
 * Safe console logger that automatically sanitizes PII/PHI
 */
export const safeLog = {
  info: (message: string, data?: any) => {
    console.info(`[SAFE] ${message}`, data ? sanitizeObject(data) : '');
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[SAFE] ${message}`, data ? sanitizeObject(data) : '');
  },
  
  error: (message: string, data?: any) => {
    console.error(`[SAFE] ${message}`, data ? sanitizeObject(data) : '');
  },
  
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[SAFE] ${message}`, data ? sanitizeObject(data) : '');
    }
  }
};

/**
 * Create a sanitized receipt that's safe for logging and storage
 */
export function createSanitizedReceipt(receipt: any): any {
  const sanitized = sanitizeObject(receipt);
  
  // Ensure we have proof/hash references instead of raw data
  if (sanitized.inputs && typeof sanitized.inputs === 'object') {
    sanitized.inputs_hash = hashPII(JSON.stringify(sanitized.inputs));
    delete sanitized.inputs; // Remove raw inputs
  }
  
  // Add privacy notice
  sanitized._privacy_notice = 'PII/PHI has been sanitized for privacy compliance';
  sanitized._sanitized_at = new Date().toISOString();
  
  return sanitized;
}

/**
 * Validate that an object doesn't contain obvious PII/PHI
 */
export function validatePrivacyCompliance(obj: any): { isCompliant: boolean; violations: string[] } {
  const violations: string[] = [];
  const objString = JSON.stringify(obj);
  
  // Check for email patterns
  if (PII_PATTERNS.email.test(objString)) {
    violations.push('Contains email addresses');
  }
  
  // Check for phone patterns
  if (PII_PATTERNS.phone.test(objString)) {
    violations.push('Contains phone numbers');
  }
  
  // Check for SSN patterns
  if (PII_PATTERNS.ssn.test(objString)) {
    violations.push('Contains SSN patterns');
  }
  
  // Check for sensitive field names
  const sensitiveFieldsFound = SENSITIVE_FIELDS.filter(field => 
    objString.toLowerCase().includes(`"${field}"`) || 
    objString.toLowerCase().includes(`'${field}'`)
  );
  
  if (sensitiveFieldsFound.length > 0) {
    violations.push(`Contains sensitive fields: ${sensitiveFieldsFound.join(', ')}`);
  }
  
  return {
    isCompliant: violations.length === 0,
    violations
  };
}