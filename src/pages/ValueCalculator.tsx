import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, DollarSign, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import CountUp from 'react-countup';
import { Celebration } from '@/components/ConfettiAnimation';
import { StressTestPreview } from '@/components/retirement/StressTestPreview';
import { playSound } from '@/utils/sounds';
import { analytics } from '@/lib/analytics';

interface CalculatorInputs {
  portfolioValue: number;
  annualFeePercent: number;
  annualFlatFee: number;
  annualGrowthPercent: number;
  monthlySpending: number;
  inflation: number;
  timeHorizon: number;
}

interface CalculatorResults {
  traditionalLifetimeFees: number;
  valueLifetimeFees: number;
  totalSavings: number;
  extraWealthYears: number;
}

export default function ValueCalculator() {
  const [horizonYears, setHorizonYears] = useState<10|20|30>(30);
  const [inputs, setInputs] = useState<CalculatorInputs>({
    portfolioValue: 1500000,
    annualFeePercent: 1.0,
    annualFlatFee: 20000,
    annualGrowthPercent: 8,
    monthlySpending: 12000,
    inflation: 2,
    timeHorizon: 30
  });

  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    analytics.trackPageView('/value-calculator');
  }, []);

  const handleHorizonChange = (years: 10|20|30) => { 
    setHorizonYears(years); 
    setInputs(prev => ({ ...prev, timeHorizon: years }));
    analytics.track('calc.horizon_set', { horizon_years: years }); 
  };

  const calculateResults = (): CalculatorResults => {
    const { portfolioValue, annualFeePercent, annualFlatFee, annualGrowthPercent, monthlySpending } = inputs;
    const timeHorizon = horizonYears;
    
    let traditionalValue = portfolioValue;
    let valueValue = portfolioValue;
    let traditionalFees = 0;
    let valueFees = 0;
    
    for (let year = 1; year <= timeHorizon; year++) {
      const traditionalAnnualFee = traditionalValue * (annualFeePercent / 100);
      traditionalFees += traditionalAnnualFee;
      traditionalValue = (traditionalValue - traditionalAnnualFee) * (1 + annualGrowthPercent / 100);
      
      valueFees += annualFlatFee;
      valueValue = (valueValue - annualFlatFee) * (1 + annualGrowthPercent / 100);
    }
    
    const totalSavings = traditionalFees - valueFees;
    const extraWealthYears = totalSavings / (monthlySpending * 12);
    
    return {
      traditionalLifetimeFees: traditionalFees,
      valueLifetimeFees: valueFees,
      totalSavings,
      extraWealthYears
    };
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setShowResults(false);
    
    analytics.track('calc_run', inputs);
    
    setTimeout(() => {
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
      setIsCalculating(false);
      setShowResults(true);
      
      if (calculatedResults.totalSavings > 0) {
        setShowConfetti(true);
        playSound('cash');
        analytics.track('calc_positive_outcome', {
          savings: calculatedResults.totalSavings,
          monthsCovered: calculatedResults.extraWealthYears * 12
        });
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }, 1200);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stressTestInputs = {
    portfolioValue: inputs.portfolioValue,
    annualFee: inputs.annualFlatFee,
    growthRate: inputs.annualGrowthPercent,
    monthlySpending: inputs.monthlySpending,
    inflation: inputs.inflation,
    timeHorizon: horizonYears
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
      <Celebration trigger={showConfetti} />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">SWAG™ Value Calculator</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how our value-driven pricing can extend your wealth and fund your healthspan goals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Input Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="portfolio">Portfolio Value</Label>
                <Input
                  id="portfolio"
                  type="number"
                  value={inputs.portfolioValue}
                  onChange={(e) => setInputs(prev => ({ ...prev, portfolioValue: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Annual % Fee (Current Advisor)</Label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[inputs.annualFeePercent]}
                    onValueChange={(value) => setInputs(prev => ({ ...prev, annualFeePercent: value[0] }))}
                    max={3}
                    min={0.25}
                    step={0.05}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground text-center">
                    {inputs.annualFeePercent.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="flatFee">Annual Flat Fee (SWAG Value Plan)</Label>
                <Input
                  id="flatFee"
                  type="number"
                  value={inputs.annualFlatFee}
                  onChange={(e) => setInputs(prev => ({ ...prev, annualFlatFee: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="monthlySpending">Monthly Spending</Label>
                <Input
                  id="monthlySpending"
                  type="number"
                  value={inputs.monthlySpending}
                  onChange={(e) => setInputs(prev => ({ ...prev, monthlySpending: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Time Horizon</Label>
                <div className="flex gap-2 mt-2" role="group" aria-label="Time horizon selection">
                  <Button
                    variant={horizonYears === 10 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleHorizonChange(10)}
                    aria-pressed={horizonYears === 10}
                    className={cn(
                      "transition-all duration-200",
                      horizonYears === 10 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "bg-background hover:bg-accent"
                    )}
                  >
                    10 years
                  </Button>
                  <Button
                    variant={horizonYears === 20 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleHorizonChange(20)}
                    aria-pressed={horizonYears === 20}
                    className={cn(
                      "transition-all duration-200",
                      horizonYears === 20 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "bg-background hover:bg-accent"
                    )}
                  >
                    20 years
                  </Button>
                  <Button
                    variant={horizonYears === 30 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleHorizonChange(30)}
                    aria-pressed={horizonYears === 30}
                    className={cn(
                      "transition-all duration-200",
                      horizonYears === 30 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "bg-background hover:bg-accent"
                    )}
                  >
                    30 years
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Button 
              onClick={handleCalculate}
              disabled={isCalculating}
              variant="high-contrast"
              size="lg"
              className="w-full text-lg py-6"
            >
              <Calculator className="mr-2 h-5 w-5" />
              {isCalculating ? "Calculating..." : "Calculate Your Savings"}
            </Button>

            <AnimatePresence>
              {showResults && results && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="pt-6 text-center">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 text-green-600" />
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        <CountUp
                          start={0}
                          end={results.totalSavings}
                          duration={2.5}
                          formattingFn={formatCurrency}
                        />
                      </div>
                      <Badge variant="secondary" className="mb-4">
                        Total Savings with SWAG™
                      </Badge>
                      <div className="text-lg font-semibold text-green-700">
                        <CountUp
                          start={0}
                          end={results.extraWealthYears}
                          duration={2}
                          decimals={1}
                        />{' '}
                        Extra Years of Wealth
                      </div>
                    </CardContent>
                  </Card>

                  <Button 
                    size="lg" 
                    variant="high-contrast"
                    className="w-full"
                    onClick={() => {
                      analytics.track('roadmap_booking_clicked', { source: 'value_calculator' });
                      window.open('/schedule', '_blank');
                    }}
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Book Your Full SWAG™ Retirement Roadmap
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <StressTestPreview
              inputs={stressTestInputs}
              onScenarioClick={() => analytics.track('stress_preview_cta_click')}
            />
          </motion.div>
        )}
      </div>
      </main>
    </div>
  );
}