
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { PlanSuccessGauge } from "@/components/financial-plans/PlanSuccessGauge";
import { NetWorthChart } from "@/components/financial-plans/NetWorthChart";
import { GoalsList } from "@/components/financial-plans/GoalsList";
import { CreatePlanDialog } from "@/components/financial-plans/CreatePlanDialog";
import { ManagePlansDialog } from "@/components/financial-plans/ManagePlansDialog";
import { InfoIcon } from "lucide-react";
import { FinancialPlansHeader } from "@/components/financial-plans/FinancialPlansHeader";
import { FinancialPlansActions } from "@/components/financial-plans/FinancialPlansActions";
import { PlanManagementSection } from "@/components/financial-plans/PlanManagementSection";
import { FinancialPlansCards } from "@/components/financial-plans/FinancialPlansCards";
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
    setCurrentDraftData(null);
    setIsCreateDialogOpen(true);
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
    <ThreeColumnLayout activeMainItem="financial-plans" title="Financial Plans">
      <div className="animate-fade-in space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-hidden">
        <div className="space-y-4">
          <FinancialPlansHeader />

          <FinancialPlansActions
            activePlan={activePlan}
            plans={plans}
            onCreatePlan={onCreatePlan}
            onSelectPlan={onSelectPlan}
          />

          <PlanManagementSection
            activePlan={activePlan}
            onEditPlan={onEditPlan}
            onDuplicatePlan={onDuplicatePlan}
            onDeletePlan={onDeletePlan}
          />
        </div>

        <div className="bg-card border border-border/30 rounded-lg p-4 sm:p-6">
          <GoalsList 
            goals={goals} 
            onGoalUpdate={handleGoalUpdate}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border border-border/30 bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                <h3 className="text-base sm:text-lg font-medium text-foreground">Projected Plan Success</h3>
                <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                  <span className="hidden sm:inline">What is chance of success?</span>
                  <span className="sm:hidden">Success chance?</span>
                  <InfoIcon className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                </div>
              </div>
              <div className="flex justify-center">
                <PlanSuccessGauge successRate={activePlan.successRate || 0} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/30 bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                <h3 className="text-base sm:text-lg font-medium text-foreground">Projected Net Worth</h3>
                <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                  <span className="hidden sm:inline">How is this chart calculated?</span>
                  <span className="sm:hidden">Chart info?</span>
                  <InfoIcon className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                </div>
              </div>
              <div className="w-full overflow-hidden">
                <NetWorthChart />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full">
          <FinancialPlansCards />
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
