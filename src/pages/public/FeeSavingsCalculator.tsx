import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/ui/Logo';
import { withTrademarks } from '@/utils/trademark';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Target, 
  ArrowRight, 
  Sparkles,
  ArrowLeft,
  Download,
  PieChart,
  Clock,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { analyticsEvents } from '@/analytics/events';
import { ResultsCrossSell } from '@/components/public/ResultsCrossSell';

interface CalculationResults {
  monthlyExpenses: number;
  annualExpenses: number;
  adjustedExpenses: number;
  portfolioNeeded: number;
  traditionalFeeTotal: number;
  valueFeeTotal: number;
  feeSavings: number;
  savingsPercentage: number;
  monthsCovered: number;
  longevityBoost: number;
}

export default function FeeSavingsCalculator() {
  const navigate = useNavigate();
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('');
  const [otherIncome, setOtherIncome] = useState<string>('');
  const [inflationRate, setInflationRate] = useState<string>('2');
  const [growthAssumption, setGrowthAssumption] = useState<string>('7');
  const [horizon, setHorizon] = useState<string>('20');
  const [portfolioValue, setPortfolioValue] = useState<string>('');
  const [currentFeePercent, setCurrentFeePercent] = useState<number[]>([1.25]);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const calculateResults = () => {
    if (!monthlyExpenses || parseFloat(monthlyExpenses) <= 0) return;

    const monthly = parseFloat(monthlyExpenses);
    const otherMonthlyIncome = parseFloat(otherIncome) || 0;
    const inflation = parseFloat(inflationRate) / 100;
    const growth = parseFloat(growthAssumption) / 100;
    const years = parseInt(horizon);
    const currentFee = currentFeePercent[0] / 100;

    // Calculate expenses and portfolio needed
    const annualExpenses = monthly * 12;
    const adjustedAnnual = annualExpenses * Math.pow(1 + inflation, years / 2);
    
    // Estimate portfolio needed (4% rule adjusted for inflation)
    const netExpensesNeeded = Math.max(0, annualExpenses - (otherMonthlyIncome * 12));
    const portfolioNeeded = netExpensesNeeded * 25; // 4% withdrawal rule

    // Calculate traditional vs value-based fees
    const traditionalAnnualFee = portfolioNeeded * currentFee;
    const traditionalFeeTotal = traditionalAnnualFee * years;

    // Value-based pricing (typically 40-60% of AUM fees)
    const valueBasedAnnualFee = traditionalAnnualFee * 0.5; // 50% savings
    const valueFeeTotal = valueBasedAnnualFee * years;

    const feeSavings = traditionalFeeTotal - valueFeeTotal;
    const savingsPercentage = (feeSavings / traditionalFeeTotal) * 100;

    // Calculate additional months covered by savings
    const monthsCovered = feeSavings / monthly;
    const longevityBoost = monthsCovered / 12; // Years of additional expenses covered

    const calculationResults: CalculationResults = {
      monthlyExpenses: monthly,
      annualExpenses: annualExpenses,
      adjustedExpenses: adjustedAnnual,
      portfolioNeeded,
      traditionalFeeTotal,
      valueFeeTotal,
      feeSavings,
      savingsPercentage,
      monthsCovered,
      longevityBoost,
    };

    setResults(calculationResults);
    setShowResults(true);

    // Track calculation event
    analyticsEvents.trackCustomEvent('calc_run', {
      portfolio: portfolioNeeded,
      feePct: currentFeePercent[0],
      monthlyEssentials: monthly,
      inflation: parseFloat(inflationRate),
      growth: parseFloat(growthAssumption),
      years: years,
      savings: feeSavings,
      savings_percentage: savingsPercentage
    });

    // Trigger confetti for positive outcomes
    if (feeSavings > 0 && savingsPercentage > 20) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setShowConfetti(true);
        analyticsEvents.trackCustomEvent('calc_positive_outcome', { 
          savings: feeSavings, 
          monthsCovered: monthsCovered 
        });
      }, 500);
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

  const handleRoadmapCTA = () => {
    analyticsEvents.trackCustomEvent('cta_roadmap', { source: 'calculator_results' });
  };

  const handleDemoCTA = () => {
    analyticsEvents.trackCustomEvent('cta_demo', { source: 'calculator_results' });
  };

  React.useEffect(() => {
    analyticsEvents.trackPageView({
      page_name: 'fee_savings_calculator',
      page_path: '/calculator',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo variant="tree" onClick={() => navigate('/')} />
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Sticky Results Summary */}
      {showResults && results && (
        <div className="sticky top-0 z-40 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-200 dark:border-emerald-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center text-sm font-medium text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-4 w-4 mr-2" />
              You can reclaim {formatCurrency(results.feeSavings)} in fees and cover {Math.round(results.monthsCovered)} additional months of essentials
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Fee Savings Calculator
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Calculate your potential savings with value-driven pricing and see how those savings can extend your financial security.
            </p>
            <Badge variant="outline" className="text-base px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              100% Fiduciary • No Hidden Costs • Transparent Pricing
            </Badge>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Your Financial Information
                </CardTitle>
                <CardDescription>
                  Enter your monthly expenses and current advisor details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="monthly-expenses">Monthly Essential Expenses (Required)</Label>
                  <Input
                    id="monthly-expenses"
                    type="number"
                    placeholder="8,000"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Housing, food, utilities, healthcare, transportation
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="other-income">Other Monthly Income (Optional)</Label>
                  <Input
                    id="other-income"
                    type="number"
                    placeholder="2,500"
                    value={otherIncome}
                    onChange={(e) => setOtherIncome(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Social Security, pensions, rental income
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio-value">Current Portfolio Value</Label>
                  <Input
                    id="portfolio-value"
                    type="number"
                    placeholder="2,000,000"
                    value={portfolioValue}
                    onChange={(e) => setPortfolioValue(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Total investable assets
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Current Annual Advisory Fee: {currentFeePercent[0]}%</Label>
                  <Slider
                    value={currentFeePercent}
                    onValueChange={setCurrentFeePercent}
                    max={2.5}
                    min={0.25}
                    step={0.05}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.25% (Low-cost)</span>
                    <span>2.5% (High-touch)</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Inflation</Label>
                    <Select value={inflationRate} onValueChange={setInflationRate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1%</SelectItem>
                        <SelectItem value="2">2%</SelectItem>
                        <SelectItem value="3">3%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Growth</Label>
                    <Select value={growthAssumption} onValueChange={setGrowthAssumption}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6%</SelectItem>
                        <SelectItem value="7">7%</SelectItem>
                        <SelectItem value="8">8%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Horizon</Label>
                    <Select value={horizon} onValueChange={setHorizon}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 years</SelectItem>
                        <SelectItem value="20">20 years</SelectItem>
                        <SelectItem value="30">30 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={calculateResults} 
                  className="w-full text-lg py-6"
                  disabled={!monthlyExpenses || parseFloat(monthlyExpenses) <= 0}
                >
                  Calculate My Savings & Coverage
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
                    {/* Celebratory Header */}
                    {showConfetti && (
                      <motion.div 
                        className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Sparkles className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                          Congratulations! 🎉
                        </h3>
                        <p className="text-green-600 dark:text-green-400">
                          You could save significantly with our value-driven approach
                        </p>
                      </motion.div>
                    )}

                    {/* Fee Comparison */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Projected Fee Spend (Current vs Value Plan)</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                          <span className="text-sm font-medium">Traditional AUM Fee ({horizon} years)</span>
                          <span className="font-bold text-red-700 dark:text-red-300">
                            {formatCurrency(results.traditionalFeeTotal)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <span className="text-sm font-medium">Value-Based Fee ({horizon} years)</span>
                          <span className="font-bold text-green-700 dark:text-green-300">
                            {formatCurrency(results.valueFeeTotal)}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-2">
                          Savings Reclaimed
                        </Badge>
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                          {formatCurrency(results.feeSavings)}
                        </div>
                        <div className="text-blue-600 dark:text-blue-400">
                          {results.savingsPercentage.toFixed(1)}% savings vs traditional AUM fees
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Income Gap Coverage */}
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Income Gap Coverage
                      </h4>
                      <div className="text-lg">
                        <div className="flex justify-between">
                          <span>Additional months covered:</span>
                          <span className="font-bold">{Math.round(results.monthsCovered)} months</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Longevity Boost:</span>
                          <span className="font-bold">{results.longevityBoost.toFixed(1)} years</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your fee savings could cover {Math.round(results.monthsCovered)} additional months of essential expenses
                      </p>
                    </div>

                    <Separator />

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <Link to="/retirement-analyzer" onClick={handleRoadmapCTA}>
                        <Button className="w-full" size="lg">
                          Get My {withTrademarks("SWAG GPS™ Roadmap")}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      
                      <Link to="/demo?view=pricing" onClick={handleDemoCTA}>
                        <Button variant="outline" className="w-full">
                          See My Platform Options
                        </Button>
                      </Link>
                      
                      <Button variant="ghost" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Email me this result (PDF)
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Enter your information to see potential savings</p>
                    <p className="text-sm mt-2">Most families save 35-60% on advisory fees</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cross-sell Panel */}
          {showResults && results && (
            <div className="mt-12">
              <ResultsCrossSell results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}