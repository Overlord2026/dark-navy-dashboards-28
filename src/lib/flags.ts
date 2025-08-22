// Feature flags loader with environment inheritance support
import defaultFlags from '@/config/featureFlags.default.json';
import devFlags from '@/config/featureFlags.dev.json';
import stagingFlags from '@/config/featureFlags.staging.json';
import prodFlags from '@/config/featureFlags.prod.json';

export type FeatureFlag = keyof typeof defaultFlags;

type FlagConfig = typeof defaultFlags & { __extends?: string };

// Determine build flavor from environment
function getBuildFlavor(): 'dev' | 'staging' | 'prod' {
  const mode = import.meta.env.MODE;
  const flavor = import.meta.env.VITE_BUILD_FLAVOR;
  
  if (flavor && ['dev', 'staging', 'prod'].includes(flavor)) {
    return flavor as 'dev' | 'staging' | 'prod';
  }
  
  // Fallback based on MODE
  if (mode === 'production') return 'prod';
  if (mode === 'staging') return 'staging';
  return 'dev';
}

// Load and merge flag configs
function loadFlags(): typeof defaultFlags {
  const flavor = getBuildFlavor();
  const configs = {
    dev: devFlags,
    staging: stagingFlags,
    prod: prodFlags
  };
  
  const envConfig = configs[flavor] as FlagConfig;
  
  // If config extends default, merge them
  if (envConfig.__extends) {
    const { __extends, ...envOverrides } = envConfig;
    return { ...defaultFlags, ...envOverrides };
  }
  
  return envConfig as typeof defaultFlags;
}

// Initialize flags
let flags = loadFlags();

// In-memory flag overrides (for admin panel)
const flagOverrides: Partial<typeof defaultFlags> = {};

export function getFlags(): typeof defaultFlags {
  return { ...flags, ...flagOverrides };
}

export function getFlag(key: FeatureFlag): boolean {
  const allFlags = getFlags();
  return allFlags[key];
}

export function setFlag(key: FeatureFlag, value: boolean): void {
  flagOverrides[key] = value;
  // Trigger any listeners (for React updates)
  flagChangeListeners.forEach(listener => listener());
}

export function resetFlags(): void {
  Object.keys(flagOverrides).forEach(key => {
    delete flagOverrides[key as FeatureFlag];
  });
  flagChangeListeners.forEach(listener => listener());
}

// React hook support
const flagChangeListeners: (() => void)[] = [];

export function useFlagChanges(callback: () => void): void {
  flagChangeListeners.push(callback);
}

export function removeFlagChangeListener(callback: () => void): void {
  const index = flagChangeListeners.indexOf(callback);
  if (index > -1) {
    flagChangeListeners.splice(index, 1);
  }
}

// Hook for React components
export function useFeatureFlag(flag: FeatureFlag): boolean {
  const [value, setValue] = React.useState(() => getFlag(flag));
  
  React.useEffect(() => {
    const listener = () => setValue(getFlag(flag));
    useFlagChanges(listener);
    return () => removeFlagChangeListener(listener);
  }, [flag]);
  
  return value;
}

// Environment info
export function getBuildInfo() {
  return {
    flavor: getBuildFlavor(),
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

// Import React for hook
import React from 'react';