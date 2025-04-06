
import { logger } from '../logging/loggingService';

/**
 * Simple schema validation utility for API responses
 */
export interface SchemaDefinition {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  properties?: Record<string, SchemaDefinition>;
  items?: SchemaDefinition;
  required?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  missingProps?: string[];
  wrongTypes?: string[];
}

/**
 * Validate a response object against an expected schema
 * 
 * @param data The response data to validate
 * @param schema The expected schema
 * @returns Validation result with details of any errors
 */
export function validateSchema(data: any, schema: SchemaDefinition): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    missingProps: [],
    wrongTypes: []
  };
  
  // Check type match
  if (schema.type === 'object') {
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      logger.warning('Schema validation failed: Expected object', { 
        actual: typeof data,
        expected: schema.type 
      }, 'SchemaValidator');
      result.isValid = false;
      result.wrongTypes?.push('root');
      return result;
    }
    
    // Check required properties
    if (schema.required) {
      for (const prop of schema.required) {
        if (data[prop] === undefined) {
          result.isValid = false;
          result.missingProps?.push(prop);
        }
      }
    }
    
    // Check property types
    if (schema.properties) {
      for (const [prop, propSchema] of Object.entries(schema.properties)) {
        if (data[prop] !== undefined) {
          const propResult = validateSchema(data[prop], propSchema);
          if (!propResult.isValid) {
            result.isValid = false;
            result.wrongTypes = [
              ...(result.wrongTypes || []),
              ...(propResult.wrongTypes?.map(p => `${prop}.${p}`) || [])
            ];
            result.missingProps = [
              ...(result.missingProps || []),
              ...(propResult.missingProps?.map(p => `${prop}.${p}`) || [])
            ];
          }
        }
      }
    }
  } 
  else if (schema.type === 'array') {
    if (!Array.isArray(data)) {
      result.isValid = false;
      result.wrongTypes?.push('root');
      return result;
    }
    
    // Check array items if schema provided
    if (schema.items && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const itemResult = validateSchema(data[i], schema.items);
        if (!itemResult.isValid) {
          result.isValid = false;
          result.wrongTypes = [
            ...(result.wrongTypes || []),
            ...(itemResult.wrongTypes?.map(p => `[${i}].${p}`) || [])
          ];
          result.missingProps = [
            ...(result.missingProps || []),
            ...(itemResult.missingProps?.map(p => `[${i}].${p}`) || [])
          ];
        }
      }
    }
  }
  else {
    // Primitive type checks
    const actualType = data === null ? 'null' : typeof data;
    if (actualType !== schema.type) {
      result.isValid = false;
      result.wrongTypes?.push('root');
    }
  }
  
  return result;
}

/**
 * Generate a sample object that conforms to the given schema
 * Useful for showing expected structure in documentation
 */
export function generateSampleFromSchema(schema: SchemaDefinition): any {
  if (schema.type === 'object') {
    const result: Record<string, any> = {};
    if (schema.properties) {
      for (const [prop, propSchema] of Object.entries(schema.properties)) {
        result[prop] = generateSampleFromSchema(propSchema);
      }
    }
    return result;
  } 
  else if (schema.type === 'array') {
    return schema.items ? [generateSampleFromSchema(schema.items)] : [];
  }
  else if (schema.type === 'string') {
    return "example";
  }
  else if (schema.type === 'number') {
    return 123;
  }
  else if (schema.type === 'boolean') {
    return true;
  }
  return null;
}

