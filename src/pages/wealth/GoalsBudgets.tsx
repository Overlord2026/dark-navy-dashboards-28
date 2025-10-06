import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TargetIcon, CalendarIcon, StarIcon, PlusIcon, DollarSignIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useFinancialPlans } from "@/hooks/useFinancialPlans";
import { BudgetCategoryManager } from "@/components/budget/BudgetCategoryManager";
import { MonthlyBudgetPlanner } from "@/components/budget/MonthlyBudgetPlanner";
import { SpendingAnalysis } from "@/components/budget/SpendingAnalysis";
import { priorityOrder } from "@/types/goals";

const GoalsBudgets = () => {
  const { plans, activePlan, summary, loading } = useFinancialPlans();

  // Get all goals across all plans
  const allGoals = plans.flatMap(plan => 
    plan.goals.map(goal => ({
      ...goal,
      planName: plan.name,
      planId: plan.id
    }))
  );

  // Sort goals by priority and progress
  const prioritizedGoals = allGoals.sort((a, b) => {
    // Map string priorities to lowercase for consistency
    const normalizedAPriority = (a.priority?.toLowerCase() || 'medium') as keyof typeof priorityOrder;
    const normalizedBPriority = (b.priority?.toLowerCase() || 'medium') as keyof typeof priorityOrder;
    
    const aPriority = priorityOrder[normalizedAPriority] ?? 2;
    const bPriority = priorityOrder[normalizedBPriority] ?? 2;
    
    if (aPriority !== bPriority) return aPriority - bPriority;
    
    // If same priority, sort by progress (closer to completion first)
    const aProgress = a.targetAmount > 0 ? (a.currentAmount / a.targetAmount) : 0;
    const bProgress = b.targetAmount > 0 ? (b.currentAmount / b.targetAmount) : 0;
    return bProgress - aProgress;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Goals & Budgets</h1>
          <p className="text-muted-foreground">Track your financial goals and manage budgets</p>
        </div>
        <Button asChild>
          <Link to="/wealth/goals/retirement">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Goal
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="retirement">Retirement Goals</TabsTrigger>
          <TabsTrigger value="bucket-list">Bucket-List Goals</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Goals Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
                <TargetIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : summary.totalGoals}
                </div>
                <p className="text-xs text-muted-foreground">
                  {allGoals.filter(g => !g.isComplete).length} active, {allGoals.filter(g => g.isComplete).length} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : allGoals.length > 0 
                    ? Math.round(allGoals.reduce((acc, goal) => {
                        const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) : 0;
                        return acc + Math.min(progress * 100, 100);
                      }, 0) / allGoals.length) 
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Completion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Target</CardTitle>
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(allGoals.reduce((acc, goal) => acc + goal.targetAmount, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all goals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Deadline</CardTitle>
                <StarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(() => {
                    const upcomingGoals = allGoals
                      .filter(goal => !goal.isComplete && goal.targetDate)
                      .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
                    
                    if (upcomingGoals.length === 0) return "None";
                    
                    const nextGoal = upcomingGoals[0];
                    const daysUntil = Math.ceil((new Date(nextGoal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return daysUntil > 0 ? `${daysUntil}d` : "Overdue";
                  })()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {allGoals.find(goal => !goal.isComplete && goal.targetDate)?.title?.substring(0, 20) || "No deadlines"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Active Goals List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Financial Goals</CardTitle>
              <CardDescription>Track your progress towards financial objectives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading goals...</div>
              ) : prioritizedGoals.length > 0 ? (
                prioritizedGoals.slice(0, 5).map((goal) => {
                  const progress = goal.targetAmount > 0 
                    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
                    : 0;
                  
                  const getPriorityColor = (priority: string) => {
                    const normalized = priority?.toLowerCase();
                    switch (normalized) {
                      case 'top_aspiration': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900';
                      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
                      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
                      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
                      default: return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900';
                    }
                  };

                  return (
                    <div key={`${goal.planId}-${goal.id}`} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getPriorityColor(goal.priority)}`}>
                            <TargetIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium">{goal.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {goal.description || `From ${goal.planName}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(goal.currentAmount)} / {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(goal.targetAmount)}
                          </div>
                          <Badge variant={progress >= 100 ? "default" : progress >= 50 ? "secondary" : "outline"}>
                            {Math.round(progress)}% Complete
                          </Badge>
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No goals yet.{' '}
                  <Link to="/financial-planning" className="text-primary hover:underline">
                    Create your first financial plan
                  </Link>{' '}
                  to get started.
                </div>
              )}
              {prioritizedGoals.length > 5 && (
                <div className="text-center pt-4">
                  <Button asChild variant="outline">
                    <Link to="/financial-planning">View All Goals</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Access */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Retirement Goals
                </CardTitle>
                <CardDescription>Plan for your retirement future</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/wealth/goals/retirement">Manage Goals</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StarIcon className="h-5 w-5" />
                  Bucket-List Goals
                </CardTitle>
                <CardDescription>Track your personal aspirations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/wealth/goals/bucket-list">View Goals</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TargetIcon className="h-5 w-5" />
                  Budgets & Spending
                </CardTitle>
                <CardDescription>Track expenses and manage budgets</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/wealth/goals?tab=budgets">Manage Budgets</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retirement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retirement Planning</CardTitle>
              <CardDescription>Comprehensive retirement goal tracking and planning</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Retirement planning features will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bucket-list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bucket-List Goals</CardTitle>
              <CardDescription>Track and plan for your personal aspirations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Bucket-list goal features will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <Tabs defaultValue="planner" className="space-y-6">
            <TabsList>
              <TabsTrigger value="planner">Monthly Planner</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="planner">
              <MonthlyBudgetPlanner />
            </TabsContent>
            
            <TabsContent value="categories">
              <BudgetCategoryManager />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="spending" className="space-y-6">
          <SpendingAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalsBudgets;