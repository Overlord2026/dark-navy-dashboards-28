
import { supabase } from "@/lib/supabase";
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
import { toast } from "sonner";

export class SupabaseFinancialPlanService implements FinancialPlanService {
  
  async getPlans(): Promise<FinancialPlan[]> {
    const { data: plans, error } = await supabase
      .from('financial_plans')
      .select(`
        *,
        financial_goals(*),
        financial_accounts(*),
        plan_expenses(*),
        plan_income(*),
        plan_savings(*),
        plan_insurance(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching financial plans:', error);
      throw new Error(`Failed to fetch financial plans: ${error.message}`);
    }

    return (plans || []).map(this.mapPlanFromDatabase);
  }

  async getPlanById(id: string): Promise<FinancialPlan | null> {
    const { data: plan, error } = await supabase
      .from('financial_plans')
      .select(`
        *,
        financial_goals(*),
        financial_accounts(*),
        plan_expenses(*),
        plan_income(*),
        plan_savings(*),
        plan_insurance(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching financial plan:', error);
      throw new Error(`Failed to fetch financial plan: ${error.message}`);
    }

    return plan ? this.mapPlanFromDatabase(plan) : null;
  }

  async createPlan(planData: Partial<FinancialPlan>): Promise<FinancialPlan> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: plan, error } = await supabase
      .from('financial_plans')
      .insert({
        user_id: user.id,
        name: planData.name || 'Untitled Plan',
        status: planData.isDraft ? 'draft' : 'active',
        is_favorite: planData.isFavorite || false,
        success_rate: planData.successRate || 0,
        is_active: planData.isActive || false,
        is_draft: planData.isDraft || true,
        draft_data: planData.draftData || null,
        step: planData.step || 1
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating financial plan:', error);
      throw new Error(`Failed to create financial plan: ${error.message}`);
    }

    // Create goals if provided
    if (planData.goals && planData.goals.length > 0) {
      await this.createGoalsForPlan(plan.id, planData.goals);
    }

    return this.mapPlanFromDatabase({ ...plan, financial_goals: planData.goals || [] });
  }

  async updatePlan(id: string, planData: Partial<FinancialPlan>): Promise<FinancialPlan | null> {
    const updateData: any = {};
    
    if (planData.name !== undefined) updateData.name = planData.name;
    if (planData.status !== undefined) updateData.status = planData.status;
    if (planData.isFavorite !== undefined) updateData.is_favorite = planData.isFavorite;
    if (planData.successRate !== undefined) updateData.success_rate = planData.successRate;
    if (planData.isActive !== undefined) updateData.is_active = planData.isActive;
    if (planData.isDraft !== undefined) updateData.is_draft = planData.isDraft;
    if (planData.draftData !== undefined) updateData.draft_data = planData.draftData;
    if (planData.step !== undefined) updateData.step = planData.step;

    const { data: plan, error } = await supabase
      .from('financial_plans')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating financial plan:', error);
      throw new Error(`Failed to update financial plan: ${error.message}`);
    }

    return plan ? this.mapPlanFromDatabase(plan) : null;
  }

  async deletePlan(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('financial_plans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting financial plan:', error);
      throw new Error(`Failed to delete financial plan: ${error.message}`);
    }

    return true;
  }

  async saveDraft(draftData: any): Promise<FinancialPlan> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: plan, error } = await supabase
      .from('financial_plans')
      .insert({
        user_id: user.id,
        name: draftData.name || 'Draft Plan',
        status: 'draft',
        is_draft: true,
        draft_data: draftData,
        step: draftData.currentStep || 1
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving draft:', error);
      throw new Error(`Failed to save draft: ${error.message}`);
    }

    return this.mapPlanFromDatabase(plan);
  }

  async getPlansSummary(): Promise<FinancialPlansSummary> {
    const { data: plans, error } = await supabase
      .from('financial_plans')
      .select('status, success_rate, financial_goals(*)');

    if (error) {
      console.error('Error fetching plans summary:', error);
      throw new Error(`Failed to fetch plans summary: ${error.message}`);
    }

    const activePlans = plans?.filter(p => p.status === 'active').length || 0;
    const draftPlans = plans?.filter(p => p.status === 'draft').length || 0;
    const totalGoals = plans?.reduce((acc, plan) => acc + (plan.financial_goals?.length || 0), 0) || 0;
    const averageSuccessRate = plans?.length > 0 
      ? plans.reduce((acc, plan) => acc + (plan.success_rate || 0), 0) / plans.length 
      : 0;

    return {
      activePlans,
      draftPlans,
      totalGoals,
      averageSuccessRate
    };
  }

  async updateGoal(planId: string, goal: FinancialGoal): Promise<boolean> {
    const { error } = await supabase
      .from('financial_goals')
      .upsert({
        id: goal.id,
        plan_id: planId,
        title: goal.title,
        description: goal.description,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount,
        target_date: goal.targetDate.toISOString().split('T')[0],
        priority: goal.priority.toLowerCase(),
        is_complete: goal.isComplete
      });

    if (error) {
      console.error('Error updating goal:', error);
      throw new Error(`Failed to update goal: ${error.message}`);
    }

    return true;
  }

  async setActivePlan(id: string): Promise<void> {
    // First, set all plans to inactive
    await supabase
      .from('financial_plans')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

    // Then set the specific plan to active
    const { error } = await supabase
      .from('financial_plans')
      .update({ is_active: true })
      .eq('id', id);

    if (error) {
      console.error('Error setting active plan:', error);
      throw new Error(`Failed to set active plan: ${error.message}`);
    }
  }

  async addExpense(planId: string, expense: Omit<Expense, "id">): Promise<Expense> {
    const { data, error } = await supabase
      .from('plan_expenses')
      .insert({
        plan_id: planId,
        name: expense.name,
        amount: expense.amount,
        expense_type: expense.type,
        period: expense.period,
        owner: expense.owner
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding expense:', error);
      throw new Error(`Failed to add expense: ${error.message}`);
    }

    return this.mapExpenseFromDatabase(data);
  }

  async updateExpense(planId: string, expenseId: string, data: Partial<Expense>): Promise<Expense | null> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.type !== undefined) updateData.expense_type = data.type;
    if (data.period !== undefined) updateData.period = data.period;
    if (data.owner !== undefined) updateData.owner = data.owner;

    const { data: expense, error } = await supabase
      .from('plan_expenses')
      .update(updateData)
      .eq('id', expenseId)
      .eq('plan_id', planId)
      .select()
      .single();

    if (error) {
      console.error('Error updating expense:', error);
      throw new Error(`Failed to update expense: ${error.message}`);
    }

    return expense ? this.mapExpenseFromDatabase(expense) : null;
  }

  async deleteExpense(planId: string, expenseId: string): Promise<boolean> {
    const { error } = await supabase
      .from('plan_expenses')
      .delete()
      .eq('id', expenseId)
      .eq('plan_id', planId);

    if (error) {
      console.error('Error deleting expense:', error);
      throw new Error(`Failed to delete expense: ${error.message}`);
    }

    return true;
  }

  async toggleFavorite(id: string): Promise<void> {
    // First get the current state
    const { data: plan, error: fetchError } = await supabase
      .from('financial_plans')
      .select('is_favorite')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching plan for favorite toggle:', fetchError);
      throw new Error(`Failed to toggle favorite: ${fetchError.message}`);
    }

    // Toggle the favorite status
    const { error } = await supabase
      .from('financial_plans')
      .update({ is_favorite: !plan.is_favorite })
      .eq('id', id);

    if (error) {
      console.error('Error toggling favorite:', error);
      throw new Error(`Failed to toggle favorite: ${error.message}`);
    }
  }

  async duplicatePlan(id: string): Promise<FinancialPlan | null> {
    const originalPlan = await this.getPlanById(id);
    if (!originalPlan) return null;

    const duplicatedPlan = await this.createPlan({
      ...originalPlan,
      name: `${originalPlan.name} (Copy)`,
      isActive: false,
      isFavorite: false
    });

    return duplicatedPlan;
  }

  private async createGoalsForPlan(planId: string, goals: FinancialGoal[]): Promise<void> {
    const goalsData = goals.map(goal => ({
      plan_id: planId,
      title: goal.title,
      description: goal.description,
      target_amount: goal.targetAmount,
      current_amount: goal.currentAmount,
      target_date: goal.targetDate.toISOString().split('T')[0],
      priority: goal.priority.toLowerCase(),
      is_complete: goal.isComplete || false
    }));

    const { error } = await supabase
      .from('financial_goals')
      .insert(goalsData);

    if (error) {
      console.error('Error creating goals:', error);
      throw new Error(`Failed to create goals: ${error.message}`);
    }
  }

  private mapPlanFromDatabase(dbPlan: any): FinancialPlan {
    return {
      id: dbPlan.id,
      name: dbPlan.name,
      owner: 'User', // This could be fetched from profiles table if needed
      createdAt: new Date(dbPlan.created_at),
      updatedAt: new Date(dbPlan.updated_at),
      isDraft: dbPlan.is_draft,
      isActive: dbPlan.is_active,
      isFavorite: dbPlan.is_favorite,
      successRate: dbPlan.success_rate || 0,
      status: dbPlan.status === 'active' ? 'Active' : 'Draft',
      goals: (dbPlan.financial_goals || []).map(this.mapGoalFromDatabase),
      accounts: (dbPlan.financial_accounts || []).map(this.mapAccountFromDatabase),
      expenses: (dbPlan.plan_expenses || []).map(this.mapExpenseFromDatabase),
      income: (dbPlan.plan_income || []).map(this.mapIncomeFromDatabase),
      savings: (dbPlan.plan_savings || []).map(this.mapSavingFromDatabase),
      insurance: (dbPlan.plan_insurance || []).map(this.mapInsuranceFromDatabase),
      draftData: dbPlan.draft_data,
      step: dbPlan.step
    };
  }

  private mapGoalFromDatabase(dbGoal: any): FinancialGoal {
    return {
      id: dbGoal.id,
      title: dbGoal.title,
      description: dbGoal.description,
      targetAmount: Number(dbGoal.target_amount),
      currentAmount: Number(dbGoal.current_amount),
      targetDate: new Date(dbGoal.target_date),
      priority: dbGoal.priority.charAt(0).toUpperCase() + dbGoal.priority.slice(1) as 'Low' | 'Medium' | 'High',
      isComplete: dbGoal.is_complete
    };
  }

  private mapAccountFromDatabase(dbAccount: any): FinancialAccount {
    return {
      id: dbAccount.id,
      name: dbAccount.name,
      type: dbAccount.account_type as any,
      balance: Number(dbAccount.balance),
      isSelected: dbAccount.is_selected
    };
  }

  private mapExpenseFromDatabase(dbExpense: any): Expense {
    return {
      id: dbExpense.id,
      name: dbExpense.name,
      amount: Number(dbExpense.amount),
      type: dbExpense.expense_type as any,
      period: dbExpense.period as any,
      owner: dbExpense.owner
    };
  }

  private mapIncomeFromDatabase(dbIncome: any): Income {
    return {
      id: dbIncome.id,
      source: dbIncome.source,
      amount: Number(dbIncome.amount),
      frequency: dbIncome.frequency as any,
      isPassive: dbIncome.is_passive
    };
  }

  private mapSavingFromDatabase(dbSaving: any): Saving {
    return {
      id: dbSaving.id,
      accountId: dbSaving.account_id,
      amount: Number(dbSaving.amount),
      frequency: dbSaving.frequency as any
    };
  }

  private mapInsuranceFromDatabase(dbInsurance: any): Insurance {
    return {
      id: dbInsurance.id,
      type: dbInsurance.insurance_type,
      provider: dbInsurance.provider,
      premium: Number(dbInsurance.premium),
      coverage: Number(dbInsurance.coverage)
    };
  }
}
