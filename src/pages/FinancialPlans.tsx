
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { GoalsList } from "@/components/financial-plans/GoalsList";
import { CreatePlanDialog } from "@/components/financial-plans/CreatePlanDialog";
import { ManagePlansDialog } from "@/components/financial-plans/ManagePlansDialog";
import { Target } from "lucide-react";
import { useFinancialPlansState } from "@/hooks/useFinancialPlansState";

const FinancialPlans = () => {
  const {
    goals,
    plans,
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
  } = useFinancialPlansState();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isManagePlansOpen, setIsManagePlansOpen] = useState(false);

  const onCreatePlan = () => {
    // Disabled - Coming Soon
    return;
  };

  const onSelectPlan = (planId: string) => {
    if (planId === "new-plan") {
      setIsCreateDialogOpen(true);
      setCurrentDraftData(null);
      return;
    }
    
    if (planId === "manage-plans") {
      setIsManagePlansOpen(true);
      return;
    }
    
    const result = handleSelectPlan(planId);
    if (result.openCreateDialog) {
      setIsCreateDialogOpen(true);
    }
  };

  const onEditPlan = (planId: string) => {
    const result = handleEditPlan(planId);
    if (result.openCreateDialog) {
      setIsCreateDialogOpen(true);
    }
    setIsManagePlansOpen(false);
  };

  const onDeletePlan = (planId: string) => {
    handleDeletePlan(planId);
    setIsManagePlansOpen(false);
  };

  const onDuplicatePlan = (planId: string) => {
    handleDuplicatePlan(planId);
  };

  return (
    <ThreeColumnLayout activeMainItem="financial-plans" title="">
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 py-8">
          {/* Simple Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Financial Plans
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage your financial goals and plans.
            </p>
          </div>

          {/* Goals Section */}
          <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <GoalsList 
                goals={goals} 
                onGoalUpdate={handleGoalUpdate}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <CreatePlanDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreatePlan={handleCreatePlan}
        onSaveDraft={handleSaveDraft}
        draftData={currentDraftData}
      />

      <ManagePlansDialog
        isOpen={isManagePlansOpen}
        onClose={() => setIsManagePlansOpen(false)}
        plans={plans}
        onEditPlan={onEditPlan}
        onDeletePlan={onDeletePlan}
        onDuplicatePlan={onDuplicatePlan}
        onToggleFavorite={handleToggleFavorite}
        onSelectPlan={(planId) => {
          handleSelectPlan(planId);
          setIsManagePlansOpen(false);
        }}
      />
    </ThreeColumnLayout>
  );
};

export default FinancialPlans;
