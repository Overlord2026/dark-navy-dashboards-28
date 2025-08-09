// Feature flags for AI Marketing Engine
export const USE_SUPABASE_MARKETING = false; // Switch to true when Supabase is ready
export const MARKETING_DRY_RUN = true; // Prevents real API calls to ad platforms
export const ENABLE_MARKETING_MODULE = true; // Master switch for the entire module

// Marketing-specific feature flags
export const MARKETING_FEATURES = {
  AB_TESTING: true,
  COMPLIANCE_AUTOMATION: true,
  MULTI_CHANNEL_CAMPAIGNS: true,
  BUDGET_MONITORING: true,
  AUDIT_EXPORTS: true,
} as const;

// Channel availability
export const ENABLED_CHANNELS = {
  FACEBOOK: true,
  LINKEDIN: true,
  GOOGLE: true,
  YOUTUBE: true,
  EMAIL: true,
  SMS: true,
} as const;