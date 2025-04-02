
import { useState, useEffect, useCallback } from "react";
import { Expense } from "@/types/financial-plan";
import { toast } from "sonner";
import { getFinancialPlanService } from "@/services/financial-plans/FinancialPlanServiceFactory";

export const useFinancialPlanExpenses = (planId: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const service = getFinancialPlanService();
  
  // Load expenses for the specified plan
  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const plan = await service.getPlanById(planId);
      if (!plan) {
        throw new Error("Plan not found");
      }
      
      setExpenses(plan.expenses || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error loading expenses'));
      toast.error('Error loading expenses');
    } finally {
      setLoading(false);
    }
  }, [planId, service]);
  
  // Initialize on component mount or when planId changes
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);
  
  // Add an expense
  const addExpense = async (expense: Omit<Expense, "id">): Promise<Expense> => {
    try {
      const newExpense = await service.addExpense(planId, expense);
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error adding expense';
      toast.error(errorMessage);
      throw err;
    }
  };
  
  // Update an expense
  const updateExpense = async (expenseId: string, data: Partial<Expense>): Promise<Expense | null> => {
    try {
      const updatedExpense = await service.updateExpense(planId, expenseId, data);
      if (updatedExpense) {
        setExpenses(prev => 
          prev.map(e => e.id === expenseId ? updatedExpense : e)
        );
      }
      return updatedExpense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error updating expense';
      toast.error(errorMessage);
      throw err;
    }
  };
  
  // Delete an expense
  const deleteExpense = async (expenseId: string): Promise<boolean> => {
    try {
      const success = await service.deleteExpense(planId, expenseId);
      if (success) {
        setExpenses(prev => prev.filter(e => e.id !== expenseId));
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error deleting expense';
      toast.error(errorMessage);
      throw err;
    }
  };
  
  // Filter expenses by type and period
  const getExpensesByTypeAndPeriod = (type: Expense["type"], period: Expense["period"]): Expense[] => {
    return expenses.filter(e => e.type === type && e.period === period);
  };
  
  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByTypeAndPeriod,
    refreshExpenses: loadExpenses
  };
};
