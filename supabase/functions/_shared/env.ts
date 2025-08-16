// Task 3: Edge Function Environment Helper
// Centralized environment variable management for Edge Functions

export const env = {
  // Required environment variables
  SUPABASE_URL: Deno.env.get('SUPABASE_URL') ?? missing('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? missing('SUPABASE_SERVICE_ROLE_KEY'),
  
  // Optional environment variables with defaults
  REPORTS_BUCKET: Deno.env.get('REPORTS_BUCKET') ?? 'reports',
  
  // Optional third-party API keys
  PLAID_CLIENT_ID: Deno.env.get('PLAID_CLIENT_ID'),
  PLAID_SECRET: Deno.env.get('PLAID_SECRET'),
  BRIDGEFT_BASE_URL: Deno.env.get('BRIDGEFT_BASE_URL'),
  BRIDGEFT_API_KEY: Deno.env.get('BRIDGEFT_API_KEY'),
  AKOYA_API_KEY: Deno.env.get('AKOYA_API_KEY'),
  
  // DocuSign environment variables
  DOCUSIGN_INTEGRATION_KEY: Deno.env.get('DOCUSIGN_INTEGRATION_KEY'),
  DOCUSIGN_USER_ID: Deno.env.get('DOCUSIGN_USER_ID'),
  DOCUSIGN_ACCOUNT_ID: Deno.env.get('DOCUSIGN_ACCOUNT_ID'),
  DOCUSIGN_PRIVATE_KEY: Deno.env.get('DOCUSIGN_PRIVATE_KEY'),
};

function missing(name: string): never {
  throw new Error(`Missing required environment variable: ${name}`);
}

// Helper to validate optional services are configured
export const isServiceConfigured = {
  plaid: () => !!(env.PLAID_CLIENT_ID && env.PLAID_SECRET),
  bridgeFT: () => !!(env.BRIDGEFT_BASE_URL && env.BRIDGEFT_API_KEY),
  akoya: () => !!env.AKOYA_API_KEY,
  docusign: () => !!(env.DOCUSIGN_INTEGRATION_KEY && env.DOCUSIGN_USER_ID && env.DOCUSIGN_ACCOUNT_ID && env.DOCUSIGN_PRIVATE_KEY),
};

// Log service availability on startup (in dev mode)
console.log('[env] Services configured:', {
  plaid: isServiceConfigured.plaid(),
  bridgeFT: isServiceConfigured.bridgeFT(),
  akoya: isServiceConfigured.akoya(),
  docusign: isServiceConfigured.docusign(),
});