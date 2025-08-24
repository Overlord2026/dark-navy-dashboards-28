import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Calendar, Calculator, Download, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';
import { recordReceipt } from '@/features/receipts/record';

interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  retirementIncome: number;
}

interface RetirementResults {
  projectedSavings: number;
  monthlyRetirementIncome: number;
  incomeReplacementRatio: number;
  savingsGap: number;
  onTrack: boolean;
}

export const RetirementRoadmapTool: React.FC = () => {
  const [inputs, setInputs] = useState<RetirementInputs>({
    currentAge: 35,
    retirementAge: 65,
    currentSavings: 150000,
    monthlyContribution: 2000,
    expectedReturn: 7,
    inflationRate: 3,
    retirementIncome: 80000
  });

  const [results, setResults] = useState<RetirementResults | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    // Load demo defaults
    const demoData = localStorage.getItem('retirement_roadmap_demo');
    if (demoData) {
      setInputs(JSON.parse(demoData));
    } else {
      // Set demo defaults for retiree families
      setInputs({
        currentAge: 45,
        retirementAge: 65,
        currentSavings: 750000,
        monthlyContribution: 3500,
        expectedReturn: 6.5,
        inflationRate: 2.5,
        retirementIncome: 120000
      });
    }
  }, []);

  const calculateRetirement = () => {
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    
    // Future value of current savings
    const futureCurrentSavings = inputs.currentSavings * Math.pow(1 + inputs.expectedReturn / 100, yearsToRetirement);
    
    // Future value of monthly contributions (annuity)
    const monthlyRate = inputs.expectedReturn / 100 / 12;
    const futureContributions = inputs.monthlyContribution * 
      ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);
    
    const projectedSavings = futureCurrentSavings + futureContributions;
    
    // 4% withdrawal rule adjusted for inflation
    const safeWithdrawalRate = 0.04;
    const monthlyRetirementIncome = (projectedSavings * safeWithdrawalRate) / 12;
    
    // Adjust target income for inflation
    const inflationAdjustedIncome = inputs.retirementIncome * 
      Math.pow(1 + inputs.inflationRate / 100, yearsToRetirement);
    
    const incomeReplacementRatio = (monthlyRetirementIncome * 12) / inflationAdjustedIncome;
    const savingsGap = Math.max(0, inflationAdjustedIncome / safeWithdrawalRate - projectedSavings);
    
    const calculatedResults: RetirementResults = {
      projectedSavings,
      monthlyRetirementIncome,
      incomeReplacementRatio,
      savingsGap,
      onTrack: incomeReplacementRatio >= 0.8
    };

    setResults(calculatedResults);
    setIsCalculated(true);

    // Record calculation receipt
    const receipt = recordReceipt({
      id: `calc_retirement_${Date.now()}`,
      type: 'Decision-RDS',
      timestamp: new Date().toISOString(),
      payload: {
        action: 'retirement_calculation',
        inputs: inputs,
        results: calculatedResults,
        policy_version: 'v1.0'
      },
      inputs_hash: `calc_${Date.now()}`,
      policy_version: 'v1.0'
    });

    // Track analytics
    analytics.track('family.retirement.calculated', {
      years_to_retirement: yearsToRetirement,
      on_track: calculatedResults.onTrack,
      savings_gap: calculatedResults.savingsGap
    });

    toast.success('Retirement roadmap calculated and saved!');
  };

  const exportResults = () => {
    if (!results) return;

    const exportData = {
      calculation_date: new Date().toISOString(),
      inputs,
      results,
      recommendations: generateRecommendations()
    };

    const csv = [
      'Metric,Value',
      `Current Age,${inputs.currentAge}`,
      `Retirement Age,${inputs.retirementAge}`,
      `Current Savings,$${inputs.currentSavings.toLocaleString()}`,
      `Monthly Contribution,$${inputs.monthlyContribution.toLocaleString()}`,
      `Projected Savings,$${results.projectedSavings.toLocaleString()}`,
      `Monthly Retirement Income,$${results.monthlyRetirementIncome.toLocaleString()}`,
      `Income Replacement Ratio,${(results.incomeReplacementRatio * 100).toFixed(1)}%`,
      `Savings Gap,$${results.savingsGap.toLocaleString()}`,
      `On Track,${results.onTrack ? 'Yes' : 'No'}`
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'retirement_roadmap.csv';
    a.click();

    analytics.track('family.retirement.exported', { format: 'csv' });
    toast.success('Retirement roadmap exported!');
  };

  const generateRecommendations = (): string[] => {
    if (!results) return [];

    const recommendations = [];

    if (results.savingsGap > 0) {
      recommendations.push(`Increase monthly contributions by $${Math.round(results.savingsGap / ((inputs.retirementAge - inputs.currentAge) * 12))} to close savings gap`);
    }

    if (results.incomeReplacementRatio < 0.8) {
      recommendations.push('Consider working an additional 2-3 years to improve retirement readiness');
    }

    if (inputs.expectedReturn > 8) {
      recommendations.push('Consider more conservative return assumptions for planning purposes');
    }

    return recommendations;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Retirement Roadmap</h1>
          <p className="text-muted-foreground">Plan your path to financial freedom</p>
        </div>
        <Badge variant="secondary">Demo Mode</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Planning Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAge">Current Age</Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={inputs.currentAge}
                  onChange={(e) => setInputs(prev => ({ ...prev, currentAge: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="retirementAge">Retirement Age</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  value={inputs.retirementAge}
                  onChange={(e) => setInputs(prev => ({ ...prev, retirementAge: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="currentSavings">Current Retirement Savings</Label>
              <Input
                id="currentSavings"
                type="number"
                value={inputs.currentSavings}
                onChange={(e) => setInputs(prev => ({ ...prev, currentSavings: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
              <Input
                id="monthlyContribution"
                type="number"
                value={inputs.monthlyContribution}
                onChange={(e) => setInputs(prev => ({ ...prev, monthlyContribution: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <Label>Expected Annual Return: {inputs.expectedReturn}%</Label>
              <Slider
                value={[inputs.expectedReturn]}
                onValueChange={(value) => setInputs(prev => ({ ...prev, expectedReturn: value[0] }))}
                min={3}
                max={12}
                step={0.5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Inflation Rate: {inputs.inflationRate}%</Label>
              <Slider
                value={[inputs.inflationRate]}
                onValueChange={(value) => setInputs(prev => ({ ...prev, inflationRate: value[0] }))}
                min={1}
                max={5}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="retirementIncome">Desired Annual Retirement Income</Label>
              <Input
                id="retirementIncome"
                type="number"
                value={inputs.retirementIncome}
                onChange={(e) => setInputs(prev => ({ ...prev, retirementIncome: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <Button onClick={calculateRetirement} className="w-full">
              Calculate Retirement Roadmap
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Retirement Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Projected Savings</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(results.projectedSavings)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(results.monthlyRetirementIncome)}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Income Replacement</span>
                    <span>{(results.incomeReplacementRatio * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={Math.min(results.incomeReplacementRatio * 100, 100)} 
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Target: 80% of pre-retirement income
                  </p>
                </div>

                {results.savingsGap > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-yellow-800">Savings Gap Identified</p>
                    <p className="text-sm text-yellow-700">
                      You may need an additional {formatCurrency(results.savingsGap)} 
                      to meet your retirement income goal.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium">Recommendations:</h4>
                  {generateRecommendations().map((rec, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      • {rec}
                    </p>
                  ))}
                </div>

                <Button onClick={exportResults} className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter your information and click calculate to see your retirement projection
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};