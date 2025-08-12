import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Shield
} from 'lucide-react';

interface OutcomeMetrics {
  ISP: number;  // Income Sufficiency Probability
  DGBP: number; // Drawdown Guardrail Breach Probability
  LCR: number;  // Longevity Coverage Ratio
  LCI: number;  // Legacy Confidence Index
  ATE: number;  // After-Tax Efficiency
  OS: number;   // Composite OutcomeScore
}

interface MonitoringPanelProps {
  metrics: OutcomeMetrics;
  proposals: any[];
}

export const MonitoringPanel: React.FC<MonitoringPanelProps> = ({ 
  metrics = {
    ISP: 0.87,
    DGBP: 0.15,
    LCR: 1.24,
    LCI: 0.78,
    ATE: 0.82,
    OS: 84
  }, 
  proposals = [] 
}) => {
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
  
  const getMetricStatus = (value: number, isInverse = false) => {
    const threshold = isInverse ? 0.2 : 0.8;
    if (isInverse) {
      return value <= threshold ? 'good' : value <= 0.3 ? 'warning' : 'alert';
    }
    return value >= threshold ? 'good' : value >= 0.6 ? 'warning' : 'alert';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'alert': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Outcome Score Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              SWAG Outcome Score™
            </CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-primary mb-2">{metrics.OS}</div>
            <p className="text-muted-foreground">Overall Retirement Confidence</p>
            <Progress value={metrics.OS} className="mt-3" />
          </div>
        </CardContent>
      </Card>

      {/* Individual Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Income Sufficiency Probability</span>
              {getStatusIcon(getMetricStatus(metrics.ISP))}
            </div>
            <div className="text-2xl font-bold mb-1">{formatPercentage(metrics.ISP)}</div>
            <p className="text-sm text-muted-foreground">Probability your income needs are met</p>
            <Progress value={metrics.ISP * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Drawdown Guardrail Breach</span>
              {getStatusIcon(getMetricStatus(metrics.DGBP, true))}
            </div>
            <div className="text-2xl font-bold mb-1">{formatPercentage(metrics.DGBP)}</div>
            <p className="text-sm text-muted-foreground">Risk of portfolio value declining too fast</p>
            <Progress value={metrics.DGBP * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Longevity Coverage Ratio</span>
              {getStatusIcon(getMetricStatus(metrics.LCR))}
            </div>
            <div className="text-2xl font-bold mb-1">{metrics.LCR.toFixed(2)}x</div>
            <p className="text-sm text-muted-foreground">Resources vs. expected lifespan</p>
            <Progress value={Math.min(metrics.LCR * 50, 100)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Legacy Confidence Index</span>
              {getStatusIcon(getMetricStatus(metrics.LCI))}
            </div>
            <div className="text-2xl font-bold mb-1">{formatPercentage(metrics.LCI)}</div>
            <p className="text-sm text-muted-foreground">Likelihood of leaving intended legacy</p>
            <Progress value={metrics.LCI * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Changes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Portfolio Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Market Performance</p>
                  <p className="text-sm text-muted-foreground">Portfolio up 2.3% this month</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">+2.3%</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Rebalancing Needed</p>
                  <p className="text-sm text-muted-foreground">Asset allocation drifted from target</p>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Action Needed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">Market Risk</div>
              <Badge className={getStatusColor('good')}>Low</Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">Inflation Risk</div>
              <Badge className={getStatusColor('warning')}>Medium</Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">Longevity Risk</div>
              <Badge className={getStatusColor('good')}>Low</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};