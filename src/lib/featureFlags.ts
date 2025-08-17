import * as React from "react";

// Feature flags with safe fallbacks
interface FeatureFlags {
  enableAdvancedAnalytics: boolean;
  enableBetaFeatures: boolean;
  enableDebugMode: boolean;
  enableExperimentalUI: boolean;
  enablePerformanceMonitoring: boolean;
  // Legacy feature flags for compatibility
  "dashboard.familyHero": boolean;
  "calc.monte": boolean;
  "guides.retirement": boolean;
  "guides.estatePlanning": boolean;
  "guides.taxPlanning": boolean;
}

const defaultFlags: FeatureFlags = {
  enableAdvancedAnalytics: true,
  enableBetaFeatures: false,
  enableDebugMode: false,
  enableExperimentalUI: false,
  enablePerformanceMonitoring: true,
  // Legacy flags default to true for backward compatibility
  "dashboard.familyHero": true,
  "calc.monte": true,
  "guides.retirement": true,
  "guides.estatePlanning": true,
  "guides.taxPlanning": true,
};

let cachedFlags: FeatureFlags | null = null;

export async function getFeatureFlags(): Promise<FeatureFlags> {
  if (cachedFlags) {
    return cachedFlags;
  }

  try {
    const response = await fetch('/feature-flags.json');
    if (!response.ok) {
      throw new Error('Failed to fetch feature flags');
    }
    const flags = await response.json();
    cachedFlags = { ...defaultFlags, ...flags };
    return cachedFlags;
  } catch (error) {
    console.warn('Failed to load feature flags, using defaults:', error);
    cachedFlags = defaultFlags;
    return cachedFlags;
  }
}

export function getFeatureFlagSync(key: keyof FeatureFlags): boolean {
  return cachedFlags?.[key] ?? defaultFlags[key];
}

export function isFeatureEnabled(key: keyof FeatureFlags): boolean {
  return getFeatureFlagSync(key);
}

// React hook for feature flags
export function useFeatureFlag(key: keyof FeatureFlags): boolean {
  const [isEnabled, setIsEnabled] = React.useState(() => getFeatureFlagSync(key));

  React.useEffect(() => {
    getFeatureFlags().then((flags) => {
      setIsEnabled(flags[key]);
    });
  }, [key]);

  return isEnabled;
}