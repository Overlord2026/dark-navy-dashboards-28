
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useFinancialPlans } from "@/context/FinancialPlanContext";
import { toast } from "sonner";

export interface Goal {
  id: string;
  title: string;
  targetDate: Date;
  targetAmount: number;
  currentAmount: number;
  priority: "High" | "Medium" | "Low";
}

export interface Plan {
  id: string;
  name: string;
  isFavorite: boolean;
  isActive?: boolean;
  successRate: number;
  status: 'Active' | 'Draft';
  createdAt: Date;
  goals?: Goal[];
  draftData?: any;
}

export const useFinancialPlansState = () => {
  const { userProfile } = useUser();
  const {
    plans: contextPlans,
    activePlan: contextActivePlan,
    loading,
    createPlan: contextCreatePlan,
    updatePlan: contextUpdatePlan,
    deletePlan: contextDeletePlan,
    saveDraft: contextSaveDraft,
    setActivePlan: contextSetActivePlan,
    updateGoal: contextUpdateGoal,
    toggleFavorite: contextToggleFavorite,
    duplicatePlan: contextDuplicatePlan
  } = useFinancialPlans();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentDraftData, setCurrentDraftData] = useState<any>(null);

  // Convert context plans to local format
  const plans = contextPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    isFavorite: plan.isFavorite,
    isActive: plan.isActive,
    successRate: plan.successRate,
    status: plan.status as 'Active' | 'Draft',
    createdAt: plan.createdAt,
    goals: plan.goals?.map(goal => ({
      id: goal.id,
      title: goal.title,
      targetDate: goal.targetDate,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      priority: goal.priority as "High" | "Medium" | "Low"
    })),
    draftData: plan.draftData
  }));

  const activePlan = contextActivePlan ? {
    id: contextActivePlan.id,
    name: contextActivePlan.name,
    isFavorite: contextActivePlan.isFavorite,
    isActive: contextActivePlan.isActive,
    successRate: contextActivePlan.successRate,
    status: contextActivePlan.status as 'Active' | 'Draft',
    createdAt: contextActivePlan.createdAt,
    goals: contextActivePlan.goals?.map(goal => ({
      id: goal.id,
      title: goal.title,
      targetDate: goal.targetDate,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      priority: goal.priority as "High" | "Medium" | "Low"
    })),
    draftData: contextActivePlan.draftData
  } : (plans.length > 0 ? plans[0] : null);

  const selectedPlan = activePlan?.id || '';

  useEffect(() => {
    if (activePlan?.goals) {
      setGoals(activePlan.goals);
    }
  }, [activePlan]);

  const handleCreatePlan = async (planName: string, planData: any) => {
    const isDraft = planData?.isDraft || false;
    
    try {
      await contextCreatePlan({
        name: planName,
        status: isDraft ? 'Draft' : 'Active',
        isFavorite: false,
        successRate: isDraft ? 0 : Math.floor(Math.random() * 60) + 40,
        goals: planData?.goals || [],
        accounts: planData?.accounts || [],
        expenses: planData?.expenses || []
      });
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  const handleSelectPlan = (planId: string) => {
    const selectedPlanObj = plans.find(plan => plan.id === planId);
    
    if (selectedPlanObj?.status === 'Draft' && selectedPlanObj.draftData) {
      setCurrentDraftData(selectedPlanObj.draftData);
      return { openCreateDialog: true };
    }
    
    contextSetActivePlan(planId);
    return { openCreateDialog: false };
  };

  const handleSaveDraft = async (draftData: any) => {
    try {
      if (currentDraftData && draftData.draftId) {
        // Update existing draft
        await contextUpdatePlan(draftData.draftId, {
          name: draftData.name,
          draftData: { ...draftData, step: draftData.currentStep || 1 }
        });
      } else {
        // Create new draft
        await contextSaveDraft(draftData);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleEditPlan = (planId: string) => {
    const planToEdit = plans.find(plan => plan.id === planId);
    
    if (planToEdit?.status === 'Draft' && planToEdit.draftData) {
      setCurrentDraftData({...planToEdit.draftData, draftId: planId});
      return { openCreateDialog: true };
    }
    
    return { openCreateDialog: false };
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await contextDeletePlan(planId);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleDuplicatePlan = async (planId: string) => {
    try {
      await contextDuplicatePlan(planId);
    } catch (error) {
      console.error('Error duplicating plan:', error);
    }
  };

  const handleToggleFavorite = async (planId: string) => {
    try {
      await contextToggleFavorite(planId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleGoalUpdate = async (updatedGoal: Goal) => {
    if (!activePlan) return;

    try {
      await contextUpdateGoal(activePlan.id, {
        id: updatedGoal.id,
        title: updatedGoal.title,
        targetAmount: updatedGoal.targetAmount,
        currentAmount: updatedGoal.currentAmount,
        targetDate: updatedGoal.targetDate,
        priority: updatedGoal.priority,
        isComplete: false
      });
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  return {
    goals,
    plans,
    selectedPlan,
    currentDraftData,
    activePlan,
    loading,
    setCurrentDraftData,
    handleCreatePlan,
    handleSelectPlan,
    handleSaveDraft,
    handleEditPlan,
    handleDeletePlan,
    handleDuplicatePlan,
    handleToggleFavorite,
    handleGoalUpdate
  };
};
