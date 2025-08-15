// supabase/functions/_shared/secrets.ts
export function need(name: string) {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

export const Env = {
  SB_URL: () => need("SUPABASE_URL"),
  SB_SERVICE: () => need("SUPABASE_SERVICE_ROLE_KEY"),
  BUCKET: () => Deno.env.get("REPORTS_BUCKET") ?? "reports",
  V: (k: string) => Deno.env.get(k) || "" // optional vendor keys e.g. BRIDGEFT_API_KEY, PLAID_SECRET, etc.
};