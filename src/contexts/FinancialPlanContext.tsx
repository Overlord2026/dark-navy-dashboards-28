
import React, { createContext, useContext, useEffect, useState } from "react";
import { FinancialPlan, FinancialGoal, FinancialAccount, Expense, FinancialPlansSummary } from "@/types/financial-plan";
import { toast } from "sonner";
import { useFinancialPlans as useFinancialPlansHook } from "@/hooks/useFinancialPlans";

interface FinancialPlanContextType {
  plans: FinancialPlan[];
  activePlan: FinancialPlan | null;
  summary: FinancialPlansSummary;
  loading: boolean;
  error: Error | null;
  createPlan: (planData: Partial<FinancialPlan>) => Promise<FinancialPlan>;
  updatePlan: (id: string, planData: Partial<FinancialPlan>) => Promise<FinancialPlan | null>;
  deletePlan: (id: string) => Promise<boolean>;
  saveDraft: (draftData: any) => Promise<FinancialPlan>;
  setActivePlan: (id: string) => Promise<void>;
  updateGoal: (planId: string, goal: FinancialGoal) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<void>;
  duplicatePlan: (id: string) => Promise<FinancialPlan | null>;
  refreshPlans: () => Promise<void>;
}

const FinancialPlanContext = createContext<FinancialPlanContextType | undefined>(undefined);

export const FinancialPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the new hook which handles service interactions
  const {
    plans,
    activePlan,
    summary,
    loading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    saveDraft,
    setActivePlan,
    updateGoal,
    toggleFavorite,
    duplicatePlan,
    refreshPlans
  } = useFinancialPlansHook();

  return (
    <FinancialPlanContext.Provider
      value={{
        plans,
        activePlan,
        summary,
        loading,
        error,
        createPlan,
        updatePlan,
        deletePlan,
        saveDraft,
        setActivePlan,
        updateGoal,
        toggleFavorite,
        duplicatePlan,
        refreshPlans
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
