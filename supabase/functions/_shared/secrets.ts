/**
 * Shared secrets management for Edge Functions
 * 
 * This module validates and provides access to environment variables
 * used across all Edge Functions. Crashes early with clear messages
 * if required secrets are missing.
 */

// Required environment variables (will crash if missing)
const REQUIRED_SECRETS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
] as const;

// Optional environment variables (graceful fallback if missing)
const OPTIONAL_SECRETS = [
  'PLAID_CLIENT_ID',
  'PLAID_SECRET', 
  'BRIDGEFT_BASE_URL',
  'BRIDGEFT_API_KEY',
  'AKOYA_API_KEY',
  'DOCUSIGN_BASE_URL',
  'DOCUSIGN_ACCOUNT_ID', 
  'DOCUSIGN_INTEGRATOR_KEY',
  'DOCUSIGN_USER_ID',
  'DOCUSIGN_PRIVATE_KEY',
  'REPORTS_BUCKET',
  'OPENAI_API_KEY',
  'CANOE_API_KEY',
  'ICAPITAL_API_KEY'
] as const;

type RequiredSecret = typeof REQUIRED_SECRETS[number];
type OptionalSecret = typeof OPTIONAL_SECRETS[number];
type SecretKey = RequiredSecret | OptionalSecret;

interface SecretsConfig {
  // Required secrets
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  
  // Optional secrets (may be undefined)
  PLAID_CLIENT_ID?: string;
  PLAID_SECRET?: string;
  BRIDGEFT_BASE_URL?: string;
  BRIDGEFT_API_KEY?: string;
  AKOYA_API_KEY?: string;
  DOCUSIGN_BASE_URL?: string;
  DOCUSIGN_ACCOUNT_ID?: string;
  DOCUSIGN_INTEGRATOR_KEY?: string;
  DOCUSIGN_USER_ID?: string;
  DOCUSIGN_PRIVATE_KEY?: string;
  REPORTS_BUCKET?: string;
  OPENAI_API_KEY?: string;
  CANOE_API_KEY?: string;
  ICAPITAL_API_KEY?: string;
}

class SecretsManager {
  private config: SecretsConfig;
  private validated = false;

  constructor() {
    this.config = {} as SecretsConfig;
  }

  /**
   * Validates and loads all secrets from environment variables
   * Crashes with clear error message if required secrets are missing
   */
  validate(): void {
    const missing: string[] = [];
    const loaded: string[] = [];

    // Check required secrets
    for (const secret of REQUIRED_SECRETS) {
      const value = Deno.env.get(secret);
      if (!value) {
        missing.push(secret);
      } else {
        (this.config as any)[secret] = value;
        loaded.push(secret);
      }
    }

    // Load optional secrets (no validation)
    for (const secret of OPTIONAL_SECRETS) {
      const value = Deno.env.get(secret);
      if (value) {
        (this.config as any)[secret] = value;
        loaded.push(secret);
      }
    }

    // Crash if required secrets are missing
    if (missing.length > 0) {
      const errorMessage = [
        '🚨 EDGE FUNCTION STARTUP FAILED 🚨',
        '',
        'Missing required environment variables:',
        ...missing.map(s => `  ❌ ${s}`),
        '',
        'Please set these secrets in your Supabase project:',
        '1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/functions',
        '2. Add the missing environment variables',
        '3. Redeploy the function',
        '',
        'For more info, see: README.md "Secrets & Security" section'
      ].join('\n');

      console.error(errorMessage);
      throw new Error(`Missing required secrets: ${missing.join(', ')}`);
    }

    this.validated = true;
    
    console.log(`✅ Secrets loaded: ${loaded.length} total (${REQUIRED_SECRETS.length} required, ${loaded.length - REQUIRED_SECRETS.length} optional)`);
  }

  /**
   * Gets a secret value by key
   * Throws error if secret is required but missing
   */
  get<T extends SecretKey>(key: T): T extends RequiredSecret ? string : string | undefined {
    if (!this.validated) {
      this.validate();
    }

    const value = this.config[key];
    
    if (REQUIRED_SECRETS.includes(key as RequiredSecret) && !value) {
      throw new Error(`Required secret ${key} is missing`);
    }

    return value as any;
  }

  /**
   * Gets all secrets as a config object
   */
  getAll(): SecretsConfig {
    if (!this.validated) {
      this.validate();
    }
    return { ...this.config };
  }

  /**
   * Checks if an optional secret is available
   */
  has(key: OptionalSecret): boolean {
    if (!this.validated) {
      this.validate();
    }
    return !!this.config[key];
  }

  /**
   * Lists all available secrets (for debugging)
   */
  list(): { required: string[], optional: string[] } {
    if (!this.validated) {
      this.validate();
    }

    return {
      required: REQUIRED_SECRETS.filter(key => !!this.config[key]),
      optional: OPTIONAL_SECRETS.filter(key => !!this.config[key])
    };
  }
}

// Export singleton instance
export const secrets = new SecretsManager();

// Export types for use in other modules
export type { SecretsConfig, RequiredSecret, OptionalSecret, SecretKey };