
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlanSuccessGauge } from "@/components/financial-plans/PlanSuccessGauge";
import { NetWorthChart } from "@/components/financial-plans/NetWorthChart";
import { GoalsList } from "@/components/financial-plans/GoalsList";
import { CreatePlanDialog } from "@/components/financial-plans/CreatePlanDialog";
import { ManagePlansDialog } from "@/components/financial-plans/ManagePlansDialog";
import { Loader2, Plus } from "lucide-react";
import { FinancialPlansHeader } from "@/components/financial-plans/FinancialPlansHeader";
import { FinancialPlansQuickActions } from "@/components/financial-plans/FinancialPlansQuickActions";
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
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="space-y-6">
            <FinancialPlansHeader />
            
            {/* Create Plan Button */}
            <div className="flex justify-start">
              <Button 
                onClick={onCreatePlan}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium"
                size="lg"
              >
                Create Plan
              </Button>
            </div>
          </div>

          {/* Quick Actions Cards - Only show if no active plan */}
          {!activePlan && (
            <FinancialPlansQuickActions onCreatePlan={onCreatePlan} />
          )}

          {/* Active Plan Section */}
          {activePlan && (
            <>
              {/* Plan Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-foreground">Your Financial Plan</h2>
                  <Button variant="ghost" size="sm">•••</Button>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Plan Success */}
                <div className="space-y-6">
                  <Card className="border border-border/30 bg-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">Projected Plan Success</h3>
                          <span className="text-sm text-muted-foreground">What is chance of success?</span>
                        </div>
                        <div className="flex justify-center py-8">
                          <PlanSuccessGauge successRate={activePlan.successRate || 0} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Middle Column - Goals */}
                <div className="space-y-6">
                  <Card className="border border-border/30 bg-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">Goals</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{goals.length} Goals</span>
                            <Button variant="ghost" size="sm">Add</Button>
                          </div>
                        </div>
                        <GoalsList 
                          goals={goals} 
                          onGoalUpdate={handleGoalUpdate}
                          compact={true}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Retirement Ages */}
                  <div className="space-y-4">
                    <Card className="border border-border/30 bg-card">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Your Retirement Age</span>
                          <span className="text-lg font-semibold">--</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-border/30 bg-card">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Spouse's Retirement Age</span>
                          <span className="text-lg font-semibold">--</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Right Column - Track Income */}
                <div className="space-y-6">
                  <Card className="border border-border/30 bg-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Track income and expenses into your plan</h3>
                        <p className="text-sm text-muted-foreground">
                          Track your income, expenses, and make sure you're on track.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Net Worth Chart */}
              <Card className="border border-border/30 bg-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Projected Net Worth</h3>
                    <div className="w-full h-64">
                      <NetWorthChart />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Empty State */}
          {!activePlan && !loading && (
            <div className="text-center py-16 px-4">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-foreground mb-4">No Financial Plans Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first financial plan to start tracking your goals and projections.
                </p>
                <Button 
                  onClick={onCreatePlan}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Create Your First Plan
                </Button>
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
