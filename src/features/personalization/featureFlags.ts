export const featureFlags = {
  // Personalization features
  personalizationEnabled: true,
  tierBasedAccess: true,
  receiptAuditing: true,
  
  // Dashboard features
  dynamicDashboardOrder: true,
  personaSpecificWidgets: true,
  complexityBasedUI: true,
  
  // Advanced features
  familyOfficeMode: true,
  advancedReporting: true,
  multiEntityView: true,
  
  // Debug features
  debugPersonalization: false,
  showTierReceipts: false,
  analyticsStubs: true
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag];
}

export function enableFeature(flag: FeatureFlag): void {
  // In a real app, this would update the feature flag service
  (featureFlags as any)[flag] = true;
  console.log(`Feature enabled: ${flag}`);
}

export function disableFeature(flag: FeatureFlag): void {
  // In a real app, this would update the feature flag service
  (featureFlags as any)[flag] = false;
  console.log(`Feature disabled: ${flag}`);
}

// Feature flag helper hook
export function useFeatureFlag(flag: FeatureFlag): boolean {
  return isFeatureEnabled(flag);
}