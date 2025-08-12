/**
 * Common Evidence Layer - Canonicalization Service
 * Provides deterministic serialization for evidence integrity
 */

export interface CanonicalizationOptions {
  stripVolatileFields?: boolean;
  roundTimestamps?: boolean;
  timestampPrecision?: 'second' | 'minute' | 'hour';
  excludeFields?: string[];
}

export class CanonicalService {
  private static readonly VOLATILE_FIELDS = [
    'updated_at',
    'last_modified',
    'cache_timestamp',
    'session_id',
    'request_id',
    'ip_address',
    'user_agent'
  ];

  /**
   * Canonicalize object for deterministic hashing
   * @param obj - Object to canonicalize
   * @param options - Canonicalization options
   * @returns Canonical JSON string
   */
  static canonicalize(obj: any, options: CanonicalizationOptions = {}): string {
    const processed = this.processObject(obj, options);
    return this.deterministicStringify(processed);
  }

  /**
   * Process object according to canonicalization rules
   */
  private static processObject(obj: any, options: CanonicalizationOptions): any {
    if (obj === null || obj === undefined) return null;
    
    if (typeof obj === 'boolean' || typeof obj === 'string' || typeof obj === 'number') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return this.roundTimestamp(obj, options.timestampPrecision || 'second');
    }
    
    if (Array.isArray(obj)) {
      return obj
        .map(item => this.processObject(item, options))
        .sort((a, b) => {
          const aStr = this.deterministicStringify(a);
          const bStr = this.deterministicStringify(b);
          return aStr.localeCompare(bStr);
        });
    }
    
    if (typeof obj === 'object') {
      const result: any = {};
      const keys = Object.keys(obj).sort();
      
      for (const key of keys) {
        // Skip volatile fields if requested
        if (options.stripVolatileFields && this.VOLATILE_FIELDS.includes(key)) {
          continue;
        }
        
        // Skip excluded fields
        if (options.excludeFields?.includes(key)) {
          continue;
        }
        
        result[key] = this.processObject(obj[key], options);
      }
      
      return result;
    }
    
    return String(obj);
  }

  /**
   * Deterministic JSON stringify with sorted keys
   */
  private static deterministicStringify(obj: any): string {
    if (obj === null || obj === undefined) return 'null';
    
    if (typeof obj === 'boolean' || typeof obj === 'number') {
      return JSON.stringify(obj);
    }
    
    if (typeof obj === 'string') {
      return JSON.stringify(obj);
    }
    
    if (Array.isArray(obj)) {
      const items = obj.map(item => this.deterministicStringify(item));
      return `[${items.join(',')}]`;
    }
    
    if (typeof obj === 'object') {
      const keys = Object.keys(obj).sort();
      const pairs = keys.map(key => 
        `${JSON.stringify(key)}:${this.deterministicStringify(obj[key])}`
      );
      return `{${pairs.join(',')}}`;
    }
    
    return JSON.stringify(String(obj));
  }

  /**
   * Round timestamp to specified precision
   */
  private static roundTimestamp(date: Date, precision: 'second' | 'minute' | 'hour'): string {
    const timestamp = new Date(date);
    
    switch (precision) {
      case 'minute':
        timestamp.setSeconds(0, 0);
        break;
      case 'hour':
        timestamp.setMinutes(0, 0, 0);
        break;
      case 'second':
      default:
        timestamp.setMilliseconds(0);
        break;
    }
    
    return timestamp.toISOString();
  }

  /**
   * Strip volatile fields from object
   */
  static stripVolatileFields(obj: any, additionalFields: string[] = []): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    const fieldsToStrip = [...this.VOLATILE_FIELDS, ...additionalFields];
    const result = { ...obj };
    
    fieldsToStrip.forEach(field => {
      delete result[field];
    });
    
    return result;
  }

  /**
   * Create canonical hash of object
   */
  static async hash(obj: any, options: CanonicalizationOptions = {}): Promise<string> {
    const canonical = this.canonicalize(obj, options);
    
    // Use the existing HashingService for consistent hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(canonical);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate canonical format
   */
  static validateCanonical(canonicalStr: string): boolean {
    try {
      // Check if it's valid JSON
      JSON.parse(canonicalStr);
      
      // Check if keys are sorted (basic validation)
      const keyOrderRegex = /"([^"]+)":/g;
      const keys: string[] = [];
      let match;
      
      while ((match = keyOrderRegex.exec(canonicalStr)) !== null) {
        keys.push(match[1]);
      }
      
      // Verify keys are sorted
      const sortedKeys = [...keys].sort();
      return JSON.stringify(keys) === JSON.stringify(sortedKeys);
    } catch {
      return false;
    }
  }
}