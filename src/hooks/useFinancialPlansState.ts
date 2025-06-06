import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
  const { userProfile } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const name = userProfile?.firstName || "Pedro";
  const fullName = userProfile?.firstName && userProfile?.lastName 
    ? `${userProfile.firstName} ${userProfile.lastName}` 
    : "Pedro Gomez";
  
  const [plans, setPlans] = useState<Plan[]>([
    { 
      id: "1", 
      name: fullName, 
      isFavorite: true, 
      isActive: true, 
      successRate: 78, 
      status: 'Active',
      createdAt: new Date(2023, 4, 15),
      goals: [
        { 
          id: "goal-1", 
          title: "Retirement", 
          targetDate: new Date(2045, 0, 1), 
          targetAmount: 1500000, 
          currentAmount: 350000,
          priority: "High" 
        },
        { 
          id: "goal-2", 
          title: "College Fund", 
          targetDate: new Date(2030, 0, 1), 
          targetAmount: 120000, 
          currentAmount: 25000,
          priority: "Medium" 
        }
      ]
    },
    { 
      id: "2", 
      name: "Draft Plan 1", 
      isFavorite: false, 
      successRate: 45, 
      status: 'Draft',
      createdAt: new Date(2023, 5, 22),
      draftData: {
        step: 2,
        name: "Draft Plan 1",
        goals: [{ name: "Retirement", priority: "High" }]
      }
    },
    { 
      id: "3", 
      name: "Draft Plan 2", 
      isFavorite: false, 
      successRate: 62,
      status: 'Draft',
      createdAt: new Date(2023, 6, 10),
      draftData: {
        step: 3,
        name: "Draft Plan 2",
        goals: [{ name: "Buy a house", priority: "Medium" }],
        income: { monthly: 5000 }
      }
    },
  ]);
  
  const [selectedPlan, setSelectedPlan] = useState<string>(plans[0].id);
  const [currentDraftData, setCurrentDraftData] = useState<any>(null);

  useEffect(() => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      const planGoals = plan.goals || [];
      setGoals(planGoals);
    }
  }, [selectedPlan, plans]);

  const handleCreatePlan = (planName: string, planData: any) => {
    const isDraft = planData?.isDraft || false;
    const projections = planData?.projections || {};
    const planGoals = planData?.goals || [];
    
    const calculatedSuccessRate = planData?.successRate !== undefined 
      ? planData.successRate 
      : (isDraft ? 0 : Math.floor(Math.random() * 60) + 40);
    
    const newPlan = {
      id: `plan-${Date.now()}`,
      name: planName,
      isFavorite: false,
      isActive: !isDraft,
      successRate: calculatedSuccessRate,
      status: isDraft ? 'Draft' as const : 'Active' as const,
      createdAt: new Date(),
      goals: planGoals,
      projections: projections,
    };
    
    setPlans(prevPlans => {
      if (!isDraft) {
        const updatedPlans = prevPlans.map(plan => ({ ...plan, isActive: false }));
        return [...updatedPlans, newPlan];
      } else {
        return [...prevPlans, newPlan];
      }
    });
    
    if (!isDraft) {
      setSelectedPlan(newPlan.id);
      setGoals(planGoals);
      toast.success("Your new plan is created!");
    }
  };

  const handleSelectPlan = (planId: string) => {
    const selectedPlanObj = plans.find(plan => plan.id === planId);
    
    if (selectedPlanObj?.status === 'Draft' && selectedPlanObj.draftData) {
      setCurrentDraftData(selectedPlanObj.draftData);
      return { openCreateDialog: true };
    }
    
    setSelectedPlan(planId);
    setPlans(prevPlans => 
      prevPlans.map(plan => ({
        ...plan,
        isActive: plan.id === planId
      }))
    );
    
    return { openCreateDialog: false };
  };

  const handleSaveDraft = (draftData: any) => {
    if (currentDraftData && draftData.draftId) {
      setPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === draftData.draftId 
            ? { 
                ...plan, 
                draftData: { ...draftData, step: draftData.currentStep || 1 } 
              } 
            : plan
        )
      );
      toast.info("Draft plan updated");
    } else {
      const newDraft: Plan = {
        id: `draft-${Date.now()}`,
        name: draftData.name || "Untitled Draft",
        isFavorite: false,
        successRate: 0,
        status: 'Draft',
        createdAt: new Date(),
        draftData: { ...draftData, step: draftData.currentStep || 1 }
      };
      
      setPlans(prevPlans => [...prevPlans, newDraft]);
      toast.info("Draft plan saved");
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

  const handleDeletePlan = (planId: string) => {
    setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
    
    if (selectedPlan === planId && plans.length > 1) {
      const remainingPlans = plans.filter(plan => plan.id !== planId);
      setSelectedPlan(remainingPlans[0].id);
    }
  };

  const handleDuplicatePlan = (planId: string) => {
    const planToDuplicate = plans.find(plan => plan.id === planId);
    
    if (planToDuplicate) {
      const duplicatedPlan = {
        ...planToDuplicate,
        id: `plan-${Date.now()}`,
        name: `${planToDuplicate.name} (Copy)`,
        createdAt: new Date(),
        isFavorite: false,
        isActive: false
      };
      
      setPlans(prevPlans => [...prevPlans, duplicatedPlan]);
      toast.success(`Plan "${duplicatedPlan.name}" created successfully`);
    }
  };

  const handleToggleFavorite = (planId: string) => {
    setPlans(prevPlans => 
      prevPlans.map(plan => 
        plan.id === planId 
          ? { ...plan, isFavorite: !plan.isFavorite } 
          : plan
      )
    );
  };

  const handleGoalUpdate = (updatedGoal: Goal) => {
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
    
    const planIndex = plans.findIndex(p => p.id === selectedPlan);
    if (planIndex >= 0) {
      const plan = plans[planIndex];
      const existingGoals = plan.goals || [];
      const goalIndex = existingGoals.findIndex(g => g.id === updatedGoal.id);
      
      let updatedGoals;
      if (goalIndex >= 0) {
        updatedGoals = [...existingGoals];
        updatedGoals[goalIndex] = updatedGoal;
      } else {
        updatedGoals = [...existingGoals, updatedGoal];
      }
      
      const updatedPlan = {
        ...plan,
        goals: updatedGoals
      };
      
      setPlans(prevPlans => {
        const newPlans = [...prevPlans];
        newPlans[planIndex] = updatedPlan;
        return newPlans;
      });
    }
    
    toast.success("Goal updated successfully");
  };

  const activePlan = plans.find(plan => plan.id === selectedPlan) || plans[0];

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
    handleGoalUpdate
  };
};
