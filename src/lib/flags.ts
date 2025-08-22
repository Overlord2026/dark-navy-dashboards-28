// Minimal feature flags implementation with environment inheritance
import def from '@/config/featureFlags.default.json';

let envFlags: any;
try {
  const flavor = import.meta.env.VITE_BUILD_FLAVOR || import.meta.env.MODE; // 'dev'|'staging'|'prod'
  envFlags = (flavor === 'prod')
    ? (await import('@/config/featureFlags.prod.json')).default
    : (flavor === 'staging')
      ? (await import('@/config/featureFlags.staging.json')).default
      : (await import('@/config/featureFlags.dev.json')).default;
} catch { 
  envFlags = {}; 
}

function extend(base: any, ext: any) {
  const result = { ...base, ...ext };
  if (ext.__extends) { /* already merged via base file */ }
  return result;
}

export const flags = extend(def, envFlags);

export type FeatureFlag = keyof typeof def;

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
  ADMIN_TOOLS_ENABLED: 'Show admin tools (panels, ready-check, etc.)'
};