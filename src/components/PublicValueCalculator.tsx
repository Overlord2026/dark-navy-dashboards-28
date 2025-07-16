import React, { useState } from 'react';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, TrendingUp, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import CountUp from 'react-countup';

export const PublicValueCalculator: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState(2000000);
  const [currentFee, setCurrentFee] = useState(1.25);
  const [showResults, setShowResults] = useState(false);

  // Fixed BFO parameters
  const bfoFlatFee = 9500;
  const growthRate = 6; // 6% assumed return
  const timeHorizons = [10, 20, 30];

  const calculateSavings = (years: number) => {
    const currentFeeDecimal = currentFee / 100;
    
    // Traditional firm calculation
    let traditionalBalance = portfolioValue;
    let traditionalTotalFees = 0;
    
    for (let year = 1; year <= years; year++) {
      const annualFee = traditionalBalance * currentFeeDecimal;
      traditionalTotalFees += annualFee;
      traditionalBalance = (traditionalBalance - annualFee) * (1 + growthRate / 100);
    }
    
    // BFO flat fee calculation
    let bfoBalance = portfolioValue;
    let bfoTotalFees = bfoFlatFee * years;
    
    for (let year = 1; year <= years; year++) {
      bfoBalance = (bfoBalance - bfoFlatFee) * (1 + growthRate / 100);
    }
    
    return {
      traditionalFinalValue: traditionalBalance,
      bfoFinalValue: bfoBalance,
      traditionalTotalFees,
      bfoTotalFees,
      feeSavings: traditionalTotalFees - bfoTotalFees,
      additionalWealth: bfoBalance - traditionalBalance
    };
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const results30Year = calculateSavings(30);
  const results20Year = calculateSavings(20);
  const results10Year = calculateSavings(10);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Are You Paying Too Much for Investment Management?
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Find out in seconds—and see what else you could be getting.
        </p>
      </div>

      {/* Calculator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <DashboardCard title="Calculate Your Potential Savings" className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="portfolio">Portfolio Value</Label>
              <Input
                id="portfolio"
                type="number"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(Number(e.target.value))}
                placeholder="$2,000,000"
                className="mt-1 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="currentFee">Current Advisory Fee (%)</Label>
              <Input
                id="currentFee"
                type="number"
                step="0.05"
                value={currentFee}
                onChange={(e) => setCurrentFee(Number(e.target.value))}
                placeholder="1.25"
                className="mt-1 text-lg"
              />
            </div>

            <Button 
              onClick={handleCalculate} 
              size="lg"
              className="w-full text-lg py-6 bg-primary hover:bg-primary/90"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Calculate My Savings
            </Button>
          </div>
        </DashboardCard>

        {/* BFO Example */}
        <DashboardCard title="BFO Value Comparison" className="bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="space-y-4">
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-sm text-muted-foreground">BFO Flat Fee for $2M Portfolio</div>
              <div className="text-3xl font-bold text-primary">{formatCurrency(bfoFlatFee)}/year</div>
              <div className="text-sm text-muted-foreground">Investment Management Only</div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">For that fee, you get:</p>
              {[
                'Complete investment management',
                'Proactive tax planning',
                'Family Legacy Box™',
                'Custom retirement income roadmap',
                'Dedicated, conflict-free advisors'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="space-y-8 animate-fade-in">
          {/* Dramatic Results Message */}
          <div className="text-center p-8 bg-gradient-to-r from-destructive/10 to-green-500/10 rounded-lg border">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              You could save over $1.38 million in fees and add nearly $2.8 million to your wealth over 30 years, compared to a typical advisor charging 1.25%.
            </h2>
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-lg text-muted-foreground">
                For that same (or even lower) fee, BFO families receive:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'Full investment management',
                  'Proactive tax planning', 
                  'Retirement income roadmap',
                  'Family Legacy Box™',
                  'Exclusive private market opportunities',
                  'And more'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">
                Actual pricing and services depend on your unique needs. Schedule a complimentary review to see your custom proposal.
              </p>
            </div>
          </div>

          {/* Comparison Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {timeHorizons.map((years) => {
              const results = calculateSavings(years);
              return (
                <DashboardCard key={years} title={`${years}-Year Comparison`} className="text-center">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Typical Firm</span>
                      <span className="font-medium">{formatCurrency(results.traditionalFinalValue)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">BFO Flat Fee</span>
                      <span className="font-medium text-green-600">{formatCurrency(results.bfoFinalValue)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="text-lg font-bold text-green-600">
                        <CountUp
                          start={0}
                          end={results.feeSavings}
                          duration={2}
                          formattingFn={formatCurrency}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">Fee Savings</div>
                    </div>
                  </div>
                </DashboardCard>
              );
            })}
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-8 border">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-foreground">
                With our value-driven flat fee, you could save over{' '}
                <span className="text-green-600">{formatCurrency(results30Year.feeSavings)}</span>{' '}
                in fees and add nearly{' '}
                <span className="text-blue-600">{formatCurrency(results30Year.additionalWealth)}</span>{' '}
                to your wealth by retirement.
              </h3>
              
              <div className="max-w-2xl mx-auto">
                <p className="text-muted-foreground mb-6">
                  Actual savings and services depend on your unique needs. To discover your true fee and full service menu, book a review with a BFO advisor.
                </p>
                
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                  onClick={() => window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank')}
                >
                  Book My Custom Fee & Service Review
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Ready to see your true savings—and a personalized service menu? Schedule a no-pressure review with a BFO advisor.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center p-4 bg-muted/30 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> Actual pricing and services depend on your unique situation and needs. Calculator for illustration only.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};