import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

interface ScorecardInputs {
  age: number;
  retirementAge: number;
  savings: number;
  monthlyIncome: number;
  monthlySpend: number;
  risk: 'conservative' | 'moderate' | 'aggressive';
  guaranteedIncome: number;
}

interface ScorecardResult {
  score: number;
  recommendations: string[];
}

export default function RetirementScorecard() {
  const [inputs, setInputs] = useState<ScorecardInputs>({
    age: 50,
    retirementAge: 65,
    savings: 250000,
    monthlyIncome: 8000,
    monthlySpend: 6000,
    risk: 'moderate',
    guaranteedIncome: 0
  });
  const [result, setResult] = useState<ScorecardResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    analytics.track('tool.scorecard.viewed', { tool: 'retirement_scorecard' });
  }, []);

  const calculateScore = (): ScorecardResult => {
    const { age, retirementAge, savings, monthlyIncome, monthlySpend, risk, guaranteedIncome } = inputs;
    
    // Simple scoring model with documented weights
    let score = 0;
    const recommendations: string[] = [];
    
    // Years to retirement factor (30% weight)
    const yearsToRetirement = retirementAge - age;
    if (yearsToRetirement > 15) {
      score += 30;
    } else if (yearsToRetirement > 10) {
      score += 20;
    } else if (yearsToRetirement > 5) {
      score += 10;
    } else {
      recommendations.push("Consider delaying retirement by a few years to improve your financial position");
    }
    
    // Savings adequacy (25% weight)
    const savingsMultiple = savings / (monthlyIncome * 12);
    if (savingsMultiple > 10) {
      score += 25;
    } else if (savingsMultiple > 5) {
      score += 20;
    } else if (savingsMultiple > 2) {
      score += 10;
    } else {
      recommendations.push("Increase your savings rate - aim for 10-15% of income annually");
    }
    
    // Income vs spending (25% weight)
    const savingsRate = 1 - (monthlySpend / monthlyIncome);
    if (savingsRate > 0.2) {
      score += 25;
    } else if (savingsRate > 0.1) {
      score += 15;
    } else if (savingsRate > 0) {
      score += 10;
    } else {
      recommendations.push("Reduce monthly expenses to create more room for retirement savings");
    }
    
    // Guaranteed income factor (20% weight)
    const guaranteedRatio = guaranteedIncome / monthlySpend;
    if (guaranteedRatio > 0.8) {
      score += 20;
    } else if (guaranteedRatio > 0.5) {
      score += 15;
    } else if (guaranteedRatio > 0.2) {
      score += 10;
    } else {
      recommendations.push("Consider sources of guaranteed retirement income like Social Security or pensions");
    }
    
    // Risk tolerance bonus/penalty
    if (risk === 'aggressive' && yearsToRetirement > 10) {
      score += 5; // Bonus for appropriate risk taking
    } else if (risk === 'conservative' && yearsToRetirement < 5) {
      score += 5; // Bonus for appropriate risk reduction
    }
    
    // Ensure we have at least 3 recommendations
    if (recommendations.length < 3) {
      const defaultRecs = [
        "Review and rebalance your investment portfolio annually",
        "Consider maximizing tax-advantaged accounts like 401(k) and IRA",
        "Meet with a financial advisor for personalized retirement planning"
      ];
      recommendations.push(...defaultRecs.slice(0, 3 - recommendations.length));
    }
    
    return {
      score: Math.min(100, Math.max(0, score)),
      recommendations: recommendations.slice(0, 3)
    };
  };

  const handleCalculate = async () => {
    setLoading(true);
    
    try {
      const result = calculateScore();
      setResult(result);
      
      // Save to database
      const user = await supabase.auth.getUser();
      let saveError = null;
      
      if (user.data.user) {
        const { error } = await supabase
          .from('tools_results')
          .insert({
            user_id: user.data.user.id,
            tool_key: 'retirement_scorecard',
            inputs: inputs as any,
            outputs: result as any
          });
        saveError = error;
      }
      
      if (saveError) {
        console.error('Error saving result:', saveError);
        toast({
          title: "Warning",
          description: "Your results were calculated but not saved. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Your retirement confidence score has been calculated and saved!"
        });
      }
      
      analytics.track('tool.scorecard.completed', { 
        tool: 'retirement_scorecard',
        score: result.score 
      });
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to calculate your score. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (score >= 60) return <TrendingUp className="h-6 w-6 text-yellow-600" />;
    return <AlertCircle className="h-6 w-6 text-red-600" />;
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8 pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold text-foreground">Retirement Confidence Scorecard</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Get a personalized assessment of your retirement readiness with actionable recommendations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              Enter your current financial situation to calculate your retirement confidence score.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Current Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={inputs.age}
                  onChange={(e) => setInputs(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  min="18"
                  max="80"
                />
              </div>
              <div>
                <Label htmlFor="retirementAge">Planned Retirement Age</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  value={inputs.retirementAge}
                  onChange={(e) => setInputs(prev => ({ ...prev, retirementAge: parseInt(e.target.value) || 0 }))}
                  min="50"
                  max="80"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="savings">Current Retirement Savings ($)</Label>
              <Input
                id="savings"
                type="number"
                value={inputs.savings}
                onChange={(e) => setInputs(prev => ({ ...prev, savings: parseInt(e.target.value) || 0 }))}
                min="0"
                step="1000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={inputs.monthlyIncome}
                  onChange={(e) => setInputs(prev => ({ ...prev, monthlyIncome: parseInt(e.target.value) || 0 }))}
                  min="0"
                  step="100"
                />
              </div>
              <div>
                <Label htmlFor="monthlySpend">Monthly Expenses ($)</Label>
                <Input
                  id="monthlySpend"
                  type="number"
                  value={inputs.monthlySpend}
                  onChange={(e) => setInputs(prev => ({ ...prev, monthlySpend: parseInt(e.target.value) || 0 }))}
                  min="0"
                  step="100"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guaranteedIncome">Expected Guaranteed Income ($/month)</Label>
              <Input
                id="guaranteedIncome"
                type="number"
                value={inputs.guaranteedIncome}
                onChange={(e) => setInputs(prev => ({ ...prev, guaranteedIncome: parseInt(e.target.value) || 0 }))}
                min="0"
                step="100"
                placeholder="Social Security, pensions, etc."
              />
            </div>

            <div>
              <Label htmlFor="risk">Risk Tolerance</Label>
              <Select
                value={inputs.risk}
                onValueChange={(value: 'conservative' | 'moderate' | 'aggressive') => 
                  setInputs(prev => ({ ...prev, risk: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleCalculate} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Calculate My Score'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Your Retirement Confidence Score</CardTitle>
            <CardDescription>
              Based on your current financial situation and retirement goals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    {getScoreIcon(result.score)}
                    <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}
                    </span>
                    <span className="text-2xl text-muted-foreground">/100</span>
                  </div>
                  <Progress value={result.score} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    {result.score >= 80 && "Excellent! You're on track for a confident retirement."}
                    {result.score >= 60 && result.score < 80 && "Good progress! Some adjustments could improve your outlook."}
                    {result.score < 60 && "Needs attention. Consider implementing the recommendations below."}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Recommendations</h3>
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-muted rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center">
                        {index + 1}
                      </span>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter your information and click "Calculate My Score" to see your results.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}