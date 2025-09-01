import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

interface InputValidatorProps {
  children: React.ReactNode;
  validationSchema?: z.ZodSchema;
  sanitize?: boolean;
  onError?: (error: string) => void;
}

// Common validation schemas
export const ValidationSchemas = {
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Invalid phone number format'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-\.]+$/, 'Name can only contain letters, spaces, hyphens, and periods'),
  message: z.string()
    .min(1, 'Message is required')
    .max(5000, 'Message must be less than 5000 characters'),
  currency: z.number().positive('Amount must be positive').max(1000000000, 'Amount too large'),
  date: z.date().refine((date) => date <= new Date(), 'Date cannot be in the future'),
  ssn: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, 'Invalid SSN format'),
  ein: z.string().regex(/^\d{2}-?\d{7}$/, 'Invalid EIN format')
};

// XSS prevention utilities
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: []
  });
};

// SQL injection prevention
export const preventSqlInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(--|\*\/|\/\*)/,
    /(\b(OR|AND)\b.*=.*)/i,
    /(;|\||&)/
  ];
  
  return !sqlPatterns.some(pattern => pattern.test(input));
};

// Rate limiting helper
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

export const checkRateLimit = (identifier: string, maxRequests = 10, windowMs = 60000): boolean => {
  const now = Date.now();
  const key = identifier;
  const current = rateLimitStore.get(key);
  
  if (!current || now - current.lastReset > windowMs) {
    rateLimitStore.set(key, { count: 1, lastReset: now });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
};

export const InputValidator: React.FC<InputValidatorProps> = ({
  children,
  validationSchema,
  sanitize = true,
  onError
}) => {
  const validateAndSanitizeInputs = (element: React.ReactElement): React.ReactElement => {
    if (!React.isValidElement(element)) return element;
    
    const props = element.props as any;
    const newProps: any = { ...props };
    
    // Handle input elements
    if (element.type === 'input' || element.type === 'textarea') {
      const originalOnChange = props.onChange;
      
      newProps.onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let value = e.target.value;
        
        // Sanitize input if enabled
        if (sanitize) {
          value = sanitizeInput(value);
        }
        
        // Check for SQL injection patterns
        if (!preventSqlInjection(value)) {
          onError?.('Invalid input detected');
          return;
        }
        
        // Validate against schema if provided
        if (validationSchema) {
          try {
            validationSchema.parse(value);
        } catch (error) {
          if (error instanceof z.ZodError) {
            onError?.(error.issues[0].message);
              return;
            }
          }
        }
        
        // Update the event with sanitized value
        const sanitizedEvent = {
          ...e,
          target: { ...e.target, value }
        };
        
        originalOnChange?.(sanitizedEvent);
      };
    }
    
    // Recursively process children
    if (props.children) {
      newProps.children = React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          return validateAndSanitizeInputs(child);
        }
        return child;
      });
    }
    
    return React.cloneElement(element, newProps);
  };
  
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return validateAndSanitizeInputs(child);
        }
        return child;
      })}
    </>
  );
};

// Hook for form validation
export const useSecureForm = <T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  onSubmit: (data: T) => void | Promise<void>
) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const validate = (data: Partial<T>): boolean => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleSubmit = async (data: Partial<T>) => {
    if (!validate(data)) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(data as T);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    errors,
    isSubmitting,
    validate,
    handleSubmit,
    clearErrors: () => setErrors({})
  };
};