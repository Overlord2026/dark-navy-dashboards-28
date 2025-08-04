import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Heart, DollarSign, TrendingDown, AlertTriangle, Crown, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QCDInput {
  currentAge: number;
  iraBalance: number;
  expectedAnnualRMD: number;
  charityIntentAmount: number;
  marginalTaxRate: number;
  stateIncomeTax: number;
  charitableDeduction: number;
  standardDeduction: number;
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
}

interface QCDScenario {
  year: number;
  age: number;
  rmdAmount: number;
  qcdAmount: number;
  taxableRmd: number;
  taxSavings: number;
  cumulativeSavings: number;
  iraBalance: number;
}

const QCDPlanner: React.FC<{ subscriptionTier: string }> = ({ subscriptionTier }) => {
  const [inputs, setInputs] = useState<QCDInput>({
    currentAge: 72,
    iraBalance: 800000,
    expectedAnnualRMD: 32000, // 4% initial assumption
    charityIntentAmount: 10000,
    marginalTaxRate: 22,
    stateIncomeTax: 5,
    charitableDeduction: 8000,
    standardDeduction: 29200, // 2024 standard deduction for married filing jointly
    filingStatus: 'married_joint'
  });

  const [scenarios, setScenarios] = useState<QCDScenario[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [qcdEligible, setQcdEligible] = useState(true);
  const { toast } = useToast();

  const isPremium = subscriptionTier === 'premium';
  const isBasic = subscriptionTier === 'basic' || isPremium;

  // IRS QCD Rules (2024)
  const QCD_RULES = {
    MIN_AGE: 70.5, // Age requirement for QCD
    MAX_ANNUAL_QCD: 100000, // Maximum QCD per year
    RMD_START_AGE: 73, // RMD required starting age (updated for 2024)
    STANDARD_DEDUCTIONS: {
      'single': 14600,
      'married_joint': 29200,
      'married_separate': 14600,
      'head_of_household': 21900
    }
  };

  useEffect(() => {
    // Check QCD eligibility based on IRS rules
    const eligible = inputs.currentAge >= QCD_RULES.MIN_AGE;
    setQcdEligible(eligible);

    // Auto-update standard deduction based on filing status
    setInputs(prev => ({
      ...prev,
      standardDeduction: QCD_RULES.STANDARD_DEDUCTIONS[prev.filingStatus]
    }));
  }, [inputs.currentAge, inputs.filingStatus]);

  const calculateRMD = (age: number, balance: number): number => {
    // IRS Uniform Lifetime Table divisors (simplified)
    const lifetableFactors: { [key: number]: number } = {
      73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
      79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8,
      85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2,
      91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9
    };

    if (age < QCD_RULES.RMD_START_AGE) return 0;
    const factor = lifetableFactors[age] || lifetableFactors[95]; // Use minimum factor for ages > 95
    return balance / factor;
  };

  const calculateQCDAnalysis = () => {
    if (!isBasic) {
      toast({
        title: "Premium Feature",
        description: "QCD analysis requires Basic subscription or higher.",
        variant: "destructive"
      });
      return;
    }

    if (!qcdEligible) {
      toast({
        title: "Age Requirement",
        description: "QCDs are only available starting at age 70½.",
        variant: "destructive"
      });
      return;
    }

    const projections: QCDScenario[] = [];
    let currentBalance = inputs.iraBalance;
    let cumulativeSavings = 0;

    // Project 15 years or until age 95
    for (let year = 0; year < 15 && (inputs.currentAge + year) <= 95; year++) {
      const currentAgeInYear = inputs.currentAge + year;
      const rmdRequired = calculateRMD(currentAgeInYear, currentBalance);
      
      // QCD amount is limited by charity intent, RMD amount, and annual limit
      const maxQcdAllowed = Math.min(
        inputs.charityIntentAmount,
        rmdRequired,
        QCD_RULES.MAX_ANNUAL_QCD
      );
      
      const qcdAmount = currentAgeInYear >= QCD_RULES.MIN_AGE ? maxQcdAllowed : 0;
      const taxableRmd = Math.max(0, rmdRequired - qcdAmount);

      // Calculate tax savings
      const federalTaxOnRmd = taxableRmd * (inputs.marginalTaxRate / 100);
      const stateTaxOnRmd = taxableRmd * (inputs.stateIncomeTax / 100);
      
      // QCD provides tax savings equal to taxes that would have been paid on the QCD amount
      const qcdTaxSavings = qcdAmount * ((inputs.marginalTaxRate + inputs.stateIncomeTax) / 100);
      
      // Additional savings from avoiding AGI increase (affects Medicare premiums, taxation of Social Security)
      const agiAvoidanceBenefit = qcdAmount * 0.03; // Conservative 3% additional benefit
      
      const totalTaxSavings = qcdTaxSavings + agiAvoidanceBenefit;
      cumulativeSavings += totalTaxSavings;

      // Update balance (assuming 5% growth, minus RMD)
      currentBalance = (currentBalance - rmdRequired) * 1.05;

      projections.push({
        year: new Date().getFullYear() + year,
        age: currentAgeInYear,
        rmdAmount: rmdRequired,
        qcdAmount,
        taxableRmd,
        taxSavings: totalTaxSavings,
        cumulativeSavings,
        iraBalance: currentBalance
      });
    }

    setScenarios(projections);
    setShowResults(true);

    analytics.track('qcd_analysis_calculated', {
      subscription_tier: subscriptionTier,
      current_age: inputs.currentAge,
      charity_amount: inputs.charityIntentAmount,
      ira_balance: inputs.iraBalance
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalLifetimeSavings = scenarios.reduce((sum, scenario) => sum + scenario.taxSavings, 0);
  const averageAnnualSavings = scenarios.length > 0 ? totalLifetimeSavings / scenarios.length : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Qualified Charitable Distribution (QCD) Planner
          {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
        <CardDescription>
          Optimize your charitable giving and minimize taxes with QCDs from your IRA
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!qcdEligible && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You must be at least 70½ years old to make Qualified Charitable Distributions.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="inputs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!showResults}>Analysis</TabsTrigger>
            <TabsTrigger value="strategies" disabled={!isPremium}>
              Strategies {!isPremium && <Crown className="h-3 w-3 ml-1" />}
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
                {inputs.currentAge < QCD_RULES.MIN_AGE && (
                  <p className="text-sm text-muted-foreground mt-1">
                    QCDs available starting at age 70½
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="iraBalance">Current IRA Balance</Label>
                <Input
                  id="iraBalance"
                  type="number"
                  value={inputs.iraBalance}
                  onChange={(e) => setInputs({...inputs, iraBalance: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="charityAmount">Annual Charitable Intent</Label>
                <Input
                  id="charityAmount"
                  type="number"
                  value={inputs.charityIntentAmount}
                  onChange={(e) => setInputs({...inputs, charityIntentAmount: parseInt(e.target.value) || 0})}
                />
                {inputs.charityIntentAmount > QCD_RULES.MAX_ANNUAL_QCD && (
                  <p className="text-sm text-amber-600 mt-1">
                    QCD limited to ${QCD_RULES.MAX_ANNUAL_QCD.toLocaleString()} annually
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="filingStatus">Filing Status</Label>
                <Select value={inputs.filingStatus} onValueChange={(value: any) => setInputs({...inputs, filingStatus: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married_joint">Married Filing Jointly</SelectItem>
                    <SelectItem value="married_separate">Married Filing Separately</SelectItem>
                    <SelectItem value="head_of_household">Head of Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="marginalTaxRate">Federal Marginal Tax Rate (%)</Label>
                <Select value={inputs.marginalTaxRate.toString()} onValueChange={(value) => setInputs({...inputs, marginalTaxRate: parseInt(value)})}>
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
                <Label htmlFor="stateIncomeTax">State Income Tax Rate (%)</Label>
                <Input
                  id="stateIncomeTax"
                  type="number"
                  value={inputs.stateIncomeTax}
                  onChange={(e) => setInputs({...inputs, stateIncomeTax: parseFloat(e.target.value) || 0})}
                  step="0.1"
                />
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>IRS Rules:</strong> QCDs must be made directly from your IRA to qualified charities. 
                Maximum $100,000 annually. Must be age 70½ or older.
              </AlertDescription>
            </Alert>

            <Button onClick={calculateQCDAnalysis} className="w-full" disabled={!qcdEligible}>
              Calculate QCD Tax Benefits
            </Button>

            {!isBasic && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Upgrade for QCD Analysis</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get detailed QCD projections, tax savings analysis, and charitable giving strategies.
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
                        <TrendingDown className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Lifetime Tax Savings</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(totalLifetimeSavings)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Average Annual Savings</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(averageAnnualSavings)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Charitable Impact</span>
                      </div>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(scenarios.reduce((sum, s) => sum + s.qcdAmount, 0))}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scenarios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}K`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="rmdAmount" fill="#ef4444" name="Required RMD" />
                      <Bar dataKey="qcdAmount" fill="#22c55e" name="QCD Amount" />
                      <Bar dataKey="taxSavings" fill="#3b82f6" name="Tax Savings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Key Benefits of QCD Strategy:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Reduces adjusted gross income (AGI) which may lower Medicare premiums</li>
                    <li>May reduce taxation of Social Security benefits</li>
                    <li>Satisfies RMD requirement without creating taxable income</li>
                    <li>No need to itemize deductions to get tax benefit</li>
                    <li>Direct transfer preserves tax-advantaged status</li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="strategies" className="space-y-4">
            {!isPremium ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border text-center">
                <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
                <p className="text-muted-foreground mb-4">
                  Access advanced QCD strategies, timing optimization, and charitable planning with Premium.
                </p>
                <Button>Upgrade to Premium</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-semibold">Advanced QCD Strategies:</h4>
                <div className="grid gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-2">Bunch QCDs for Larger Impact</h5>
                      <p className="text-sm text-muted-foreground">
                        Make larger QCDs in alternating years to maximize tax efficiency and charitable impact.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-2">Coordinate with Roth Conversions</h5>
                      <p className="text-sm text-muted-foreground">
                        Use QCDs to offset income from strategic Roth conversions.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          <a href="/education/qcd-guide" className="text-primary hover:underline">
            Learn more about Qualified Charitable Distributions
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default QCDPlanner;