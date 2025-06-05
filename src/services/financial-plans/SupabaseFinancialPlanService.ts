
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
import { supabase } from "@/lib/supabase";

export class SupabaseFinancialPlanService implements FinancialPlanService {
  
  async getPlans(): Promise<FinancialPlan[]> {
    try {
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

      if (error) throw error;

      return (plans || []).map(this.mapSupabasePlanToFinancialPlan);
    } catch (error) {
      console.error('Error fetching financial plans:', error);
      return [];
    }
  }

  async getPlanById(id: string): Promise<FinancialPlan | null> {
    try {
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

      if (error) throw error;
      if (!plan) return null;

      return this.mapSupabasePlanToFinancialPlan(plan);
    } catch (error) {
      console.error('Error fetching financial plan:', error);
      return null;
    }
  }

  async createPlan(planData: Partial<FinancialPlan>): Promise<FinancialPlan> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: plan, error } = await supabase
        .from('financial_plans')
        .insert({
          user_id: user.id,
          name: planData.name || 'New Plan',
          status: planData.status || 'draft',
          is_draft: planData.isDraft ?? true,
          is_active: planData.isActive ?? false,
          is_favorite: planData.isFavorite ?? false,
          success_rate: planData.successRate ?? 0,
          draft_data: planData.draftData || {},
          step: planData.step ?? 1
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapSupabasePlanToFinancialPlan(plan);
    } catch (error) {
      console.error('Error creating financial plan:', error);
      throw error;
    }
  }

  async updatePlan(id: string, planData: Partial<FinancialPlan>): Promise<FinancialPlan | null> {
    try {
      const { data: plan, error } = await supabase
        .from('financial_plans')
        .update({
          name: planData.name,
          status: planData.status,
          is_draft: planData.isDraft,
          is_active: planData.isActive,
          is_favorite: planData.isFavorite,
          success_rate: planData.successRate,
          draft_data: planData.draftData,
          step: planData.step,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!plan) return null;

      return this.mapSupabasePlanToFinancialPlan(plan);
    } catch (error) {
      console.error('Error updating financial plan:', error);
      throw error;
    }
  }

  async deletePlan(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('financial_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting financial plan:', error);
      return false;
    }
  }

  async saveDraft(draftData: any): Promise<FinancialPlan> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: plan, error } = await supabase
        .from('financial_plans')
        .insert({
          user_id: user.id,
          name: draftData.name || 'Draft Plan',
          status: 'draft',
          is_draft: true,
          is_active: false,
          draft_data: draftData,
          step: draftData.step || 1
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapSupabasePlanToFinancialPlan(plan);
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  }

  async getPlansSummary(): Promise<FinancialPlansSummary> {
    try {
      const { data: plans, error } = await supabase
        .from('financial_plans')
        .select('status, success_rate, financial_goals(*)');

      if (error) throw error;

      const activePlans = (plans || []).filter(p => p.status === 'active').length;
      const draftPlans = (plans || []).filter(p => p.status === 'draft').length;
      const totalGoals = (plans || []).reduce((acc, plan) => acc + (plan.financial_goals?.length || 0), 0);
      const averageSuccessRate = (plans || []).reduce((acc, plan) => acc + (plan.success_rate || 0), 0) / Math.max(plans?.length || 1, 1);

      return {
        activePlans,
        draftPlans,
        totalGoals,
        averageSuccessRate
      };
    } catch (error) {
      console.error('Error fetching plans summary:', error);
      return {
        activePlans: 0,
        draftPlans: 0,
        totalGoals: 0,
        averageSuccessRate: 0
      };
    }
  }

  async updateGoal(planId: string, goal: FinancialGoal): Promise<boolean> {
    try {
      const { data: existingGoal } = await supabase
        .from('financial_goals')
        .select('id')
        .eq('id', goal.id)
        .eq('plan_id', planId)
        .single();

      if (existingGoal) {
        // Update existing goal
        const { error } = await supabase
          .from('financial_goals')
          .update({
            title: goal.title,
            description: goal.description,
            target_amount: goal.targetAmount,
            current_amount: goal.currentAmount,
            target_date: goal.targetDate.toISOString(),
            priority: goal.priority,
            is_complete: goal.isComplete || false,
            updated_at: new Date().toISOString()
          })
          .eq('id', goal.id)
          .eq('plan_id', planId);

        if (error) throw error;
      } else {
        // Create new goal
        const { error } = await supabase
          .from('financial_goals')
          .insert({
            id: goal.id,
            plan_id: planId,
            title: goal.title,
            description: goal.description,
            target_amount: goal.targetAmount,
            current_amount: goal.currentAmount,
            target_date: goal.targetDate.toISOString(),
            priority: goal.priority,
            is_complete: goal.isComplete || false
          });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error updating goal:', error);
      return false;
    }
  }

  async setActivePlan(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First, set all plans for this user to inactive
      await supabase
        .from('financial_plans')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Then set the specified plan to active
      const { error } = await supabase
        .from('financial_plans')
        .update({ is_active: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error setting active plan:', error);
      throw error;
    }
  }

  async addExpense(planId: string, expense: Omit<Expense, "id">): Promise<Expense> {
    try {
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

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        amount: data.amount,
        type: data.expense_type,
        period: data.period,
        owner: data.owner
      };
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  async updateExpense(planId: string, expenseId: string, data: Partial<Expense>): Promise<Expense | null> {
    try {
      const { data: expense, error } = await supabase
        .from('plan_expenses')
        .update({
          name: data.name,
          amount: data.amount,
          expense_type: data.type,
          period: data.period,
          owner: data.owner,
          updated_at: new Date().toISOString()
        })
        .eq('id', expenseId)
        .eq('plan_id', planId)
        .select()
        .single();

      if (error) throw error;
      if (!expense) return null;

      return {
        id: expense.id,
        name: expense.name,
        amount: expense.amount,
        type: expense.expense_type,
        period: expense.period,
        owner: expense.owner
      };
    } catch (error) {
      console.error('Error updating expense:', error);
      return null;
    }
  }

  async deleteExpense(planId: string, expenseId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('plan_expenses')
        .delete()
        .eq('id', expenseId)
        .eq('plan_id', planId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      return false;
    }
  }

  async toggleFavorite(id: string): Promise<void> {
    try {
      const { data: plan } = await supabase
        .from('financial_plans')
        .select('is_favorite')
        .eq('id', id)
        .single();

      if (plan) {
        const { error } = await supabase
          .from('financial_plans')
          .update({ is_favorite: !plan.is_favorite })
          .eq('id', id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  async duplicatePlan(id: string): Promise<FinancialPlan | null> {
    try {
      const originalPlan = await this.getPlanById(id);
      if (!originalPlan) return null;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: newPlan, error } = await supabase
        .from('financial_plans')
        .insert({
          user_id: user.id,
          name: `${originalPlan.name} (Copy)`,
          status: 'draft',
          is_draft: true,
          is_active: false,
          is_favorite: false,
          success_rate: originalPlan.successRate,
          draft_data: originalPlan.draftData,
          step: originalPlan.step
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapSupabasePlanToFinancialPlan(newPlan);
    } catch (error) {
      console.error('Error duplicating plan:', error);
      return null;
    }
  }

  private mapSupabasePlanToFinancialPlan(plan: any): FinancialPlan {
    return {
      id: plan.id,
      name: plan.name,
      owner: '', // This might need to be fetched from profiles table
      createdAt: new Date(plan.created_at),
      updatedAt: new Date(plan.updated_at),
      isDraft: plan.is_draft,
      isActive: plan.is_active,
      isFavorite: plan.is_favorite,
      successRate: plan.success_rate || 0,
      status: plan.status as 'Draft' | 'Active' | 'Archived',
      goals: (plan.financial_goals || []).map((goal: any) => ({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        targetAmount: goal.target_amount,
        currentAmount: goal.current_amount,
        targetDate: new Date(goal.target_date),
        priority: goal.priority as 'Low' | 'Medium' | 'High',
        isComplete: goal.is_complete
      })),
      accounts: (plan.financial_accounts || []).map((account: any) => ({
        id: account.id,
        name: account.name,
        type: account.account_type as 'Checking' | 'Savings' | 'Investment' | 'Retirement' | 'Other',
        balance: account.balance,
        isSelected: account.is_selected
      })),
      expenses: (plan.plan_expenses || []).map((expense: any) => ({
        id: expense.id,
        name: expense.name,
        amount: expense.amount,
        type: expense.expense_type,
        period: expense.period,
        owner: expense.owner
      })),
      income: (plan.plan_income || []).map((income: any) => ({
        id: income.id,
        source: income.source,
        amount: income.amount,
        frequency: income.frequency as 'Monthly' | 'Annual',
        isPassive: income.is_passive
      })),
      savings: (plan.plan_savings || []).map((saving: any) => ({
        id: saving.id,
        accountId: saving.account_id,
        amount: saving.amount,
        frequency: saving.frequency as 'Monthly' | 'Annual'
      })),
      insurance: (plan.plan_insurance || []).map((insurance: any) => ({
        id: insurance.id,
        type: insurance.insurance_type,
        provider: insurance.provider,
        premium: insurance.premium,
        coverage: insurance.coverage
      })),
      draftData: plan.draft_data,
      step: plan.step
    };
  }
}
