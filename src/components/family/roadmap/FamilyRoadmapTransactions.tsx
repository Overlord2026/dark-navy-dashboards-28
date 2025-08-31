import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Car, 
  Utensils, 
  Heart, 
  Plane,
  ShoppingBag,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  account: string;
}

interface SpendingCategory {
  name: string;
  spent: number;
  budget: number;
  icon: any;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

export default function FamilyRoadmapTransactions() {
  const [timeframe, setTimeframe] = useState('month');
  
  const [transactions] = useState<Transaction[]>([
    { id: '1', date: '2024-12-01', description: 'Social Security Payment', category: 'Income', amount: 3420, type: 'income', account: 'Checking' },
    { id: '2', date: '2024-12-01', description: 'Pension Payment', category: 'Income', amount: 1850, type: 'income', account: 'Checking' },
    { id: '3', date: '2024-11-30', description: 'Costco Pharmacy', category: 'Healthcare', amount: -185, type: 'expense', account: 'Checking' },
    { id: '4', date: '2024-11-29', description: 'Electric Bill', category: 'Utilities', amount: -234, type: 'expense', account: 'Checking' },
    { id: '5', date: '2024-11-28', description: 'Grocery Shopping', category: 'Food & Dining', amount: -127, type: 'expense', account: 'Credit Card' },
    { id: '6', date: '2024-11-27', description: 'Gas Station', category: 'Transportation', amount: -65, type: 'expense', account: 'Credit Card' },
    { id: '7', date: '2024-11-26', description: 'Restaurant Dinner', category: 'Food & Dining', amount: -89, type: 'expense', account: 'Credit Card' },
    { id: '8', date: '2024-11-25', description: 'Amazon Purchase', category: 'Shopping', amount: -156, type: 'expense', account: 'Credit Card' },
  ]);

  const [spendingCategories] = useState<SpendingCategory[]>([
    { name: 'Housing', spent: 2850, budget: 3000, icon: Home, color: 'text-blue-500', trend: 'stable' },
    { name: 'Food & Dining', spent: 890, budget: 800, icon: Utensils, color: 'text-emerald-500', trend: 'up' },
    { name: 'Healthcare', spent: 650, budget: 700, icon: Heart, color: 'text-pink-500', trend: 'down' },
    { name: 'Transportation', spent: 420, budget: 500, icon: Car, color: 'text-orange-500', trend: 'down' },
    { name: 'Travel', spent: 320, budget: 600, icon: Plane, color: 'text-purple-500', trend: 'stable' },
    { name: 'Shopping', spent: 580, budget: 400, icon: ShoppingBag, color: 'text-red-500', trend: 'up' }
  ]);

  const handleRestrictedAction = (action: string) => {
    toast.error(`${action} requires premium plan`, {
      description: 'Upgrade to access detailed spending analytics'
    });
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netCashFlow = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Spending Analysis</h2>
          <p className="text-muted-foreground">Track and analyze your retirement spending patterns</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleRestrictedAction('Export transactions')}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
            <Lock className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleRestrictedAction('Advanced filtering')}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter
            <Lock className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Cash Flow Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Monthly Income</h3>
              <p className="text-2xl font-bold text-emerald-600">
                ${totalIncome.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Monthly Expenses</h3>
              <p className="text-2xl font-bold text-red-600">
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${netCashFlow >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
              <DollarSign className={`h-5 w-5 ${netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Net Cash Flow</h3>
              <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                ${netCashFlow.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Spending Categories */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spendingCategories.map((category, index) => {
            const progressPercent = Math.round((category.spent / category.budget) * 100);
            const isOverBudget = category.spent > category.budget;
            const Icon = category.icon;

            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${category.color}`} />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`h-3 w-3 ${
                      category.trend === 'up' ? 'text-red-500' :
                      category.trend === 'down' ? 'text-emerald-500 rotate-180' :
                      'text-gray-400'
                    }`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>${category.spent.toLocaleString()}</span>
                    <span className="text-muted-foreground">
                      ${category.budget.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(progressPercent, 100)} 
                    className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : ''}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progressPercent}% of budget</span>
                    {isOverBudget && (
                      <span className="text-red-500">Over budget!</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleRestrictedAction('View all transactions')}
            className="gap-2"
          >
            View All
            <Lock className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 8).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <CreditCard className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{transaction.account}</span>
                    <span>•</span>
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className={`font-semibold ${
                transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">Spending Insights</h3>
        <div className="space-y-2 text-blue-800">
          <p className="text-sm">• You're spending 11% more on food & dining this month compared to last month</p>
          <p className="text-sm">• Healthcare costs are down 15% - great progress on preventive care</p>
          <p className="text-sm">• Consider setting up automatic transfers for the $1,000+ monthly surplus</p>
          <p className="text-sm">• Travel budget has $280 remaining for December activities</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-100"
          onClick={() => handleRestrictedAction('Advanced insights')}
        >
          Get Detailed Analysis
          <Lock className="h-3 w-3 ml-2" />
        </Button>
      </Card>
    </div>
  );
}