
import { FeatureFlag, FeatureFlagConfig, Environment } from '@/types/featureFlags';
import { getConfigService } from './configService';

// Default configuration for each environment
const DEFAULT_CONFIGS: Record<Environment, FeatureFlagConfig> = {
  development: {
    USE_LOCAL_STORAGE: true,
    ENABLE_DIAGNOSTICS: true,
    ENABLE_API_INTEGRATION: false,
    ENABLE_ADVANCED_ANALYTICS: false,
    ENABLE_THIRD_PARTY_INTEGRATIONS: false,
    ENABLE_MARKETPLACE_FEATURES: false,
    ENABLE_TAX_PLANNING_TOOLS: false
  },
  staging: {
    USE_LOCAL_STORAGE: false,
    ENABLE_DIAGNOSTICS: true,
    ENABLE_API_INTEGRATION: true,
    ENABLE_ADVANCED_ANALYTICS: true,
    ENABLE_THIRD_PARTY_INTEGRATIONS: false,
    ENABLE_MARKETPLACE_FEATURES: true,
    ENABLE_TAX_PLANNING_TOOLS: true
  },
  production: {
    USE_LOCAL_STORAGE: false,
    ENABLE_DIAGNOSTICS: false,
    ENABLE_API_INTEGRATION: true,
    ENABLE_ADVANCED_ANALYTICS: true,
    ENABLE_THIRD_PARTY_INTEGRATIONS: true,
    ENABLE_MARKETPLACE_FEATURES: true,
    ENABLE_TAX_PLANNING_TOOLS: true
  }
};

// Detection of current environment
const getCurrentEnvironment = (): Environment => {
  return getConfigService().getEnvironment();
};

/**
 * Service for managing feature flags
 */
export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private config: FeatureFlagConfig;
  private environment: Environment;
  
  private constructor() {
    const configService = getConfigService();
    this.environment = configService.getEnvironment();
    
    // Start with the default config for the current environment
    this.config = { ...DEFAULT_CONFIGS[this.environment] };
    
    // Override with any flags from the config service
    const configFlags = configService.getFeatureFlags();
    this.config = { ...this.config, ...configFlags };
    
    // Load any overrides from localStorage
    try {
      const storedOverrides = localStorage.getItem('feature-flags-override');
      if (storedOverrides) {
        const overrides = JSON.parse(storedOverrides);
        this.config = { ...this.config, ...overrides };
      }
    } catch (e) {
      console.error('Error loading feature flag overrides:', e);
    }
  }
  
  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }
  
  /**
   * Check if a feature is enabled
   */
  public isEnabled(flag: FeatureFlag): boolean {
    return this.config[flag] === true;
  }
  
  /**
   * Enable a specific feature flag
   */
  public enable(flag: FeatureFlag): void {
    this.config[flag] = true;
    this.saveOverrides();
  }
  
  /**
   * Disable a specific feature flag
   */
  public disable(flag: FeatureFlag): void {
    this.config[flag] = false;
    this.saveOverrides();
  }
  
  /**
   * Toggle a feature flag
   */
  public toggle(flag: FeatureFlag): boolean {
    this.config[flag] = !this.config[flag];
    this.saveOverrides();
    return this.config[flag];
  }
  
  /**
   * Get the current environment
   */
  public getEnvironment(): Environment {
    return this.environment;
  }
  
  /**
   * Get all feature flags and their states
   */
  public getAllFlags(): FeatureFlagConfig {
    return { ...this.config };
  }
  
  /**
   * Reset all flags to default values for the current environment
   */
  public resetToDefaults(): void {
    this.config = { ...DEFAULT_CONFIGS[this.environment] };
    localStorage.removeItem('feature-flags-override');
  }
  
  /**
   * Save overrides to localStorage
   */
  private saveOverrides(): void {
    try {
      const defaultConfig = DEFAULT_CONFIGS[this.environment];
      const overrides: Record<string, boolean> = {};
      
      // Only save values that differ from the default
      Object.keys(this.config).forEach(key => {
        if (this.config[key] !== defaultConfig[key]) {
          overrides[key] = this.config[key];
        }
      });
      
      localStorage.setItem('feature-flags-override', JSON.stringify(overrides));
    } catch (e) {
      console.error('Error saving feature flag overrides:', e);
    }
  }
}

/**
 * Get the singleton instance of the feature flag service
 */
export const getFeatureFlagService = (): FeatureFlagService => {
  return FeatureFlagService.getInstance();
};
