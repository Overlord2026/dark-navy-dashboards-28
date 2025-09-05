export const DEMO_MODE = true;
export const VOICE_ENABLED = false;
export const HQ_BOOT = true;
export const IP_LEDGER = true;
export const PUBLISH_BATCH = true;

// Runtime configuration based on flags
export const CONFIG = {
  DEMO_MODE,
  VOICE_ENABLED,
  HQ_BOOT,
  IP_LEDGER,
  PUBLISH_BATCH,
  
  // Demo-specific settings
  USE_FIXTURES: DEMO_MODE,
  MOCK_NETWORK_CALLS: DEMO_MODE,
  DISABLE_LIVE_CONNECTORS: DEMO_MODE,
  
  // Environment detection
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

export type FeatureFlags = typeof CONFIG;