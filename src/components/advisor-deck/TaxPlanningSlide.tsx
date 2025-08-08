import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaxPlanningSlideProps {
  liveDemoMode?: boolean;
  whiteLabelEnabled?: boolean;
  presentationMode?: boolean;
}

export const TaxPlanningSlide: React.FC<TaxPlanningSlideProps> = ({
  liveDemoMode,
  whiteLabelEnabled,
  presentationMode
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('roth_conversion');

  const taxStrategies = [
    {
      id: 'roth_conversion',
      name: 'Optimal Roth Conversions',
      description: 'Convert traditional IRA to Roth during low-income years',
      currentTaxes: 180000,
      optimizedTaxes: 125000,
      savings: 55000,
      years: '5-year strategy'
    },
    {
      id: 'social_security',
      name: 'Social Security Timing',
      description: 'Delay Social Security to maximize benefits',
      currentTaxes: 45000,
      optimizedTaxes: 32000,
      savings: 13000,
      years: 'Annual savings'
    },
    {
      id: 'withdrawal_sequence',
      name: 'Tax-Smart Withdrawals',
      description: 'Optimize withdrawal sequence from different account types',
      currentTaxes: 65000,
      optimizedTaxes: 48000,
      savings: 17000,
      years: 'Annual savings'
    },
    {
      id: 'bracket_management',
      name: 'Tax Bracket Management',
      description: 'Stay within optimal tax brackets through careful planning',
      currentTaxes: 85000,
      optimizedTaxes: 71000,
      savings: 14000,
      years: 'Annual savings'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const selectedStrategyData = taxStrategies.find(s => s.id === selectedStrategy) || taxStrategies[0];

  // Tax bracket visualization data
  const taxBrackets = [
    { min: 0, max: 22550, rate: 10, optimal: false },
    { min: 22550, max: 89450, rate: 12, optimal: true },
    { min: 89450, max: 190750, rate: 22, optimal: true },
    { min: 190750, max: 364200, rate: 24, optimal: false },
    { min: 364200, max: 462500, rate: 32, optimal: false },
    { min: 462500, max: 693750, rate: 35, optimal: false },
    { min: 693750, max: Infinity, rate: 37, optimal: false }
  ];

  return (
    <div className="min-h-[600px] p-8 md:p-16 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            Tax Optimization & Efficiency
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-primary">Tax-Efficient</span> Planning
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The SWAG™ GPS™ identifies opportunities for tax efficiency, including optimal Roth conversions, 
            Social Security timing, and tax-smart withdrawal sequencing.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Tax Bracket Heat Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Percent className="h-5 w-5 mr-2 text-primary" />
                  Tax Bracket Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {taxBrackets.slice(0, 6).map((bracket, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-4 h-8 rounded ${
                        bracket.optimal ? 'bg-green-500' : bracket.rate >= 24 ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{bracket.rate}% Tax Bracket</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(bracket.min)} - {
                            bracket.max === Infinity ? '∞' : formatCurrency(bracket.max)
                          }
                        </div>
                      </div>
                      {bracket.optimal && (
                        <Badge variant="default" className="text-xs">Optimal</Badge>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Roth Conversion Window</h4>
                  <p className="text-sm text-green-700">
                    Client can convert up to <strong>{formatCurrency(95000)}</strong> annually 
                    while staying in the 22% bracket.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Strategy Selector & Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Strategy Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {taxStrategies.map((strategy) => (
                <Button
                  key={strategy.id}
                  variant={selectedStrategy === strategy.id ? "default" : "outline"}
                  className="h-auto p-3 text-left"
                  onClick={() => setSelectedStrategy(strategy.id)}
                >
                  <div>
                    <div className="font-semibold text-sm">{strategy.name}</div>
                    <div className="text-xs opacity-75">{strategy.years}</div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Selected Strategy Details */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">{selectedStrategyData.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{selectedStrategyData.description}</p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Current Taxes</div>
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(selectedStrategyData.currentTaxes)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Optimized Taxes</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(selectedStrategyData.optimizedTaxes)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Tax Savings</div>
                    <div className="text-xl font-bold text-primary">
                      {formatCurrency(selectedStrategyData.savings)}
                    </div>
                  </div>
                </div>

                {/* Savings Visualization */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tax Efficiency</span>
                    <span className="font-semibold">
                      {Math.round((selectedStrategyData.savings / selectedStrategyData.currentTaxes) * 100)}% Reduction
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${100 - (selectedStrategyData.optimizedTaxes / selectedStrategyData.currentTaxes) * 100}%` 
                      }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Live Demo Section */}
        {liveDemoMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Interactive Tax Planning Demo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Adjust Income Slider</div>
                    <div className="mt-2 bg-muted h-6 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">$125,000</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Conversion Amount</div>
                    <div className="mt-2 bg-muted h-6 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">$85,000</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Tax Savings</div>
                    <div className="mt-2 bg-primary/10 h-6 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{formatCurrency(selectedStrategyData.savings)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Script Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3">Advisor Script:</h4>
              <p className="text-sm leading-relaxed italic">
                "The SWAG™ GPS™ identifies opportunities for tax efficiency, including optimal Roth conversions, 
                Social Security timing, and tax-smart withdrawal sequencing. We can show your clients exactly 
                how much they can save in taxes over their lifetime with proper planning."
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};