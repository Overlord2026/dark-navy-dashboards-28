import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calculator, 
  PiggyBank, 
  Heart, 
  Download,
  BarChart3,
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface TaxPlanningModalProps {
  open: boolean;
  onClose: () => void;
  calculatorType: 'roth-conversion' | 'tax-savings-estimator' | 'charitable-gifting';
}

export const TaxPlanningModal: React.FC<TaxPlanningModalProps> = ({
  open,
  onClose,
  calculatorType
}) => {
  // Common inputs
  const [currentAge, setCurrentAge] = useState(45);
  const [annualIncome, setAnnualIncome] = useState(150000);
  const [currentTaxRate, setCurrentTaxRate] = useState([24]);
  const [retirementTaxRate, setRetirementTaxRate] = useState([22]);

  // Roth Conversion specific
  const [traditionalIRABalance, setTraditionalIRABalance] = useState(500000);
  const [conversionAmount, setConversionAmount] = useState(50000);
  const [conversionYears, setConversionYears] = useState(5);

  // Tax Savings specific
  const [projectionYears, setProjectionYears] = useState(10);
  const [expectedGrowthRate, setExpectedGrowthRate] = useState([7]);

  // Charitable Gifting specific
  const [giftAmount, setGiftAmount] = useState(25000);
  const [giftType, setGiftType] = useState('cash');
  const [appreciatedValue, setAppreciatedValue] = useState(50000);
  const [costBasis, setCostBasis] = useState(25000);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateRothConversion = () => {
    const currentTax = currentTaxRate[0] / 100;
    const futureTax = retirementTaxRate[0] / 100;
    const growthRate = 0.07; // 7% annual growth
    const yearsToRetirement = 65 - currentAge;

    const projections = [];
    let remainingBalance = traditionalIRABalance;
    let rothBalance = 0;
    let totalTaxesPaid = 0;

    for (let year = 0; year <= yearsToRetirement; year++) {
      let conversionThisYear = 0;
      let taxOnConversion = 0;

      if (year < conversionYears && remainingBalance > 0) {
        conversionThisYear = Math.min(conversionAmount, remainingBalance);
        taxOnConversion = conversionThisYear * currentTax;
        totalTaxesPaid += taxOnConversion;
        remainingBalance -= conversionThisYear;
        rothBalance += conversionThisYear;
      }

      // Grow both balances
      remainingBalance *= (1 + growthRate);
      rothBalance *= (1 + growthRate);

      projections.push({
        year,
        age: currentAge + year,
        rothBalance: Math.round(rothBalance),
        traditionalBalance: Math.round(remainingBalance),
        conversionAmount: conversionThisYear,
        taxesPaid: taxOnConversion,
        totalTaxesPaid: Math.round(totalTaxesPaid)
      });
    }

    // Calculate tax savings
    const traditionalTaxesInRetirement = remainingBalance * futureTax;
    const totalTaxSavings = traditionalTaxesInRetirement - totalTaxesPaid;

    return { projections, totalTaxSavings, totalTaxesPaid };
  };

  const calculateTaxSavings = () => {
    const baselineIncome = annualIncome;
    const taxRate = currentTaxRate[0] / 100;
    const growthRate = expectedGrowthRate[0] / 100;

    const projections = [];
    let cumulativeSavings = 0;

    for (let year = 1; year <= projectionYears; year++) {
      const inflatedIncome = baselineIncome * Math.pow(1 + 0.03, year); // 3% income growth
      const baselineTax = inflatedIncome * taxRate;
      
      // Assume various tax strategies save 15% of taxes
      const taxSavings = baselineTax * 0.15;
      cumulativeSavings += taxSavings;

      projections.push({
        year,
        income: Math.round(inflatedIncome),
        baselineTax: Math.round(baselineTax),
        optimizedTax: Math.round(baselineTax - taxSavings),
        annualSavings: Math.round(taxSavings),
        cumulativeSavings: Math.round(cumulativeSavings),
        investedSavings: Math.round(cumulativeSavings * Math.pow(1 + growthRate, year))
      });
    }

    return projections;
  };

  const calculateCharitableGifting = () => {
    const taxRate = currentTaxRate[0] / 100;
    let taxDeduction = 0;
    let capitalGainsSavings = 0;

    if (giftType === 'cash') {
      taxDeduction = giftAmount * taxRate;
    } else if (giftType === 'appreciated_stock') {
      taxDeduction = appreciatedValue * taxRate;
      const capitalGains = appreciatedValue - costBasis;
      capitalGainsSavings = capitalGains * 0.20; // Assume 20% capital gains rate
    }

    const totalTaxBenefit = taxDeduction + capitalGainsSavings;
    const netCost = (giftType === 'cash' ? giftAmount : appreciatedValue) - totalTaxBenefit;

    return {
      giftValue: giftType === 'cash' ? giftAmount : appreciatedValue,
      taxDeduction,
      capitalGainsSavings,
      totalTaxBenefit,
      netCost,
      effectiveGiftCost: (netCost / (giftType === 'cash' ? giftAmount : appreciatedValue)) * 100
    };
  };

  const getCalculatorTitle = () => {
    switch (calculatorType) {
      case 'roth-conversion':
        return 'Roth Conversion Analyzer';
      case 'tax-savings-estimator':
        return 'Multi-year Tax Savings Estimator';
      case 'charitable-gifting':
        return 'Charitable Gifting Impact Calculator';
      default:
        return 'Tax Planning Calculator';
    }
  };

  const getCalculatorIcon = () => {
    switch (calculatorType) {
      case 'roth-conversion':
        return PiggyBank;
      case 'tax-savings-estimator':
        return Calculator;
      case 'charitable-gifting':
        return Heart;
      default:
        return Calculator;
    }
  };

  const generateReport = () => {
    let reportData;
    let fileName;

    switch (calculatorType) {
      case 'roth-conversion':
        reportData = calculateRothConversion();
        fileName = 'roth-conversion-analysis.txt';
        break;
      case 'tax-savings-estimator':
        reportData = calculateTaxSavings();
        fileName = 'tax-savings-projection.txt';
        break;
      case 'charitable-gifting':
        reportData = calculateCharitableGifting();
        fileName = 'charitable-gifting-analysis.txt';
        break;
      default:
        return;
    }

    // Save to localStorage
    localStorage.setItem(`${calculatorType}-results`, JSON.stringify(reportData));

    // Generate downloadable report
    const reportContent = `
${getCalculatorTitle().toUpperCase()} REPORT
Generated: ${new Date().toLocaleDateString()}

Analysis Details: [Calculation results would be formatted here]

This analysis is for educational purposes only and should not be considered as tax advice.
Please consult with a qualified tax professional.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCalculatorContent = () => {
    const IconComponent = getCalculatorIcon();

    switch (calculatorType) {
      case 'roth-conversion':
        const rothResults = calculateRothConversion();
        return (
          <Tabs defaultValue="inputs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inputs">Conversion Setup</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="inputs" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Situation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Current Age</Label>
                      <Input
                        type="number"
                        value={currentAge}
                        onChange={(e) => setCurrentAge(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Traditional IRA Balance</Label>
                      <Input
                        type="number"
                        value={traditionalIRABalance}
                        onChange={(e) => setTraditionalIRABalance(Number(e.target.value))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Strategy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Annual Conversion Amount</Label>
                      <Input
                        type="number"
                        value={conversionAmount}
                        onChange={(e) => setConversionAmount(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Number of Conversion Years</Label>
                      <Input
                        type="number"
                        value={conversionYears}
                        onChange={(e) => setConversionYears(Number(e.target.value))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Tax Rates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Current Tax Rate: {currentTaxRate[0]}%</Label>
                      <Slider
                        value={currentTaxRate}
                        onValueChange={setCurrentTaxRate}
                        max={40}
                        min={10}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Expected Retirement Tax Rate: {retirementTaxRate[0]}%</Label>
                      <Slider
                        value={retirementTaxRate}
                        onValueChange={setRetirementTaxRate}
                        max={40}
                        min={10}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Total Tax Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(rothResults.totalTaxSavings)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Taxes Paid on Conversion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(rothResults.totalTaxesPaid)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Balance Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={rothResults.projections.slice(0, 20)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="age" />
                          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                          <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
                          <Line type="monotone" dataKey="rothBalance" stroke="#10b981" name="Roth IRA" />
                          <Line type="monotone" dataKey="traditionalBalance" stroke="#3b82f6" name="Traditional IRA" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        );

      case 'tax-savings-estimator':
        const taxSavingsResults = calculateTaxSavings();
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Annual Income</Label>
                    <Input
                      type="number"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Projection Years</Label>
                    <Input
                      type="number"
                      value={projectionYears}
                      onChange={(e) => setProjectionYears(Number(e.target.value))}
                      max={20}
                      min={1}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assumptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Current Tax Rate: {currentTaxRate[0]}%</Label>
                    <Slider
                      value={currentTaxRate}
                      onValueChange={setCurrentTaxRate}
                      max={40}
                      min={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Investment Growth Rate: {expectedGrowthRate[0]}%</Label>
                    <Slider
                      value={expectedGrowthRate}
                      onValueChange={setExpectedGrowthRate}
                      max={12}
                      min={3}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tax Savings Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={taxSavingsResults}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
                    <Bar dataKey="annualSavings" fill="#10b981" name="Annual Tax Savings" />
                    <Bar dataKey="investedSavings" fill="#3b82f6" name="Invested Savings Value" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        );

      case 'charitable-gifting':
        const charitableResults = calculateCharitableGifting();
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gift Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Gift Type</Label>
                    <Select value={giftType} onValueChange={setGiftType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="appreciated_stock">Appreciated Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {giftType === 'cash' ? (
                    <div>
                      <Label>Gift Amount</Label>
                      <Input
                        type="number"
                        value={giftAmount}
                        onChange={(e) => setGiftAmount(Number(e.target.value))}
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label>Current Value</Label>
                        <Input
                          type="number"
                          value={appreciatedValue}
                          onChange={(e) => setAppreciatedValue(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Cost Basis</Label>
                        <Input
                          type="number"
                          value={costBasis}
                          onChange={(e) => setCostBasis(Number(e.target.value))}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax Impact Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Gift Value:</span>
                    <span className="font-semibold">{formatCurrency(charitableResults.giftValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Deduction:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(charitableResults.taxDeduction)}</span>
                  </div>
                  {charitableResults.capitalGainsSavings > 0 && (
                    <div className="flex justify-between">
                      <span>Capital Gains Savings:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(charitableResults.capitalGainsSavings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span>Total Tax Benefit:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(charitableResults.totalTaxBenefit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Cost:</span>
                    <span className="font-semibold">{formatCurrency(charitableResults.netCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Effective Cost:</span>
                    <span className="font-semibold">{charitableResults.effectiveGiftCost.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const IconComponent = getCalculatorIcon();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <IconComponent className="h-6 w-6 text-primary" />
            {getCalculatorTitle()}
          </DialogTitle>
        </DialogHeader>

        {renderCalculatorContent()}

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={generateReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};