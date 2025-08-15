// supabase/functions/_shared/secrets.ts
export function requireEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

// Supabase
export const SUPABASE_URL             = requireEnv('SUPABASE_URL');
export const SUPABASE_SERVICE_ROLE_KEY= requireEnv('SUPABASE_SERVICE_ROLE_KEY');

// Vendors (optional; only load where used)
export function getBridgeFT() {
  return {
    baseUrl: requireEnv('BRIDGEFT_BASE_URL'),
    apiKey:  requireEnv('BRIDGEFT_API_KEY'),
  };
}
export function getDocuSign() {
  return {
    baseUrl:       requireEnv('DOCUSIGN_BASE_URL'),
    accountId:     requireEnv('DOCUSIGN_ACCOUNT_ID'),
    integratorKey: requireEnv('DOCUSIGN_INTEGRATOR_KEY'),
    userId:        requireEnv('DOCUSIGN_USER_ID'),
    privateKey:    requireEnv('DOCUSIGN_PRIVATE_KEY'),
  };
}
export const REPORTS_BUCKET = Deno.env.get('REPORTS_BUCKET') ?? 'reports';