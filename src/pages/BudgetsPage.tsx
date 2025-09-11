import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Target
} from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { PremiumWrapper } from '@/components/ui/premium-badge';
import { toast } from 'sonner';

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  color: string;
}

interface MonthlyBudget {
  month: string;
  totalIncome: number;
  totalBudgeted: number;
  totalSpent: number;
  categories: BudgetCategory[];
}

export const BudgetsPage = () => {
  const { checkFeatureAccessByKey } = useFeatureAccess();
  const hasAdvancedBudgets = checkFeatureAccessByKey('premium_analytics_access');

  const [currentBudget] = useState<MonthlyBudget>({
    month: 'February 2024',
    totalIncome: 15000,
    totalBudgeted: 12500,
    totalSpent: 8750,
    categories: [
      {
        id: '1',
        name: 'Housing',
        budgeted: 4000,
        spent: 4000,
        remaining: 0,
        color: 'bg-blue-500'
      },
      {
        id: '2', 
        name: 'Transportation',
        budgeted: 1200,
        spent: 890,
        remaining: 310,
        color: 'bg-green-500'
      },
      {
        id: '3',
        name: 'Food & Dining',
        budgeted: 800,
        spent: 645,
        remaining: 155,
        color: 'bg-yellow-500'
      },
      {
        id: '4',
        name: 'Utilities',
        budgeted: 400,
        spent: 385,
        remaining: 15,
        color: 'bg-purple-500'
      },
      {
        id: '5',
        name: 'Entertainment',
        budgeted: 600,
        spent: 750,
        remaining: -150,
        color: 'bg-red-500'
      },
      {
        id: '6',
        name: 'Healthcare',
        budgeted: 300,
        spent: 125,
        remaining: 175,
        color: 'bg-indigo-500'
      }
    ]
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    budgeted: ''
  });

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.budgeted) {
      toast.error('Please fill in all fields');
      return;
    }
    
    toast.success(`Budget category "${newCategory.name}" added successfully`);
    setNewCategory({ name: '', budgeted: '' });
  };

  const getProgressColor = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTrendIcon = (remaining: number) => {
    if (remaining < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    if (remaining > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    return <Target className="h-4 w-4 text-blue-500" />;
  };

  const savingsRate = ((currentBudget.totalIncome - currentBudget.totalSpent) / currentBudget.totalIncome) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground">
            Track spending, manage budgets, and reach your financial goals
          </p>
        </div>
        <PremiumWrapper isPremium={hasAdvancedBudgets} showBadge>
          <Badge variant="outline" className="ml-2">
            {hasAdvancedBudgets ? 'Advanced Analytics' : 'Basic Budgets'}
          </Badge>
        </PremiumWrapper>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Budget Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentBudget.totalIncome.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Total income for {currentBudget.month}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentBudget.totalBudgeted.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Allocated across all categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentBudget.totalSpent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {((currentBudget.totalSpent / currentBudget.totalBudgeted) * 100).toFixed(1)}% of budget used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Of total income saved
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Budget Progress */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Budget Categories</CardTitle>
                <CardDescription>
                  Your spending across different budget categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentBudget.categories.map((category) => {
                  const percentage = (category.spent / category.budgeted) * 100;
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <span className="font-medium">{category.name}</span>
                          {getTrendIcon(category.remaining)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${category.spent} / ${category.budgeted}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{percentage.toFixed(1)}% used</span>
                          <span
                            className={category.remaining >= 0 ? 'text-green-600' : 'text-red-600'}
                          >
                            {category.remaining >= 0 ? '+' : ''}${category.remaining}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      placeholder="Enter category name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetAmount">Budget Amount</Label>
                    <Input
                      id="budgetAmount"
                      type="number"
                      placeholder="0.00"
                      value={newCategory.budgeted}
                      onChange={(e) => setNewCategory({...newCategory, budgeted: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddCategory} className="w-full">
                    Add Category
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Overall Status</span>
                      <Badge className="bg-green-100 text-green-800">
                        On Track
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Categories Over Budget</span>
                      <span className="text-sm font-medium">
                        {currentBudget.categories.filter(c => c.remaining < 0).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Remaining This Month</span>
                      <span className="text-sm font-medium text-green-600">
                        ${(currentBudget.totalBudgeted - currentBudget.totalSpent).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>
                Manage your budget categories and allocations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentBudget.categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${category.color}`} />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${category.spent} of ${category.budgeted} spent
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {category.remaining < 0 ? (
                        <Badge className="bg-red-100 text-red-800">
                          Over by ${Math.abs(category.remaining)}
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">
                          ${category.remaining} left
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>
                  Analyze your spending patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Detailed spending trends and forecasting available with Premium
                  </p>
                  {!hasAdvancedBudgets && (
                    <Button>Upgrade for Advanced Analytics</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Insights</CardTitle>
                <CardDescription>
                  AI-powered insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Great job on transportation!</div>
                      <div className="text-sm text-muted-foreground">
                        You're 25% under budget this month
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Watch entertainment spending</div>
                      <div className="text-sm text-muted-foreground">
                        You've exceeded your budget by $150
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Excellent savings rate</div>
                      <div className="text-sm text-muted-foreground">
                        You're saving {savingsRate.toFixed(1)}% of your income
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};