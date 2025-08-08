import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Download,
  BarChart3,
  PieChart,
  Calculator,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface RetirementRoadmapModalProps {
  open: boolean;
  onClose: () => void;
}

export const RetirementRoadmapModal: React.FC<RetirementRoadmapModalProps> = ({
  open,
  onClose
}) => {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(250000);
  const [monthlyContribution, setMonthlyContribution] = useState(2000);
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [expectedReturn, setExpectedReturn] = useState([7]);
  const [inflationRate, setInflationRate] = useState([3]);
  const [retirementExpenses, setRetirementExpenses] = useState([75]);

  const yearsToRetirement = retirementAge - currentAge;
  const retirementYears = 30; // Assume 30 years in retirement

  const calculateProjections = () => {
    const projections = [];
    let balance = currentSavings;
    const monthlyReturn = expectedReturn[0] / 100 / 12;
    const annualInflation = inflationRate[0] / 100;
    const retirementIncomeNeed = annualIncome * (retirementExpenses[0] / 100);

    // Accumulation phase
    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = currentAge + year;
      if (year > 0) {
        // Add monthly contributions for the year
        for (let month = 0; month < 12; month++) {
          balance = balance * (1 + monthlyReturn) + monthlyContribution;
        }
      }
      
      projections.push({
        age,
        year,
        balance: Math.round(balance),
        phase: 'accumulation',
        contribution: monthlyContribution * 12,
        annualIncome: year === 0 ? annualIncome : Math.round(annualIncome * Math.pow(1 + annualInflation, year)),
        requiredIncome: Math.round(retirementIncomeNeed * Math.pow(1 + annualInflation, year))
      });
    }

    // Distribution phase
    const retirementBalance = balance;
    let distributionBalance = retirementBalance;
    const withdrawalRate = 0.04; // 4% rule

    for (let year = 1; year <= retirementYears; year++) {
      const age = retirementAge + year;
      const annualWithdrawal = distributionBalance * withdrawalRate;
      distributionBalance = (distributionBalance - annualWithdrawal) * (1 + expectedReturn[0] / 100);
      
      projections.push({
        age,
        year: yearsToRetirement + year,
        balance: Math.round(Math.max(0, distributionBalance)),
        phase: 'distribution',
        withdrawal: Math.round(annualWithdrawal),
        requiredIncome: Math.round(retirementIncomeNeed * Math.pow(1 + annualInflation, yearsToRetirement + year))
      });
    }

    return projections;
  };

  const projections = calculateProjections();
  const retirementBalance = projections.find(p => p.age === retirementAge)?.balance || 0;
  const shortfall = Math.max(0, (annualIncome * (retirementExpenses[0] / 100) * 25) - retirementBalance);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const generatePDF = () => {
    const reportData = {
      projections,
      retirementBalance,
      shortfall,
      assumptions: {
        currentAge,
        retirementAge,
        currentSavings,
        monthlyContribution,
        expectedReturn: expectedReturn[0],
        inflationRate: inflationRate[0],
        retirementExpenses: retirementExpenses[0]
      }
    };

    // Save results to user profile
    const savedResults = JSON.stringify(reportData);
    localStorage.setItem('retirement-roadmap-results', savedResults);

    // Generate downloadable report
    const reportContent = `
RETIREMENT ROADMAP ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}

CURRENT SITUATION:
- Current Age: ${currentAge}
- Planned Retirement Age: ${retirementAge}
- Current Savings: ${formatCurrency(currentSavings)}
- Monthly Contribution: ${formatCurrency(monthlyContribution)}
- Annual Income: ${formatCurrency(annualIncome)}

ASSUMPTIONS:
- Expected Annual Return: ${expectedReturn[0]}%
- Inflation Rate: ${inflationRate[0]}%
- Retirement Expense Ratio: ${retirementExpenses[0]}%

PROJECTED RESULTS:
- Balance at Retirement: ${formatCurrency(retirementBalance)}
- Estimated Shortfall: ${formatCurrency(shortfall)}
- Years to Retirement: ${yearsToRetirement}

YEAR-BY-YEAR PROJECTIONS:
${projections.slice(0, 10).map(p => 
  `Age ${p.age}: ${formatCurrency(p.balance)} (${p.phase})`
).join('\n')}

This analysis is for educational purposes only and should not be considered as financial advice.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'retirement-roadmap-analysis.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="h-6 w-6 text-primary" />
            Retirement Roadmap Analyzer
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="inputs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inputs">Inputs & Assumptions</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Current Age</Label>
                      <Input
                        type="number"
                        value={currentAge}
                        onChange={(e) => setCurrentAge(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Retirement Age</Label>
                      <Input
                        type="number"
                        value={retirementAge}
                        onChange={(e) => setRetirementAge(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Annual Income</Label>
                    <Input
                      type="number"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Financial Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Savings</Label>
                    <Input
                      type="number"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Monthly Contribution</Label>
                    <Input
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Investment Assumptions */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Investment Assumptions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Expected Annual Return: {expectedReturn[0]}%</Label>
                    <Slider
                      value={expectedReturn}
                      onValueChange={setExpectedReturn}
                      max={15}
                      min={1}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Inflation Rate: {inflationRate[0]}%</Label>
                    <Slider
                      value={inflationRate}
                      onValueChange={setInflationRate}
                      max={6}
                      min={1}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Retirement Expenses (% of current income): {retirementExpenses[0]}%</Label>
                    <Slider
                      value={retirementExpenses}
                      onValueChange={setRetirementExpenses}
                      max={100}
                      min={50}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Key Metrics */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Retirement Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(retirementBalance)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      At age {retirementAge}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Years to Retirement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald">
                      {yearsToRetirement}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Years of accumulation
                    </p>
                  </CardContent>
                </Card>

                {shortfall > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Estimated Shortfall</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-destructive">
                        {formatCurrency(shortfall)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Additional savings needed
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Chart */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Portfolio Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={projections}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis 
                          tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                        />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(Number(value)), 'Balance']}
                          labelFormatter={(label) => `Age ${label}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="balance" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Readiness Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>On Track for Retirement</span>
                      <span className={shortfall === 0 ? 'text-green-600' : 'text-red-600'}>
                        {shortfall === 0 ? '✓ Yes' : '✗ Needs Improvement'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Savings Rate</span>
                      <span className="text-blue-600">
                        {((monthlyContribution * 12) / annualIncome * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Replacement Ratio</span>
                      <span className="text-blue-600">
                        {retirementExpenses[0]}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {shortfall > 0 && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <p className="font-medium text-red-800 dark:text-red-200">
                          Consider increasing monthly contributions by {formatCurrency(shortfall / (yearsToRetirement * 12))} to close the gap.
                        </p>
                      </div>
                    )}
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="text-blue-800 dark:text-blue-200">
                        Review and rebalance your portfolio annually to maintain target allocation.
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-green-800 dark:text-green-200">
                        Consider tax-advantaged accounts like 401(k) and IRA to maximize growth.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={generatePDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export PDF Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};