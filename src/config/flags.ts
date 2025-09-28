// Primary feature flags - simple, no circular references
export const FLAGS = {
  // Agent automation flags
  __ENABLE_AGENT_AUTOMATIONS__: false,
  __REQUIRE_APPROVAL_HIGH_RISK__: true,
  
  // Toggle to render the Legacy section on the pricing page
  legacyBeta: true,

  // Gate advanced vault UX for families during beta
  legacyAdvancedEnabled: false
} as const;

// Legacy exports for backward compatibility - no circular references
export const DEMO_MODE = true;
export const VOICE_ENABLED = false;
export const HQ_BOOT = true;
export const IP_LEDGER = true;
export const PUBLISH_BATCH = true;

// Agent automation flags (deprecated - use FLAGS instead) - use direct values
export const __ENABLE_AGENT_AUTOMATIONS__ = false;
export const __REQUIRE_APPROVAL_HIGH_RISK__ = true;

// Runtime configuration based on flags - avoid import.meta.env during init
export const CONFIG = {
  DEMO_MODE,
  VOICE_ENABLED,
  HQ_BOOT,
  IP_LEDGER,
  PUBLISH_BATCH,
  __ENABLE_AGENT_AUTOMATIONS__: false,
  __REQUIRE_APPROVAL_HIGH_RISK__: true,
  
  // Demo-specific settings
  USE_FIXTURES: DEMO_MODE,
  MOCK_NETWORK_CALLS: DEMO_MODE,
  DISABLE_LIVE_CONNECTORS: DEMO_MODE,
  
  // Environment detection - lazy evaluation to avoid module init issues
  get IS_DEVELOPMENT() { return import.meta.env.DEV; },
  get IS_PRODUCTION() { return import.meta.env.PROD; },
} as const;

export type FeatureFlags = typeof CONFIG;

// keep default for code that may import default
export default FLAGS;
