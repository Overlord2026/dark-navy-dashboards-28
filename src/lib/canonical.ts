// src/lib/canonical.ts
// Browser-safe canonicalization + hashing (no node:crypto)

function toRFC3339(d: Date | string) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z");
}

/**
 * Canonicalize an object:
 * - strings → NFC
 * - object keys → lexicographic order
 * - arrays → keep order unless you explicitly opt-in (arraySortKeys)
 * - numbers → fixed precision (6)
 * - dates → RFC-3339
 * - no binary blobs (use digests upstream)
 */
export function canonicalize(obj: any, arraySortKeys: string[] = []): string {
  const seen = new WeakSet();

  function norm(v: any, path: string[]): any {
    if (v === null || typeof v !== "object") {
      if (typeof v === "string") return v.normalize("NFC");
      if (typeof v === "number" && Number.isFinite(v)) return Number(v.toFixed(6));
      if (v instanceof Date) return toRFC3339(v);
      return v;
    }
    if (seen.has(v)) return null; // break cycles defensively
    seen.add(v);

    if (Array.isArray(v)) {
      const key = path.join("/");
      const arr = v.map((x, i) => norm(x, path.concat(String(i))));
      if (arraySortKeys.includes(key)) {
        return arr.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
      }
      return arr;
    }
    // object
    return Object.keys(v)
      .sort()
      .reduce((acc, k) => {
        acc[k] = norm(v[k], path.concat(k));
        return acc;
      }, {} as Record<string, any>);
  }

  const canon = norm(obj, []);
  return JSON.stringify(canon);
}

export async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const dig = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(dig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * inputsHash: convenience wrapper used across the app
 * canonicalize(obj) → sha256Hex(canonical)
 */
async function inputsHash(obj: any, arraySortKeys: string[] = []): Promise<string> {
  const canon = canonicalize(obj, arraySortKeys);
  return sha256Hex(canon);
}

// Legacy exports for backward compatibility
export async function canonicalizeWithHash(obj: unknown): Promise<{ canonical: string; hash: string }> {
  const canonical = canonicalize(obj);
  const hash = await sha256Hex(canonical);
  return { canonical, hash };
}

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

// Alias and version exports
export const stableStringify = canonicalize;
export const __CANONICAL_BUILD_ID = "react-singleton-01";
export const __BUILD_ID__ = "react-singleton-04-toast-fix";
export { inputsHash };