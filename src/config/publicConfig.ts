// Public UI feature flags configuration
// These can be overridden by environment variables

export const PUBLIC_CONFIG = {
  DISCOVER_ENABLED: import.meta.env.VITE_PUBLIC_DISCOVER_ENABLED !== 'false',
  SOLUTIONS_ENABLED: import.meta.env.VITE_SOLUTIONS_ENABLED !== 'false', 
  CATALOG_ENABLED: import.meta.env.VITE_PUBLIC_CATALOG_ENABLED !== 'false',
  DEMOS_ENABLED: import.meta.env.VITE_DEMOS_ENABLED !== 'false',
  CTA_BAR_ENABLED: import.meta.env.VITE_PUBLIC_CTA_BAR !== 'false',
  TRUST_EXPLAINER_ENABLED: import.meta.env.VITE_TRUST_EXPLAINER_ENABLED !== 'false',
} as const;

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (feature: keyof typeof PUBLIC_CONFIG): boolean => {
  return PUBLIC_CONFIG[feature];
};

// Helper to get all enabled features
export const getEnabledFeatures = (): string[] => {
  return Object.entries(PUBLIC_CONFIG)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature);
};

// Helper for conditional rendering
export const withFeatureFlag = <T,>(
  feature: keyof typeof PUBLIC_CONFIG,
  component: T,
  fallback: T | null = null
): T | null => {
  return isFeatureEnabled(feature) ? component : fallback;
};