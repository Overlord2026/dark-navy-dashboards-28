// Simple Edge JSON caller
export async function callEdgeJSON(fn: string, payload: any, init?: RequestInit) {
  const url = `/functions/v1/${fn}`; // Supabase Functions proxy (works in Lovable dev/preview too)
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    body: JSON.stringify(payload),
    ...init,
  });
  if (!res.ok) throw new Error(`Edge ${fn} ${res.status}`);
  return await res.json();
}