
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  FinancialPlan,
  FinancialGoal,
  FinancialPlansSummary
} from "@/types/financial-plan";
import { supabase } from "@/integrations/supabase/client";

export interface UseFinancialPlansState {
  plans: FinancialPlan[];
  activePlan: FinancialPlan | null;
  summary: FinancialPlansSummary;
  loading: boolean;
  error: Error | null;
  currentDraftData: any;
  goals: Goal[]; // Add goals property
  setCurrentDraftData: (data: any) => void;
  handleCreatePlan: (planData: Partial<FinancialPlan>) => Promise<void>;
  handleSelectPlan: (planId: string) => { success: boolean; openCreateDialog?: boolean };
  handleSaveDraft: (draftData: any) => Promise<void>;
  handleEditPlan: (planId: string) => { success: boolean; openCreateDialog?: boolean };
  handleDeletePlan: (planId: string) => Promise<void>;
  handleDuplicatePlan: (planId: string) => Promise<void>;
  handleToggleFavorite: (planId: string) => Promise<void>;
  handleGoalUpdate: (goal: FinancialGoal) => Promise<void>;
}

export interface Goal {
  id: string;
  title: string;
  name?: string;
  type?: string;
  owner?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  priority: "Low" | "Medium" | "High";
  description?: string;
  dateOfBirth?: Date;
  targetRetirementAge?: number;
  planningHorizonAge?: number;
  purchasePrice?: number;
  financingMethod?: string;
  annualAppreciation?: string;
  studentName?: string;
  startYear?: number;
  endYear?: number;
  tuitionEstimate?: number;
  destination?: string;
  estimatedCost?: number;
  amountDesired?: number;
  repeats?: string;
  annualInflationType?: string;
  annualInflationRate?: number;
}

export const useFinancialPlansState = (): UseFinancialPlansState => {
  const [plans, setPlans] = useState<FinancialPlan[]>([]);
  const [activePlan, setActivePlan] = useState<FinancialPlan | null>(null);
  const [summary, setSummary] = useState<FinancialPlansSummary>({
    activePlans: 0,
    draftPlans: 0,
    totalGoals: 0,
    averageSuccessRate: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentDraftData, setCurrentDraftData] = useState<any>(null);

  // Derive goals from active plan
  const goals: Goal[] = activePlan?.goals?.map(goal => ({
    id: goal.id,
    title: goal.title,
    name: goal.title,
    type: goal.priority,
    owner: 'Current User',
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    targetDate: goal.targetDate,
    priority: goal.priority,
    description: goal.description,
  })) || [];

  const calculateSummary = useCallback((plans: FinancialPlan[]) => {
    const activePlans = plans.filter(plan => plan.status === 'Active').length;
    const draftPlans = plans.filter(plan => plan.status === 'Draft').length;
    const totalGoals = plans.reduce((acc, plan) => acc + (plan.goals?.length || 0), 0);
    const successRates = plans.filter(plan => plan.successRate !== null && plan.successRate !== undefined).map(plan => plan.successRate);
    const averageSuccessRate = successRates.length > 0 ? successRates.reduce((acc, rate) => acc + rate, 0) / successRates.length : 0;

    return {
      activePlans,
      draftPlans,
      totalGoals,
      averageSuccessRate,
    };
  }, []);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
			const { data, error } = await supabase
				.from('financial_plans')
				.select('*');

      if (error) {
        throw error;
      }

      const fetchedPlans = data as FinancialPlan[];
      setPlans(fetchedPlans);
      setSummary(calculateSummary(fetchedPlans));

      // If there's no activePlan in state but there are plans, set the first one as active
      if (!activePlan && fetchedPlans.length > 0) {
        setActivePlan(fetchedPlans[0]);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [calculateSummary, activePlan]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleCreatePlan = async (planData: Partial<FinancialPlan>) => {
    setLoading(true);
    try {
      const newPlan: FinancialPlan = {
        id: uuidv4(),
        name: planData.name || 'New Financial Plan',
        owner: planData.owner || 'Current User',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDraft: planData.isDraft !== undefined ? planData.isDraft : true,
        isActive: planData.isActive !== undefined ? planData.isActive : false,
        isFavorite: planData.isFavorite !== undefined ? planData.isFavorite : false,
        successRate: planData.successRate || 75,
        status: planData.status || 'Draft',
        goals: [],
        accounts: [],
        expenses: [],
        draftData: planData.draftData,
        step: planData.step,
      };

			const { error } = await supabase
				.from('financial_plans')
				.insert([newPlan]);

      if (error) {
        throw error;
      }

      setPlans(prevPlans => [...prevPlans, newPlan]);
      setSummary(calculateSummary([...plans, newPlan]));
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    if (planId === "new-plan") {
      return { success: true, openCreateDialog: true };
    }

    if (planId === "manage-plans") {
      return { success: true };
    }

    const selectedPlan = plans.find(plan => plan.id === planId);
    if (selectedPlan) {
      setActivePlan(selectedPlan);
      return { success: true };
    } else {
      console.warn(`Plan with id ${planId} not found.`);
      return { success: false };
    }
  };

  const handleSaveDraft = async (draftData: any) => {
    setLoading(true);
    try {
      const updatedPlan: FinancialPlan = {
        id: uuidv4(),
        name: draftData.name || 'Draft Financial Plan',
        owner: draftData.owner || 'Current User',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDraft: true,
        isActive: false,
        isFavorite: false,
        successRate: 50,
        status: 'Draft',
        goals: [],
        accounts: [],
        expenses: [],
        draftData: draftData,
        step: draftData.step,
      };

			const { error } = await supabase
				.from('financial_plans')
				.insert([updatedPlan]);

      if (error) {
        throw error;
      }

      setPlans(prevPlans => [...prevPlans, updatedPlan]);
      setSummary(calculateSummary([...plans, updatedPlan]));
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlan = (planId: string) => {
    const planToEdit = plans.find(plan => plan.id === planId);
    if (planToEdit) {
      setCurrentDraftData(planToEdit.draftData);
      return { success: true, openCreateDialog: true };
    } else {
      console.warn(`Plan with id ${planId} not found for editing.`);
      return { success: false };
    }
  };

  const handleDeletePlan = async (planId: string) => {
    setLoading(true);
    try {
			const { error } = await supabase
				.from('financial_plans')
				.delete()
				.eq('id', planId);

      if (error) {
        throw error;
      }

      setPlans(prevPlans => {
        const updatedPlans = prevPlans.filter(plan => plan.id !== planId);
        setSummary(calculateSummary(updatedPlans));
        return updatedPlans;
      });

      if (activePlan?.id === planId) {
        setActivePlan(null);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicatePlan = async (planId: string) => {
    setLoading(true);
    try {
      const planToDuplicate = plans.find(plan => plan.id === planId);

      if (planToDuplicate) {
        const duplicatedPlan: FinancialPlan = {
          id: uuidv4(),
          name: `${planToDuplicate.name} (Duplicated)`,
          owner: planToDuplicate.owner,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDraft: true,
          isActive: false,
          isFavorite: false,
          successRate: planToDuplicate.successRate,
          status: 'Draft',
          goals: planToDuplicate.goals,
          accounts: planToDuplicate.accounts,
          expenses: planToDuplicate.expenses,
          draftData: planToDuplicate.draftData,
          step: planToDuplicate.step,
        };

				const { error } = await supabase
					.from('financial_plans')
					.insert([duplicatedPlan]);

        if (error) {
          throw error;
        }

        setPlans(prevPlans => [...prevPlans, duplicatedPlan]);
        setSummary(calculateSummary([...plans, duplicatedPlan]));
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (planId: string) => {
    setLoading(true);
    try {
      const planToUpdate = plans.find(plan => plan.id === planId);

      if (planToUpdate) {
        const updatedPlan = { ...planToUpdate, isFavorite: !planToUpdate.isFavorite };

				const { error } = await supabase
					.from('financial_plans')
					.update({ is_favorite: updatedPlan.isFavorite })
					.eq('id', planId);

        if (error) {
          throw error;
        }

        setPlans(prevPlans =>
          prevPlans.map(plan => (plan.id === planId ? updatedPlan : plan))
        );
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalUpdate = async (goal: FinancialGoal) => {
    setLoading(true);
    try {
      if (!activePlan) {
        console.warn("No active plan to update goal.");
        return;
      }

      // Optimistically update the local state
      setPlans(prevPlans => {
        const updatedPlans = prevPlans.map(plan => {
          if (plan.id === activePlan.id) {
            const updatedGoals = plan.goals.map(g => (g.id === goal.id ? goal : g));
            return { ...plan, goals: updatedGoals };
          }
          return plan;
        });
        return updatedPlans;
      });

      // Update the goal in the database
			const { error } = await supabase
				.from('financial_plans')
				.update({ goals: activePlan.goals })
				.eq('id', activePlan.id);

      if (error) {
        throw error;
      }

      // Update the active plan in local state
      setActivePlan(prevPlan => {
        if (prevPlan && prevPlan.id === activePlan.id) {
          const updatedGoals = prevPlan.goals.map(g => (g.id === goal.id ? goal : g));
          return { ...prevPlan, goals: updatedGoals };
        }
        return prevPlan;
      });
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    plans,
    activePlan,
    summary,
    loading,
    error,
    currentDraftData,
    goals,
    setCurrentDraftData,
    handleCreatePlan,
    handleSelectPlan,
    handleSaveDraft,
    handleEditPlan,
    handleDeletePlan,
    handleDuplicatePlan,
    handleToggleFavorite,
    handleGoalUpdate,
  };
};
