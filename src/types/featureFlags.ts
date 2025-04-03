
/**
 * Type definitions for the feature flag system
 */

/**
 * Feature flag identifiers
 * Add new feature flags here as needed for phased development
 */
export type FeatureFlag = 
  | 'USE_LOCAL_STORAGE'
  | 'ENABLE_DIAGNOSTICS' 
  | 'ENABLE_API_INTEGRATION'
  | 'ENABLE_ADVANCED_ANALYTICS'
  | 'ENABLE_THIRD_PARTY_INTEGRATIONS'
  | 'ENABLE_MARKETPLACE_FEATURES'
  | 'ENABLE_TAX_PLANNING_TOOLS';

/**
 * Feature flag configuration for the application
 */
export interface FeatureFlagConfig {
  [key: string]: boolean;
}

/**
 * Environment types for configuration
 */
export type Environment = 'development' | 'staging' | 'production';
