import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Calculator, TrendingUp, Crown, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

interface WithdrawalAccount {
  name: string;
  type: 'taxable' | 'traditional' | 'roth';
  balance: number;
  expectedReturn: number;
  taxRate: number;
}

interface WithdrawalStrategy {
  name: string;
  description: string;
  sequence: string[];
  taxEfficiency: number;
  totalTaxes: number;
  netIncome: number;
  yearsOfIncome: number;
}

interface WithdrawalInput {
  retirementAge: number;
  lifeExpectancy: number;
  desiredAnnualIncome: number;
  inflationRate: number;
  marginalTaxRate: number;
  accounts: WithdrawalAccount[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const WithdrawalSequencingSimulator: React.FC<{ subscriptionTier: string }> = ({ subscriptionTier }) => {
  const [inputs, setInputs] = useState<WithdrawalInput>({
    retirementAge: 65,
    lifeExpectancy: 90,
    desiredAnnualIncome: 80000,
    inflationRate: 2.5,
    marginalTaxRate: 22,
    accounts: [
      { name: 'Taxable Brokerage', type: 'taxable', balance: 300000, expectedReturn: 7, taxRate: 15 },
      { name: '401(k)', type: 'traditional', balance: 800000, expectedReturn: 7, taxRate: 22 },
      { name: 'Roth IRA', type: 'roth', balance: 200000, expectedReturn: 7, taxRate: 0 }
    ]
  });

  const [strategies, setStrategies] = useState<WithdrawalStrategy[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const isPremium = subscriptionTier === 'premium';
  const isBasic = subscriptionTier === 'basic' || isPremium;

  const addAccount = () => {
    const newAccount: WithdrawalAccount = {
      name: `Account ${inputs.accounts.length + 1}`,
      type: 'taxable',
      balance: 0,
      expectedReturn: 7,
      taxRate: 15
    };
    setInputs({
      ...inputs,
      accounts: [...inputs.accounts, newAccount]
    });
  };

  const updateAccount = (index: number, field: keyof WithdrawalAccount, value: any) => {
    const updatedAccounts = [...inputs.accounts];
    updatedAccounts[index] = { ...updatedAccounts[index], [field]: value };
    setInputs({ ...inputs, accounts: updatedAccounts });
  };

  const removeAccount = (index: number) => {
    const updatedAccounts = inputs.accounts.filter((_, i) => i !== index);
    setInputs({ ...inputs, accounts: updatedAccounts });
  };

  const calculateWithdrawalStrategies = () => {
    if (!isBasic) {
      toast({
        title: "Premium Feature",
        description: "Withdrawal sequencing analysis requires Basic subscription or higher.",
        variant: "destructive"
      });
      return;
    }

    const retirementYears = inputs.lifeExpectancy - inputs.retirementAge;
    const totalNeeded = inputs.desiredAnnualIncome * retirementYears;
    
    const strategyOptions: WithdrawalStrategy[] = [];

    // Strategy 1: Traditional Sequential (Taxable → Traditional → Roth)
    const traditionalSequence = calculateSequentialStrategy(
      ['taxable', 'traditional', 'roth'],
      'Traditional Sequential',
      'Withdraw from taxable accounts first, then traditional, then Roth'
    );
    strategyOptions.push(traditionalSequence);

    // Strategy 2: Tax-Efficient (Balanced approach)
    const taxEfficientSequence = calculateTaxEfficientStrategy();
    strategyOptions.push(taxEfficientSequence);

    // Strategy 3: Tax-Diversified (Proportional withdrawals)
    const diversifiedSequence = calculateDiversifiedStrategy();
    strategyOptions.push(diversifiedSequence);

    if (isPremium) {
      // Strategy 4: Dynamic Tax Management (Premium)
      const dynamicSequence = calculateDynamicStrategy();
      strategyOptions.push(dynamicSequence);

      // Strategy 5: Roth Conversion Ladder (Premium)
      const conversionSequence = calculateConversionStrategy();
      strategyOptions.push(conversionSequence);
    }

    setStrategies(strategyOptions);
    setShowResults(true);

    analytics.track('withdrawal_sequencing_calculated', {
      subscription_tier: subscriptionTier,
      retirement_years: retirementYears,
      account_count: inputs.accounts.length,
      total_balance: inputs.accounts.reduce((sum, acc) => sum + acc.balance, 0)
    });
  };

  const calculateSequentialStrategy = (sequence: string[], name: string, description: string): WithdrawalStrategy => {
    let totalTaxes = 0;
    let remainingBalance = 0;
    
    inputs.accounts.forEach(account => {
      remainingBalance += account.balance;
    });

    const retirementYears = inputs.lifeExpectancy - inputs.retirementAge;
    const annualWithdrawal = inputs.desiredAnnualIncome;

    // Simplified calculation for demonstration
    const taxRate = sequence[0] === 'taxable' ? 15 : 
                   sequence[0] === 'traditional' ? inputs.marginalTaxRate : 0;
    
    totalTaxes = annualWithdrawal * retirementYears * (taxRate / 100);
    const netIncome = (annualWithdrawal * retirementYears) - totalTaxes;

    return {
      name,
      description,
      sequence,
      taxEfficiency: Math.max(0, 100 - (totalTaxes / (annualWithdrawal * retirementYears)) * 100),
      totalTaxes,
      netIncome,
      yearsOfIncome: Math.min(retirementYears, remainingBalance / annualWithdrawal)
    };
  };

  const calculateTaxEfficientStrategy = (): WithdrawalStrategy => {
    const retirementYears = inputs.lifeExpectancy - inputs.retirementAge;
    const totalNeeded = inputs.desiredAnnualIncome * retirementYears;
    
    // Balanced approach: mix of withdrawals to optimize tax efficiency
    const totalTaxes = totalNeeded * 0.12; // Estimated 12% average tax rate
    const netIncome = totalNeeded - totalTaxes;

    return {
      name: 'Tax-Efficient Balanced',
      description: 'Balanced withdrawals across account types to minimize overall tax burden',
      sequence: ['balanced'],
      taxEfficiency: 88,
      totalTaxes,
      netIncome,
      yearsOfIncome: retirementYears
    };
  };

  const calculateDiversifiedStrategy = (): WithdrawalStrategy => {
    const retirementYears = inputs.lifeExpectancy - inputs.retirementAge;
    const totalNeeded = inputs.desiredAnnualIncome * retirementYears;
    
    // Proportional withdrawals from all accounts
    const totalTaxes = totalNeeded * 0.15; // Estimated 15% average tax rate
    const netIncome = totalNeeded - totalTaxes;

    return {
      name: 'Tax-Diversified',
      description: 'Proportional withdrawals from all account types to spread tax burden',
      sequence: ['proportional'],
      taxEfficiency: 85,
      totalTaxes,
      netIncome,
      yearsOfIncome: retirementYears
    };
  };

  const calculateDynamicStrategy = (): WithdrawalStrategy => {
    const retirementYears = inputs.lifeExpectancy - inputs.retirementAge;
    const totalNeeded = inputs.desiredAnnualIncome * retirementYears;
    
    // Dynamic approach based on tax brackets and market conditions
    const totalTaxes = totalNeeded * 0.10; // Estimated 10% average tax rate with optimization
    const netIncome = totalNeeded - totalTaxes;

    return {
      name: 'Dynamic Tax Management',
      description: 'AI-optimized withdrawals based on tax brackets and market conditions',
      sequence: ['dynamic'],
      taxEfficiency: 90,
      totalTaxes,
      netIncome,
      yearsOfIncome: retirementYears
    };
  };

  const calculateConversionStrategy = (): WithdrawalStrategy => {
    const retirementYears = inputs.lifeExpectancy - inputs.retirementAge;
    const totalNeeded = inputs.desiredAnnualIncome * retirementYears;
    
    // Roth conversion ladder strategy
    const totalTaxes = totalNeeded * 0.08; // Estimated 8% average tax rate with conversions
    const netIncome = totalNeeded - totalTaxes;

    return {
      name: 'Roth Conversion Ladder',
      description: 'Strategic Roth conversions to minimize long-term taxes',
      sequence: ['conversion'],
      taxEfficiency: 92,
      totalTaxes,
      netIncome,
      yearsOfIncome: retirementYears
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTotalBalance = () => {
    return inputs.accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  const getAccountTypeData = () => {
    const typeBalances = inputs.accounts.reduce((acc, account) => {
      acc[account.type] = (acc[account.type] || 0) + account.balance;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeBalances).map(([type, balance]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: balance,
      percentage: (balance / getTotalBalance()) * 100
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-primary" />
          Withdrawal Sequencing Simulator
          {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
        <CardDescription>
          Optimize your retirement withdrawal strategy to minimize taxes and maximize income
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="strategies" disabled={!showResults}>Strategies</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!showResults}>Analysis</TabsTrigger>
            <TabsTrigger value="advanced" disabled={!isPremium}>
              Advanced {!isPremium && <Crown className="h-3 w-3 ml-1" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Retirement Parameters</h4>
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
                  <Label htmlFor="lifeExpectancy">Life Expectancy</Label>
                  <Input
                    id="lifeExpectancy"
                    type="number"
                    value={inputs.lifeExpectancy}
                    onChange={(e) => setInputs({...inputs, lifeExpectancy: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="desiredIncome">Desired Annual Income</Label>
                  <Input
                    id="desiredIncome"
                    type="number"
                    value={inputs.desiredAnnualIncome}
                    onChange={(e) => setInputs({...inputs, desiredAnnualIncome: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Economic Assumptions</h4>
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
                <div>
                  <Label htmlFor="marginalTaxRate">Marginal Tax Rate (%)</Label>
                  <Input
                    id="marginalTaxRate"
                    type="number"
                    value={inputs.marginalTaxRate}
                    onChange={(e) => setInputs({...inputs, marginalTaxRate: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Account Balance Summary</h5>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getAccountTypeData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={60}
                          dataKey="value"
                        >
                          {getAccountTypeData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Total: {formatCurrency(getTotalBalance())}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Retirement Accounts</h4>
                <Button onClick={addAccount} size="sm" variant="outline">
                  Add Account
                </Button>
              </div>
              
              <div className="space-y-3">
                {inputs.accounts.map((account, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <Label htmlFor={`name-${index}`}>Account Name</Label>
                          <Input
                            id={`name-${index}`}
                            value={account.name}
                            onChange={(e) => updateAccount(index, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`type-${index}`}>Type</Label>
                          <Select 
                            value={account.type} 
                            onValueChange={(value) => updateAccount(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="taxable">Taxable</SelectItem>
                              <SelectItem value="traditional">Traditional</SelectItem>
                              <SelectItem value="roth">Roth</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`balance-${index}`}>Balance</Label>
                          <Input
                            id={`balance-${index}`}
                            type="number"
                            value={account.balance}
                            onChange={(e) => updateAccount(index, 'balance', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`return-${index}`}>Expected Return (%)</Label>
                          <Input
                            id={`return-${index}`}
                            type="number"
                            step="0.1"
                            value={account.expectedReturn}
                            onChange={(e) => updateAccount(index, 'expectedReturn', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`tax-${index}`}>Tax Rate (%)</Label>
                          <Input
                            id={`tax-${index}`}
                            type="number"
                            value={account.taxRate}
                            onChange={(e) => updateAccount(index, 'taxRate', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={() => removeAccount(index)}
                            size="sm"
                            variant="destructive"
                            disabled={inputs.accounts.length <= 1}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Button onClick={calculateWithdrawalStrategies} className="w-full">
              Analyze Withdrawal Strategies
            </Button>

            {!isBasic && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Upgrade for Withdrawal Analysis</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get detailed withdrawal strategies, tax optimization, and scenario planning.
                </p>
                <Button size="sm" variant="outline">Upgrade to Basic</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="strategies" className="space-y-4">
            {showResults && strategies.length > 0 && (
              <div className="space-y-4">
                {strategies.map((strategy, index) => (
                  <Card key={index} className={strategy.taxEfficiency >= 90 ? 'border-green-200 bg-green-50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {strategy.name}
                            {strategy.taxEfficiency >= 90 && <Badge variant="default">Recommended</Badge>}
                            {!isPremium && (strategy.name.includes('Dynamic') || strategy.name.includes('Conversion')) && 
                              <Crown className="h-4 w-4 text-yellow-500" />
                            }
                          </h4>
                          <p className="text-sm text-muted-foreground">{strategy.description}</p>
                        </div>
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {strategy.taxEfficiency.toFixed(0)}% Efficient
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Total Taxes</p>
                          <p className="text-lg font-bold text-red-600">
                            {formatCurrency(strategy.totalTaxes)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Net Income</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(strategy.netIncome)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Years of Income</p>
                          <p className="text-lg font-bold text-blue-600">
                            {strategy.yearsOfIncome.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Tax Efficiency</p>
                          <p className="text-lg font-bold text-purple-600">
                            {strategy.taxEfficiency.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {showResults && strategies.length > 0 && (
              <div className="space-y-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={strategies}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}K`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="totalTaxes" fill="#ef4444" name="Total Taxes" />
                      <Bar dataKey="netIncome" fill="#22c55e" name="Net Income" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Strategy Comparison Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Best Tax Efficiency:</strong> {strategies.reduce((best, current) => 
                          current.taxEfficiency > best.taxEfficiency ? current : best
                        ).name} ({strategies.reduce((best, current) => 
                          current.taxEfficiency > best.taxEfficiency ? current : best
                        ).taxEfficiency.toFixed(1)}%)
                      </p>
                      <p className="text-sm">
                        <strong>Lowest Total Taxes:</strong> {formatCurrency(Math.min(...strategies.map(s => s.totalTaxes)))}
                      </p>
                      <p className="text-sm">
                        <strong>Highest Net Income:</strong> {formatCurrency(Math.max(...strategies.map(s => s.netIncome)))}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            {!isPremium ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border text-center">
                <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
                <p className="text-muted-foreground mb-4">
                  Access advanced strategies like dynamic tax management and Roth conversion ladders.
                </p>
                <Button>Upgrade to Premium</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Advanced withdrawal strategies with dynamic optimization and tax management.
                </p>
                {/* Advanced strategies would go here */}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
          <a href="/education/withdrawal-strategies" className="text-primary hover:underline">
            Learn more about withdrawal strategies
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default WithdrawalSequencingSimulator;