import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  PieChart,
  BarChart3,
  Target,
  Home,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings,
  Plus
} from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { PremiumWrapper } from '@/components/ui/premium-badge';
import { Link } from 'react-router-dom';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  change: number;
  changePercent: number;
}

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
}

export const WealthDashboardPage = () => {
  const { checkFeatureAccessByKey } = useFeatureAccess();
  const hasAdvancedAnalytics = checkFeatureAccessByKey('premium_analytics_access');

  const [accounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Investment Portfolio',
      type: 'Investment',
      balance: 2450000,
      change: 45000,
      changePercent: 1.87
    },
    {
      id: '2',
      name: 'Primary Checking',
      type: 'Checking',
      balance: 125000,
      change: -2500,
      changePercent: -1.96
    },
    {
      id: '3',
      name: 'Savings Account',
      type: 'Savings',
      balance: 350000,
      change: 1200,
      changePercent: 0.34
    },
    {
      id: '4',
      name: 'Real Estate',
      type: 'Property',
      balance: 1800000,
      change: 25000,
      changePercent: 1.41
    }
  ]);

  const [goals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Retirement Fund',
      target: 5000000,
      current: 2450000,
      deadline: '2040-01-01',
      category: 'Retirement'
    },
    {
      id: '2',
      name: 'Vacation Home',
      target: 800000,
      current: 320000,
      deadline: '2025-06-01',
      category: 'Property'
    },
    {
      id: '3',
      name: 'Emergency Fund',
      target: 200000,
      current: 175000,
      deadline: '2024-12-01',
      category: 'Security'
    }
  ]);

  const totalNetWorth = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalChange = accounts.reduce((sum, account) => sum + account.change, 0);
  const totalChangePercent = (totalChange / (totalNetWorth - totalChange)) * 100;

  const getChangeIcon = (change: number) => {
    return change >= 0 ? 
      <ArrowUpRight className="h-4 w-4 text-green-500" /> : 
      <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'Investment': return <BarChart3 className="h-4 w-4" />;
      case 'Checking': return <CreditCard className="h-4 w-4" />;
      case 'Savings': return <Banknote className="h-4 w-4" />;
      case 'Property': return <Home className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const quickActions = [
    { name: 'Add Account', href: '/wealth/accounts', icon: Plus },
    { name: 'Transfer Funds', href: '/wealth/cash/transfers', icon: ArrowUpRight },
    { name: 'Create Goal', href: '/wealth/goals', icon: Target },
    { name: 'View Reports', href: '/reports', icon: BarChart3 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Family Wealth Dashboard</h1>
          <p className="text-muted-foreground">
            Your complete family office financial overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PremiumWrapper isPremium={hasAdvancedAnalytics} showBadge>
            <Badge variant="outline">
              {hasAdvancedAnalytics ? 'Advanced Analytics' : 'Basic View'}
            </Badge>
          </PremiumWrapper>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Net Worth Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Net Worth</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalNetWorth.toLocaleString()}</div>
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(totalChange)}`}>
              {getChangeIcon(totalChange)}
              <span>
                {totalChange >= 0 ? '+' : ''}${totalChange.toLocaleString()} 
                ({totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Liquid Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(accounts.find(a => a.type === 'Checking')?.balance || 0 + accounts.find(a => a.type === 'Savings')?.balance || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for immediate use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Investment Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((accounts.find(a => a.type === 'Investment')?.changePercent || 0)).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Portfolio performance
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Account Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>
                  Your financial accounts and their current performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getAccountIcon(account.type)}
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-muted-foreground">{account.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${account.balance.toLocaleString()}</div>
                      <div className={`text-sm flex items-center gap-1 ${getChangeColor(account.change)}`}>
                        {getChangeIcon(account.change)}
                        <span>
                          {account.change >= 0 ? '+' : ''}${Math.abs(account.change).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Link to="/wealth/accounts">
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Accounts
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <Button variant="outline" className="w-full justify-start">
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.name}
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts">
          <div className="grid lg:grid-cols-2 gap-6">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getAccountIcon(account.type)}
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                    </div>
                    <Badge variant="outline">{account.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold">${account.balance.toLocaleString()}</div>
                      <div className={`text-sm flex items-center gap-1 ${getChangeColor(account.change)}`}>
                        {getChangeIcon(account.change)}
                        <span>
                          {account.change >= 0 ? '+' : ''}${Math.abs(account.change).toLocaleString()} 
                          ({account.changePercent >= 0 ? '+' : ''}{account.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Financial Goals</h3>
              <Link to="/wealth/goals">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </Link>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                const yearsToDeadline = new Date(goal.deadline).getFullYear() - new Date().getFullYear();
                
                return (
                  <Card key={goal.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <Badge variant="outline">{goal.category}</Badge>
                      </div>
                      <CardDescription>
                        Target: ${goal.target.toLocaleString()} by {new Date(goal.deadline).getFullYear()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress: ${goal.current.toLocaleString()}</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                          ${(goal.target - goal.current).toLocaleString()} remaining • {yearsToDeadline} years
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Wealth Insights</CardTitle>
                <CardDescription>
                  AI-powered analysis of your financial position
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasAdvancedAnalytics ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">Strong Portfolio Diversification</div>
                      <div className="text-sm text-green-600">
                        Your assets are well-distributed across multiple sectors
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">Emergency Fund Status</div>
                      <div className="text-sm text-blue-600">
                        You have 6.8 months of expenses covered
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-yellow-800">Tax Optimization Opportunity</div>
                      <div className="text-sm text-yellow-600">
                        Consider tax-loss harvesting to reduce tax burden
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Advanced Insights</h3>
                    <p className="text-muted-foreground mb-4">
                      Get AI-powered financial insights and recommendations
                    </p>
                    <Button>Upgrade for Advanced Insights</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators for your wealth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Asset Allocation</span>
                    <span className="text-sm font-medium">Optimized</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Risk Score</span>
                    <span className="text-sm font-medium">Moderate (6/10)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Goal Progress</span>
                    <span className="text-sm font-medium">On Track</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cash Flow</span>
                    <span className="text-sm font-medium text-green-600">Positive</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Debt-to-Asset Ratio</span>
                    <span className="text-sm font-medium">12%</span>
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