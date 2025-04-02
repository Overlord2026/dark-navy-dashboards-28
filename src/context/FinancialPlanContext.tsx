
import React, { createContext, useContext, useEffect, useState } from "react";
import { FinancialPlan, FinancialGoal, FinancialAccount, Expense, FinancialPlansSummary } from "@/types/financial-plan";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface FinancialPlanContextType {
  plans: FinancialPlan[];
  activePlan: FinancialPlan | null;
  summary: FinancialPlansSummary;
  createPlan: (planData: Partial<FinancialPlan>) => FinancialPlan;
  updatePlan: (id: string, planData: Partial<FinancialPlan>) => FinancialPlan | null;
  deletePlan: (id: string) => boolean;
  saveDraft: (draftData: any) => FinancialPlan;
  setActivePlan: (id: string) => void;
  updateGoal: (planId: string, goal: FinancialGoal) => boolean;
  toggleFavorite: (id: string) => void;
  duplicatePlan: (id: string) => FinancialPlan | null;
}

const FinancialPlanContext = createContext<FinancialPlanContextType | undefined>(undefined);

export const FinancialPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useLocalStorage<FinancialPlan[]>("financial-plans", []);
  const [activePlanId, setActivePlanId] = useLocalStorage<string | null>("active-financial-plan", null);
  
  // Calculated properties
  const activePlan = plans.find(plan => plan.id === activePlanId) || 
                     plans.find(plan => plan.isActive) || 
                     (plans.length > 0 ? plans[0] : null);
  
  const summary: FinancialPlansSummary = {
    activePlans: plans.filter(p => p.status === 'Active').length,
    draftPlans: plans.filter(p => p.status === 'Draft').length,
    totalGoals: plans.reduce((sum, plan) => sum + (plan.goals?.length || 0), 0),
    averageSuccessRate: plans.length > 0 
      ? plans.reduce((sum, plan) => sum + plan.successRate, 0) / plans.length
      : 0
  };

  // Initialize with sample data if empty
  useEffect(() => {
    if (plans.length === 0) {
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
      
      setPlans([samplePlan]);
      setActivePlanId(samplePlan.id);
    }
  }, []);

  const createPlan = (planData: Partial<FinancialPlan>): FinancialPlan => {
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
    
    setPlans(prevPlans => {
      // If creating a non-draft plan, set all other plans to inactive
      if (!newPlan.isDraft) {
        return [...prevPlans.map(p => ({ ...p, isActive: false })), newPlan];
      } else {
        return [...prevPlans, newPlan];
      }
    });
    
    if (!newPlan.isDraft) {
      setActivePlanId(newPlan.id);
    }
    
    toast.success(newPlan.isDraft ? "Draft saved" : "Plan created successfully");
    return newPlan;
  };

  const updatePlan = (id: string, planData: Partial<FinancialPlan>): FinancialPlan | null => {
    let updatedPlan: FinancialPlan | null = null;
    
    setPlans(prevPlans => {
      const index = prevPlans.findIndex(p => p.id === id);
      if (index === -1) return prevPlans;
      
      const plans = [...prevPlans];
      updatedPlan = {
        ...plans[index],
        ...planData,
        updatedAt: new Date()
      };
      plans[index] = updatedPlan;
      return plans;
    });
    
    toast.success("Plan updated");
    return updatedPlan;
  };

  const deletePlan = (id: string): boolean => {
    let success = false;
    
    setPlans(prevPlans => {
      const index = prevPlans.findIndex(p => p.id === id);
      if (index === -1) return prevPlans;
      
      const plans = [...prevPlans];
      plans.splice(index, 1);
      success = true;
      return plans;
    });
    
    // If we deleted the active plan, set a new active plan
    if (id === activePlanId && plans.length > 0) {
      setActivePlanId(plans[0].id);
    }
    
    if (success) {
      toast.success("Plan deleted");
    }
    
    return success;
  };

  const saveDraft = (draftData: any): FinancialPlan => {
    // If updating an existing draft
    if (draftData.draftId) {
      const updatedPlan = updatePlan(draftData.draftId, { 
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
    return createPlan({
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
  };

  const setActivePlan = (id: string) => {
    const plan = plans.find(p => p.id === id);
    if (!plan) return;
    
    if (plan.status === 'Draft') {
      toast.error("Cannot set a draft as the active plan");
      return;
    }
    
    setActivePlanId(id);
    
    setPlans(prevPlans => 
      prevPlans.map(p => ({
        ...p,
        isActive: p.id === id
      }))
    );
  };

  const updateGoal = (planId: string, goal: FinancialGoal): boolean => {
    let success = false;
    
    setPlans(prevPlans => {
      const planIndex = prevPlans.findIndex(p => p.id === planId);
      if (planIndex === -1) return prevPlans;
      
      const plan = { ...prevPlans[planIndex] };
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
      
      const updatedPlans = [...prevPlans];
      updatedPlans[planIndex] = plan;
      success = true;
      
      return updatedPlans;
    });
    
    if (success) {
      toast.success("Goal updated");
    }
    
    return success;
  };

  const toggleFavorite = (id: string) => {
    setPlans(prevPlans => 
      prevPlans.map(plan => 
        plan.id === id 
          ? { ...plan, isFavorite: !plan.isFavorite } 
          : plan
      )
    );
  };

  const duplicatePlan = (id: string): FinancialPlan | null => {
    const planToDuplicate = plans.find(plan => plan.id === id);
    if (!planToDuplicate) return null;
    
    const duplicatedPlan: FinancialPlan = {
      ...planToDuplicate,
      id: uuidv4(),
      name: `${planToDuplicate.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      isActive: false
    };
    
    setPlans(prevPlans => [...prevPlans, duplicatedPlan]);
    toast.success(`Plan "${duplicatedPlan.name}" created successfully`);
    
    return duplicatedPlan;
  };

  return (
    <FinancialPlanContext.Provider
      value={{
        plans,
        activePlan,
        summary,
        createPlan,
        updatePlan,
        deletePlan,
        saveDraft,
        setActivePlan,
        updateGoal,
        toggleFavorite,
        duplicatePlan
      }}
    >
      {children}
    </FinancialPlanContext.Provider>
  );
};

export const useFinancialPlans = () => {
  const context = useContext(FinancialPlanContext);
  if (context === undefined) {
    throw new Error('useFinancialPlans must be used within a FinancialPlanProvider');
  }
  return context;
};
