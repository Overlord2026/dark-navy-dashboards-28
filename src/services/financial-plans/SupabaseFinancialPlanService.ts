
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

export class SupabaseFinancialPlanService implements FinancialPlanService {
  
  async getPlans(): Promise<FinancialPlan[]> {
    const { data: plans, error } = await supabase
      .from('financial_plans')
      .select(`
        *,
        financial_goals (
          id,
          title,
          description,
          target_amount,
          current_amount,
          target_date,
          priority,
          is_complete
        ),
        financial_accounts (
          id,
          name,
          account_type,
          balance,
          is_selected
        ),
        plan_expenses (
          id,
          name,
          amount,
          expense_type,
          period,
          owner
        ),
        plan_income (
          id,
          source,
          amount,
          frequency,
          is_passive
        ),
        plan_savings (
          id,
          account_id,
          amount,
          frequency
        ),
        plan_insurance (
          id,
          insurance_type,
          provider,
          premium,
          coverage
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching plans:', error);
      throw new Error(`Failed to fetch financial plans: ${error.message}`);
    }

    return (plans || []).map(this.mapPlanFromDatabase);
  }

  async getPlanById(id: string): Promise<FinancialPlan | null> {
    const { data: plan, error } = await supabase
      .from('financial_plans')
      .select(`
        *,
        financial_goals (
          id,
          title,
          description,
          target_amount,
          current_amount,
          target_date,
          priority,
          is_complete
        ),
        financial_accounts (
          id,
          name,
          account_type,
          balance,
          is_selected
        ),
        plan_expenses (
          id,
          name,
          amount,
          expense_type,
          period,
          owner
        ),
        plan_income (
          id,
          source,
          amount,
          frequency,
          is_passive
        ),
        plan_savings (
          id,
          account_id,
          amount,
          frequency
        ),
        plan_insurance (
          id,
          insurance_type,
          provider,
          premium,
          coverage
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching plan:', error);
      return null;
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
        status: planData.status || 'draft',
        is_favorite: planData.isFavorite || false,
        success_rate: planData.successRate || 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating plan:', error);
      throw new Error(`Failed to create financial plan: ${error.message}`);
    }

    // Create associated goals if provided
    if (planData.goals && planData.goals.length > 0) {
      await this.createGoalsForPlan(plan.id, planData.goals);
    }

    // Create associated accounts if provided
    if (planData.accounts && planData.accounts.length > 0) {
      await this.createAccountsForPlan(plan.id, planData.accounts);
    }

    // Create associated expenses if provided
    if (planData.expenses && planData.expenses.length > 0) {
      await this.createExpensesForPlan(plan.id, planData.expenses);
    }

    return this.mapPlanFromDatabase(plan);
  }

  async updatePlan(id: string, planData: Partial<FinancialPlan>): Promise<FinancialPlan | null> {
    const { data: plan, error } = await supabase
      .from('financial_plans')
      .update({
        name: planData.name,
        status: planData.status,
        is_favorite: planData.isFavorite,
        success_rate: planData.successRate
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating plan:', error);
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
      console.error('Error deleting plan:', error);
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
        is_favorite: false,
        success_rate: 0
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
      .select('status, financial_goals(id)');

    if (error) {
      console.error('Error fetching plans summary:', error);
      throw new Error(`Failed to fetch plans summary: ${error.message}`);
    }

    const activePlans = plans?.filter(p => p.status === 'active').length || 0;
    const draftPlans = plans?.filter(p => p.status === 'draft').length || 0;
    const totalGoals = plans?.reduce((acc, plan) => acc + (plan.financial_goals?.length || 0), 0) || 0;

    return {
      activePlans,
      draftPlans,
      totalGoals,
      averageSuccessRate: 0 // Calculate this based on actual success rates
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
        is_complete: goal.isComplete || false
      });

    if (error) {
      console.error('Error updating goal:', error);
      throw new Error(`Failed to update goal: ${error.message}`);
    }

    return true;
  }

  async setActivePlan(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, set all plans to inactive
    await supabase
      .from('financial_plans')
      .update({ status: 'draft' })
      .eq('user_id', user.id)
      .neq('status', 'archived');

    // Then set the selected plan to active
    const { error } = await supabase
      .from('financial_plans')
      .update({ status: 'active' })
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
        expense_type: expense.type.toLowerCase(),
        period: expense.period === 'Before Retirement' ? 'before_retirement' : 'after_retirement',
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
    const { data: expense, error } = await supabase
      .from('plan_expenses')
      .update({
        name: data.name,
        amount: data.amount,
        expense_type: data.type?.toLowerCase(),
        period: data.period === 'Before Retirement' ? 'before_retirement' : 'after_retirement',
        owner: data.owner
      })
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

      if (error) {
        console.error('Error toggling favorite:', error);
        throw new Error(`Failed to toggle favorite: ${error.message}`);
      }
    }
  }

  async duplicatePlan(id: string): Promise<FinancialPlan | null> {
    const originalPlan = await this.getPlanById(id);
    if (!originalPlan) return null;

    const duplicatedPlan = await this.createPlan({
      ...originalPlan,
      name: `${originalPlan.name} (Copy)`,
      isFavorite: false,
      status: 'draft'
    });

    return duplicatedPlan;
  }

  private mapPlanFromDatabase(dbPlan: any): FinancialPlan {
    return {
      id: dbPlan.id,
      name: dbPlan.name,
      owner: '', // We'll need to fetch user info separately if needed
      createdAt: new Date(dbPlan.created_at),
      updatedAt: new Date(dbPlan.updated_at),
      isDraft: dbPlan.status === 'draft',
      isActive: dbPlan.status === 'active',
      isFavorite: dbPlan.is_favorite,
      successRate: dbPlan.success_rate || 0,
      status: dbPlan.status === 'active' ? 'Active' : dbPlan.status === 'archived' ? 'Archived' : 'Draft',
      goals: (dbPlan.financial_goals || []).map(this.mapGoalFromDatabase),
      accounts: (dbPlan.financial_accounts || []).map(this.mapAccountFromDatabase),
      expenses: (dbPlan.plan_expenses || []).map(this.mapExpenseFromDatabase),
      income: (dbPlan.plan_income || []).map(this.mapIncomeFromDatabase),
      savings: (dbPlan.plan_savings || []).map(this.mapSavingFromDatabase),
      insurance: (dbPlan.plan_insurance || []).map(this.mapInsuranceFromDatabase)
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
      type: dbAccount.account_type.charAt(0).toUpperCase() + dbAccount.account_type.slice(1) as any,
      balance: Number(dbAccount.balance),
      isSelected: dbAccount.is_selected
    };
  }

  private mapExpenseFromDatabase(dbExpense: any): Expense {
    return {
      id: dbExpense.id,
      name: dbExpense.name,
      amount: Number(dbExpense.amount),
      type: dbExpense.expense_type.charAt(0).toUpperCase() + dbExpense.expense_type.slice(1) as any,
      period: dbExpense.period === 'before_retirement' ? 'Before Retirement' : 'After Retirement',
      owner: dbExpense.owner
    };
  }

  private mapIncomeFromDatabase(dbIncome: any): Income {
    return {
      id: dbIncome.id,
      source: dbIncome.source,
      amount: Number(dbIncome.amount),
      frequency: dbIncome.frequency.charAt(0).toUpperCase() + dbIncome.frequency.slice(1) as any,
      isPassive: dbIncome.is_passive
    };
  }

  private mapSavingFromDatabase(dbSaving: any): Saving {
    return {
      id: dbSaving.id,
      accountId: dbSaving.account_id,
      amount: Number(dbSaving.amount),
      frequency: dbSaving.frequency.charAt(0).toUpperCase() + dbSaving.frequency.slice(1) as any
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

  private async createGoalsForPlan(planId: string, goals: FinancialGoal[]) {
    const goalsToInsert = goals.map(goal => ({
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
      .insert(goalsToInsert);

    if (error) {
      console.error('Error creating goals:', error);
      throw new Error(`Failed to create goals: ${error.message}`);
    }
  }

  private async createAccountsForPlan(planId: string, accounts: FinancialAccount[]) {
    const accountsToInsert = accounts.map(account => ({
      plan_id: planId,
      name: account.name,
      account_type: account.type.toLowerCase(),
      balance: account.balance,
      is_selected: account.isSelected || false
    }));

    const { error } = await supabase
      .from('financial_accounts')
      .insert(accountsToInsert);

    if (error) {
      console.error('Error creating accounts:', error);
      throw new Error(`Failed to create accounts: ${error.message}`);
    }
  }

  private async createExpensesForPlan(planId: string, expenses: Expense[]) {
    const expensesToInsert = expenses.map(expense => ({
      plan_id: planId,
      name: expense.name,
      amount: expense.amount,
      expense_type: expense.type.toLowerCase(),
      period: expense.period === 'Before Retirement' ? 'before_retirement' : 'after_retirement',
      owner: expense.owner
    }));

    const { error } = await supabase
      .from('plan_expenses')
      .insert(expensesToInsert);

    if (error) {
      console.error('Error creating expenses:', error);
      throw new Error(`Failed to create expenses: ${error.message}`);
    }
  }
}
