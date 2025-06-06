
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
  targetRetirementAge?: number;
}

export const useFinancialPlansState = () => {
  const { userProfile } = useAuth();
  const { 
    plans: contextPlans, 
    activePlan: contextActivePlan, 
    updatePlan, 
    createPlan: contextCreatePlan,
    deletePlan: contextDeletePlan,
    duplicatePlan: contextDuplicatePlan,
    toggleFavorite: contextToggleFavorite,
    updateGoal: contextUpdateGoal,
    saveDraft: contextSaveDraft,
    setActivePlan: contextSetActivePlan
  } = useFinancialPlans();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [currentDraftData, setCurrentDraftData] = useState<any>(null);

  // Convert context plans to local format
  const plans: Plan[] = contextPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    isFavorite: plan.isFavorite || false,
    isActive: plan.isActive || false,
    successRate: plan.successRate || 0,
    status: plan.status === 'Active' ? 'Active' as const : 'Draft' as const,
    createdAt: plan.createdAt,
    goals: plan.goals?.map(goal => ({
      id: goal.id,
      title: goal.title,
      targetDate: goal.targetDate,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      priority: goal.priority as "High" | "Medium" | "Low"
    })) || [],
    draftData: plan.draftData,
    targetRetirementAge: plan.draftData?.targetRetirementAge || 67
  }));

  const activePlan = contextActivePlan ? {
    id: contextActivePlan.id,
    name: contextActivePlan.name,
    isFavorite: contextActivePlan.isFavorite || false,
    isActive: contextActivePlan.isActive || false,
    successRate: contextActivePlan.successRate || 0,
    status: contextActivePlan.status === 'Active' ? 'Active' as const : 'Draft' as const,
    createdAt: contextActivePlan.createdAt,
    goals: contextActivePlan.goals?.map(goal => ({
      id: goal.id,
      title: goal.title,
      targetDate: goal.targetDate,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      priority: goal.priority as "High" | "Medium" | "Low"
    })) || [],
    draftData: contextActivePlan.draftData,
    targetRetirementAge: contextActivePlan.draftData?.targetRetirementAge || 67
  } : null;

  useEffect(() => {
    if (contextActivePlan) {
      setSelectedPlan(contextActivePlan.id);
      const planGoals = contextActivePlan.goals || [];
      setGoals(planGoals.map(goal => ({
        id: goal.id,
        title: goal.title,
        targetDate: goal.targetDate,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        priority: goal.priority as "High" | "Medium" | "Low"
      })));
    } else if (plans.length > 0) {
      setSelectedPlan(plans[0].id);
      setGoals(plans[0].goals || []);
    }
  }, [contextActivePlan, contextPlans]);

  const handleUpdateTargetRetirementAge = async (age: number) => {
    if (!activePlan) return;

    try {
      const updatedDraftData = {
        ...activePlan.draftData,
        targetRetirementAge: age
      };

      await updatePlan(activePlan.id, {
        draftData: updatedDraftData
      });

      toast.success("Target retirement age updated successfully");
    } catch (error) {
      toast.error("Failed to update target retirement age");
      console.error("Error updating target retirement age:", error);
    }
  };

  const handleCreatePlan = async (planName: string, planData: any) => {
    try {
      await contextCreatePlan({
        name: planName,
        ...planData
      });
    } catch (error) {
      toast.error("Failed to create plan");
      console.error("Error creating plan:", error);
    }
  };

  const handleSelectPlan = (planId: string) => {
    const selectedPlanObj = plans.find(plan => plan.id === planId);
    
    if (selectedPlanObj?.status === 'Draft' && selectedPlanObj.draftData) {
      setCurrentDraftData(selectedPlanObj.draftData);
      return { openCreateDialog: true };
    }
    
    setSelectedPlan(planId);
    contextSetActivePlan(planId);
    
    return { openCreateDialog: false };
  };

  const handleSaveDraft = async (draftData: any) => {
    try {
      if (currentDraftData && draftData.draftId) {
        await updatePlan(draftData.draftId, {
          draftData: { ...draftData, step: draftData.currentStep || 1 }
        });
        toast.info("Draft plan updated");
      } else {
        await contextSaveDraft(draftData);
      }
    } catch (error) {
      toast.error("Failed to save draft");
      console.error("Error saving draft:", error);
    }
  };

  const handleEditPlan = (planId: string) => {
    const planToEdit = plans.find(plan => plan.id === planId);
    
    if (planToEdit?.status === 'Draft' && planToEdit.draftData) {
      setCurrentDraftData({...planToEdit.draftData, draftId: planId});
      return { openCreateDialog: true };
    } else {
      toast.info(`Editing plan ${planId}`);
    }
    
    return { openCreateDialog: false };
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await contextDeletePlan(planId);
      toast.success("Plan deleted successfully");
    } catch (error) {
      toast.error("Failed to delete plan");
      console.error("Error deleting plan:", error);
    }
  };

  const handleDuplicatePlan = async (planId: string) => {
    try {
      await contextDuplicatePlan(planId);
    } catch (error) {
      toast.error("Failed to duplicate plan");
      console.error("Error duplicating plan:", error);
    }
  };

  const handleToggleFavorite = async (planId: string) => {
    try {
      await contextToggleFavorite(planId);
    } catch (error) {
      toast.error("Failed to update favorite status");
      console.error("Error toggling favorite:", error);
    }
  };

  const handleGoalUpdate = async (updatedGoal: Goal) => {
    try {
      await contextUpdateGoal(selectedPlan, {
        id: updatedGoal.id,
        title: updatedGoal.title,
        description: "",
        targetAmount: updatedGoal.targetAmount,
        currentAmount: updatedGoal.currentAmount,
        targetDate: updatedGoal.targetDate,
        priority: updatedGoal.priority,
        isComplete: false
      });
      
      setGoals(prevGoals => {
        const existingGoalIndex = prevGoals.findIndex(g => g.id === updatedGoal.id);
        if (existingGoalIndex >= 0) {
          const newGoals = [...prevGoals];
          newGoals[existingGoalIndex] = updatedGoal;
          return newGoals;
        } else {
          return [...prevGoals, updatedGoal];
        }
      });
    } catch (error) {
      toast.error("Failed to update goal");
      console.error("Error updating goal:", error);
    }
  };

  return {
    goals,
    plans,
    selectedPlan,
    currentDraftData,
    activePlan,
    setCurrentDraftData,
    handleCreatePlan,
    handleSelectPlan,
    handleSaveDraft,
    handleEditPlan,
    handleDeletePlan,
    handleDuplicatePlan,
    handleToggleFavorite,
    handleGoalUpdate,
    handleUpdateTargetRetirementAge
  };
};
