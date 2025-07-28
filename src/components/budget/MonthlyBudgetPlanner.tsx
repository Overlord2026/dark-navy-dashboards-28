import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, PlusIcon, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { defaultBudgetCategories } from '@/data/budgetCategories';
import { Budget, BudgetCategory } from '@/types/budget';

// Mock data for demonstration
const mockBudgets: Budget[] = [
  {
    id: '1',
    userId: 'user1',
    categoryId: 'housing',
    targetAmount: 3000,
    actualAmount: 2800,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    userId: 'user1',
    categoryId: 'food',
    targetAmount: 800,
    actualAmount: 950,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: '3',
    userId: 'user1',
    categoryId: 'transportation',
    targetAmount: 600,
    actualAmount: 520,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
];

export const MonthlyBudgetPlanner = () => {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [newBudget, setNewBudget] = useState<Partial<Budget>>({
    period: 'monthly',
    targetAmount: 0,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.actualAmount / budget.targetAmount) * 100;
    if (percentage <= 85) return 'under';
    if (percentage <= 100) return 'on-track';
    return 'over';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'on-track': return <CheckCircle className="h-4 w-4 text-warning" />;
      case 'over': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under': return 'text-success';
      case 'on-track': return 'text-warning';
      case 'over': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const summary = useMemo(() => {
    const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.targetAmount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.actualAmount, 0);
    const underBudget = budgets.filter(b => getBudgetStatus(b) === 'under').length;
    const overBudget = budgets.filter(b => getBudgetStatus(b) === 'over').length;
    
    return {
      totalBudgeted,
      totalSpent,
      remaining: totalBudgeted - totalSpent,
      underBudget,
      overBudget,
      onTrack: budgets.length - underBudget - overBudget,
    };
  }, [budgets]);

  const handleAddBudget = () => {
    if (newBudget.categoryId && newBudget.targetAmount) {
      const budget: Budget = {
        id: Date.now().toString(),
        userId: 'user1',
        categoryId: newBudget.categoryId,
        targetAmount: newBudget.targetAmount,
        actualAmount: 0,
        period: 'monthly',
        startDate: `${selectedMonth}-01`,
        endDate: `${selectedMonth}-31`,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setBudgets([...budgets, budget]);
      setNewBudget({ period: 'monthly', targetAmount: 0 });
      setShowAddForm(false);
    }
  };

  const handleUpdateBudget = (budgetId: string, targetAmount: number) => {
    setBudgets(budgets.map(budget => 
      budget.id === budgetId 
        ? { ...budget, targetAmount, updatedAt: new Date().toISOString() }
        : budget
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Monthly Budget Planner</h3>
          <p className="text-sm text-muted-foreground">
            Set target amounts and track your spending by category
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            />
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalBudgeted)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              {((summary.totalSpent / summary.totalBudgeted) * 100).toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(summary.remaining)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-success">Under Budget</span>
                <span>{summary.underBudget}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-warning">On Track</span>
                <span>{summary.onTrack}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-destructive">Over Budget</span>
                <span>{summary.overBudget}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Budget Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Budget Category</CardTitle>
            <CardDescription>Set a spending target for a new category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newBudget.categoryId || ''}
                  onValueChange={(value) => setNewBudget({ ...newBudget, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultBudgetCategories
                      .filter(cat => cat.type === 'expense' && !cat.parentCategory)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="target-amount">Target Amount</Label>
                <Input
                  id="target-amount"
                  type="number"
                  placeholder="0"
                  value={newBudget.targetAmount || ''}
                  onChange={(e) => setNewBudget({ ...newBudget, targetAmount: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddBudget}>Add Budget</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget List */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
          <CardDescription>Track your spending against your targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgets.map((budget) => {
            const category = defaultBudgetCategories.find(cat => cat.id === budget.categoryId);
            const status = getBudgetStatus(budget);
            const percentage = Math.min((budget.actualAmount / budget.targetAmount) * 100, 100);
            const remaining = budget.targetAmount - budget.actualAmount;
            
            return (
              <div key={budget.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category?.color || 'hsl(var(--primary))' }}
                    />
                    <div>
                      <h4 className="font-medium">{category?.name || 'Unknown Category'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(budget.actualAmount)} of {formatCurrency(budget.targetAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <Badge variant={status === 'over' ? 'destructive' : status === 'under' ? 'default' : 'secondary'}>
                      {percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                
                <Progress value={percentage} className="h-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <span className={getStatusColor(status)}>
                    {remaining >= 0 
                      ? `${formatCurrency(remaining)} remaining`
                      : `${formatCurrency(Math.abs(remaining))} over budget`
                    }
                  </span>
                  <Input
                    type="number"
                    value={budget.targetAmount}
                    onChange={(e) => handleUpdateBudget(budget.id, Number(e.target.value))}
                    className="w-24 h-8 text-right"
                  />
                </div>
              </div>
            );
          })}
          
          {budgets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No budgets set up yet. Click "Add Budget" to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};