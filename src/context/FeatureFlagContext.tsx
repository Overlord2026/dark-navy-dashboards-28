
import React, { createContext, useContext, ReactNode } from 'react';
import { FeatureFlag, FeatureFlagConfig, Environment } from '@/types/featureFlags';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

interface FeatureFlagContextType {
  flags: FeatureFlagConfig;
  environment: Environment;
  isEnabled: (flag: FeatureFlag) => boolean;
  enableFeature: (flag: FeatureFlag) => void;
  disableFeature: (flag: FeatureFlag) => void;
  toggleFeature: (flag: FeatureFlag) => boolean;
  resetToDefaults: () => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const featureFlags = useFeatureFlags();
  
  return (
    <FeatureFlagContext.Provider value={featureFlags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlagContext() {
  const context = useContext(FeatureFlagContext);
  
  if (context === undefined) {
    throw new Error('useFeatureFlagContext must be used within a FeatureFlagProvider');
  }
  
  return context;
}
