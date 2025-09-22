import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Calendar,
  PieChart,
  Wallet,
  Building2,
  Heart,
  RefreshCw
} from 'lucide-react';
import { useAccountAggregation } from '@/hooks/useAccountAggregation';

interface AccountAggregationPanelProps {
  clientId?: string;
  compact?: boolean;
}

export function AccountAggregationPanel({ clientId, compact = false }: AccountAggregationPanelProps) {
  const { accounts, summary, loading, refreshAccounts } = useAccountAggregation(clientId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPerformanceColor = (performance: number) => {
    return performance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPerformanceIcon = (performance: number) => {
    return performance >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total AUM</span>
            </div>
            <div className="text-xl font-bold">{formatCurrency(summary.totalBalance)}</div>
            <div className="flex items-center gap-1 text-sm">
              {getPerformanceIcon(summary.performanceToday)}
              <span className={getPerformanceColor(summary.performanceToday)}>
                {summary.performanceToday > 0 ? '+' : ''}{summary.performanceToday.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Investments</span>
            </div>
            <div className="text-xl font-bold">{formatCurrency(summary.totalInvestments)}</div>
            <div className="flex items-center gap-1 text-sm">
              {getPerformanceIcon(summary.performanceYTD)}
              <span className={getPerformanceColor(summary.performanceYTD)}>
                {summary.performanceYTD > 0 ? '+' : ''}{summary.performanceYTD.toFixed(1)}% YTD
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">RMDs Due</span>
            </div>
            <div className="text-xl font-bold text-orange-600">{summary.upcomingRMDs.length}</div>
            <div className="text-sm text-muted-foreground">
              {summary.upcomingRMDs.length > 0 ? 'Action required' : 'All current'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Alerts</span>
            </div>
            <div className="text-xl font-bold text-amber-600">{summary.rebalanceAlerts.length}</div>
            <div className="text-sm text-muted-foreground">
              {summary.rebalanceAlerts.length > 0 ? 'Need attention' : 'All good'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalBalance)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getPerformanceIcon(summary.performanceToday)}
                  <span className={`text-sm ${getPerformanceColor(summary.performanceToday)}`}>
                    {summary.performanceToday > 0 ? '+' : ''}{summary.performanceToday.toFixed(2)}% today
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Investments</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalInvestments)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getPerformanceIcon(summary.performanceYTD)}
                  <span className={`text-sm ${getPerformanceColor(summary.performanceYTD)}`}>
                    {summary.performanceYTD > 0 ? '+' : ''}{summary.performanceYTD.toFixed(1)}% YTD
                  </span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cash & Savings</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalCash)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {((summary.totalCash / summary.totalBalance) * 100).toFixed(1)}% allocation
                </p>
              </div>
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">HSA Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalHSA)}</p>
                <p className="text-sm text-muted-foreground mt-1">Health savings</p>
              </div>
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RMD Alerts */}
        {summary.upcomingRMDs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Calendar className="h-5 w-5" />
                Upcoming Required Distributions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.upcomingRMDs.map((rmd) => (
                <div key={rmd.accountId} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div>
                    <p className="font-medium">{rmd.accountName}</p>
                    {rmd.clientName && <p className="text-sm text-muted-foreground">{rmd.clientName}</p>}
                    <p className="text-sm text-orange-600">Due: {new Date(rmd.deadline).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">{formatCurrency(rmd.amount)}</p>
                    <Button size="sm" variant="outline" className="mt-1">
                      Process RMD
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Rebalance Alerts */}
        {summary.rebalanceAlerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
                Portfolio Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.rebalanceAlerts.map((alert) => (
                <div key={alert.accountId} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{alert.accountName}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                      {alert.severity}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Account List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Account Details
            </CardTitle>
            <Button variant="outline" size="sm" onClick={refreshAccounts}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      account.type === 'investment' ? 'bg-blue-500' :
                      account.type === 'bank' ? 'bg-green-500' :
                      account.type === 'retirement' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`} />
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.institution} • {account.type.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  {account.performance && (
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className={getPerformanceColor(account.performance.oneDay)}>
                        1D: {account.performance.oneDay > 0 ? '+' : ''}{account.performance.oneDay.toFixed(2)}%
                      </span>
                      <span className={getPerformanceColor(account.performance.ytd)}>
                        YTD: {account.performance.ytd > 0 ? '+' : ''}{account.performance.ytd.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{formatCurrency(account.balance)}</p>
                  <p className="text-sm text-muted-foreground">
                    Updated {new Date(account.lastUpdate).toLocaleDateString()}
                  </p>
                  {account.rmdRequired && (
                    <Badge variant="outline" className="mt-1 text-orange-600 border-orange-600">
                      RMD Required
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}