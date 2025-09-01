interface FeatureFlags {
  families_tools_band?: boolean;
  pricing_gates?: boolean;
  consent_module?: boolean;
  nil_booking_v1?: boolean;
  DEMO_MODE?: boolean;
  VOICE_ENABLED?: boolean;
  HQ_BOOT?: boolean;
  IP_LEDGER?: boolean;
  PUBLISH_BATCH?: boolean;
  [key: string]: boolean | undefined;
}

// Demo-ready feature flags for investor presentation
const mockFlags: FeatureFlags = {
  families_tools_band: true,
  pricing_gates: true,
  consent_module: true,
  nil_booking_v1: true,
  DEMO_MODE: true,
  VOICE_ENABLED: false,
  HQ_BOOT: true,
  IP_LEDGER: true,
  PUBLISH_BATCH: true,
};

export function useFeatureFlags(): FeatureFlags {
  // In a real implementation, this would fetch from your feature flag service
  // For now, return mock flags
  return mockFlags;
}

export function isFeatureEnabled(flagKey: keyof FeatureFlags): boolean {
  return mockFlags[flagKey] ?? false;
}

export function useFeatureFlag(flagKey: keyof FeatureFlags): boolean {
  return useFeatureFlags()[flagKey] ?? false;
}