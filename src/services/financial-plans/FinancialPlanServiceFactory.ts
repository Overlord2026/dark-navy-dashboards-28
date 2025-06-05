
import { FinancialPlanService } from "./FinancialPlanService";
import { SupabaseFinancialPlanService } from "./SupabaseFinancialPlanService";

/**
 * Factory function to get the appropriate financial plan service implementation.
 * This allows for easy switching between different implementations (localStorage, Supabase, etc.)
 */
export function getFinancialPlanService(): FinancialPlanService {
  // Return Supabase implementation by default
  return new SupabaseFinancialPlanService();
}
