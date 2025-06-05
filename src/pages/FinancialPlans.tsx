
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { GoalsList } from "@/components/financial-plans/GoalsList";
import { CreatePlanDialog } from "@/components/financial-plans/CreatePlanDialog";
import { ManagePlansDialog } from "@/components/financial-plans/ManagePlansDialog";
import { Target, TrendingUp, DollarSign, PieChart, Clock, Plus, Settings } from "lucide-react";
import { FinancialPlansActions } from "@/components/financial-plans/FinancialPlansActions";
import { PlanManagementSection } from "@/components/financial-plans/PlanManagementSection";
import { useFinancialPlansState } from "@/hooks/useFinancialPlansState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-6 py-8">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Financial Plans
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      Create comprehensive financial plans to achieve your goals. Track progress, manage assets, and build your financial future.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="lg:w-80">
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Plus className="h-5 w-5 text-blue-600" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Button 
                        onClick={onCreatePlan}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Plan
                      </Button>
                      <Button 
                        onClick={() => setIsManagePlansOpen(true)}
                        variant="outline"
                        className="w-full"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Plans
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Current Plan & Goals */}
            <div className="lg:col-span-2 space-y-8">
              {/* Current Plan Section */}
              {activePlan && (
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                          <Target className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">Current Plan</h2>
                          <p className="text-muted-foreground">Your active financial strategy</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>
                    
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
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Financial Goals</h2>
                      <p className="text-muted-foreground">Track your progress towards financial milestones</p>
                    </div>
                  </div>
                  <GoalsList 
                    goals={goals} 
                    onGoalUpdate={handleGoalUpdate}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Analytics & Features */}
            <div className="space-y-8">
              {/* Plan Selector */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Plan Selection</h3>
                  <FinancialPlansActions
                    activePlan={activePlan}
                    plans={plans}
                    onCreatePlan={onCreatePlan}
                    onSelectPlan={onSelectPlan}
                  />
                </CardContent>
              </Card>

              {/* Analytics Cards */}
              <div className="space-y-6">
                {/* Plan Success Rate - Coming Soon */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold">Success Rate</h3>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Coming Soon
                      </Badge>
                    </div>
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                      <div className="p-3 bg-muted/50 rounded-full mb-3">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Plan success analysis coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Net Worth Projection - Coming Soon */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <PieChart className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold">Net Worth</h3>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Coming Soon
                      </Badge>
                    </div>
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                      <div className="p-3 bg-muted/50 rounded-full mb-3">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Net worth projections coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Feature Highlights */}
                <div className="space-y-4">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Target className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="font-semibold">Goal Setting</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Define and track financial objectives from retirement to major purchases.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <DollarSign className="h-5 w-5 text-purple-600" />
                        </div>
                        <h4 className="font-semibold">Expense Tracking</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Monitor income streams and expenses to stay on track for your goals.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
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
