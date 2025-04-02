
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
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
import { FinancialPlanService } from "./FinancialPlanService";
import { logger } from "../logging/loggingService";

/**
 * Implementation of FinancialPlanService that uses localStorage for persistence.
 * This serves as a stub for the actual API implementation that will be added later.
 */
export class LocalFinancialPlanService implements FinancialPlanService {
  private readonly STORAGE_KEY = "financial-plans";
  private readonly ACTIVE_PLAN_KEY = "active-financial-plan";
  private plans: FinancialPlan[] = [];
  private activePlanId: string | null = null;

  constructor() {
    this.loadPlans();
  }

  /**
   * Load plans from localStorage
   */
  private loadPlans(): void {
    try {
      const storedPlans = localStorage.getItem(this.STORAGE_KEY);
      this.plans = storedPlans ? JSON.parse(storedPlans) : [];
      
      // Convert string dates back to Date objects
      this.plans = this.plans.map(plan => ({
        ...plan,
        createdAt: new Date(plan.createdAt),
        updatedAt: new Date(plan.updatedAt),
        goals: plan.goals?.map(goal => ({
          ...goal,
          targetDate: new Date(goal.targetDate)
        })) || []
      }));
      
      const storedActivePlanId = localStorage.getItem(this.ACTIVE_PLAN_KEY);
      this.activePlanId = storedActivePlanId;
      
      logger.info("Loaded financial plans from localStorage", { count: this.plans.length });
    } catch (error) {
      logger.error("Error loading financial plans from localStorage", error);
      this.plans = [];
      this.activePlanId = null;
    }
  }

  /**
   * Save plans to localStorage
   */
  private savePlans(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.plans));
      if (this.activePlanId) {
        localStorage.setItem(this.ACTIVE_PLAN_KEY, this.activePlanId);
      }
      logger.info("Saved financial plans to localStorage", { count: this.plans.length });
    } catch (error) {
      logger.error("Error saving financial plans to localStorage", error);
      toast.error("Error saving financial plans");
    }
  }

  /**
   * Initialize with sample data if empty
   */
  async initializeWithSampleData(): Promise<void> {
    if (this.plans.length === 0) {
      const samplePlan: FinancialPlan = {
        id: uuidv4(),
        name: "My First Financial Plan",
        owner: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
        isDraft: false,
        isActive: true,
        isFavorite: true,
        successRate: 78,
        status: 'Active',
        goals: [
          { 
            id: uuidv4(), 
            title: "Retirement", 
            targetDate: new Date(2045, 0, 1), 
            targetAmount: 1500000, 
            currentAmount: 350000,
            priority: "High" 
          },
          { 
            id: uuidv4(), 
            title: "College Fund", 
            targetDate: new Date(2030, 0, 1), 
            targetAmount: 120000, 
            currentAmount: 25000,
            priority: "Medium" 
          }
        ],
        accounts: [
          { id: uuidv4(), name: "Checking Account", type: "Checking", balance: 5000 },
          { id: uuidv4(), name: "Savings Account", type: "Savings", balance: 25000 },
          { id: uuidv4(), name: "401(k)", type: "Retirement", balance: 120000 }
        ],
        expenses: []
      };
      
      this.plans = [samplePlan];
      this.activePlanId = samplePlan.id;
      this.savePlans();
    }
  }

  async getPlans(): Promise<FinancialPlan[]> {
    await this.initializeWithSampleData();
    return this.plans;
  }

  async getPlanById(id: string): Promise<FinancialPlan | null> {
    await this.initializeWithSampleData();
    return this.plans.find(plan => plan.id === id) || null;
  }

  async createPlan(planData: Partial<FinancialPlan>): Promise<FinancialPlan> {
    const now = new Date();
    const newPlan: FinancialPlan = {
      id: uuidv4(),
      name: planData.name || "Untitled Plan",
      owner: planData.owner || "User",
      createdAt: now,
      updatedAt: now,
      isDraft: planData.isDraft || false,
      isActive: !planData.isDraft,
      isFavorite: planData.isFavorite || false,
      successRate: planData.successRate || Math.floor(Math.random() * 60) + 40,
      status: planData.isDraft ? 'Draft' : 'Active',
      goals: planData.goals || [],
      accounts: planData.accounts || [],
      expenses: planData.expenses || [],
      income: planData.income || [],
      savings: planData.savings || [],
      insurance: planData.insurance || [],
      draftData: planData.draftData,
      step: planData.step
    };
    
    // If creating a non-draft plan, set all other plans to inactive
    if (!newPlan.isDraft) {
      this.plans = this.plans.map(p => ({ ...p, isActive: false }));
      this.activePlanId = newPlan.id;
    }
    
    this.plans.push(newPlan);
    this.savePlans();
    
    toast.success(newPlan.isDraft ? "Draft saved" : "Plan created successfully");
    return newPlan;
  }

  async updatePlan(id: string, planData: Partial<FinancialPlan>): Promise<FinancialPlan | null> {
    const planIndex = this.plans.findIndex(p => p.id === id);
    if (planIndex === -1) {
      toast.error("Plan not found");
      return null;
    }
    
    const updatedPlan: FinancialPlan = {
      ...this.plans[planIndex],
      ...planData,
      updatedAt: new Date()
    };
    
    this.plans[planIndex] = updatedPlan;
    this.savePlans();
    
    toast.success("Plan updated");
    return updatedPlan;
  }

  async deletePlan(id: string): Promise<boolean> {
    const planIndex = this.plans.findIndex(p => p.id === id);
    if (planIndex === -1) {
      toast.error("Plan not found");
      return false;
    }
    
    this.plans.splice(planIndex, 1);
    
    // If we deleted the active plan, set a new active plan
    if (id === this.activePlanId && this.plans.length > 0) {
      this.activePlanId = this.plans[0].id;
    }
    
    this.savePlans();
    toast.success("Plan deleted");
    
    return true;
  }

  async saveDraft(draftData: any): Promise<FinancialPlan> {
    // If updating an existing draft
    if (draftData.draftId) {
      const updatedPlan = await this.updatePlan(draftData.draftId, { 
        draftData,
        step: draftData.currentStep || 1,
        name: draftData.name || "Untitled Draft",
        goals: draftData.goals || [],
        accounts: draftData.accounts || [],
        expenses: draftData.expenses || []
      });
      
      if (updatedPlan) {
        return updatedPlan;
      }
    }
    
    // Creating a new draft
    return this.createPlan({
      name: draftData.name || "Untitled Draft",
      isDraft: true,
      status: 'Draft',
      successRate: 0,
      draftData,
      step: draftData.currentStep || 1,
      goals: draftData.goals || [],
      accounts: draftData.accounts || [],
      expenses: draftData.expenses || []
    });
  }

  async getPlansSummary(): Promise<FinancialPlansSummary> {
    await this.initializeWithSampleData();
    
    return {
      activePlans: this.plans.filter(p => p.status === 'Active').length,
      draftPlans: this.plans.filter(p => p.status === 'Draft').length,
      totalGoals: this.plans.reduce((sum, plan) => sum + (plan.goals?.length || 0), 0),
      averageSuccessRate: this.plans.length > 0 
        ? this.plans.reduce((sum, plan) => sum + plan.successRate, 0) / this.plans.length
        : 0
    };
  }

  async updateGoal(planId: string, goal: FinancialGoal): Promise<boolean> {
    const planIndex = this.plans.findIndex(p => p.id === planId);
    if (planIndex === -1) {
      toast.error("Plan not found");
      return false;
    }
    
    const plan = { ...this.plans[planIndex] };
    const goals = [...(plan.goals || [])];
    
    // Update or add the goal
    const goalIndex = goals.findIndex(g => g.id === goal.id);
    if (goalIndex >= 0) {
      goals[goalIndex] = goal;
    } else {
      // If it's a new goal, generate an ID
      if (!goal.id) {
        goal.id = uuidv4();
      }
      goals.push(goal);
    }
    
    plan.goals = goals;
    plan.updatedAt = new Date();
    
    this.plans[planIndex] = plan;
    this.savePlans();
    
    toast.success("Goal updated");
    return true;
  }

  async setActivePlan(id: string): Promise<void> {
    const plan = this.plans.find(p => p.id === id);
    if (!plan) {
      toast.error("Plan not found");
      return;
    }
    
    if (plan.status === 'Draft') {
      toast.error("Cannot set a draft as the active plan");
      return;
    }
    
    this.activePlanId = id;
    this.plans = this.plans.map(p => ({
      ...p,
      isActive: p.id === id
    }));
    
    this.savePlans();
  }

  async addExpense(planId: string, expense: Omit<Expense, "id">): Promise<Expense> {
    const plan = this.plans.find(p => p.id === planId);
    if (!plan) {
      toast.error("Plan not found");
      throw new Error("Plan not found");
    }
    
    const newExpense: Expense = {
      ...expense,
      id: uuidv4()
    };
    
    const updatedExpenses = [...(plan.expenses || []), newExpense];
    
    plan.expenses = updatedExpenses;
    plan.updatedAt = new Date();
    
    this.savePlans();
    
    return newExpense;
  }

  async updateExpense(planId: string, expenseId: string, data: Partial<Expense>): Promise<Expense | null> {
    const plan = this.plans.find(p => p.id === planId);
    if (!plan) {
      toast.error("Plan not found");
      throw new Error("Plan not found");
    }
    
    const expenses = plan.expenses || [];
    const expenseIndex = expenses.findIndex(e => e.id === expenseId);
    if (expenseIndex === -1) {
      toast.error("Expense not found");
      return null;
    }
    
    const updatedExpense = {
      ...expenses[expenseIndex],
      ...data
    };
    
    const updatedExpenses = [...expenses];
    updatedExpenses[expenseIndex] = updatedExpense;
    
    plan.expenses = updatedExpenses;
    plan.updatedAt = new Date();
    
    this.savePlans();
    
    return updatedExpense;
  }

  async deleteExpense(planId: string, expenseId: string): Promise<boolean> {
    const plan = this.plans.find(p => p.id === planId);
    if (!plan) {
      toast.error("Plan not found");
      throw new Error("Plan not found");
    }
    
    const expenses = plan.expenses || [];
    const updatedExpenses = expenses.filter(e => e.id !== expenseId);
    
    if (updatedExpenses.length === expenses.length) {
      toast.error("Expense not found");
      return false;
    }
    
    plan.expenses = updatedExpenses;
    plan.updatedAt = new Date();
    
    this.savePlans();
    toast.success("Expense deleted");
    
    return true;
  }

  async toggleFavorite(id: string): Promise<void> {
    const plan = this.plans.find(p => p.id === id);
    if (!plan) {
      toast.error("Plan not found");
      return;
    }
    
    plan.isFavorite = !plan.isFavorite;
    plan.updatedAt = new Date();
    
    this.savePlans();
  }

  async duplicatePlan(id: string): Promise<FinancialPlan | null> {
    const planToDuplicate = this.plans.find(plan => plan.id === id);
    if (!planToDuplicate) {
      toast.error("Plan not found");
      return null;
    }
    
    const duplicatedPlan: FinancialPlan = {
      ...planToDuplicate,
      id: uuidv4(),
      name: `${planToDuplicate.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      isActive: false
    };
    
    this.plans.push(duplicatedPlan);
    this.savePlans();
    
    toast.success(`Plan "${duplicatedPlan.name}" created successfully`);
    
    return duplicatedPlan;
  }
}
