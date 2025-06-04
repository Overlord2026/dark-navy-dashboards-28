
import { FinancialPlanService } from "./FinancialPlanService";
import { LocalFinancialPlanService } from "./LocalFinancialPlanService";
import { SupabaseFinancialPlanService } from "./SupabaseFinancialPlanService";

/**
 * Service implementation type.
 * LOCAL: Uses localStorage for persistence (development/testing)
 * SUPABASE: Uses Supabase backend (production)
 */
export type ServiceImplementation = 'LOCAL' | 'SUPABASE';

/**
 * Factory to get the appropriate implementation of FinancialPlanService.
 * This allows switching between different implementations (local storage vs Supabase)
 * with minimal changes to the consuming code.
 */
export class FinancialPlanServiceFactory {
  private static instance: FinancialPlanService;
  private static implementation: ServiceImplementation = 'SUPABASE';

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
      case 'SUPABASE':
        this.instance = new SupabaseFinancialPlanService();
        break;
    }
  }
}

/**
 * Convenience function to get the current financial plan service
 */
export const getFinancialPlanService = (): FinancialPlanService => {
  return FinancialPlanServiceFactory.getService();
};
