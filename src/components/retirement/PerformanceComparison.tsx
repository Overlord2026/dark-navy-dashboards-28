/**
 * Performance Comparison: Traditional vs Multi-Phase
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  DollarSign, 
  Target,
  AlertTriangle
} from 'lucide-react';
import { MultiPhaseResults } from '@/engines/multiPhase/multiPhaseEngine';

interface PerformanceComparisonProps {
  results: MultiPhaseResults;
  comparison: {
    finalValueImprovement: number;
    drawdownReduction: number;
    sequenceRiskReduction: number;
    incomeGapReduction: number;
  };
}

export function PerformanceComparison({ results, comparison }: PerformanceComparisonProps) {
  const { traditional, multiPhase } = results.projectedOutcomes;

  // Create comparison data for charts
  const performanceData = [
    {
      metric: 'Final Portfolio Value',
      traditional: traditional.finalValue / 1000000,
      multiPhase: multiPhase.finalValue / 1000000,
      unit: '$M'
    },
    {
      metric: 'Max Drawdown',
      traditional: traditional.maxDrawdown * 100,
      multiPhase: multiPhase.maxDrawdown * 100,
      unit: '%'
    },
    {
      metric: 'Sequence Risk',
      traditional: traditional.sequenceRisk * 100,
      multiPhase: multiPhase.sequenceRisk * 100,
      unit: '%'
    },
    {
      metric: 'Income Shortfall',
      traditional: traditional.incomeShortfall / 1000,
      multiPhase: multiPhase.incomeShortfall / 1000,
      unit: '$K'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (improvement < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return 'text-green-600';
    if (improvement < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Growth</p>
                <p className="text-lg font-semibold">
                  +{comparison.finalValueImprovement.toFixed(1)}%
                </p>
              </div>
              <div className="flex items-center">
                {getImprovementIcon(comparison.finalValueImprovement)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drawdown Reduction</p>
                <p className="text-lg font-semibold text-green-600">
                  -{comparison.drawdownReduction.toFixed(1)}%
                </p>
              </div>
              <Shield className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sequence Risk</p>
                <p className="text-lg font-semibold text-green-600">
                  -{comparison.sequenceRiskReduction.toFixed(1)}%
                </p>
              </div>
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Income Gap</p>
                <p className="text-lg font-semibold text-green-600">
                  -{comparison.incomeGapReduction.toFixed(1)}%
                </p>
              </div>
              <Target className="h-5 w-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Strategy Comparison</CardTitle>
          <CardDescription>
            Side-by-side comparison of traditional 60/40 vs multi-phase SWAG™ approach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${typeof value === 'number' ? value.toFixed(2) : value}${performanceData.find(d => d.traditional === value || d.multiPhase === value)?.unit || ''}`,
                    name === 'traditional' ? 'Traditional 60/40' : 'Multi-Phase SWAG™'
                  ]}
                />
                <Bar dataKey="traditional" fill="#6b7280" name="traditional" />
                <Bar dataKey="multiPhase" fill="#10b981" name="multiPhase" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Financial Outcomes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Traditional Final Value:</span>
                <span className="font-medium">{formatCurrency(traditional.finalValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Multi-Phase Final Value:</span>
                <span className="font-medium text-green-600">{formatCurrency(multiPhase.finalValue)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Improvement:</span>
                  <span className={`font-semibold ${getImprovementColor(comparison.finalValueImprovement)}`}>
                    {formatCurrency(multiPhase.finalValue - traditional.finalValue)}
                    <span className="text-xs ml-1">
                      (+{comparison.finalValueImprovement.toFixed(1)}%)
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Traditional Income Gap:</span>
                <span className="font-medium text-red-600">{formatCurrency(traditional.incomeShortfall)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Multi-Phase Income Gap:</span>
                <span className="font-medium text-green-600">{formatCurrency(multiPhase.incomeShortfall)}</span>
              </div>
              {comparison.incomeGapReduction > 0 && (
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Gap Reduction:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(traditional.incomeShortfall - multiPhase.incomeShortfall)}
                      <span className="text-xs ml-1">
                        (-{comparison.incomeGapReduction.toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Risk Reduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Maximum Drawdown</span>
                  <span className="text-xs text-muted-foreground">Lower is better</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Traditional:</span>
                    <span className="text-sm font-medium">{(traditional.maxDrawdown * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={traditional.maxDrawdown * 100} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Multi-Phase:</span>
                    <span className="text-sm font-medium text-green-600">{(multiPhase.maxDrawdown * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={multiPhase.maxDrawdown * 100} className="h-2" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Sequence of Returns Risk</span>
                  <span className="text-xs text-muted-foreground">Lower is better</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Traditional:</span>
                    <span className="text-sm font-medium">{(traditional.sequenceRisk * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={traditional.sequenceRisk * 100} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Multi-Phase:</span>
                    <span className="text-sm font-medium text-green-600">{(multiPhase.sequenceRisk * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={multiPhase.sequenceRisk * 100} className="h-2" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Shield className="h-4 w-4" />
                <span>
                  Risk reduction of {comparison.drawdownReduction.toFixed(0)}% through phase management
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Recommended Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Badge 
              variant={results.recommendedStrategy === 'multi_phase' ? 'default' : 'secondary'}
              className="text-base px-4 py-2"
            >
              {results.recommendedStrategy === 'multi_phase' ? 'Multi-Phase SWAG™' : 'Traditional 60/40'}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm">Confidence:</span>
              <Progress value={results.confidenceScore} className="w-24" />
              <span className="text-sm font-medium">{results.confidenceScore}%</span>
            </div>
          </div>

          {results.recommendedStrategy === 'multi_phase' ? (
            <div className="space-y-2">
              <p className="text-sm text-green-600 font-medium">
                ✓ Multi-Phase SWAG™ strategy is recommended
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• {comparison.drawdownReduction.toFixed(1)}% reduction in maximum drawdown risk</li>
                <li>• {comparison.sequenceRiskReduction.toFixed(1)}% reduction in sequence of returns risk</li>
                <li>• {formatCurrency(multiPhase.finalValue - traditional.finalValue)} additional portfolio value</li>
                <li>• Enhanced diversification through alternative assets</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-amber-600 font-medium">
                ⚠ Traditional strategy may be sufficient for this scenario
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Lower complexity and management requirements</li>
                <li>• Sufficient to meet retirement income goals</li>
                <li>• Consider multi-phase approach for enhanced protection</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}