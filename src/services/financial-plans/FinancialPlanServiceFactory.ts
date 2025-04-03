
import { FinancialPlanService } from './FinancialPlanService';
import { LocalFinancialPlanService } from './LocalFinancialPlanService';
import { ApiFinancialPlanService } from './ApiFinancialPlanService';
import { getConfigService } from '../configService';
import { getFeatureFlagService } from '../featureFlagService';

/**
 * Factory class to create the appropriate FinancialPlanService implementation
 * based on current environment and feature flags
 */
export class FinancialPlanServiceFactory {
  /**
   * Get the appropriate service implementation based on environment and feature flags
   */
  static getService(): FinancialPlanService {
    const configService = getConfigService();
    const featureFlagService = getFeatureFlagService();
    
    // If local services are enabled by configuration or API integration is disabled by feature flag,
    // return the local implementation
    if (
      configService.shouldUseLocalServices() ||
      !featureFlagService.isEnabled('ENABLE_API_INTEGRATION')
    ) {
      return new LocalFinancialPlanService();
    }
    
    // Otherwise, return the API implementation
    return new ApiFinancialPlanService();
  }
}

/**
 * Helper function to get the financial plan service instance
 * This is the function that is being imported by other modules
 */
export const getFinancialPlanService = (): FinancialPlanService => {
  return FinancialPlanServiceFactory.getService();
};
