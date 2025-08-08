import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart3, 
  DollarSign,
  Target,
  AlertTriangle,
  Settings,
  RefreshCw
} from 'lucide-react';

interface AllocationData {
  phase: string;
  allocated: number;
  target: number;
  percentage: number;
  status: 'on_track' | 'over_allocated' | 'under_allocated';
}

interface AccountAllocation {
  accountName: string;
  accountType: string;
  balance: number;
  targetPhase: string;
  currentAllocation: number;
  recommendedAllocation: number;
}

const SAMPLE_ALLOCATION_DATA: AllocationData[] = [
  { phase: 'Income Now', allocated: 250000, target: 200000, percentage: 15, status: 'over_allocated' },
  { phase: 'Income Later', allocated: 750000, target: 800000, percentage: 45, status: 'under_allocated' },
  { phase: 'Growth', allocated: 500000, target: 600000, percentage: 30, status: 'under_allocated' },
  { phase: 'Legacy', allocated: 167000, target: 150000, percentage: 10, status: 'on_track' }
];

const SAMPLE_ACCOUNT_DATA: AccountAllocation[] = [
  {
    accountName: '401(k) Primary',
    accountType: 'Tax-Deferred',
    balance: 425000,
    targetPhase: 'Income Later',
    currentAllocation: 425000,
    recommendedAllocation: 425000
  },
  {
    accountName: 'Roth IRA',
    accountType: 'Tax-Free',
    balance: 150000,
    targetPhase: 'Growth',
    currentAllocation: 150000,
    recommendedAllocation: 200000
  },
  {
    accountName: 'Brokerage Account',
    accountType: 'Taxable',
    balance: 300000,
    targetPhase: 'Income Now',
    currentAllocation: 200000,
    recommendedAllocation: 150000
  },
  {
    accountName: 'HSA',
    accountType: 'Tax-Free',
    balance: 85000,
    targetPhase: 'Growth',
    currentAllocation: 85000,
    recommendedAllocation: 85000
  }
];

const PHASE_COLORS = {
  'Income Now': '#10B981',
  'Income Later': '#3B82F6', 
  'Growth': '#8B5CF6',
  'Legacy': '#F59E0B'
};

export default function InvestmentAllocationDashboard() {
  const [viewMode, setViewMode] = useState<'phase' | 'account'>('phase');
  const [showRecommendations, setShowRecommendations] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-emerald';
      case 'over_allocated': return 'text-warning';
      case 'under_allocated': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track': return '✓';
      case 'over_allocated': return '↑';
      case 'under_allocated': return '↓';
      default: return '—';
    }
  };

  const totalPortfolioValue = SAMPLE_ALLOCATION_DATA.reduce((sum, item) => sum + item.allocated, 0);
  const pieData = SAMPLE_ALLOCATION_DATA.map(item => ({
    name: item.phase,
    value: item.allocated,
    color: PHASE_COLORS[item.phase as keyof typeof PHASE_COLORS]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Investment Allocation Dashboard</h1>
              <p className="text-muted-foreground">Phase-based portfolio allocation and investment management</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setShowRecommendations(!showRecommendations)}>
                <Settings className="h-4 w-4 mr-2" />
                {showRecommendations ? 'Hide' : 'Show'} Recommendations
              </Button>
              <Button className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Rebalance Portfolio
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Portfolio</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phases On Track</p>
                    <p className="text-2xl font-bold">
                      {SAMPLE_ALLOCATION_DATA.filter(item => item.status === 'on_track').length} / {SAMPLE_ALLOCATION_DATA.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rebalancing Needed</p>
                    <p className="text-2xl font-bold">
                      {SAMPLE_ALLOCATION_DATA.filter(item => item.status !== 'on_track').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Return</p>
                    <p className="text-2xl font-bold">7.2%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phase" className="gap-2">
                <PieChartIcon className="h-4 w-4" />
                View by Phase
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                View by Account
              </TabsTrigger>
            </TabsList>

            {/* Phase View */}
            <TabsContent value="phase" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Allocation Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Allocation by Phase</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Target vs Actual */}
                <Card>
                  <CardHeader>
                    <CardTitle>Target vs Actual Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={SAMPLE_ALLOCATION_DATA}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="phase" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Bar dataKey="target" fill="hsl(var(--muted))" name="Target" />
                        <Bar dataKey="allocated" fill="hsl(var(--primary))" name="Current" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Phase Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SAMPLE_ALLOCATION_DATA.map((phase) => (
                  <Card key={phase.phase}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{phase.phase}</CardTitle>
                        <Badge variant={phase.status === 'on_track' ? 'default' : 'destructive'}>
                          {getStatusIcon(phase.status)} {phase.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Current</p>
                          <p className="font-semibold">{formatCurrency(phase.allocated)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Target</p>
                          <p className="font-semibold">{formatCurrency(phase.target)}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Allocation</span>
                          <span className="font-medium">{phase.percentage}%</span>
                        </div>
                        <Progress value={phase.percentage} className="h-2" />
                      </div>

                      <div className={`text-sm ${getStatusColor(phase.status)}`}>
                        {phase.status === 'on_track' && 'Properly allocated'}
                        {phase.status === 'over_allocated' && `${formatCurrency(phase.allocated - phase.target)} over target`}
                        {phase.status === 'under_allocated' && `${formatCurrency(phase.target - phase.allocated)} needed`}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Account View */}
            <TabsContent value="account" className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {SAMPLE_ACCOUNT_DATA.map((account) => (
                  <Card key={account.accountName}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{account.accountName}</h3>
                          <p className="text-muted-foreground">{account.accountType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
                          <Badge variant="outline">→ {account.targetPhase}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Allocation</p>
                          <p className="text-lg font-semibold">{formatCurrency(account.currentAllocation)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Recommended</p>
                          <p className="text-lg font-semibold">{formatCurrency(account.recommendedAllocation)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Adjustment Needed</p>
                          <p className={`text-lg font-semibold ${
                            account.currentAllocation === account.recommendedAllocation ? 'text-emerald' :
                            account.currentAllocation > account.recommendedAllocation ? 'text-warning' : 'text-blue-500'
                          }`}>
                            {account.currentAllocation === account.recommendedAllocation ? 'None' :
                             formatCurrency(Math.abs(account.currentAllocation - account.recommendedAllocation))}
                          </p>
                        </div>
                      </div>

                      {account.currentAllocation !== account.recommendedAllocation && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm">
                            <strong>Recommendation:</strong> {' '}
                            {account.currentAllocation > account.recommendedAllocation 
                              ? `Reduce allocation by ${formatCurrency(account.currentAllocation - account.recommendedAllocation)}`
                              : `Increase allocation by ${formatCurrency(account.recommendedAllocation - account.currentAllocation)}`
                            }
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Rebalancing Recommendations */}
          {showRecommendations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Rebalancing Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">High Priority Actions</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="text-sm">Increase Growth phase allocation by $100k</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <span className="text-sm">Reduce Income Now phase by $50k</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Tax Optimization</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Consider Roth conversion for Growth phase</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald" />
                          <span className="text-sm">Tax-loss harvesting opportunity in brokerage</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Projected Impact of Rebalancing
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 dark:text-blue-300">Expected Return Improvement</p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">+0.3% annually</p>
                      </div>
                      <div>
                        <p className="text-blue-700 dark:text-blue-300">Risk Reduction</p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">5% volatility decrease</p>
                      </div>
                      <div>
                        <p className="text-blue-700 dark:text-blue-300">Tax Savings</p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">$12,000 annually</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}