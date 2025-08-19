import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, Shield, Clock } from 'lucide-react';
import CountUp from 'react-countup';
import { Celebration } from '@/components/ConfettiAnimation';
import { analytics } from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScorecardInputs {
  age: number;
  retirementAge: number;
  savings: number;
  monthlyIncome: number;
  monthlySpend: number;
  risk: 'conservative' | 'moderate' | 'aggressive';
  guaranteedIncome: number;
}

interface ScorecardResults {
  score: number;
  recommendations: string[];
  category: 'poor' | 'fair' | 'good' | 'excellent';
  details: {
    readinessScore: number;
    incomeReplacementRatio: number;
    yearsToRetirement: number;
    projectedNeeds: number;
    shortfall: number;
  };
}

const riskMultipliers = {
  conservative: 0.05,
  moderate: 0.07,
  aggressive: 0.09
};

const calculateRetirementScore = (inputs: ScorecardInputs): ScorecardResults => {
  const {
    age,
    retirementAge,
    savings,
    monthlyIncome,
    monthlySpend,
    risk,
    guaranteedIncome
  } = inputs;

  const yearsToRetirement = Math.max(1, retirementAge - age);
  const annualIncome = monthlyIncome * 12;
  const annualSpend = monthlySpend * 12;
  const annualGuaranteedIncome = guaranteedIncome * 12;
  
  // Calculate projected savings at retirement
  const growthRate = riskMultipliers[risk];
  const projectedSavings = savings * Math.pow(1 + growthRate, yearsToRetirement);
  
  // Estimated annual needs in retirement (80% of current spending)
  const retirementAnnualNeeds = annualSpend * 0.8;
  
  // Available retirement income from savings (4% withdrawal rule)
  const savingsAnnualIncome = projectedSavings * 0.04;
  
  // Total retirement income
  const totalRetirementIncome = savingsAnnualIncome + annualGuaranteedIncome;
  
  // Income replacement ratio
  const incomeReplacementRatio = (totalRetirementIncome / annualIncome) * 100;
  
  // Calculate shortfall
  const shortfall = Math.max(0, retirementAnnualNeeds - totalRetirementIncome);
  
  // Score calculation (0-100)
  let score = 0;
  
  // Savings adequacy (40 points)
  const savingsRatio = projectedSavings / (annualSpend * 25); // 25x rule
  score += Math.min(40, savingsRatio * 40);
  
  // Income replacement (30 points)
  score += Math.min(30, (incomeReplacementRatio / 80) * 30);
  
  // Time to retirement (20 points)
  const timeScore = yearsToRetirement >= 10 ? 20 : (yearsToRetirement / 10) * 20;
  score += timeScore;
  
  // Guaranteed income cushion (10 points)
  const guaranteedRatio = annualGuaranteedIncome / retirementAnnualNeeds;
  score += Math.min(10, guaranteedRatio * 10);
  
  score = Math.round(Math.min(100, Math.max(0, score)));
  
  // Determine category
  let category: 'poor' | 'fair' | 'good' | 'excellent';
  if (score >= 80) category = 'excellent';
  else if (score >= 65) category = 'good';
  else if (score >= 45) category = 'fair';
  else category = 'poor';
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (shortfall > 0) {
    recommendations.push(`Bridge the ${formatCurrency(shortfall)} annual shortfall by increasing savings or reducing expenses.`);
  }
  
  if (incomeReplacementRatio < 70) {
    recommendations.push('Consider increasing retirement savings rate to achieve 70-80% income replacement.');
  }
  
  if (yearsToRetirement < 10 && score < 70) {
    recommendations.push('With limited time to retirement, consider delaying retirement or reducing expected expenses.');
  }
  
  if (risk === 'conservative' && yearsToRetirement > 15) {
    recommendations.push('Consider a moderate investment approach to potentially increase growth over your long time horizon.');
  }
  
  if (guaranteedIncome === 0) {
    recommendations.push('Explore guaranteed income sources like Social Security optimization or annuities for income security.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Your retirement plan looks solid! Continue monitoring and adjusting as needed.');
    recommendations.push('Consider working with a financial advisor to optimize your strategy.');
    recommendations.push('Review and update your plan annually or when major life changes occur.');
  }
  
  return {
    score,
    recommendations: recommendations.slice(0, 3),
    category,
    details: {
      readinessScore: score,
      incomeReplacementRatio,
      yearsToRetirement,
      projectedNeeds: retirementAnnualNeeds,
      shortfall
    }
  };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function RetirementScorecard() {
  const [inputs, setInputs] = useState<ScorecardInputs>({
    age: 45,
    retirementAge: 65,
    savings: 250000,
    monthlyIncome: 8000,
    monthlySpend: 6000,
    risk: 'moderate',
    guaranteedIncome: 2500
  });

  const [results, setResults] = useState<ScorecardResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    analytics.track('tool.scorecard.viewed', {
      timestamp: Date.now(),
      source: 'direct'
    });
  }, []);

  const handleCalculate = async () => {
    setIsCalculating(true);
    setShowResults(false);
    
    setTimeout(async () => {
      const calculatedResults = calculateRetirementScore(inputs);
      setResults(calculatedResults);
      setIsCalculating(false);
      setShowResults(true);
      
      // Show confetti for good scores
      if (calculatedResults.score >= 70) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
      
      // Track completion
      analytics.track('tool.scorecard.completed', {
        score: calculatedResults.score,
        category: calculatedResults.category,
        age: inputs.age,
        years_to_retirement: calculatedResults.details.yearsToRetirement
      });
      
      // Save to database (simplified for now)
      try {
        console.log('Retirement scorecard results:', calculatedResults);
      } catch (error) {
        console.error('Error saving results:', error);
      }
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 45) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 65) return TrendingUp;
    if (score >= 45) return Clock;
    return AlertTriangle;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Celebration trigger={showConfetti} />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Retirement Confidence Scorecard</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get a comprehensive assessment of your retirement readiness with personalized recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Your Information
              </CardTitle>
              <CardDescription>
                Enter your current financial situation to calculate your retirement readiness score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Current Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={inputs.age}
                    onChange={(e) => setInputs(prev => ({ ...prev, age: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="retirementAge">Planned Retirement Age</Label>
                  <Input
                    id="retirementAge"
                    type="number"
                    value={inputs.retirementAge}
                    onChange={(e) => setInputs(prev => ({ ...prev, retirementAge: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="savings">Current Retirement Savings</Label>
                <Input
                  id="savings"
                  type="number"
                  value={inputs.savings}
                  onChange={(e) => setInputs(prev => ({ ...prev, savings: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Income</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={inputs.monthlyIncome}
                    onChange={(e) => setInputs(prev => ({ ...prev, monthlyIncome: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlySpend">Monthly Spending</Label>
                  <Input
                    id="monthlySpend"
                    type="number"
                    value={inputs.monthlySpend}
                    onChange={(e) => setInputs(prev => ({ ...prev, monthlySpend: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guaranteedIncome">Monthly Guaranteed Income (Social Security, Pensions)</Label>
                <Input
                  id="guaranteedIncome"
                  type="number"
                  value={inputs.guaranteedIncome}
                  onChange={(e) => setInputs(prev => ({ ...prev, guaranteedIncome: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Investment Risk Tolerance</Label>
                <Select
                  value={inputs.risk}
                  onValueChange={(value: 'conservative' | 'moderate' | 'aggressive') => 
                    setInputs(prev => ({ ...prev, risk: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative (5% growth)</SelectItem>
                    <SelectItem value="moderate">Moderate (7% growth)</SelectItem>
                    <SelectItem value="aggressive">Aggressive (9% growth)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Button 
              onClick={handleCalculate}
              disabled={isCalculating}
              size="lg"
              className="w-full text-lg py-6"
            >
              <Calculator className="mr-2 h-5 w-5" />
              {isCalculating ? "Calculating..." : "Calculate My Retirement Score"}
            </Button>

            <AnimatePresence>
              {showResults && results && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                    <CardContent className="pt-6 text-center">
                      <div className="flex items-center justify-center mb-4">
                        {React.createElement(getScoreIcon(results.score), {
                          className: `h-12 w-12 ${getScoreColor(results.score)}`
                        })}
                      </div>
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(results.score)}`}>
                        <CountUp
                          start={0}
                          end={results.score}
                          duration={2}
                        />
                        <span className="text-2xl">/100</span>
                      </div>
                      <Badge variant="secondary" className="mb-4 capitalize">
                        {results.category} Readiness
                      </Badge>
                      <Progress value={results.score} className="mb-4" />
                      <p className="text-sm text-muted-foreground">
                        {results.details.yearsToRetirement} years until retirement
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Income Replacement Ratio:</span>
                        <span className="font-medium">{results.details.incomeReplacementRatio.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Annual Retirement Needs:</span>
                        <span className="font-medium">{formatCurrency(results.details.projectedNeeds)}</span>
                      </div>
                      {results.details.shortfall > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span className="text-sm">Annual Shortfall:</span>
                          <span className="font-medium">{formatCurrency(results.details.shortfall)}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {results.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-primary">{index + 1}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}