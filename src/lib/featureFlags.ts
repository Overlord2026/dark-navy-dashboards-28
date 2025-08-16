// Task 11: Feature Flags System
import { useState, useEffect } from 'react';

interface FeatureFlags {
  'nav.persona': boolean;
  'dashboard.familyHero': boolean;
  'calc.monte': boolean;
  'calc.rmd': boolean;
  'calc.socialSecurity': boolean;
  'guides.retirement': boolean;
  'guides.taxPlanning': boolean;
  'guides.estatePlanning': boolean;
  'pros.medicareRecordingBanner': boolean;
  'pros.complianceMode': boolean;
  'features.plaidIntegration': boolean;
  'features.docusignIntegration': boolean;
  'features.advancedReporting': boolean;
  'ui.experimentalDesign': boolean;
}

type FeatureFlagKey = keyof FeatureFlags;

let flagsCache: FeatureFlags | null = null;

// Load flags based on environment
async function loadFlags(): Promise<FeatureFlags> {
  if (flagsCache) {
    return flagsCache;
  }

  try {
    const env = import.meta.env.MODE || 'development';
    const flagsFile = env === 'production' ? '/config/flags.prod.json' : '/config/flags.dev.json';
    
    const response = await fetch(flagsFile);
    if (!response.ok) {
      throw new Error(`Failed to load flags: ${response.status}`);
    }
    
    flagsCache = await response.json();
    console.log('[feature-flags] Loaded flags for environment:', env, flagsCache);
    
    return flagsCache!;
  } catch (error) {
    console.warn('[feature-flags] Failed to load flags, using defaults:', error);
    
    // Default flags (all off for safety)
    flagsCache = {
      'nav.persona': false,
      'dashboard.familyHero': false,
      'calc.monte': false,
      'calc.rmd': false,
      'calc.socialSecurity': false,
      'guides.retirement': false,
      'guides.taxPlanning': false,
      'guides.estatePlanning': false,
      'pros.medicareRecordingBanner': false,
      'pros.complianceMode': true, // Default to compliant mode
      'features.plaidIntegration': false,
      'features.docusignIntegration': false,
      'features.advancedReporting': false,
      'ui.experimentalDesign': false,
    };
    
    return flagsCache;
  }
}

// Hook to use feature flags in components
export function useFeatureFlag(flagKey: FeatureFlagKey): boolean {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadFlags()
      .then(flags => {
        setIsEnabled(flags[flagKey] || false);
        setIsLoading(false);
      })
      .catch(() => {
        setIsEnabled(false);
        setIsLoading(false);
      });
  }, [flagKey]);

  return isLoading ? false : isEnabled;
}

// Hook to get all feature flags
export function useFeatureFlags(): { flags: FeatureFlags | null; isLoading: boolean } {
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadFlags()
      .then(loadedFlags => {
        setFlags(loadedFlags);
        setIsLoading(false);
      })
      .catch(() => {
        setFlags(null);
        setIsLoading(false);
      });
  }, []);

  return { flags, isLoading };
}

// Synchronous flag check (use after flags are loaded)
export function checkFlag(flagKey: FeatureFlagKey): boolean {
  if (!flagsCache) {
    console.warn(`[feature-flags] Flag ${flagKey} checked before flags loaded, returning false`);
    return false;
  }
  
  return flagsCache[flagKey] || false;
}

// Force reload flags (useful for admin interfaces)
export async function reloadFlags(): Promise<FeatureFlags> {
  flagsCache = null;
  return loadFlags();
}

// Type-safe flag checking with error handling
export function useFlag(flagKey: FeatureFlagKey, defaultValue: boolean = false): boolean {
  const [flagValue, setFlagValue] = useState<boolean>(defaultValue);

  useEffect(() => {
    loadFlags()
      .then(flags => setFlagValue(flags[flagKey] ?? defaultValue))
      .catch(() => setFlagValue(defaultValue));
  }, [flagKey, defaultValue]);

  return flagValue;
}