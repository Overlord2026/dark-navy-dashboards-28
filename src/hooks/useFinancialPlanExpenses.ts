
import { useFinancialPlans } from "@/context/FinancialPlanContext";
import { Expense } from "@/types/financial-plan";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export const useFinancialPlanExpenses = (planId: string) => {
  const { plans, updatePlan } = useFinancialPlans();
  
  const plan = plans.find(p => p.id === planId);
  const expenses = plan?.expenses || [];
  
  const addExpense = (expense: Omit<Expense, "id">): Expense => {
    if (!plan) {
      toast.error("Plan not found");
      throw new Error("Plan not found");
    }
    
    const newExpense: Expense = {
      ...expense,
      id: uuidv4()
    };
    
    const updatedExpenses = [...expenses, newExpense];
    
    updatePlan(planId, { expenses: updatedExpenses });
    
    return newExpense;
  };
  
  const updateExpense = (expenseId: string, data: Partial<Expense>): Expense | null => {
    if (!plan) {
      toast.error("Plan not found");
      throw new Error("Plan not found");
    }
    
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
    
    updatePlan(planId, { expenses: updatedExpenses });
    
    return updatedExpense;
  };
  
  const deleteExpense = (expenseId: string): boolean => {
    if (!plan) {
      toast.error("Plan not found");
      throw new Error("Plan not found");
    }
    
    const updatedExpenses = expenses.filter(e => e.id !== expenseId);
    
    if (updatedExpenses.length === expenses.length) {
      toast.error("Expense not found");
      return false;
    }
    
    updatePlan(planId, { expenses: updatedExpenses });
    toast.success("Expense deleted");
    
    return true;
  };
  
  const getExpensesByTypeAndPeriod = (type: Expense["type"], period: Expense["period"]): Expense[] => {
    return expenses.filter(e => e.type === type && e.period === period);
  };
  
  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByTypeAndPeriod
  };
};
