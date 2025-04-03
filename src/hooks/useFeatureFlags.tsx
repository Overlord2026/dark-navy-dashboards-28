
import { useState, useEffect, useCallback } from 'react';
import { FeatureFlag, FeatureFlagConfig, Environment } from '@/types/featureFlags';
import { getFeatureFlagService, FeatureFlagService } from '@/services/featureFlagService';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function useFeatureFlags() {
  const service = getFeatureFlagService();
  const [flags, setFlags] = useState<FeatureFlagConfig>(service.getAllFlags());
  const [environment, setEnvironment] = useState<Environment>(service.getEnvironment());
  
  // Update state when flags change
  const refreshFlags = useCallback(() => {
    setFlags(service.getAllFlags());
  }, []);
  
  // Check if a feature is enabled
  const isEnabled = useCallback((flag: FeatureFlag): boolean => {
    return service.isEnabled(flag);
  }, [service]);
  
  // Enable a specific feature
  const enableFeature = useCallback((flag: FeatureFlag): void => {
    service.enable(flag);
    refreshFlags();
  }, [service, refreshFlags]);
  
  // Disable a specific feature
  const disableFeature = useCallback((flag: FeatureFlag): void => {
    service.disable(flag);
    refreshFlags();
  }, [service, refreshFlags]);
  
  // Toggle a feature
  const toggleFeature = useCallback((flag: FeatureFlag): boolean => {
    const newState = service.toggle(flag);
    refreshFlags();
    return newState;
  }, [service, refreshFlags]);
  
  // Reset all flags to defaults
  const resetToDefaults = useCallback((): void => {
    service.resetToDefaults();
    refreshFlags();
  }, [service, refreshFlags]);
  
  return {
    flags,
    environment,
    isEnabled,
    enableFeature,
    disableFeature,
    toggleFeature,
    resetToDefaults
  };
}
