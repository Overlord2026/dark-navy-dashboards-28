import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calculator, TrendingUp, DollarSign, Target, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { useRetirementCalculator } from '@/hooks/useRetirementCalculator';
import { RetirementAnalysisInput, RetirementAnalysisResults } from '@/types/retirement';
import { ScenarioBuilder } from './ScenarioBuilder';
import { RetirementPDFExport } from './RetirementPDFExport';
import { ResponsiveChart } from '@/components/ui/responsive-chart';
import { SWAGAnalyticsDashboard } from './SWAGAnalyticsDashboard';
import { SWAGEnhancedResults } from '@/lib/swag/swagIntegration';

interface RetirementCalculatorEngineProps {
  inputs: RetirementAnalysisInput;
  onInputsChange: (inputs: RetirementAnalysisInput) => void;
}

export const RetirementCalculatorEngine: React.FC<RetirementCalculatorEngineProps> = ({
  inputs,
  onInputsChange
}) => {
  const [results, setResults] = useState<SWAGEnhancedResults | null>(null);
  const { calculateRetirement, loading, error } = useRetirementCalculator();

  const handleCalculate = async () => {
    try {
      const calculatedResults = await calculateRetirement(inputs);
      setResults(calculatedResults);
    } catch (err) {
      console.error('Calculation failed:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSwagScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getSwagScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent', variant: 'success' as const };
    if (score >= 80) return { text: 'Very Good', variant: 'success' as const };
    if (score >= 70) return { text: 'Good', variant: 'secondary' as const };
    if (score >= 60) return { text: 'Fair', variant: 'secondary' as const };
    return { text: 'Needs Improvement', variant: 'destructive' as const };
  };

  return (
    <div className="space-y-6">
      {/* Header with Calculate Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              <CardTitle>Retirement Calculator Engine</CardTitle>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              {results && (
                <RetirementPDFExport inputs={inputs} results={results} loading={loading} />
              )}
              <Button 
                onClick={handleCalculate} 
                disabled={loading}
                className="gap-2 w-full sm:w-auto"
              >
                <TrendingUp className="h-4 w-4" />
                {loading ? 'Calculating...' : 'Run Analysis'}
              </Button>
            </div>
          </div>
        </CardHeader>
        {error && (
          <CardContent>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-destructive">{error}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Results Dashboard */}
      {results && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-7">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="swag" className="text-xs sm:text-sm">SWAG™</TabsTrigger>
            <TabsTrigger value="scenarios" className="text-xs sm:text-sm">Scenarios</TabsTrigger>
            <TabsTrigger value="cashflow" className="text-xs sm:text-sm">Cash Flow</TabsTrigger>
            <TabsTrigger value="montecarlo" className="text-xs sm:text-sm">Monte Carlo</TabsTrigger>
            <TabsTrigger value="recommendations" className="text-xs sm:text-sm">Recommendations</TabsTrigger>
            <TabsTrigger value="stress" className="text-xs sm:text-sm">Stress Test</TabsTrigger>
          </TabsList>

          {/* SWAG Analytics Tab */}
          <TabsContent value="swag" className="space-y-6">
            {'swagAnalytics' in results && (
              <SWAGAnalyticsDashboard results={results as SWAGEnhancedResults} />
            )}
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            <ScenarioBuilder
              baselineInputs={inputs}
              baselineResults={results}
              onInputsChange={onInputsChange}
            />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* SWAG Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">SWAG Score™</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getSwagScoreColor(results.monteCarlo.swagScore)}`}>
                        {results.monteCarlo.swagScore.toFixed(0)}
                      </div>
                      <Badge variant={getSwagScoreBadge(results.monteCarlo.swagScore).variant} className="mt-2">
                        {getSwagScoreBadge(results.monteCarlo.swagScore).text}
                      </Badge>
                    </div>
                    <Progress value={results.monteCarlo.swagScore} className="h-3" />
                    <p className="text-xs text-muted-foreground text-center">
                      {'swagAnalytics' in results ? 'Advanced SWAG™ Score' : 'Basic confidence score'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Readiness Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Retirement Readiness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">
                        {results.readinessScore.toFixed(0)}%
                      </div>
                    </div>
                    <Progress value={results.readinessScore} className="h-3" />
                    <p className="text-xs text-muted-foreground text-center">
                      Overall retirement preparedness
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Income Gap */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Monthly Income Gap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {formatCurrency(results.monthlyIncomeGap)}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      {results.monthlyIncomeGap > 0 ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <span className="text-xs text-muted-foreground">Shortfall to address</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald" />
                          <span className="text-xs text-muted-foreground">On track</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald" />
                    <div>
                      <p className="text-xs text-muted-foreground">Success Probability</p>
                      <p className="text-lg font-semibold">{results.monteCarlo.successProbability.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Median Portfolio Value</p>
                      <p className="text-lg font-semibold">{formatCurrency(results.monteCarlo.medianPortfolioValue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Retirement Target</p>
                      <p className="text-lg font-semibold">{formatCurrency(inputs.goals.annualRetirementIncome)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-warning" />
                    <div>
                      <p className="text-xs text-muted-foreground">Years to Retirement</p>
                      <p className="text-lg font-semibold">{inputs.goals.retirementAge - inputs.goals.currentAge}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cash Flow Tab */}
          <TabsContent value="cashflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projected Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveChart height={400} minHeight={250}>
                    <LineChart data={results.projectedCashFlow.slice(0, 30)}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="age" 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value as number)}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="beginningBalance" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Portfolio Balance" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="endingBalance" 
                        stroke="hsl(var(--emerald))" 
                        strokeWidth={2}
                        name="Ending Balance" 
                      />
                    </LineChart>
                </ResponsiveChart>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monte Carlo Tab */}
          <TabsContent value="montecarlo" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monte Carlo Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Success Probability</span>
                      <span className="font-semibold">{results.monteCarlo.successProbability.toFixed(1)}%</span>
                    </div>
                    <Progress value={results.monteCarlo.successProbability} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">SWAG Score™</span>
                      <span className="font-semibold">{results.monteCarlo.swagScore.toFixed(0)}</span>
                    </div>
                    <Progress value={results.monteCarlo.swagScore} />
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">10th Percentile</span>
                      <span className="text-sm">{formatCurrency(results.monteCarlo.worstCase10th)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Median Outcome</span>
                      <span className="text-sm font-semibold">{formatCurrency(results.monteCarlo.medianPortfolioValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">90th Percentile</span>
                      <span className="text-sm">{formatCurrency(results.monteCarlo.bestCase90th)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">
                        {results.monteCarlo.successProbability >= 80 ? 'Low Risk' :
                         results.monteCarlo.successProbability >= 60 ? 'Moderate Risk' : 'High Risk'}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on {results.monteCarlo.successProbability.toFixed(1)}% success probability
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Key Risk Factors:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Market volatility impact</li>
                        <li>• Sequence of returns risk</li>
                        <li>• Inflation erosion</li>
                        <li>• Longevity risk</li>
                        <li>• Healthcare cost increases</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="space-y-4">
              {results.recommendations.map((rec) => (
                <Card key={rec.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{rec.title}</h3>
                          <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Potential Impact</p>
                        <p className="font-semibold">{formatCurrency(rec.impactAmount)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Implementation Steps:</h4>
                      <ul className="text-sm space-y-1">
                        {rec.implementation.map((step, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Stress Test Tab */}
          <TabsContent value="stress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stress Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced stress testing features including widow(er)'s penalty scenarios, 
                  long-term care events, and market crash simulations will be available soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};