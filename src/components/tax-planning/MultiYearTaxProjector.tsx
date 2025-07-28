import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Calculator, PieChart, Crown, HelpCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

interface ProjectionInput {
  currentAge: number;
  retirementAge: number;
  currentIncome: number;
  incomeGrowthRate: number;
  currentSavings: number;
  annualSavings: number;
  employerMatch: number;
  socialSecurityBenefit: number;
  pensionBenefit: number;
  otherIncome: number;
  inflationRate: number;
  marketGrowthRate: number;
  currentTaxBracket: number;
  retirementLocation: string;
}

interface YearlyProjection {
  year: number;
  age: number;
  grossIncome: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  cumulativeSavings: number;
}

const TAX_BRACKETS_2024 = [
  { min: 0, max: 11000, rate: 10 },
  { min: 11001, max: 44725, rate: 12 },
  { min: 44726, max: 95375, rate: 22 },
  { min: 95376, max: 182050, rate: 24 },
  { min: 182051, max: 231250, rate: 32 },
  { min: 231251, max: 578125, rate: 35 },
  { min: 578126, max: Infinity, rate: 37 }
];

const STATE_TAX_RATES: Record<string, number> = {
  'CA': 13.3, 'NY': 10.9, 'NJ': 10.75, 'OR': 9.9, 'MN': 9.85,
  'DC': 8.95, 'VT': 8.75, 'IA': 8.53, 'WI': 7.65, 'ME': 7.15,
  'TX': 0, 'FL': 0, 'NV': 0, 'WA': 0, 'WY': 0, 'SD': 0, 'TN': 0, 'AK': 0, 'NH': 0
};

const MultiYearTaxProjector: React.FC<{ subscriptionTier: string }> = ({ subscriptionTier }) => {
  const [inputs, setInputs] = useState<ProjectionInput>({
    currentAge: 35,
    retirementAge: 65,
    currentIncome: 100000,
    incomeGrowthRate: 3,
    currentSavings: 50000,
    annualSavings: 15000,
    employerMatch: 5000,
    socialSecurityBenefit: 24000,
    pensionBenefit: 0,
    otherIncome: 0,
    inflationRate: 2.5,
    marketGrowthRate: 7,
    currentTaxBracket: 22,
    retirementLocation: 'FL'
  });

  const [projections, setProjections] = useState<YearlyProjection[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const isPremium = subscriptionTier === 'premium';
  const isBasic = subscriptionTier === 'basic' || isPremium;

  const calculateFederalTax = (income: number) => {
    let tax = 0;
    let remainingIncome = income;

    for (const bracket of TAX_BRACKETS_2024) {
      if (remainingIncome <= 0) break;
      
      const taxableInThisBracket = Math.min(
        remainingIncome, 
        bracket.max - bracket.min + 1
      );
      
      tax += (taxableInThisBracket * bracket.rate) / 100;
      remainingIncome -= taxableInThisBracket;
    }

    return tax;
  };

  const calculateStateTax = (income: number, state: string) => {
    const stateRate = STATE_TAX_RATES[state] || 5; // Default 5% for other states
    return (income * stateRate) / 100;
  };

  const calculateProjections = () => {
    if (!isBasic) {
      toast({
        title: "Premium Feature",
        description: "Multi-year tax projection requires Basic subscription or higher.",
        variant: "destructive"
      });
      return;
    }

    const yearsToProject = Math.min(inputs.retirementAge - inputs.currentAge + 10, 40);
    const newProjections: YearlyProjection[] = [];

    for (let year = 0; year <= yearsToProject; year++) {
      const currentYear = new Date().getFullYear() + year;
      const age = inputs.currentAge + year;
      
      let grossIncome: number;
      
      if (age < inputs.retirementAge) {
        // Working years
        grossIncome = inputs.currentIncome * Math.pow(1 + inputs.incomeGrowthRate / 100, year);
      } else {
        // Retirement years
        const retirementSavings = inputs.currentSavings * Math.pow(1 + inputs.marketGrowthRate / 100, year);
        const withdrawalRate = 0.04; // 4% rule
        const retirementWithdrawals = retirementSavings * withdrawalRate;
        
        grossIncome = inputs.socialSecurityBenefit + inputs.pensionBenefit + 
                     retirementWithdrawals + inputs.otherIncome;
      }

      const federalTax = calculateFederalTax(grossIncome);
      const stateTax = calculateStateTax(grossIncome, inputs.retirementLocation);
      const totalTax = federalTax + stateTax;
      const netIncome = grossIncome - totalTax;
      const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
      
      // Simplified marginal rate calculation
      const marginalTaxRate = grossIncome > 578125 ? 37 : 
                             grossIncome > 231250 ? 35 :
                             grossIncome > 182050 ? 32 :
                             grossIncome > 95375 ? 24 :
                             grossIncome > 44725 ? 22 :
                             grossIncome > 11000 ? 12 : 10;

      const cumulativeSavings = age < inputs.retirementAge ? 
        inputs.currentSavings * Math.pow(1 + inputs.marketGrowthRate / 100, year) +
        (inputs.annualSavings + inputs.employerMatch) * year : 0;

      newProjections.push({
        year: currentYear,
        age,
        grossIncome,
        federalTax,
        stateTax,
        totalTax,
        netIncome,
        effectiveTaxRate,
        marginalTaxRate,
        cumulativeSavings
      });
    }

    setProjections(newProjections);
    setShowResults(true);

    analytics.track('multi_year_tax_projection_calculated', {
      subscription_tier: subscriptionTier,
      years_projected: yearsToProject,
      current_age: inputs.currentAge,
      retirement_age: inputs.retirementAge,
      retirement_location: inputs.retirementLocation
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTotalTaxesPaid = () => {
    return projections.reduce((sum, projection) => sum + projection.totalTax, 0);
  };

  const getAverageEffectiveRate = () => {
    if (projections.length === 0) return 0;
    const totalEffectiveRate = projections.reduce((sum, projection) => sum + projection.effectiveTaxRate, 0);
    return totalEffectiveRate / projections.length;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Multi-Year Tax Projection Simulator
          {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
        <CardDescription>
          Project your tax situation over multiple years and plan for retirement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inputs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="projections" disabled={!showResults}>Projections</TabsTrigger>
            <TabsTrigger value="scenarios" disabled={!isPremium}>
              Scenarios {!isPremium && <Crown className="h-3 w-3 ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="optimization" disabled={!isPremium}>
              Optimization {!isPremium && <Crown className="h-3 w-3 ml-1" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
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
                </div>
                
                <div>
                  <Label htmlFor="retirementLocation">Retirement State</Label>
                  <Select value={inputs.retirementLocation} onValueChange={(value) => setInputs({...inputs, retirementLocation: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FL">Florida (0% tax)</SelectItem>
                      <SelectItem value="TX">Texas (0% tax)</SelectItem>
                      <SelectItem value="NV">Nevada (0% tax)</SelectItem>
                      <SelectItem value="WA">Washington (0% tax)</SelectItem>
                      <SelectItem value="CA">California (13.3% tax)</SelectItem>
                      <SelectItem value="NY">New York (10.9% tax)</SelectItem>
                      <SelectItem value="NJ">New Jersey (10.75% tax)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Income & Growth</h4>
                <div>
                  <Label htmlFor="currentIncome">Current Annual Income</Label>
                  <Input
                    id="currentIncome"
                    type="number"
                    value={inputs.currentIncome}
                    onChange={(e) => setInputs({...inputs, currentIncome: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="incomeGrowthRate">Income Growth Rate (%)</Label>
                  <Input
                    id="incomeGrowthRate"
                    type="number"
                    step="0.1"
                    value={inputs.incomeGrowthRate}
                    onChange={(e) => setInputs({...inputs, incomeGrowthRate: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                  <Input
                    id="inflationRate"
                    type="number"
                    step="0.1"
                    value={inputs.inflationRate}
                    onChange={(e) => setInputs({...inputs, inflationRate: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Savings & Investments</h4>
                <div>
                  <Label htmlFor="currentSavings">Current Retirement Savings</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    value={inputs.currentSavings}
                    onChange={(e) => setInputs({...inputs, currentSavings: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="annualSavings">Annual Savings Contribution</Label>
                  <Input
                    id="annualSavings"
                    type="number"
                    value={inputs.annualSavings}
                    onChange={(e) => setInputs({...inputs, annualSavings: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="employerMatch">Employer Match</Label>
                  <Input
                    id="employerMatch"
                    type="number"
                    value={inputs.employerMatch}
                    onChange={(e) => setInputs({...inputs, employerMatch: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="marketGrowthRate">Market Growth Rate (%)</Label>
                  <Input
                    id="marketGrowthRate"
                    type="number"
                    step="0.1"
                    value={inputs.marketGrowthRate}
                    onChange={(e) => setInputs({...inputs, marketGrowthRate: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Retirement Income</h4>
                <div>
                  <Label htmlFor="socialSecurityBenefit">Annual Social Security Benefit</Label>
                  <Input
                    id="socialSecurityBenefit"
                    type="number"
                    value={inputs.socialSecurityBenefit}
                    onChange={(e) => setInputs({...inputs, socialSecurityBenefit: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="pensionBenefit">Annual Pension Benefit</Label>
                  <Input
                    id="pensionBenefit"
                    type="number"
                    value={inputs.pensionBenefit}
                    onChange={(e) => setInputs({...inputs, pensionBenefit: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="otherIncome">Other Annual Income</Label>
                  <Input
                    id="otherIncome"
                    type="number"
                    value={inputs.otherIncome}
                    onChange={(e) => setInputs({...inputs, otherIncome: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>

            <Button onClick={calculateProjections} className="w-full">
              Generate Multi-Year Tax Projection
            </Button>

            {!isBasic && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Upgrade for Tax Projections</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get detailed multi-year tax projections, scenario planning, and optimization strategies.
                </p>
                <Button size="sm" variant="outline">Upgrade to Basic</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="projections" className="space-y-4">
            {showResults && projections.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total Lifetime Taxes</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(getTotalTaxesPaid())}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Average Effective Rate</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {getAverageEffectiveRate().toFixed(1)}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Years Projected</p>
                        <p className="text-2xl font-bold text-green-600">
                          {projections.length}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          name === 'effectiveTaxRate' || name === 'marginalTaxRate' ? 
                            `${value.toFixed(1)}%` : formatCurrency(value),
                          name === 'effectiveTaxRate' ? 'Effective Tax Rate' :
                          name === 'marginalTaxRate' ? 'Marginal Tax Rate' :
                          name === 'totalTax' ? 'Total Tax' :
                          name === 'grossIncome' ? 'Gross Income' : name
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="effectiveTaxRate" 
                        stroke="#3b82f6" 
                        name="Effective Tax Rate"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="marginalTaxRate" 
                        stroke="#ef4444" 
                        name="Marginal Tax Rate"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projections.slice(0, 20)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}K`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="grossIncome" fill="#22c55e" name="Gross Income" />
                      <Bar dataKey="totalTax" fill="#ef4444" name="Total Tax" />
                      <Bar dataKey="netIncome" fill="#3b82f6" name="Net Income" />
                    </BarChart>
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
                  Compare different tax scenarios and strategies with Premium access.
                </p>
                <Button>Upgrade to Premium</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Compare different tax scenarios, retirement locations, and strategies.
                </p>
                {/* Scenario comparison would go here */}
              </div>
            )}
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            {!isPremium ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border text-center">
                <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
                <p className="text-muted-foreground mb-4">
                  Get AI-powered tax optimization recommendations with Premium access.
                </p>
                <Button>Upgrade to Premium</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  AI-powered recommendations to optimize your tax situation over time.
                </p>
                {/* Optimization recommendations would go here */}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
          <a href="/education/tax-projection-guide" className="text-primary hover:underline">
            Learn more about tax projections
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiYearTaxProjector;