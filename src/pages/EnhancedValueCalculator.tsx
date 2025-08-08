import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calculator, TrendingUp, Target, DollarSign, Clock, Sparkles } from 'lucide-react';
import { useEventTracking } from '@/hooks/useEventTracking';
import confetti from 'canvas-confetti';

interface CalculatorInputs {
  portfolioValue: number;
  advisoryFee: number;
  flatAnnualFee: number;
  expectedReturn: number;
  timeHorizon: number;
  monthlySpending: number;
  monthlyGuaranteedIncome: number;
  inflation: number;
}

interface CalculatorResults {
  totalFeesAUM: number;
  totalFeesFlat: number;
  feeSavings: number;
  incomeGap: number;
  yearsOfSpendingCovered: number;
  shouldCelebrate: boolean;
}

const defaultInputs: CalculatorInputs = {
  portfolioValue: 2000000,
  advisoryFee: 1.25,
  flatAnnualFee: 15000,
  expectedReturn: 6.0,
  timeHorizon: 20,
  monthlySpending: 8000,
  monthlyGuaranteedIncome: 3000,
  inflation: 2.0
};

function calculateResults(inputs: CalculatorInputs): CalculatorResults {
  const {
    portfolioValue,
    advisoryFee,
    flatAnnualFee,
    expectedReturn,
    timeHorizon,
    monthlySpending,
    monthlyGuaranteedIncome,
    inflation
  } = inputs;

  // Calculate total fees over time horizon
  const annualAUMFee = portfolioValue * (advisoryFee / 100);
  const totalFeesAUM = annualAUMFee * timeHorizon;
  const totalFeesFlat = flatAnnualFee * timeHorizon;
  const feeSavings = Math.max(0, totalFeesAUM - totalFeesFlat);

  // Calculate income gap
  const incomeGap = Math.max(0, monthlySpending - monthlyGuaranteedIncome);
  
  // Calculate years of spending covered by savings
  const yearsOfSpendingCovered = incomeGap > 0 ? feeSavings / (incomeGap * 12) : 0;
  
  const shouldCelebrate = feeSavings > 25000;

  return {
    totalFeesAUM,
    totalFeesFlat,
    feeSavings,
    incomeGap,
    yearsOfSpendingCovered,
    shouldCelebrate
  };
}

export default function EnhancedValueCalculator() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { trackEvent } = useEventTracking();
  
  // Initialize from localStorage or URL params
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    // First try URL params
    const urlPortfolio = searchParams.get('portfolio');
    const urlFee = searchParams.get('fee');
    const urlReturn = searchParams.get('return');
    const urlHorizon = searchParams.get('horizon');
    
    if (urlPortfolio || urlFee || urlReturn || urlHorizon) {
      return {
        ...defaultInputs,
        portfolioValue: urlPortfolio ? Number(urlPortfolio) : defaultInputs.portfolioValue,
        advisoryFee: urlFee ? Number(urlFee) : defaultInputs.advisoryFee,
        expectedReturn: urlReturn ? Number(urlReturn) : defaultInputs.expectedReturn,
        timeHorizon: urlHorizon ? Number(urlHorizon) : defaultInputs.timeHorizon,
      };
    }
    
    // Then try localStorage
    const saved = localStorage.getItem('calculator-inputs');
    return saved ? JSON.parse(saved) : defaultInputs;
  });

  const results = useMemo(() => calculateResults(inputs), [inputs]);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('calculator-inputs', JSON.stringify(inputs));
  }, [inputs]);

  // Update URL params for sharing
  useEffect(() => {
    const newParams = new URLSearchParams();
    newParams.set('portfolio', inputs.portfolioValue.toString());
    newParams.set('fee', inputs.advisoryFee.toString());
    newParams.set('return', inputs.expectedReturn.toString());
    newParams.set('horizon', inputs.timeHorizon.toString());
    setSearchParams(newParams, { replace: true });
  }, [inputs, setSearchParams]);

  // Celebration effect
  useEffect(() => {
    if (results.shouldCelebrate) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Play celebration sound
      try {
        const audio = new Audio('/celebration.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Ignore audio play errors (browser restrictions)
        });
      } catch (error) {
        // Ignore audio errors
      }
    }
  }, [results.shouldCelebrate]);

  const updateInput = (key: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    trackEvent('calculator_input_changed', `${key}:${value}`);
  };

  const handleBuildRoadmap = () => {
    trackEvent('build_roadmap_clicked', `savings:${results.feeSavings}:years:${results.yearsOfSpendingCovered}`);
    
    // Store calculator summary for onboarding
    localStorage.setItem('calculator-summary', JSON.stringify({
      portfolioValue: inputs.portfolioValue,
      feeSavings: results.feeSavings,
      yearsOfSpendingCovered: results.yearsOfSpendingCovered,
      timestamp: Date.now()
    }));
    
    navigate('/onboarding/client');
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Calculator className="h-10 w-10 text-primary" />
            Value & Longevity Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how much you could save with flat-fee wealth management and extend your financial longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Portfolio & Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio Value</Label>
                  <Input
                    id="portfolio"
                    type="number"
                    value={inputs.portfolioValue}
                    onChange={(e) => updateInput('portfolioValue', Number(e.target.value))}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Advisory Fee: {formatPercentage(inputs.advisoryFee)}</Label>
                  <Slider
                    value={[inputs.advisoryFee]}
                    onValueChange={([value]) => updateInput('advisoryFee', value)}
                    max={2.0}
                    min={0.5}
                    step={0.05}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0.5%</span>
                    <span>2.0%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flatFee">Our Flat Annual Fee</Label>
                  <Input
                    id="flatFee"
                    type="number"
                    value={inputs.flatAnnualFee}
                    onChange={(e) => updateInput('flatAnnualFee', Number(e.target.value))}
                    className="text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Expected Return: {formatPercentage(inputs.expectedReturn)}</Label>
                  <Slider
                    value={[inputs.expectedReturn]}
                    onValueChange={([value]) => updateInput('expectedReturn', value)}
                    max={12}
                    min={3}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Time Horizon: {inputs.timeHorizon} years</Label>
                  <Slider
                    value={[inputs.timeHorizon]}
                    onValueChange={([value]) => updateInput('timeHorizon', value)}
                    max={40}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Inflation Rate: {formatPercentage(inputs.inflation)}</Label>
                  <Slider
                    value={[inputs.inflation]}
                    onValueChange={([value]) => updateInput('inflation', value)}
                    max={5}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Income & Spending
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="spending">Monthly Spending</Label>
                  <Input
                    id="spending"
                    type="number"
                    value={inputs.monthlySpending}
                    onChange={(e) => updateInput('monthlySpending', Number(e.target.value))}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guaranteed">Monthly Guaranteed Income (SS/Pension)</Label>
                  <Input
                    id="guaranteed"
                    type="number"
                    value={inputs.monthlyGuaranteedIncome}
                    onChange={(e) => updateInput('monthlyGuaranteedIncome', Number(e.target.value))}
                    className="text-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <Card className={results.shouldCelebrate ? 'border-primary shadow-lg' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {results.shouldCelebrate && <Sparkles className="h-5 w-5 text-primary animate-pulse" />}
                  <Clock className="h-5 w-5" />
                  Your Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-destructive">
                      {formatCurrency(results.totalFeesAUM)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total AUM Fees
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(results.totalFeesFlat)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Flat Fees
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-center p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatCurrency(results.feeSavings)}
                  </div>
                  <div className="text-lg font-medium mb-4">Total Fee Savings</div>
                  {results.shouldCelebrate && (
                    <Badge variant="default" className="animate-pulse">
                      🎉 Significant Savings!
                    </Badge>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Income Gap (Monthly)</span>
                    <span className="font-medium">{formatCurrency(results.incomeGap)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Years of Spending Covered</span>
                    <span className="font-bold text-primary text-lg">
                      {results.yearsOfSpendingCovered.toFixed(1)} years
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleBuildRoadmap}
                  size="lg" 
                  className="w-full text-lg py-6"
                >
                  Build my Retirement Roadmap
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share Your Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    trackEvent('results_shared', 'copy_link');
                  }}
                >
                  Copy Shareable Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}