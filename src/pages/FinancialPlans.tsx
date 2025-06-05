import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { PlanSuccessGauge } from "@/components/financial-plans/PlanSuccessGauge";
import { NetWorthChart } from "@/components/financial-plans/NetWorthChart";
import { GoalsList } from "@/components/financial-plans/GoalsList";
import { CreatePlanDialog } from "@/components/financial-plans/CreatePlanDialog";
import { ManagePlansDialog } from "@/components/financial-plans/ManagePlansDialog";
import { InfoIcon, Target, TrendingUp, DollarSign, PieChart } from "lucide-react";
import { FinancialPlansHeader } from "@/components/financial-plans/FinancialPlansHeader";
import { FinancialPlansActions } from "@/components/financial-plans/FinancialPlansActions";
import { PlanManagementSection } from "@/components/financial-plans/PlanManagementSection";
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
    <ThreeColumnLayout activeMainItem="financial-plans" title="">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Plans
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create comprehensive financial plans to achieve your goals. Track progress, manage assets, and build your financial future.
            </p>
          </div>

          {/* Action Section */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <FinancialPlansActions
                activePlan={activePlan}
                plans={plans}
                onCreatePlan={onCreatePlan}
                onSelectPlan={onSelectPlan}
              />
            </CardContent>
          </Card>

          {/* Plan Management */}
          {activePlan && (
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <PlanManagementSection
                  activePlan={activePlan}
                  onEditPlan={onEditPlan}
                  onDuplicatePlan={onDuplicatePlan}
                  onDeletePlan={onDeletePlan}
                />
              </CardContent>
            </Card>
          )}

          {/* Goals Section */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Your Financial Goals</h2>
              </div>
              <GoalsList 
                goals={goals} 
                onGoalUpdate={handleGoalUpdate}
              />
            </CardContent>
          </Card>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Success Gauge */}
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Plan Success Rate</h3>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <span>Success probability</span>
                    <InfoIcon className="h-4 w-4 ml-1" />
                  </div>
                </div>
                <PlanSuccessGauge successRate={activePlan.successRate || 0} />
              </CardContent>
            </Card>

            {/* Net Worth Chart */}
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <PieChart className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Net Worth Projection</h3>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <span>Growth over time</span>
                    <InfoIcon className="h-4 w-4 ml-1" />
                  </div>
                </div>
                <NetWorthChart />
              </CardContent>
            </Card>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Set Financial Goals</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Define and track your financial objectives — from retirement planning to major purchases like homes and vacations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Track Income & Expenses</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor your income streams, expenses, and savings to ensure you're on track for retirement and beyond.
                </p>
              </CardContent>
            </Card>
          </div>
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
