/**
 * JSON Canonicalization Scheme (JCS) implementation
 * Produces deterministic serialization of JSON objects
 */

/**
 * Canonicalize a JSON object according to JCS RFC 8785
 * @param obj - The object to canonicalize
 * @returns Canonicalized JSON string with sorted keys
 */
export function canonicalize(obj: any): string {
  if (obj === null) return 'null';
  if (typeof obj === 'boolean') return obj ? 'true' : 'false';
  if (typeof obj === 'string') return JSON.stringify(obj);
  if (typeof obj === 'number') {
    if (!isFinite(obj)) {
      throw new Error('Non-finite numbers are not allowed in JCS');
    }
    return normalizeNumber(obj);
  }
  
  if (Array.isArray(obj)) {
    const items = obj.map(item => canonicalize(item));
    return `[${items.join(',')}]`;
  }
  
  if (typeof obj === 'object') {
    const keys = Object.keys(obj).sort();
    const pairs = keys.map(key => `${JSON.stringify(key)}:${canonicalize(obj[key])}`);
    return `{${pairs.join(',')}}`;
  }
  
  throw new Error(`Unsupported type: ${typeof obj}`);
}

/**
 * Normalize number representation for JCS
 * @param num - Number to normalize
 * @returns Normalized string representation
 */
function normalizeNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  
  // For floating point numbers, use JSON.stringify and remove unnecessary precision
  const str = JSON.stringify(num);
  
  // Remove unnecessary trailing zeros after decimal point
  if (str.includes('.')) {
    return str.replace(/\.?0+$/, '');
  }
  
  return str;
}

/**
 * Convert canonicalized JSON to UTF-8 bytes
 * @param canonicalJson - Canonicalized JSON string
 * @returns UTF-8 encoded bytes
 */
export function toUTF8Bytes(canonicalJson: string): Uint8Array {
  return new TextEncoder().encode(canonicalJson);
}

/**
 * Convenience function to canonicalize and get UTF-8 bytes in one step
 * @param obj - Object to canonicalize
 * @returns UTF-8 encoded canonical representation
 */
export function canonicalizeToBytes(obj: any): Uint8Array {
  return toUTF8Bytes(canonicalize(obj));
}