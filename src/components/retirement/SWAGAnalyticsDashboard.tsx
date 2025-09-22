/**
 * SWAG Analytics Dashboard
 * Advanced retirement outcome analytics with phase-based metrics
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Cell, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, Shield, Target, AlertTriangle, CheckCircle, 
  DollarSign, Activity, Zap, Award, Brain
} from 'lucide-react';
import { SWAGPhaseAnalytics, SWAGEnhancedResults } from '@/lib/swag/swagIntegration';
import { ResponsiveChart } from '@/components/ui/responsive-chart';

interface SWAGAnalyticsDashboardProps {
  results: SWAGEnhancedResults;
}

export const SWAGAnalyticsDashboard: React.FC<SWAGAnalyticsDashboardProps> = ({
  results
}) => {
  const { swagAnalytics } = results;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'hsl(var(--emerald))';
    if (score >= 60) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default' as const;
    if (score >= 60) return 'secondary' as const;
    return 'destructive' as const;
  };

  const getRiskColor = (level: 'low' | 'moderate' | 'high') => {
    switch (level) {
      case 'low': return 'hsl(var(--emerald))';
      case 'moderate': return 'hsl(var(--warning))';
      case 'high': return 'hsl(var(--destructive))';
    }
  };

  // Prepare data for charts
  const phaseData = Object.entries(swagAnalytics.phaseMetrics).map(([phase, metrics]) => ({
    phase: phase.replace('_', ' '),
    fullPhase: phase,
    ...metrics,
    overallScore: metrics.OS * 100
  }));

  const outcomeMetricsData = Object.entries(swagAnalytics.phaseMetrics).flatMap(([phase, metrics]) => [
    { phase, metric: 'ISP', value: metrics.ISP * 100, label: 'Income Sufficiency' },
    { phase, metric: 'DGBP', value: (1 - metrics.DGBP) * 100, label: 'Drawdown Protection' },
    { phase, metric: 'LCR', value: Math.min(100, metrics.LCR * 50), label: 'Longevity Coverage' },
    { phase, metric: 'LCI', value: metrics.LCI * 100, label: 'Legacy Confidence' },
    { phase, metric: 'ATE', value: metrics.ATE * 100, label: 'Tax Efficiency' }
  ]);

  const radarData = [
    { metric: 'Income Sufficiency', value: swagAnalytics.phaseMetrics.INCOME_NOW.ISP * 100 },
    { metric: 'Drawdown Protection', value: (1 - swagAnalytics.phaseMetrics.INCOME_NOW.DGBP) * 100 },
    { metric: 'Longevity Coverage', value: Math.min(100, swagAnalytics.phaseMetrics.INCOME_LATER.LCR * 50) },
    { metric: 'Legacy Confidence', value: swagAnalytics.phaseMetrics.LEGACY.LCI * 100 },
    { metric: 'Tax Efficiency', value: swagAnalytics.phaseMetrics.GROWTH.ATE * 100 }
  ];

  const riskDistribution = Object.entries(swagAnalytics.phaseMetrics).map(([phase, metrics]) => ({
    phase: phase.replace('_', ' '),
    risk: metrics.riskLevel,
    value: 1
  }));

  const riskColors = ['hsl(var(--emerald))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

  return (
    <div className="space-y-6">
      {/* Header with Overall SWAG Score */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">SWAG™ Analytics Dashboard</CardTitle>
                <p className="text-sm text-muted-foreground">Strategic Wealth Alpha GPS™ - Outcome-First Analysis</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">
                {swagAnalytics.overallScore.toFixed(0)}
              </div>
              <Badge variant={getScoreBadgeVariant(swagAnalytics.overallScore)} className="mb-2">
                {swagAnalytics.overallScore >= 90 ? 'Excellent' :
                 swagAnalytics.overallScore >= 80 ? 'Very Good' :
                 swagAnalytics.overallScore >= 70 ? 'Good' :
                 swagAnalytics.overallScore >= 60 ? 'Fair' : 'Needs Improvement'}
              </Badge>
              <div className="text-xs text-muted-foreground">
                Confidence: {swagAnalytics.riskAnalysis.confidenceLevel.toFixed(0)}%
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="phases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="phases">Phase Analysis</TabsTrigger>
          <TabsTrigger value="outcomes">Outcome Metrics</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Phase Analysis Tab */}
        <TabsContent value="phases" className="space-y-6">
          {/* Phase Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(swagAnalytics.phaseMetrics).map(([phase, metrics]) => (
              <Card key={phase} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {phase.replace('_', ' ')}
                    </CardTitle>
                    <div className={`w-3 h-3 rounded-full`} 
                         style={{ backgroundColor: getRiskColor(metrics.riskLevel) }} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: getScoreColor(metrics.OS * 100) }}>
                      {(metrics.OS * 100).toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Outcome Score</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Confidence</span>
                      <span>{metrics.confidence.toFixed(0)}%</span>
                    </div>
                    <Progress value={metrics.confidence} className="h-1.5" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">ISP</div>
                      <div className="font-medium">{formatPercentage(metrics.ISP)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">DGBP</div>
                      <div className="font-medium">{formatPercentage(metrics.DGBP)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">LCR</div>
                      <div className="font-medium">{metrics.LCR.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">ATE</div>
                      <div className="font-medium">{formatPercentage(metrics.ATE)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Phase Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Phase Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveChart height={300}>
                <BarChart data={phaseData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="phase"
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value.toFixed(1)}`, 'Score']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar 
                    dataKey="overallScore" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveChart>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outcome Metrics Tab */}
        <TabsContent value="outcomes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Outcome Metrics Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveChart height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis 
                      dataKey="metric"
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <PolarRadiusAxis 
                      angle={45}
                      domain={[0, 100]}
                      tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveChart>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Outcome Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald" />
                      <span className="text-sm">Income Sufficiency</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatPercentage(swagAnalytics.phaseMetrics.INCOME_NOW.ISP)}
                      </div>
                      <div className="text-xs text-muted-foreground">Current Phase</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm">Drawdown Protection</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatPercentage(1 - swagAnalytics.phaseMetrics.INCOME_NOW.DGBP)}
                      </div>
                      <div className="text-xs text-muted-foreground">Risk Mitigation</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-warning" />
                      <span className="text-sm">Longevity Coverage</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {swagAnalytics.phaseMetrics.INCOME_LATER.LCR.toFixed(1)}x
                      </div>
                      <div className="text-xs text-muted-foreground">Coverage Ratio</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-accent" />
                      <span className="text-sm">Legacy Confidence</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatPercentage(swagAnalytics.phaseMetrics.LEGACY.LCI)}
                      </div>
                      <div className="text-xs text-muted-foreground">Estate Goal</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Tax Efficiency</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatPercentage(swagAnalytics.phaseMetrics.GROWTH.ATE)}
                      </div>
                      <div className="text-xs text-muted-foreground">After-Tax Optimization</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution by Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(swagAnalytics.phaseMetrics).map(([phase, metrics]) => (
                    <div key={phase} className="flex items-center justify-between">
                      <span className="text-sm">{phase.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={metrics.riskLevel === 'low' ? 'default' : 
                                  metrics.riskLevel === 'moderate' ? 'secondary' : 'destructive'}
                        >
                          {metrics.riskLevel}
                        </Badge>
                        <div className="w-16 text-right text-sm">
                          {metrics.confidence.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Primary Risk Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {swagAnalytics.riskAnalysis.primaryRisks.map((risk, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{risk}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Mitigation Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {swagAnalytics.riskAnalysis.mitigationStrategies.map((strategy, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{strategy}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {swagAnalytics.phaseRecommendations.map((rec, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{rec.phase.replace('_', ' ')}</Badge>
                        <Badge 
                          variant={rec.urgency === 'high' ? 'destructive' : 
                                  rec.urgency === 'medium' ? 'secondary' : 'outline'}
                        >
                          {rec.urgency} priority
                        </Badge>
                      </div>
                      <p className="text-sm">{rec.recommendation}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-muted-foreground">Impact</div>
                      <div className="font-semibold">+{rec.impact.toFixed(1)}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};