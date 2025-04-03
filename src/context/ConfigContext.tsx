
import React, { createContext, useContext, ReactNode } from 'react';
import { AppConfig, Environment, getConfigService } from '@/services/configService';

interface ConfigContextType {
  config: AppConfig;
  environment: Environment;
  isLocalMode: boolean;
  isDiagnosticsEnabled: boolean;
  getApiEndpoint: (name: keyof AppConfig['apiEndpoints']) => string;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const configService = getConfigService();
  const config = configService.getConfig();
  const environment = configService.getEnvironment();
  
  const contextValue: ConfigContextType = {
    config,
    environment,
    isLocalMode: configService.shouldUseLocalServices(),
    isDiagnosticsEnabled: configService.areDiagnosticsEnabled(),
    getApiEndpoint: (name) => configService.getApiEndpoint(name)
  };
  
  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  
  return context;
}

/**
 * Hook to get the current environment
 */
export function useEnvironment() {
  const { environment } = useConfig();
  return environment;
}

/**
 * Hook to check if the app is running in local mode
 */
export function useLocalMode() {
  const { isLocalMode } = useConfig();
  return isLocalMode;
}

/**
 * Hook to check if diagnostics are enabled
 */
export function useDiagnosticsEnabled() {
  const { isDiagnosticsEnabled } = useConfig();
  return isDiagnosticsEnabled;
}

/**
 * Hook to get an API endpoint
 */
export function useApiEndpoint(name: keyof AppConfig['apiEndpoints']) {
  const { getApiEndpoint } = useConfig();
  return getApiEndpoint(name);
}
