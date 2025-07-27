import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, Target, Shield, PieChart, BarChart3, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useRoleContext } from '@/context/RoleContext';

export function ClientDashboard() {
  const { getCurrentClientTier } = useRoleContext();
  const clientTier = getCurrentClientTier();
  const isPremium = clientTier === 'premium';

  const portfolioMetrics = {
    totalValue: '$2,847,950',
    monthlyGrowth: '+5.8%',
    ytdReturn: '12.4%',
    riskScore: 'Moderate',
    assetAllocation: {
      stocks: 60,
      bonds: 25,
      alternatives: 15
    }
  };

  const goals = [
    { name: 'Retirement Planning', target: '$5M', current: '$2.8M', progress: 56, status: 'on-track' },
    { name: 'Education Fund', target: '$500K', current: '$285K', progress: 57, status: 'on-track' },
    { name: 'Emergency Fund', target: '$100K', current: '$100K', progress: 100, status: 'complete' }
  ];

  const recentTransactions = [
    { type: 'Investment', description: 'S&P 500 Index Fund', amount: '+$5,000', date: 'Mar 10, 2024' },
    { type: 'Dividend', description: 'Apple Inc. (AAPL)', amount: '+$156.80', date: 'Mar 8, 2024' },
    { type: 'Withdrawal', description: 'Living Expenses', amount: '-$3,500', date: 'Mar 5, 2024' },
    { type: 'Investment', description: 'Bond Portfolio', amount: '+$10,000', date: 'Mar 1, 2024' }
  ];

  const premiumFeatures = [
    { title: 'Advanced Tax Optimization', description: 'AI-powered tax loss harvesting and optimization strategies' },
    { title: 'Private Market Access', description: 'Exclusive access to private equity and hedge fund investments' },
    { title: 'Dedicated Advisor', description: '24/7 access to your personal wealth management team' },
    { title: 'Custom Estate Planning', description: 'Personalized estate planning and trust structures' }
  ];

  const upcomingEvents = [
    { title: 'Quarterly Portfolio Review', date: 'March 20, 2024', type: 'meeting' },
    { title: 'Tax Planning Session', date: 'March 25, 2024', type: 'consultation' },
    { title: 'Investment Committee Meeting', date: 'April 5, 2024', type: 'update' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Your Wealth Dashboard
            {isPremium && <Badge className="ml-3" variant="secondary"><Star className="h-3 w-3 mr-1" />Premium</Badge>}
          </h1>
          <p className="text-muted-foreground">
            Monitor your portfolio performance and financial goals
          </p>
        </div>
        <Button className="gap-2">
          <Target className="h-4 w-4" />
          Schedule Consultation
        </Button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioMetrics.totalValue}</div>
            <p className="text-xs text-muted-foreground">
              {portfolioMetrics.monthlyGrowth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioMetrics.ytdReturn}</div>
            <p className="text-xs text-muted-foreground">
              Outperforming benchmark by 2.1%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioMetrics.riskScore}</div>
            <p className="text-xs text-muted-foreground">
              Aligned with your goals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals on Track</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2/3</div>
            <p className="text-xs text-muted-foreground">
              1 goal completed this year
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>
              Current portfolio distribution across asset classes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Stocks</span>
                <span className="text-sm font-medium">{portfolioMetrics.assetAllocation.stocks}%</span>
              </div>
              <Progress value={portfolioMetrics.assetAllocation.stocks} className="w-full" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Bonds</span>
                <span className="text-sm font-medium">{portfolioMetrics.assetAllocation.bonds}%</span>
              </div>
              <Progress value={portfolioMetrics.assetAllocation.bonds} className="w-full" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Alternatives</span>
                <span className="text-sm font-medium">{portfolioMetrics.assetAllocation.alternatives}%</span>
              </div>
              <Progress value={portfolioMetrics.assetAllocation.alternatives} className="w-full" />
            </div>

            <Button variant="outline" className="w-full">
              View Detailed Holdings
            </Button>
          </CardContent>
        </Card>

        {/* Financial Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Goals</CardTitle>
            <CardDescription>
              Track progress toward your financial objectives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{goal.name}</span>
                  <Badge variant={
                    goal.status === 'complete' ? 'default' :
                    goal.status === 'on-track' ? 'secondary' : 'destructive'
                  }>
                    {goal.status === 'complete' ? 'Complete' :
                     goal.status === 'on-track' ? 'On Track' : 'Behind'}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{goal.current}</span>
                  <span>{goal.target}</span>
                </div>
                <Progress value={goal.progress} className="w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {isPremium && (
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Premium Features
            </CardTitle>
            <CardDescription>
              Exclusive benefits available to Premium clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg bg-background/50">
                  <h4 className="font-medium mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest account activity and transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'Investment' ? 'bg-green-500' :
                    transaction.type === 'Dividend' ? 'bg-blue-500' :
                    transaction.type === 'Withdrawal' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Scheduled meetings and important dates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
                <Badge variant="outline">{event.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button className="h-20 flex-col gap-2" variant="outline">
              <DollarSign className="h-6 w-6" />
              <span className="text-xs">Make Investment</span>
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <BarChart3 className="h-6 w-6" />
              <span className="text-xs">View Reports</span>
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <PieChart className="h-6 w-6" />
              <span className="text-xs">Rebalance Portfolio</span>
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Target className="h-6 w-6" />
              <span className="text-xs">Update Goals</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}