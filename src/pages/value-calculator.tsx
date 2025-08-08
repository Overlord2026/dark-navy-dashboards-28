import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Calculator, TrendingUp, DollarSign, Target, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { analyticsEvents } from '@/analytics/events';

interface CalculationResults {
  monthlyExpenses: number;
  annualExpenses: number;
  adjustedExpenses: number;
  aumFee: number;
  valueFee: number;
  monthlySavings: number;
  annualSavings: number;
  lifetimeSavings: number;
  savingsPercentage: number;
}

export default function ValueCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('');
  const [inflationRate, setInflationRate] = useState<string>('3');
  const [yearsRetirement, setYearsRetirement] = useState<string>('25');
  const [aumRate, setAumRate] = useState<string>('1.25');
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const calculateValue = () => {
    if (!monthlyExpenses || parseFloat(monthlyExpenses) <= 0) return;

    const monthly = parseFloat(monthlyExpenses);
    const inflation = parseFloat(inflationRate) / 100;
    const years = parseInt(yearsRetirement);
    const aumPercentage = parseFloat(aumRate) / 100;

    // Calculate annual expenses
    const annual = monthly * 12;
    
    // Adjust for inflation over retirement period
    const adjustedAnnual = annual * Math.pow(1 + inflation, years / 2);
    
    // Estimate portfolio size needed (25x rule with inflation adjustment)
    const portfolioNeeded = adjustedAnnual * 25;
    
    // Calculate AUM fees vs value-based pricing
    const annualAumFee = portfolioNeeded * aumPercentage;
    const monthlyAumFee = annualAumFee / 12;
    
    // Value-based pricing (typically 30-50% less than AUM)
    const valueBasedFee = annualAumFee * 0.65; // 35% savings
    const monthlyValueFee = valueBasedFee / 12;
    
    // Calculate savings
    const annualSavings = annualAumFee - valueBasedFee;
    const monthlySavings = annualSavings / 12;
    const lifetimeSavings = annualSavings * years;
    const savingsPercentage = (annualSavings / annualAumFee) * 100;

    const calculationResults: CalculationResults = {
      monthlyExpenses: monthly,
      annualExpenses: annual,
      adjustedExpenses: adjustedAnnual,
      aumFee: annualAumFee,
      valueFee: valueBasedFee,
      monthlySavings,
      annualSavings,
      lifetimeSavings,
      savingsPercentage,
    };

    setResults(calculationResults);
    setShowResults(true);

    // Track calculation event
    analyticsEvents.trackCustomEvent('value_calculator_completed', {
      monthly_expenses: monthly,
      inflation_rate: parseFloat(inflationRate),
      years_retirement: years,
      aum_rate: parseFloat(aumRate),
      annual_savings: annualSavings,
      savings_percentage: savingsPercentage,
    });

    // Trigger confetti if savings are significant
    if (savingsPercentage > 25) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number): string => {
    return `${percent.toFixed(1)}%`;
  };

  React.useEffect(() => {
    // Track page view
    analyticsEvents.trackPageView({
      page_name: 'value_calculator',
      page_path: '/value-calculator',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Value Calculator
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare traditional AUM fees vs value-based pricing and discover how much you could save over your retirement.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Your Retirement Information
                </CardTitle>
                <CardDescription>
                  Enter your expected retirement expenses and timeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="monthly-expenses">Monthly Retirement Expenses</Label>
                  <Input
                    id="monthly-expenses"
                    type="number"
                    placeholder="8,000"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    How much do you expect to spend monthly in retirement?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inflation-rate">Expected Inflation Rate</Label>
                  <Select value={inflationRate} onValueChange={setInflationRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2% (Conservative)</SelectItem>
                      <SelectItem value="3">3% (Historical Average)</SelectItem>
                      <SelectItem value="4">4% (Elevated)</SelectItem>
                      <SelectItem value="5">5% (High Inflation)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years-retirement">Years in Retirement</Label>
                  <Select value={yearsRetirement} onValueChange={setYearsRetirement}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20 Years</SelectItem>
                      <SelectItem value="25">25 Years</SelectItem>
                      <SelectItem value="30">30 Years</SelectItem>
                      <SelectItem value="35">35 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aum-rate">Current AUM Fee Rate</Label>
                  <Select value={aumRate} onValueChange={setAumRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.0">1.0% (Low-cost advisor)</SelectItem>
                      <SelectItem value="1.25">1.25% (Typical advisor)</SelectItem>
                      <SelectItem value="1.5">1.5% (Full-service advisor)</SelectItem>
                      <SelectItem value="2.0">2.0% (High-touch advisor)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={calculateValue} 
                  className="w-full text-lg py-6"
                  disabled={!monthlyExpenses || parseFloat(monthlyExpenses) <= 0}
                >
                  Calculate My Savings
                  <Calculator className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className={`shadow-lg transition-all duration-500 ${showResults ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Your Potential Savings
                </CardTitle>
                <CardDescription>
                  {results ? 'Here\'s how value-based pricing could benefit you' : 'Complete the form to see your potential savings'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {results ? (
                  <>
                    {/* Savings Highlight */}
                    <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-center mb-2">
                        <Sparkles className="h-6 w-6 text-green-600 mr-2" />
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Potential Annual Savings
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                        {formatCurrency(results.annualSavings)}
                      </div>
                      <div className="text-lg text-green-600 dark:text-green-400">
                        {formatPercent(results.savingsPercentage)} less than traditional AUM fees
                      </div>
                    </div>

                    <Separator />

                    {/* Detailed Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Fee Comparison</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                          <span className="text-sm font-medium">Traditional AUM Fee (Annual)</span>
                          <span className="font-bold text-red-700 dark:text-red-300">
                            {formatCurrency(results.aumFee)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <span className="text-sm font-medium">Value-Based Fee (Annual)</span>
                          <span className="font-bold text-green-700 dark:text-green-300">
                            {formatCurrency(results.valueFee)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Monthly Savings</span>
                          <span className="font-bold">{formatCurrency(results.monthlySavings)}</span>
                        </div>
                        <Progress value={results.savingsPercentage} className="h-2" />
                      </div>
                    </div>

                    <Separator />

                    {/* Lifetime Impact */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Lifetime Impact
                      </h4>
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(results.lifetimeSavings)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total savings over {yearsRetirement} years of retirement
                      </p>
                    </div>

                    {/* Call to Action */}
                    <div className="pt-4 space-y-3">
                      <Link to="/retirement-roadmap-info">
                        <Button className="w-full" size="lg">
                          See Your SWAG™ Retirement Roadmap
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      
                      <Link to="/retirement-analyzer">
                        <Button variant="outline" className="w-full">
                          Try the Full Retirement Analyzer
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Enter your information to see potential savings</p>
                    <p className="text-sm mt-2">Most families save 25-40% on advisory fees</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          {showResults && results && (
            <Card className="mt-8 shadow-lg">
              <CardHeader>
                <CardTitle>Why Value-Based Pricing Makes Sense</CardTitle>
                <CardDescription>
                  Understanding the difference between traditional and modern fee structures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-red-700 dark:text-red-300">
                      Traditional AUM Fees
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Fees increase as your wealth grows</li>
                      <li>• No cap on total fees paid</li>
                      <li>• Conflicts of interest with investment choices</li>
                      <li>• You pay more for being successful</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300">
                      Value-Based Pricing
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Fixed fees based on complexity, not assets</li>
                      <li>• Transparent, predictable costs</li>
                      <li>• Aligned incentives for your success</li>
                      <li>• More wealth stays in your family</li>
                    </ul>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Based on typical fee structures. Individual results may vary.
                    This calculator provides estimates for comparison purposes only.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}