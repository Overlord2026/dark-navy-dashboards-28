/**
 * Canonical data processing utilities for policy bundles
 */

export async function sha256Hex(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function canonicalizeObject(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(canonicalizeObject).sort();
  }
  
  const result: any = {};
  const keys = Object.keys(obj).sort();
  
  for (const key of keys) {
    result[key] = canonicalizeObject(obj[key]);
  }
  
  return result;
}

export async function generateContentHash(content: any): Promise<string> {
  const canonical = canonicalizeObject(content);
  const jsonString = JSON.stringify(canonical);
  return await sha256Hex(jsonString);
}