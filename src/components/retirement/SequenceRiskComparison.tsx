import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SequenceRiskResults, SequenceRiskInput } from '@/engines/sequenceRisk/sequenceRiskEngine';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';

interface SequenceRiskComparisonProps {
  scenarios: SequenceRiskResults[];
  input: SequenceRiskInput;
  loading: boolean;
}

export const SequenceRiskComparison: React.FC<SequenceRiskComparisonProps> = ({
  scenarios,
  input,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Comparing scenarios...</p>
        </div>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No scenarios to compare. Add some retirement start years to analyze.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare comparison data for chart
  const maxYears = Math.max(...scenarios.map(s => s.projections.length));
  const chartData = Array.from({ length: maxYears }, (_, i) => {
    const dataPoint: any = { year: scenarios[0].projections[0]?.year + i };
    
    scenarios.forEach((scenario, scenarioIndex) => {
      const projection = scenario.projections[i];
      if (projection) {
        dataPoint[`scenario${scenarioIndex}`] = projection.endingBalance;
      }
    });
    
    return dataPoint;
  });

  const colors = ['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  return (
    <div className="space-y-6">
      {/* Scenario Comparison Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Scenario Comparison Summary
          </CardTitle>
          <CardDescription>
            Compare portfolio performance across different retirement start years
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {scenarios.map((scenario, index) => (
              <div key={scenario.scenarioName} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <div>
                    <p className="font-medium">{scenario.scenarioName}</p>
                    <p className="text-sm text-muted-foreground">{scenario.scenarioDescription}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{scenario.portfolioSurvivalYears} years</p>
                    <p className="text-xs text-muted-foreground">Survival</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{formatCurrency(scenario.finalPortfolioValue)}</p>
                    <p className="text-xs text-muted-foreground">Final Value</p>
                  </div>
                  <Badge variant={scenario.success ? "default" : "destructive"}>
                    {scenario.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Value Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Portfolio Value Comparison
          </CardTitle>
          <CardDescription>
            Track how different start years affect portfolio sustainability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value, { compact: true })}
                />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    const scenarioIndex = parseInt(name.replace('scenario', ''));
                    const scenarioName = scenarios[scenarioIndex]?.scenarioName || name;
                    return [formatCurrency(value), scenarioName];
                  }}
                  labelFormatter={(label) => `Year ${label}`}
                />
                {scenarios.map((scenario, index) => (
                  <Line
                    key={`scenario${index}`}
                    type="monotone"
                    dataKey={`scenario${index}`}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={false}
                    name={scenario.scenarioName}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Analysis
          </CardTitle>
          <CardDescription>
            Identify the highest and lowest risk scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Case */}
            {scenarios.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-primary">Best Case Scenario</h4>
                {(() => {
                  const bestScenario = scenarios.reduce((best, current) => 
                    current.finalPortfolioValue > best.finalPortfolioValue ? current : best
                  );
                  return (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="font-medium">{bestScenario.scenarioName}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Portfolio Survival:</span>
                          <span className="font-medium">{bestScenario.portfolioSurvivalYears} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Final Value:</span>
                          <span className="font-medium">{formatCurrency(bestScenario.finalPortfolioValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Success Rate:</span>
                          <Badge variant={bestScenario.success ? "default" : "destructive"}>
                            {bestScenario.success ? '100%' : '0%'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Worst Case */}
            {scenarios.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-destructive">Worst Case Scenario</h4>
                {(() => {
                  const worstScenario = scenarios.reduce((worst, current) => 
                    current.portfolioSurvivalYears < worst.portfolioSurvivalYears ? current : worst
                  );
                  return (
                    <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <p className="font-medium">{worstScenario.scenarioName}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Portfolio Survival:</span>
                          <span className="font-medium">{worstScenario.portfolioSurvivalYears} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Final Value:</span>
                          <span className="font-medium">{formatCurrency(worstScenario.finalPortfolioValue)}</span>
                        </div>
                        {worstScenario.shortfall > 0 && (
                          <div className="flex justify-between">
                            <span>Shortfall:</span>
                            <span className="font-medium text-destructive">{formatCurrency(worstScenario.shortfall)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};