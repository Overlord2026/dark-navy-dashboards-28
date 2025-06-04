
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { PlanSuccessGauge } from "@/components/financial-plans/PlanSuccessGauge";
import { NetWorthChart } from "@/components/financial-plans/NetWorthChart";
import { GoalsList } from "@/components/financial-plans/GoalsList";
import { CreatePlanDialog } from "@/components/financial-plans/CreatePlanDialog";
import { ManagePlansDialog } from "@/components/financial-plans/ManagePlansDialog";
import { InfoIcon, Loader2 } from "lucide-react";
import { FinancialPlansHeader } from "@/components/financial-plans/FinancialPlansHeader";
import { FinancialPlansActions } from "@/components/financial-plans/FinancialPlansActions";
import { PlanManagementSection } from "@/components/financial-plans/PlanManagementSection";
import { FinancialPlansCards } from "@/components/financial-plans/FinancialPlansCards";
import { useFinancialPlansState } from "@/hooks/useFinancialPlansState";
import { FinancialPlanProvider } from "@/context/FinancialPlanContext";

const FinancialPlansContent = () => {
  const {
    goals,
    plans,
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

  if (loading) {
    return (
      <ThreeColumnLayout activeMainItem="financial-plans" title="Financial Plans">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your financial plans...</p>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout activeMainItem="financial-plans" title="Financial Plans">
      <div className="animate-fade-in w-full">
        <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="space-y-4">
            <FinancialPlansHeader />
            <FinancialPlansActions
              activePlan={activePlan}
              plans={plans}
              onCreatePlan={onCreatePlan}
              onSelectPlan={onSelectPlan}
            />
          </div>

          {/* Plan Management Section */}
          {activePlan && (
            <PlanManagementSection
              activePlan={activePlan}
              onEditPlan={onEditPlan}
              onDuplicatePlan={onDuplicatePlan}
              onDeletePlan={onDeletePlan}
            />
          )}

          {/* Goals Section */}
          {activePlan && (
            <Card className="border border-border/30 bg-card">
              <CardContent className="p-4 lg:p-6">
                <GoalsList 
                  goals={goals} 
                  onGoalUpdate={handleGoalUpdate}
                />
              </CardContent>
            </Card>
          )}

          {/* Charts Section */}
          {activePlan && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="border border-border/30 bg-card">
                <CardContent className="p-4 lg:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Projected Plan Success</h3>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <span>Success chance</span>
                        <InfoIcon className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                    <div className="flex justify-center py-4">
                      <PlanSuccessGauge successRate={activePlan.successRate || 0} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/30 bg-card">
                <CardContent className="p-4 lg:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Projected Net Worth</h3>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <span>Chart info</span>
                        <InfoIcon className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                    <div className="w-full h-64">
                      <NetWorthChart />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Financial Cards Section */}
          {activePlan && (
            <div className="w-full">
              <FinancialPlansCards />
            </div>
          )}

          {/* Empty State */}
          {!activePlan && !loading && (
            <div className="text-center py-16 px-4">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-foreground mb-4">No Financial Plans Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first financial plan to start tracking your goals and projections.
                </p>
                <button 
                  onClick={onCreatePlan}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Create Your First Plan
                </button>
              </div>
            </div>
          )}
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
      </div>
    </ThreeColumnLayout>
  );
};

const FinancialPlans = () => {
  return (
    <FinancialPlanProvider>
      <FinancialPlansContent />
    </FinancialPlanProvider>
  );
};

export default FinancialPlans;
