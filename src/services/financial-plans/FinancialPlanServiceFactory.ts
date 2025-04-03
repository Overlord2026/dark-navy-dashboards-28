import { FinancialPlanService } from "./FinancialPlanService";
import { LocalFinancialPlanService } from "./LocalFinancialPlanService";
import { getFeatureFlagService } from "../featureFlagService";

/**
 * Service implementation type.
 * LOCAL: Uses localStorage for persistence (development/testing)
 * API: Uses external API (production) - to be implemented later
 */
export type ServiceImplementation = 'LOCAL' | 'API';

/**
 * Factory to get the appropriate implementation of FinancialPlanService.
 * This allows switching between different implementations (local storage vs API)
 * with minimal changes to the consuming code.
 */
export class FinancialPlanServiceFactory {
  private static instance: FinancialPlanService;
  private static implementation: ServiceImplementation = 'LOCAL';

  /**
   * Get the current service implementation
   */
  static getService(): FinancialPlanService {
    // Check feature flags to determine which implementation to use
    const featureFlags = getFeatureFlagService();
    
    // Use local storage if the feature flag is enabled, regardless of the set implementation
    if (featureFlags.isEnabled('USE_LOCAL_STORAGE')) {
      return new LocalFinancialPlanService();
    }
    
    // Otherwise use the configured implementation
    if (!this.instance || this.shouldRecreateInstance()) {
      this.createService();
    }
    
    return this.instance;
  }

  /**
   * Set the service implementation to use
   */
  static setImplementation(impl: ServiceImplementation): void {
    this.implementation = impl;
    this.createService();
  }
  
  /**
   * Determine if we need to recreate the instance based on feature flags
   */
  private static shouldRecreateInstance(): boolean {
    const featureFlags = getFeatureFlagService();
    const useApi = featureFlags.isEnabled('ENABLE_API_INTEGRATION');
    
    // If API integration is enabled but we're using local, or vice versa, recreate
    return (useApi && this.implementation === 'LOCAL') || 
           (!useApi && this.implementation === 'API');
  }

  /**
   * Create the appropriate service implementation
   */
  private static createService(): void {
    const featureFlags = getFeatureFlagService();
    
    if (featureFlags.isEnabled('USE_LOCAL_STORAGE')) {
      this.instance = new LocalFinancialPlanService();
      return;
    }
    
    switch (this.implementation) {
      case 'LOCAL':
        this.instance = new LocalFinancialPlanService();
        break;
      case 'API':
        // Only use API if the feature flag is enabled
        if (featureFlags.isEnabled('ENABLE_API_INTEGRATION')) {
          // To be implemented when API integration is ready
          // this.instance = new ApiFinancialPlanService();
          this.instance = new LocalFinancialPlanService(); // Fallback until API implementation is ready
          console.warn('API implementation is not yet available, using local implementation as fallback');
        } else {
          this.instance = new LocalFinancialPlanService();
          console.info('API integration is disabled by feature flag, using local implementation');
        }
        break;
    }
  }
}

/**
 * Convenience hook to get the current financial plan service
 */
export const getFinancialPlanService = (): FinancialPlanService => {
  return FinancialPlanServiceFactory.getService();
};
