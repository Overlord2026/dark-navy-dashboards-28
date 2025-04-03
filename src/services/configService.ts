
import { FeatureFlag } from '@/types/featureFlags';

export type Environment = 'development' | 'staging' | 'production';

export interface AppConfig {
  useLocalServices: boolean;
  diagnosticsEnabled: boolean;
  apiEndpoints: Record<string, string>;
  featureFlags: Record<FeatureFlag, boolean>;
}

// Default configurations for different environments
const ENVIRONMENT_CONFIGS: Record<Environment, AppConfig> = {
  development: {
    useLocalServices: true,
    diagnosticsEnabled: true,
    apiEndpoints: {
      base: 'http://localhost:3000/api',
      auth: 'http://localhost:3000/api/auth',
      data: 'http://localhost:3000/api/data',
      analytics: 'http://localhost:3000/api/analytics'
    },
    featureFlags: {
      USE_LOCAL_STORAGE: true,
      ENABLE_DIAGNOSTICS: true,
      ENABLE_API_INTEGRATION: false,
      ENABLE_ADVANCED_ANALYTICS: false,
      ENABLE_THIRD_PARTY_INTEGRATIONS: false,
      ENABLE_MARKETPLACE_FEATURES: false,
      ENABLE_TAX_PLANNING_TOOLS: false
    }
  },
  staging: {
    useLocalServices: false,
    diagnosticsEnabled: true,
    apiEndpoints: {
      base: 'https://staging-api.example.com/api',
      auth: 'https://staging-api.example.com/api/auth',
      data: 'https://staging-api.example.com/api/data',
      analytics: 'https://staging-api.example.com/api/analytics'
    },
    featureFlags: {
      USE_LOCAL_STORAGE: false,
      ENABLE_DIAGNOSTICS: true,
      ENABLE_API_INTEGRATION: true,
      ENABLE_ADVANCED_ANALYTICS: true,
      ENABLE_THIRD_PARTY_INTEGRATIONS: false,
      ENABLE_MARKETPLACE_FEATURES: true,
      ENABLE_TAX_PLANNING_TOOLS: true
    }
  },
  production: {
    useLocalServices: false,
    diagnosticsEnabled: false,
    apiEndpoints: {
      base: 'https://api.example.com/api',
      auth: 'https://api.example.com/api/auth',
      data: 'https://api.example.com/api/data',
      analytics: 'https://api.example.com/api/analytics'
    },
    featureFlags: {
      USE_LOCAL_STORAGE: false,
      ENABLE_DIAGNOSTICS: false,
      ENABLE_API_INTEGRATION: true,
      ENABLE_ADVANCED_ANALYTICS: true,
      ENABLE_THIRD_PARTY_INTEGRATIONS: true,
      ENABLE_MARKETPLACE_FEATURES: true,
      ENABLE_TAX_PLANNING_TOOLS: true
    }
  }
};

/**
 * Configuration service to manage environment-specific settings
 */
export class ConfigService {
  private static instance: ConfigService;
  private currentEnvironment: Environment;
  private config: AppConfig;
  
  private constructor() {
    this.currentEnvironment = this.detectEnvironment();
    this.config = { ...ENVIRONMENT_CONFIGS[this.currentEnvironment] };
  }
  
  private detectEnvironment(): Environment {
    // In a real application, this would detect the actual environment
    // from window.location.hostname, environment variables, or build flags
    const hostname = window.location.hostname;
    
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'development';
    } else if (hostname.includes('staging') || hostname.includes('test')) {
      return 'staging';
    }
    
    return 'production';
  }
  
  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }
  
  /**
   * Get the current environment
   */
  public getEnvironment(): Environment {
    return this.currentEnvironment;
  }
  
  /**
   * Get the full configuration for the current environment
   */
  public getConfig(): AppConfig {
    return { ...this.config };
  }
  
  /**
   * Get a specific configuration value
   */
  public getValue<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }
  
  /**
   * Get an API endpoint URL
   */
  public getApiEndpoint(name: keyof AppConfig['apiEndpoints']): string {
    return this.config.apiEndpoints[name] || this.config.apiEndpoints.base;
  }
  
  /**
   * Check if local services should be used instead of API calls
   */
  public shouldUseLocalServices(): boolean {
    return this.config.useLocalServices;
  }
  
  /**
   * Check if diagnostics are enabled
   */
  public areDiagnosticsEnabled(): boolean {
    return this.config.diagnosticsEnabled;
  }
  
  /**
   * Get the feature flag configuration
   */
  public getFeatureFlags(): Record<FeatureFlag, boolean> {
    return { ...this.config.featureFlags };
  }
  
  /**
   * Override specific configuration values (useful for testing)
   */
  public override<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.config[key] = value;
  }
}

/**
 * Get the singleton instance of the config service
 */
export const getConfigService = (): ConfigService => {
  return ConfigService.getInstance();
};

/**
 * Helper function to get configuration for a specific environment
 */
export function getConfig(env: Environment): AppConfig {
  return { ...ENVIRONMENT_CONFIGS[env] };
}

/**
 * Helper function to get the current environment's configuration
 */
export function getCurrentConfig(): AppConfig {
  return getConfigService().getConfig();
}
