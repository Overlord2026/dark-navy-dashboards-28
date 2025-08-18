interface FeatureFlags {
  families_tools_band?: boolean;
  pricing_gates?: boolean;
  consent_module?: boolean;
  nil_booking_v1?: boolean;
  [key: string]: boolean | undefined;
}

// Mock feature flags - in real app this would come from a service like LaunchDarkly
const mockFlags: FeatureFlags = {
  families_tools_band: true,
  pricing_gates: true,
  consent_module: true,
  nil_booking_v1: true,
};

export function useFeatureFlags(): FeatureFlags {
  // In a real implementation, this would fetch from your feature flag service
  // For now, return mock flags
  return mockFlags;
}

export function isFeatureEnabled(flagKey: keyof FeatureFlags): boolean {
  return mockFlags[flagKey] ?? false;
}