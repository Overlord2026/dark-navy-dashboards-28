// src/services/aiEdge.ts
export async function callEdgeJSON(fn: string, payload: any, init?: RequestInit) {
  const url = `/functions/v1/${fn}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers||{}) },
    body: JSON.stringify(payload), ...init,
  });
  if (!res.ok) throw new Error(`Edge ${fn} ${res.status}`);
  return res.json();
}