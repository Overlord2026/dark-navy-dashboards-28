import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { withTrademarks } from '@/utils/trademark';

export const DemoCalculator: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState('2000000');
  const [currentFee, setCurrentFee] = useState('1.25');
  
  const calculateSavings = () => {
    const portfolio = parseFloat(portfolioValue.replace(/[,$]/g, ''));
    const feePercent = parseFloat(currentFee) / 100;
    
    if (portfolio && feePercent) {
      const traditionalFees = portfolio * feePercent * 30;
      const bfoFlatFee = 9500 * 30;
      const savings = traditionalFees - bfoFlatFee;
      const potentialGrowth = savings * Math.pow(1.06, 30) - savings;
      
      return {
        traditionalFees: traditionalFees.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
        bfoFees: bfoFlatFee.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
        savings: savings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
        potentialGrowth: potentialGrowth.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      };
    }
    return null;
  };

  const calculation = calculateSavings();

  const premiumServices = [
    { name: "Advanced Estate Planning", locked: true },
    { name: "Premium Property Management", locked: true },
    { name: "Healthcare Optimization", locked: true },
    { name: "Private Market Access", locked: true },
    { name: "Tax Loss Harvesting", locked: true },
    { name: "Family Governance", locked: true }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <Card className="bg-gradient-primary text-white border-0">
        <CardContent className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {withTrademarks("Welcome to Your Boutique Family Office Demo")}
          </h1>
          <p className="text-xl opacity-90">
            Experience how a true family office can work for you. See your potential savings and discover services that go far beyond investment management.
          </p>
        </CardContent>
      </Card>

      {/* Calculator */}
      <Card className="bg-card/80 backdrop-blur-sm border border-gold/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Calculator className="h-6 w-6 text-gold" />
            What Are You Paying for Investment Management?
          </CardTitle>
          <p className="text-muted-foreground">
            Enter your portfolio value and current advisory fee to see your potential savings—and the additional services you could unlock.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Portfolio Value</label>
              <Input
                placeholder="$2,000,000"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(e.target.value)}
                className="text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Current Annual Fee (%)</label>
              <Input
                placeholder="1.25"
                value={currentFee}
                onChange={(e) => setCurrentFee(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>

          {calculation && (
            <motion.div 
              className="p-6 bg-emerald/10 border border-emerald/30 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-4">Your Potential Savings</h3>
              <div className="space-y-3 text-lg">
                <p>With a ${portfolioValue} portfolio at {currentFee}%, you'd pay <span className="font-bold text-error">{calculation.traditionalFees}</span> in fees over 30 years.</p>
                <p>Our typical flat fee for investment management could save you <span className="font-bold text-emerald">{calculation.savings}</span> and potentially add nearly <span className="font-bold text-emerald">{calculation.potentialGrowth}</span> in portfolio value.</p>
              </div>

              <div className="mt-6 p-4 bg-card/50 rounded-lg">
                <h4 className="font-bold mb-3">For that fee, BFO families enjoy:</h4>
                <ul className="space-y-2">
                  {[
                    "A customized retirement income roadmap",
                    withTrademarks("The Family Legacy Box™"),
                    "Ongoing tax planning",
                    "Private Market Alpha investments",
                    "Concierge-level advisory support"
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full mt-6 bg-gradient-primary hover:bg-gradient-primary/90 text-white">
                Book My Custom Fee & Service Review
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Premium Services Preview */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Premium Family Office Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumServices.map((service, index) => (
            <Card key={index} className="relative overflow-hidden bg-card/30">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                <p className="text-muted-foreground text-sm">
                  Advanced wealth management tools available with Family Office Plan
                </p>
                
                {service.locked && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <Badge variant="outline" className="mb-3">Premium Feature</Badge>
                      <Button size="sm" variant="outline">
                        Unlock with a Family Office Plan
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};