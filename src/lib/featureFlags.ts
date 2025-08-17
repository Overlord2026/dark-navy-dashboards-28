// Feature flags with safe fallbacks
interface FeatureFlags {
  enableAdvancedAnalytics: boolean;
  enableBetaFeatures: boolean;
  enableDebugMode: boolean;
  enableExperimentalUI: boolean;
  enablePerformanceMonitoring: boolean;
}

const defaultFlags: FeatureFlags = {
  enableAdvancedAnalytics: true,
  enableBetaFeatures: false,
  enableDebugMode: false,
  enableExperimentalUI: false,
  enablePerformanceMonitoring: true,
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