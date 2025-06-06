
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-primary/20 rounded-2xl shadow-lg">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-foreground">
                      Financial Plans
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      Create comprehensive financial plans to achieve your goals. Track progress, manage assets, and build your financial future.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="border border-border bg-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Goal Setting</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Define and track financial objectives from retirement to major purchases.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border bg-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Expense Tracking</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monitor income streams and expenses to stay on track for your goals.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Current Plan & Goals */}
            <div className="lg:col-span-2 space-y-8">
              {/* Goals Section */}
              <Card className="border border-border bg-card shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Financial Goals</h2>
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
              {/* Plan Selector - Coming Soon */}
              <Card className="border border-border bg-card shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Plan Selection</h3>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Coming Soon
                    </Badge>
                  </div>
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <div className="p-3 bg-muted/50 rounded-full mb-3">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Plan selection and management features coming soon
                    </p>
                    <Button 
                      onClick={onCreatePlan}
                      disabled
                      className="bg-primary text-primary-foreground opacity-50 cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics Cards */}
              <div className="space-y-6">
                {/* Plan Success Rate - Coming Soon */}
                <Card className="border border-border bg-card shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-success/20 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-success" />
                        </div>
                        <h3 className="font-semibold text-foreground">Projected Plan Success</h3>
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
                <Card className="border border-border bg-card shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <PieChart className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground">Projected Networth</h3>
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
