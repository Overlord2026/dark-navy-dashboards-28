export async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(digest);
}
function bufferToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}
export async function canonicalize(obj: unknown): Promise<{ canonical: string; hash: string }> {
  const canonical = JSON.stringify(obj, Object.keys(obj as any).sort());
  const hash = await sha256Hex(canonical);
  return { canonical, hash };
}

// Legacy exports for backward compatibility
export async function hash(obj: unknown): Promise<string> {
  const { hash } = await canonicalize(obj);
  return hash;
}

export async function inputs_hash(obj: unknown): Promise<string> {
  const { hash } = await canonicalize(obj);
  return 'sha256:' + hash;
}

export function canonicalJson(obj: any): string {
  return JSON.stringify(obj, Object.keys(obj as any).sort());
}