// Browser-safe canonical JSON + SHA-256 hashing using Web Crypto API only
// Removed node:crypto dependency to fix browser compatibility build issues

export function canonicalJson(obj: any): string {
  return JSON.stringify(sortRecursively(obj));
}

function sortRecursively(input: any): any {
  if (Array.isArray(input)) return input.map(sortRecursively);
  if (input && typeof input === 'object') {
    return Object.keys(input).sort().reduce((acc: any, k: string) => {
      acc[k] = sortRecursively((input as any)[k]);
      return acc;
    }, {});
  }
  return input;
}

export async function sha256Hex(data: string): Promise<string> {
  // Browser (Web Crypto) - always use this in browser builds
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(data);
    const digest = await window.crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Server-side rendering fallback - avoid node:crypto import
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    const bytes = new TextEncoder().encode(data);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Last-ditch deterministic fallback (not cryptographic, but deterministic)
  let h = 0;
  for (let i = 0; i < data.length; i++) h = (h * 31 + data.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(64, '0');
}

export async function inputs_hash(obj: any): Promise<string> {
  const s = canonicalJson(obj);
  const hex = await sha256Hex(s);
  return 'sha256:' + hex;
}

export async function hash(obj: any): Promise<string> {
  const s = canonicalJson(obj);
  const hex = await sha256Hex(s);
  return 'sha256:' + hex;
}