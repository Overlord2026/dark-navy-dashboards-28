import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { defaultBudgetCategories } from '@/data/budgetCategories';
import { Transaction, SpendingAnalysis as SpendingAnalysisType } from '@/types/budget';

// Mock transaction data for demonstration
const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: 'user1',
    accountId: 'acc1',
    categoryId: 'groceries',
    amount: 120,
    description: 'Whole Foods Market',
    date: '2024-01-15',
    type: 'expense',
    status: 'completed',
    tags: ['food', 'groceries'],
    merchantName: 'Whole Foods',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    userId: 'user1',
    accountId: 'acc1',
    categoryId: 'gas',
    amount: 65,
    description: 'Shell Gas Station',
    date: '2024-01-14',
    type: 'expense',
    status: 'completed',
    tags: ['transportation', 'fuel'],
    merchantName: 'Shell',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
  },
  {
    id: '3',
    userId: 'user1',
    accountId: 'acc1',
    categoryId: 'dining-out',
    amount: 85,
    description: 'Restaurant Dinner',
    date: '2024-01-13',
    type: 'expense',
    status: 'completed',
    tags: ['food', 'dining'],
    merchantName: 'Local Restaurant',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
  },
  {
    id: '4',
    userId: 'user1',
    accountId: 'acc1',
    categoryId: 'utilities',
    amount: 180,
    description: 'Electric Bill',
    date: '2024-01-10',
    type: 'expense',
    status: 'completed',
    tags: ['housing', 'utilities'],
    merchantName: 'Electric Company',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: '5',
    userId: 'user1',
    accountId: 'acc1',
    categoryId: 'salary',
    amount: 5000,
    description: 'Salary Deposit',
    date: '2024-01-01',
    type: 'income',
    status: 'completed',
    tags: ['income', 'salary'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
];

export const SpendingAnalysis = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const spendingAnalysis = useMemo((): SpendingAnalysisType => {
    const expenses = mockTransactions.filter(t => t.type === 'expense');
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);

    // Top categories by spending
    const categoryTotals = expenses.reduce((acc, transaction) => {
      const categoryId = transaction.categoryId || 'uncategorized';
      acc[categoryId] = (acc[categoryId] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryTotals)
      .map(([categoryId, amount]) => {
        const category = defaultBudgetCategories.find(cat => cat.id === categoryId);
        const transactionCount = expenses.filter(t => t.categoryId === categoryId).length;
        return {
          categoryId,
          categoryName: category?.name || 'Uncategorized',
          amount,
          transactionCount,
          percentage: (amount / totalSpent) * 100,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // Monthly breakdown (simplified for demo)
    const monthlyBreakdown = [
      {
        month: '2024-01',
        totalSpent,
        categoryBreakdown: categoryTotals,
      },
    ];

    // Budget comparison (mock data)
    const budgetComparison = topCategories.map(cat => ({
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      budgeted: cat.amount * 1.2, // Mock budget 20% higher
      spent: cat.amount,
      variance: cat.amount * 0.2,
      status: cat.amount > cat.amount * 1.1 ? 'over' : cat.amount < cat.amount * 0.9 ? 'under' : 'on-track',
    })) as SpendingAnalysisType['budgetComparison'];

    return {
      topCategories,
      monthlyBreakdown,
      budgetComparison,
    };
  }, []);

  // Data for charts
  const barChartData = spendingAnalysis.topCategories.slice(0, 6).map(cat => ({
    name: cat.categoryName.length > 12 ? cat.categoryName.slice(0, 12) + '...' : cat.categoryName,
    amount: cat.amount,
  }));

  const pieChartData = spendingAnalysis.topCategories.slice(0, 5).map((cat, index) => ({
    name: cat.categoryName,
    value: cat.amount,
    color: COLORS[index % COLORS.length],
  }));

  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(totalIncome - totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">Income - Expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTransactions.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Your top spending categories this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Amount']}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spending Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Spending Distribution</CardTitle>
            <CardDescription>Percentage breakdown of your expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Detailed spending analysis by category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {spendingAnalysis.topCategories.map((category, index) => {
            const budgetItem = spendingAnalysis.budgetComparison.find(b => b.categoryId === category.categoryId);
            return (
              <div key={category.categoryId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <span className="font-medium">{category.categoryName}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({category.transactionCount} transactions)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(category.amount)}</div>
                    <Badge variant="secondary" className="text-xs">
                      {category.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                
                {budgetItem && (
                  <div className="ml-6">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                      <span>vs Budget: {formatCurrency(budgetItem.budgeted)}</span>
                      <span className={
                        budgetItem.status === 'over' ? 'text-destructive' :
                        budgetItem.status === 'under' ? 'text-success' : 'text-warning'
                      }>
                        {budgetItem.status === 'over' ? 'Over' : 
                         budgetItem.status === 'under' ? 'Under' : 'On Track'}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((category.amount / budgetItem.budgeted) * 100, 100)} 
                      className="h-1"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest spending activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTransactions
              .filter(t => t.type === 'expense')
              .slice(0, 5)
              .map((transaction) => {
                const category = defaultBudgetCategories.find(cat => cat.id === transaction.categoryId);
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category?.color || 'hsl(var(--muted))' }}
                      />
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {category?.name || 'Uncategorized'} • {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                      <Badge variant="outline" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};