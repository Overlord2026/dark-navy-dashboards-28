
import { FinancialPlanService } from "./FinancialPlanService";
import { LocalFinancialPlanService } from "./LocalFinancialPlanService";

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
    if (!this.instance) {
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
   * Create the appropriate service implementation
   */
  private static createService(): void {
    switch (this.implementation) {
      case 'LOCAL':
        this.instance = new LocalFinancialPlanService();
        break;
      case 'API':
        // To be implemented when API integration is ready
        // this.instance = new ApiFinancialPlanService();
        this.instance = new LocalFinancialPlanService(); // Fallback until API implementation is ready
        console.warn('API implementation is not yet available, using local implementation as fallback');
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
