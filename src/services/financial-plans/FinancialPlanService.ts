
import { 
  FinancialPlan, 
  FinancialGoal, 
  FinancialAccount, 
  Expense, 
  Income, 
  Saving, 
  Insurance,
  FinancialPlansSummary
} from "@/types/financial-plan";

/**
 * Interface defining operations for financial plan management.
 * This provides a consistent API regardless of the underlying implementation
 * (local storage, external API, etc.)
 */
export interface FinancialPlanService {
  /**
   * Get all financial plans for the current user
   */
  getPlans(): Promise<FinancialPlan[]>;
  
  /**
   * Get a single financial plan by ID
   */
  getPlanById(id: string): Promise<FinancialPlan | null>;
  
  /**
   * Create a new financial plan
   */
  createPlan(planData: Partial<FinancialPlan>): Promise<FinancialPlan>;
  
  /**
   * Update an existing financial plan
   */
  updatePlan(id: string, planData: Partial<FinancialPlan>): Promise<FinancialPlan | null>;
  
  /**
   * Delete a financial plan
   */
  deletePlan(id: string): Promise<boolean>;
  
  /**
   * Save a draft financial plan
   */
  saveDraft(draftData: any): Promise<FinancialPlan>;
  
  /**
   * Get a summary of all financial plans
   */
  getPlansSummary(): Promise<FinancialPlansSummary>;
  
  /**
   * Update a financial goal within a plan
   */
  updateGoal(planId: string, goal: FinancialGoal): Promise<boolean>;
  
  /**
   * Set the active financial plan
   */
  setActivePlan(id: string): Promise<void>;
  
  /**
   * Add an expense to a financial plan
   */
  addExpense(planId: string, expense: Omit<Expense, "id">): Promise<Expense>;
  
  /**
   * Update an expense in a financial plan
   */
  updateExpense(planId: string, expenseId: string, data: Partial<Expense>): Promise<Expense | null>;
  
  /**
   * Delete an expense from a financial plan
   */
  deleteExpense(planId: string, expenseId: string): Promise<boolean>;
  
  /**
   * Toggle whether a plan is a favorite
   */
  toggleFavorite(id: string): Promise<void>;
  
  /**
   * Duplicate a plan
   */
  duplicatePlan(id: string): Promise<FinancialPlan | null>;
}
