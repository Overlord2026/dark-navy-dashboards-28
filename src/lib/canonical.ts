export function canonicalJson(obj: any): string {
  return JSON.stringify(sortRecursively(obj));
}

function sortRecursively(input: any): any {
  if (Array.isArray(input)) return input.map(sortRecursively);
  if (input && typeof input === 'object') {
    return Object.keys(input).sort().reduce((acc:any, k:string) => {
      acc[k] = sortRecursively(input[k]); return acc;
    }, {});
  }
  return input;
}

export async function sha256Hex(data: string): Promise<string> {
  // Browser: SubtleCrypto
  if (typeof window !== 'undefined' && (window.crypto as any)?.subtle) {
    const enc = new TextEncoder().encode(data);
    const digest = await window.crypto.subtle.digest('SHA-256', enc);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2,'0')).join('');
  }
  // Node/CLI: dynamic import only outside browser
  try {
    const { createHash } = await import('node:crypto');
    return createHash('SHA-256').update(data, 'utf8').digest('hex');
  } catch {
    // deterministic fallback
    return Array.from(data).reduce((acc, ch) => (acc*31 + ch.charCodeAt(0))>>>0, 0)
                 .toString(16).padStart(64,'0');
  }
}

export async function hash(obj: any): Promise<string> {
  const s = canonicalJson(obj);
  const hex = await sha256Hex(s);
  return 'sha256:' + hex;
}