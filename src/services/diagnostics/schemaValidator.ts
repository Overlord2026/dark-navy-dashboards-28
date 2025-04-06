
import { logger } from '../logging/loggingService';

/**
 * Simple schema validation utility for API responses
 */
export interface SchemaDefinition {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  properties?: Record<string, SchemaDefinition>;
  items?: SchemaDefinition;
  required?: string[] | readonly string[];
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
    
    // Check required properties - handle both readonly and mutable arrays
    if (schema.required) {
      const requiredProps = Array.isArray(schema.required) ? Array.from(schema.required) : schema.required;
      for (const prop of requiredProps) {
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

/**
 * Utility function to ensure schema definitions have mutable arrays
 * This helps prevent TypeScript errors when working with readonly arrays in schema definitions
 * 
 * @param schema The schema definition that may have readonly arrays
 * @returns A new schema definition with mutable arrays
 */
export function ensureMutableSchema(schema: any): SchemaDefinition {
  if (typeof schema !== 'object' || schema === null) {
    return schema as SchemaDefinition;
  }
  
  // Create a new object to avoid mutating the original
  const result: Record<string, any> = {};
  
  // Copy all properties
  for (const [key, value] of Object.entries(schema)) {
    if (key === 'required' && Array.isArray(value)) {
      // Convert readonly arrays to mutable arrays
      result[key] = Array.from(value);
    } 
    else if (key === 'properties' && typeof value === 'object' && value !== null) {
      // Recursively process property schemas
      const mutableProperties: Record<string, SchemaDefinition> = {};
      for (const [propKey, propValue] of Object.entries(value)) {
        mutableProperties[propKey] = ensureMutableSchema(propValue);
      }
      result[key] = mutableProperties;
    }
    else if (key === 'items' && typeof value === 'object' && value !== null) {
      // Recursively process items schema for arrays
      result[key] = ensureMutableSchema(value);
    }
    else {
      // Copy other properties as is
      result[key] = value;
    }
  }
  
  return result as SchemaDefinition;
}
