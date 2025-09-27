// Enhanced feature flags with environment & build protections
import def from '@/config/featureFlags.default.json';
import devFlags from '@/config/featureFlags.dev.json';
import stagingFlags from '@/config/featureFlags.staging.json';
import prodFlags from '@/config/featureFlags.prod.json';

export type FeatureFlag = keyof typeof def;

/* Environment & build flags (Vite) */
type PublicMode = 'staging' | 'prod';

const env = import.meta.env as Record<string, string | boolean | undefined>;
const toBool = (v: unknown) => v === true || v === 'true' || v === '1';

export const PUBLIC_MODE: PublicMode =
  (env.VITE_PUBLIC_MODE as PublicMode) || 'staging';

export const IS_PROD = PUBLIC_MODE === 'prod';
export const ENABLE_EXPERIMENTS = toBool(env.VITE_ENABLE_EXPERIMENTS) && !IS_PROD;
export const ENABLE_DEV_PANEL = toBool(env.VITE_ENABLE_DEV_PANEL) && !IS_PROD;

export const APP_NAME = (env.VITE_APP_NAME as string) || 'BFO Platform';

/* __BUILD_ID__ is provided by Vite define() at build time */
declare const __BUILD_ID__: string;
export const BUILD_ID = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev-local';

// Determine environment flags synchronously  
function getEnvironmentFlags() {
  const flavor = import.meta.env.VITE_BUILD_FLAVOR || import.meta.env.MODE;
  
  if (flavor === 'prod' || flavor === 'production') {
    return prodFlags;
  } else if (flavor === 'staging') {
    return stagingFlags;
  } else {
    return devFlags;
  }
}

function extend(base: any, ext: any) {
  const result = { ...base, ...ext };
  if (ext.__extends) { /* already merged via base file */ }
  return result;
}

// Initialize flags synchronously
const envFlags = getEnvironmentFlags();
export const flags = extend(def, envFlags);

// Admin panel can mutate runtime flag (does not persist file)
export function setFlag(key: string, value: boolean) {
  (flags as any)[key] = value;
  return flags;
}

export function getFlag(key: FeatureFlag): boolean {
  return flags[key];
}

export function getFlags(): typeof def {
  return flags;
}

export function resetFlags(): void {
  // Reset to original flags (remove any runtime overrides)
  Object.assign(flags, extend(def, envFlags));
}

// Environment info for admin panel
export function getBuildInfo() {
  return {
    flavor: import.meta.env.VITE_BUILD_FLAVOR || import.meta.env.MODE,
    mode: import.meta.env.MODE,
    timestamp: new Date().toISOString(),
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD
  };
}

// Flag descriptions for admin panel
export const FLAG_DESCRIPTIONS: Record<FeatureFlag, string> = {
  PUBLIC_DISCOVER_ENABLED: 'Show /discover page for unauthenticated users',
  SOLUTIONS_ENABLED: 'Enable /solutions/* routes and navigation',
  PUBLIC_CATALOG_ENABLED: 'Show catalog section on public pages',
  DEMOS_ENABLED: 'Enable /demos/* routes and demo functionality',
  PUBLIC_CTA_BAR: 'Show sticky call-to-action bar on public pages',
  TRUST_EXPLAINER_ENABLED: 'Show trust and verification explainer sections',
  ONBOARDING_PUBLIC_ENABLED: 'Allow public user onboarding flows',
  NIL_PUBLIC_ENABLED: 'Show /nil and /nil/index for unauthenticated users',
  NIL_AGENT_ENABLED: 'Enable NIL agent portal and functionality',
  NIL_SCHOOL_ENABLED: 'Enable NIL school portal and functionality',
  BRAND_PUBLIC_ENABLED: 'Enable brand and local business NIL onboarding',
  ADMIN_TOOLS_ENABLED: 'Show admin tools (panels, ready-check, etc.)',
  INSTALL_DEFAULT_TOOLS_ON_FIRST_LOGIN: 'Auto-install default tools for new users based on their persona',
  ANCHOR_ON_IMPORT: 'Enable blockchain anchoring for imported meetings',
  MEETING_IMPORT_ENABLED: 'Allow importing meetings from external platforms',
  CRYPTO_ENABLED: 'Enable crypto wallet management and portfolio tracking',
  CRYPTO_TRADE_ENABLED: 'Enable crypto trading functionality',
  CRYPTO_SELF_CUSTODY_ENABLED: 'Enable watch-only wallet support',
  CRYPTO_TAX_ENABLED: 'Enable crypto tax lot tracking and Form 8949 export',
  FAM_V1: 'Enable Family V1 enhanced dashboard features with receipt chips and readiness check',
  ADV_V1: 'Enable Advisor V1 enhanced fee compare with benchmark receipts and proof verification',
  IA_V2: 'Enable new information architecture with Families hub and Service Pros suite navigation',
  HEALTH_PUBLIC: 'Enable public health check endpoint'
};

// Hook to use feature flags
export function useFeatureFlag(flag: FeatureFlag): boolean {
  return getFlag(flag);
}