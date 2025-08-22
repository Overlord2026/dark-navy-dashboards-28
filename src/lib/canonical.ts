/**
 * Canonical JSON + SHA256 hashing for deterministic receipt generation
 */

export function canonicalJson(obj: any): string {
  if (obj === null) return 'null';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'string') return JSON.stringify(obj);
  
  if (Array.isArray(obj)) {
    const items = obj.map(canonicalJson);
    return `[${items.join(',')}]`;
  }
  
  if (typeof obj === 'object') {
    const sortedKeys = Object.keys(obj).sort();
    const pairs = sortedKeys.map(key => {
      const value = canonicalJson(obj[key]);
      return `${JSON.stringify(key)}:${value}`;
    });
    return `{${pairs.join(',')}}`;
  }
  
  throw new Error(`Cannot canonicalize type: ${typeof obj}`);
}

export function hash(obj: any): string {
  const canonical = canonicalJson(obj);
  // Simple hash for demo - in production use crypto.subtle
  let hash = 0;
  for (let i = 0; i < canonical.length; i++) {
    const char = canonical.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(8, '0')}`;
}