/**
 * Lightweight helper to call Supabase Edge Functions as JSON.
 * Usage: const res = await callEdgeJSON("pmalpha-ddpack", payload)
 */
export async function callEdgeJSON(path: string, payload: unknown, init?: RequestInit) {
  const base =
    import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ||
    `${import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "")}/functions/v1`;

  const url = `${base}/${path.replace(/^\/+/, "")}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    body: JSON.stringify(payload),
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}