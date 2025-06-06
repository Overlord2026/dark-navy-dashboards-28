
import { FinancialPlan, FinancialGoal, Expense, FinancialPlansSummary } from "@/types/financial-plan";

export interface FinancialPlanService {
  getPlans(): Promise<FinancialPlan[]>;
  getPlanById(id: string): Promise<FinancialPlan | null>;
  createPlan(planData: Partial<FinancialPlan>): Promise<FinancialPlan>;
  updatePlan(id: string, planData: Partial<FinancialPlan>): Promise<FinancialPlan | null>;
  deletePlan(id: string): Promise<boolean>;
  saveDraft(draftData: any): Promise<FinancialPlan>;
  getPlansSummary(): Promise<FinancialPlansSummary>;
  updateGoal(planId: string, goal: FinancialGoal): Promise<boolean>;
  deleteGoal(planId: string, goalId: string): Promise<boolean>;
  setActivePlan(id: string): Promise<void>;
  addExpense(planId: string, expense: Omit<Expense, "id">): Promise<Expense>;
  updateExpense(planId: string, expenseId: string, data: Partial<Expense>): Promise<Expense | null>;
  deleteExpense(planId: string, expenseId: string): Promise<boolean>;
  toggleFavorite(id: string): Promise<void>;
  duplicatePlan(id: string): Promise<FinancialPlan | null>;
}
