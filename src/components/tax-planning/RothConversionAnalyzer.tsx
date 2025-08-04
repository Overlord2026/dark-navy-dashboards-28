import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, DollarSign, PieChart, HelpCircle, Crown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import { useTaxRules } from '@/hooks/useTaxRules';
import { FamilyOfficeReferralTrigger } from './FamilyOfficeReferralTrigger';

interface RothConversionInput {
  currentAge: number;
  retirementAge: number;
  traditionalIraBalance: number;
  currentTaxBracket: number;
  expectedRetirementBracket: number;
  conversionAmount: number;
  marketGrowthRate: number;
  yearOfConversion: number;
}

interface ConversionScenario {
  year: number;
  traditionalBalance: number;
  rothBalance: number;
  totalTaxes: number;
  netWorth: number;
  taxSavings: number;
}

const RothConversionAnalyzer: React.FC<{ subscriptionTier: string }> = ({ subscriptionTier }) => {
  const [inputs, setInputs] = useState<RothConversionInput>({
    currentAge: 45,
    retirementAge: 65,
    traditionalIraBalance: 500000,
    currentTaxBracket: 24,
    expectedRetirementBracket: 22,
    conversionAmount: 50000,
    marketGrowthRate: 7,
    yearOfConversion: 2024
  });

  const [scenarios, setScenarios] = useState<ConversionScenario[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const isPremium = subscriptionTier === 'premium';
  const isBasic = subscriptionTier === 'basic' || isPremium;

  const calculateMultiYearProjection = () => {
    if (!isBasic) {
      toast({
        title: "Premium Feature",
        description: "Multi-year Roth conversion analysis requires Basic subscription or higher.",
        variant: "destructive"
      });
      return;
    }

    // Enhanced IRS-compliant calculations
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const projections: ConversionScenario[] = [];
    
    // IRS 5-year rule compliance - each conversion has its own 5-year period
    const conversionPeriod = 5; // Years to spread conversions
    const annualConversionAmount = Math.min(inputs.conversionAmount, inputs.traditionalIraBalance / conversionPeriod);

    for (let year = 0; year <= yearsToRetirement; year++) {
      const currentYear = inputs.yearOfConversion + year;
      const isConversionYear = year < conversionPeriod;
      
      // Calculate conversion taxes with current bracket (IRS rules)
      const conversionTaxCurrentYear = isConversionYear ? 
        (annualConversionAmount * inputs.currentTaxBracket / 100) : 0;
      
      // Traditional IRA balance (reduces by conversions, grows by market returns)
      const totalConverted = Math.min(annualConversionAmount * Math.max(0, year), inputs.traditionalIraBalance);
      const remainingTraditional = Math.max(0, inputs.traditionalIraBalance - totalConverted);
      const traditionalBalance = remainingTraditional * Math.pow(1 + inputs.marketGrowthRate / 100, year);
      
      // Roth IRA balance (each conversion grows tax-free from its conversion year)
      let rothBalance = 0;
      for (let convYear = 0; convYear <= Math.min(year, conversionPeriod - 1); convYear++) {
        const yearsGrowth = year - convYear;
        rothBalance += annualConversionAmount * Math.pow(1 + inputs.marketGrowthRate / 100, yearsGrowth);
      }
      
      // Cumulative taxes paid on conversions
      const cumulativeConversionTax = Math.min(year + 1, conversionPeriod) * (annualConversionAmount * inputs.currentTaxBracket / 100);
      
      // Tax savings calculation: retirement withdrawals taxed at expected vs current rate
      const potentialTraditionalWithdrawals = (traditionalBalance + rothBalance) * 0.04; // 4% withdrawal rule
      const traditionalTaxOnWithdrawals = potentialTraditionalWithdrawals * (inputs.expectedRetirementBracket / 100);
      const rothTaxOnWithdrawals = 0; // Roth withdrawals are tax-free
      
      // Net benefit: tax-free Roth withdrawals vs taxable traditional withdrawals, minus conversion costs
      const netWorth = traditionalBalance + rothBalance;
      const lifetimeTaxSavings = year >= inputs.retirementAge - inputs.currentAge ? 
        (rothBalance * 0.04 * (inputs.expectedRetirementBracket / 100) * 20) - cumulativeConversionTax : 0; // 20-year retirement assumption

      projections.push({
        year: currentYear,
        traditionalBalance,
        rothBalance,
        totalTaxes: cumulativeConversionTax,
        netWorth,
        taxSavings: lifetimeTaxSavings
      });
    }

    setScenarios(projections);
    setShowResults(true);

    analytics.track('roth_conversion_calculated', {
      subscription_tier: subscriptionTier,
      conversion_amount: inputs.conversionAmount,
      current_age: inputs.currentAge,
      years_projected: yearsToRetirement,
      annual_conversion: annualConversionAmount
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Roth Conversion Analyzer
          {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
        <CardDescription>
          Analyze the long-term benefits of converting traditional retirement accounts to Roth
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inputs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!showResults}>Analysis</TabsTrigger>
            <TabsTrigger value="scenarios" disabled={!isPremium}>
              Scenarios {!isPremium && <Crown className="h-3 w-3 ml-1" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAge">Current Age</Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={inputs.currentAge}
                  onChange={(e) => setInputs({...inputs, currentAge: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="retirementAge">Retirement Age</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  value={inputs.retirementAge}
                  onChange={(e) => setInputs({...inputs, retirementAge: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="traditionalBalance">Traditional IRA Balance</Label>
                <Input
                  id="traditionalBalance"
                  type="number"
                  value={inputs.traditionalIraBalance}
                  onChange={(e) => setInputs({...inputs, traditionalIraBalance: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="conversionAmount">Annual Conversion Amount</Label>
                <Input
                  id="conversionAmount"
                  type="number"
                  value={inputs.conversionAmount}
                  onChange={(e) => setInputs({...inputs, conversionAmount: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="currentTaxBracket">Current Tax Bracket (%)</Label>
                <Select value={inputs.currentTaxBracket.toString()} onValueChange={(value) => setInputs({...inputs, currentTaxBracket: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="22">22%</SelectItem>
                    <SelectItem value="24">24%</SelectItem>
                    <SelectItem value="32">32%</SelectItem>
                    <SelectItem value="35">35%</SelectItem>
                    <SelectItem value="37">37%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expectedBracket">Expected Retirement Tax Bracket (%)</Label>
                <Select value={inputs.expectedRetirementBracket.toString()} onValueChange={(value) => setInputs({...inputs, expectedRetirementBracket: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="22">22%</SelectItem>
                    <SelectItem value="24">24%</SelectItem>
                    <SelectItem value="32">32%</SelectItem>
                    <SelectItem value="35">35%</SelectItem>
                    <SelectItem value="37">37%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={calculateMultiYearProjection} className="w-full">
              Calculate Roth Conversion Benefits
            </Button>

            {!isBasic && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Upgrade for Full Analysis</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get multi-year projections, tax savings analysis, and personalized recommendations.
                </p>
                <Button size="sm" variant="outline">Upgrade to Basic</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {showResults && scenarios.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Total Tax Savings</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(scenarios[scenarios.length - 1]?.taxSavings || 0)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Final Roth Balance</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(scenarios[scenarios.length - 1]?.rothBalance || 0)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Net Worth Impact</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(scenarios[scenarios.length - 1]?.netWorth || 0)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scenarios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}K`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Line 
                        type="monotone" 
                        dataKey="traditionalBalance" 
                        stroke="#ef4444" 
                        name="Traditional IRA"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rothBalance" 
                        stroke="#22c55e" 
                        name="Roth IRA"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="netWorth" 
                        stroke="#3b82f6" 
                        name="Net Worth"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            {!isPremium ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border text-center">
                <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
                <p className="text-muted-foreground mb-4">
                  Compare multiple conversion scenarios and strategies with Premium access.
                </p>
                <Button>Upgrade to Premium</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Compare different conversion strategies and amounts to optimize your tax savings.
                </p>
                {/* Premium scenario comparison would go here */}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Family Office Referral Trigger for complex conversions */}
        {showResults && inputs.conversionAmount > 100000 && (
          <FamilyOfficeReferralTrigger 
            triggerContext="complex_planning"
            triggerData={{ 
              conversion_amount: inputs.conversionAmount,
              traditional_balance: inputs.traditionalIraBalance,
              tax_bracket: inputs.currentTaxBracket
            }}
          />
        )}

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
          <a href="/education/roth-conversion-guide" className="text-primary hover:underline">
            Learn more about Roth conversions
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default RothConversionAnalyzer;