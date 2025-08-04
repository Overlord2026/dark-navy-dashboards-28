import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, DollarSign, Building2, AlertTriangle, Crown, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NUAInput {
  employerStockShares: number;
  costBasisPerShare: number;
  currentStockPrice: number;
  currentAge: number;
  anticipatedSaleAge: number;
  marginalOrdinaryRate: number;
  capitalGainsRate: number;
  stateIncomeTax: number;
  other401kBalance: number;
  projectedStockGrowth: number;
}

interface NUAScenario {
  strategy: 'nua' | 'rollover';
  immediateOrdinaryTax: number;
  capitalGainsTax: number;
  totalTaxes: number;
  netAfterTax: number;
  taxSavings: number;
}

const NUAAnalyzer: React.FC<{ subscriptionTier: string }> = ({ subscriptionTier }) => {
  const [inputs, setInputs] = useState<NUAInput>({
    employerStockShares: 1000,
    costBasisPerShare: 25,
    currentStockPrice: 75,
    currentAge: 60,
    anticipatedSaleAge: 65,
    marginalOrdinaryRate: 24,
    capitalGainsRate: 15,
    stateIncomeTax: 5,
    other401kBalance: 300000,
    projectedStockGrowth: 6
  });

  const [scenarios, setScenarios] = useState<NUAScenario[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [nuaEligible, setNuaEligible] = useState(true);
  const { toast } = useToast();

  const isPremium = subscriptionTier === 'premium';
  const isBasic = subscriptionTier === 'basic' || isPremium;

  // Calculate NUA (Net Unrealized Appreciation)
  const nuaAmount = (inputs.currentStockPrice - inputs.costBasisPerShare) * inputs.employerStockShares;
  const totalStockValue = inputs.currentStockPrice * inputs.employerStockShares;
  const costBasisTotal = inputs.costBasisPerShare * inputs.employerStockShares;

  const calculateNUAAnalysis = () => {
    if (!isBasic) {
      toast({
        title: "Premium Feature",
        description: "NUA analysis requires Basic subscription or higher.",
        variant: "destructive"
      });
      return;
    }

    const yearsUntilSale = inputs.anticipatedSaleAge - inputs.currentAge;
    const futureStockValue = totalStockValue * Math.pow(1 + inputs.projectedStockGrowth / 100, yearsUntilSale);
    const futureNUA = nuaAmount * Math.pow(1 + inputs.projectedStockGrowth / 100, yearsUntilSale);

    // NUA Strategy
    const nuaStrategy: NUAScenario = {
      strategy: 'nua',
      immediateOrdinaryTax: costBasisTotal * (inputs.marginalOrdinaryRate + inputs.stateIncomeTax) / 100,
      capitalGainsTax: futureNUA * (inputs.capitalGainsRate + inputs.stateIncomeTax * 0.5) / 100, // Assume state treats as cap gains
      totalTaxes: 0,
      netAfterTax: 0,
      taxSavings: 0
    };

    nuaStrategy.totalTaxes = nuaStrategy.immediateOrdinaryTax + nuaStrategy.capitalGainsTax;
    nuaStrategy.netAfterTax = futureStockValue - nuaStrategy.totalTaxes;

    // Rollover Strategy (all ordinary income when withdrawn)
    const rolloverStrategy: NUAScenario = {
      strategy: 'rollover',
      immediateOrdinaryTax: 0,
      capitalGainsTax: 0,
      totalTaxes: futureStockValue * (inputs.marginalOrdinaryRate + inputs.stateIncomeTax) / 100,
      netAfterTax: 0,
      taxSavings: 0
    };

    rolloverStrategy.netAfterTax = futureStockValue - rolloverStrategy.totalTaxes;

    // Calculate savings
    nuaStrategy.taxSavings = rolloverStrategy.totalTaxes - nuaStrategy.totalTaxes;
    rolloverStrategy.taxSavings = nuaStrategy.totalTaxes - rolloverStrategy.totalTaxes;

    setScenarios([nuaStrategy, rolloverStrategy]);
    setShowResults(true);

    analytics.track('nua_analysis_calculated', {
      subscription_tier: subscriptionTier,
      nua_amount: nuaAmount,
      stock_value: totalStockValue,
      potential_savings: nuaStrategy.taxSavings
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (amount: number, total: number) => {
    return ((amount / total) * 100).toFixed(1) + '%';
  };

  const pieData = [
    { name: 'Cost Basis', value: costBasisTotal, color: '#3b82f6' },
    { name: 'NUA', value: nuaAmount, color: '#22c55e' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Net Unrealized Appreciation (NUA) Analyzer
          {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
        <CardDescription>
          Analyze the tax benefits of using NUA treatment for employer stock in retirement plans
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inputs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!showResults}>Analysis</TabsTrigger>
            <TabsTrigger value="considerations" disabled={!isPremium}>
              Strategy {!isPremium && <Crown className="h-3 w-3 ml-1" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>NUA Requirements:</strong> Must be a lump-sum distribution after separation from service, 
                death, disability, or reaching age 59½. Employer stock must be distributed in-kind.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shares">Employer Stock Shares</Label>
                <Input
                  id="shares"
                  type="number"
                  value={inputs.employerStockShares}
                  onChange={(e) => setInputs({...inputs, employerStockShares: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <Label htmlFor="costBasis">Cost Basis per Share</Label>
                <Input
                  id="costBasis"
                  type="number"
                  value={inputs.costBasisPerShare}
                  onChange={(e) => setInputs({...inputs, costBasisPerShare: parseFloat(e.target.value) || 0})}
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="currentPrice">Current Stock Price</Label>
                <Input
                  id="currentPrice"
                  type="number"
                  value={inputs.currentStockPrice}
                  onChange={(e) => setInputs({...inputs, currentStockPrice: parseFloat(e.target.value) || 0})}
                  step="0.01"
                />
              </div>

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
                <Label htmlFor="saleAge">Anticipated Sale Age</Label>
                <Input
                  id="saleAge"
                  type="number"
                  value={inputs.anticipatedSaleAge}
                  onChange={(e) => setInputs({...inputs, anticipatedSaleAge: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="ordinaryRate">Marginal Ordinary Rate (%)</Label>
                <Select value={inputs.marginalOrdinaryRate.toString()} onValueChange={(value) => setInputs({...inputs, marginalOrdinaryRate: parseInt(value)})}>
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
                <Label htmlFor="capGainsRate">Capital Gains Rate (%)</Label>
                <Select value={inputs.capitalGainsRate.toString()} onValueChange={(value) => setInputs({...inputs, capitalGainsRate: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="15">15%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="stockGrowth">Projected Annual Stock Growth (%)</Label>
                <Input
                  id="stockGrowth"
                  type="number"
                  value={inputs.projectedStockGrowth}
                  onChange={(e) => setInputs({...inputs, projectedStockGrowth: parseFloat(e.target.value) || 0})}
                  step="0.1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <h4 className="font-medium text-sm mb-2">Current Position Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Stock Value:</span>
                    <span className="font-medium">{formatCurrency(totalStockValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Basis:</span>
                    <span className="font-medium">{formatCurrency(costBasisTotal)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>NUA Amount:</span>
                    <span className="font-medium">{formatCurrency(nuaAmount)}</span>
                  </div>
                </div>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Button onClick={calculateNUAAnalysis} className="w-full">
              Calculate NUA Tax Benefits
            </Button>

            {!isBasic && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Upgrade for NUA Analysis</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get detailed NUA projections, tax comparisons, and strategic timing recommendations.
                </p>
                <Button size="sm" variant="outline">Upgrade to Basic</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {showResults && scenarios.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scenarios.map((scenario) => (
                    <Card key={scenario.strategy} className={scenario.strategy === 'nua' && scenario.taxSavings > 0 ? 'ring-2 ring-green-500' : ''}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {scenario.strategy === 'nua' ? (
                            <>
                              <TrendingUp className="h-5 w-5 text-green-500" />
                              NUA Strategy
                              {scenario.taxSavings > 0 && <Badge variant="secondary">Recommended</Badge>}
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-5 w-5 text-blue-500" />
                              Rollover Strategy
                            </>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Immediate Tax:</span>
                            <span className={scenario.immediateOrdinaryTax > 0 ? 'text-red-600' : 'text-green-600'}>
                              {formatCurrency(scenario.immediateOrdinaryTax)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Capital Gains Tax:</span>
                            <span className={scenario.capitalGainsTax > 0 ? 'text-red-600' : 'text-green-600'}>
                              {formatCurrency(scenario.capitalGainsTax)}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium border-t pt-2">
                            <span>Total Taxes:</span>
                            <span className="text-red-600">{formatCurrency(scenario.totalTaxes)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Net After Tax:</span>
                            <span className="text-green-600">{formatCurrency(scenario.netAfterTax)}</span>
                          </div>
                          {scenario.taxSavings !== 0 && (
                            <div className="flex justify-between font-medium text-lg">
                              <span>Tax Savings:</span>
                              <span className={scenario.taxSavings > 0 ? 'text-green-600' : 'text-red-600'}>
                                {scenario.taxSavings > 0 ? '+' : ''}{formatCurrency(scenario.taxSavings)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> NUA treatment is irrevocable and requires careful planning. 
                    Consult with a tax professional before implementation.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </TabsContent>

          <TabsContent value="considerations" className="space-y-4">
            {!isPremium ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border text-center">
                <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
                <p className="text-muted-foreground mb-4">
                  Access advanced NUA strategies, timing considerations, and estate planning implications.
                </p>
                <Button>Upgrade to Premium</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-semibold">Strategic Considerations:</h4>
                <div className="grid gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-2">Timing Considerations</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Consider current vs. future tax rates</li>
                        <li>• Evaluate market timing for stock appreciation</li>
                        <li>• Plan around other income events</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-2">Estate Planning Benefits</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Step-up in basis for heirs on remaining NUA</li>
                        <li>• Reduces size of taxable estate</li>
                        <li>• Allows for more efficient wealth transfer</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-2">Risk Factors</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Concentration risk in single stock</li>
                        <li>• Immediate tax burden on cost basis</li>
                        <li>• No tax-deferred growth on distributed amount</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          <a href="/education/nua-guide" className="text-primary hover:underline">
            Learn more about Net Unrealized Appreciation strategies
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default NUAAnalyzer;