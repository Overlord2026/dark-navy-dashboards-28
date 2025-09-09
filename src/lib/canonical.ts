export function canonicalize(obj: any, arraySortKeys: string[] = []): string {
  // NFC normalization, key sort, non-semantic array sort, fixed precision, RFC-3339
  const normalizeValue = (value: any): any => {
    if (value === null || value === undefined) return value;
    if (typeof value === 'string') return value.normalize('NFC');
    if (typeof value === 'number') return Number(value.toFixed(10)); // Fixed precision
    if (Array.isArray(value)) {
      if (arraySortKeys.some(key => JSON.stringify(value).includes(key))) {
        return value.map(normalizeValue).sort();
      }
      return value.map(normalizeValue);
    }
    if (typeof value === 'object') {
      const sorted: any = {};
      Object.keys(value).sort().forEach(key => {
        sorted[key] = normalizeValue(value[key]);
      });
      return sorted;
    }
    return value;
  };
  
  return JSON.stringify(normalizeValue(obj));
}

export async function sha256Hex(s: string): Promise<string> {
  const data = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function inputsHash(obj: any, arraySortKeys: string[] = []): Promise<string> {
  return sha256Hex(canonicalize(obj, arraySortKeys));
}

export async function canonicalizeWithHash(obj: unknown): Promise<{ canonical: string; hash: string }> {
  const canonical = canonicalize(obj);
  const hash = await sha256Hex(canonical);
  return { canonical, hash };
}

// Legacy exports for backward compatibility
export async function hash(obj: unknown): Promise<string> {
  const { hash } = await canonicalizeWithHash(obj);
  return hash;
}

export async function inputs_hash(obj: unknown): Promise<string> {
  const { hash } = await canonicalizeWithHash(obj);
  return 'sha256:' + hash;
}

export function canonicalJson(obj: any): string {
  return JSON.stringify(obj, Object.keys(obj as any).sort());
}