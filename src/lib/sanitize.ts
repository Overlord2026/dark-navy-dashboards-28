import DOMPurify from 'dompurify';

/**
 * Enhanced HTML sanitization with stricter security policies
 * @param html - The HTML string to sanitize
 * @param allowedTags - Optional custom allowed tags
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (html: string, allowedTags?: string[]): string => {
  // Enhanced security configuration
  const config = {
    ALLOWED_TAGS: allowedTags || ['mark', 'span', 'strong', 'em', 'b', 'i'],
    ALLOWED_ATTR: ['class'],
    KEEP_CONTENT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    ADD_TAGS: [],
    ADD_ATTR: [],
  };

  // Additional security checks
  if (typeof html !== 'string') {
    console.warn('sanitizeHtml: Input is not a string, returning empty string');
    return '';
  }

  // Check for common XSS patterns before sanitization
  const xssPatterns = [
    /javascript:/gi,
    /data:(?!image\/)/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(html)) {
      console.warn('sanitizeHtml: Potentially malicious content detected and blocked');
      return '';
    }
  }

  return DOMPurify.sanitize(html, config);
};

/**
 * Renders sanitized HTML content with highlight support
 * @param text - Original text content
 * @param highlights - Highlighted HTML content (potentially unsafe)
 * @returns Object with sanitized HTML string
 */
export const renderSafeHighlight = (text: string, highlights?: string) => {
  if (!highlights || highlights === text) {
    return { __html: sanitizeHtml(text) }; // Always sanitize, even plain text
  }
  
  return { __html: sanitizeHtml(highlights) };
};

/**
 * Validates and sanitizes user input for database operations
 * @param input - User input string
 * @param maxLength - Maximum allowed length
 * @returns Sanitized and validated string
 */
export const sanitizeUserInput = (input: string, maxLength: number = 1000): string => {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove potential SQL injection patterns
  const sqlPatterns = [
    /[';]|--|\|\||\/\*|\*\//gi,
    /\b(EXEC|UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b/gi
  ];

  let sanitized = input.trim();
  
  for (const pattern of sqlPatterns) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Truncate to max length
  sanitized = sanitized.substring(0, maxLength);
  
  // Remove HTML tags completely for user input
  return DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/**
 * Content Security Policy helper for setting up CSP headers
 */
export const getContentSecurityPolicy = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://xcmqjkvyvuhoslbzmlgi.supabase.co",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://xcmqjkvyvuhoslbzmlgi.supabase.co wss://xcmqjkvyvuhoslbzmlgi.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'"
  ].join('; ');
};