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
  Home, 
  Calculator, 
  TrendingDown,
  TrendingUp,
  Download,
  DollarSign,
  Percent,
  Calendar,
  PieChart
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface LendingAffordabilityModalProps {
  open: boolean;
  onClose: () => void;
}

export const LendingAffordabilityModal: React.FC<LendingAffordabilityModalProps> = ({
  open,
  onClose
}) => {
  // Property and loan inputs
  const [propertyPrice, setPropertyPrice] = useState(750000);
  const [downPayment, setDownPayment] = useState(150000);
  const [interestRate, setInterestRate] = useState([6.5]);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyType, setPropertyType] = useState('primary');

  // Income and expenses
  const [monthlyIncome, setMonthlyIncome] = useState(15000);
  const [monthlyDebts, setMonthlyDebts] = useState(2500);
  const [propertyTaxes, setPropertyTaxes] = useState(12000);
  const [insurance, setInsurance] = useState(2400);
  const [hoaFees, setHoaFees] = useState(300);

  // Investment property specific
  const [rentalIncome, setRentalIncome] = useState(4500);
  const [vacancyRate, setVacancyRate] = useState([5]);
  const [maintenanceReserve, setMaintenanceReserve] = useState([10]);

  const loanAmount = propertyPrice - downPayment;
  const downPaymentPercentage = (downPayment / propertyPrice) * 100;

  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate[0] / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (monthlyRate === 0) {
      return loanAmount / numberOfPayments;
    }
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  const calculateTotalMonthlyPayment = () => {
    const principalAndInterest = calculateMonthlyPayment();
    const monthlyTaxes = propertyTaxes / 12;
    const monthlyInsurance = insurance / 12;
    const monthlyHOA = hoaFees;
    
    return principalAndInterest + monthlyTaxes + monthlyInsurance + monthlyHOA;
  };

  const calculateCashFlow = () => {
    if (propertyType !== 'investment') return 0;
    
    const totalMonthlyPayment = calculateTotalMonthlyPayment();
    const effectiveRentalIncome = rentalIncome * (1 - vacancyRate[0] / 100);
    const maintenanceReserves = effectiveRentalIncome * (maintenanceReserve[0] / 100);
    
    return effectiveRentalIncome - totalMonthlyPayment - maintenanceReserves;
  };

  const calculateAffordabilityMetrics = () => {
    const totalMonthlyPayment = calculateTotalMonthlyPayment();
    const totalMonthlyDebt = monthlyDebts + totalMonthlyPayment;
    
    const frontEndRatio = (totalMonthlyPayment / monthlyIncome) * 100;
    const backEndRatio = (totalMonthlyDebt / monthlyIncome) * 100;
    
    return {
      frontEndRatio,
      backEndRatio,
      qualifies: frontEndRatio <= 28 && backEndRatio <= 36,
      totalMonthlyPayment,
      cashFlow: calculateCashFlow()
    };
  };

  const generateAmortizationSchedule = () => {
    const monthlyPayment = calculateMonthlyPayment();
    const monthlyRate = interestRate[0] / 100 / 12;
    let balance = loanAmount;
    const schedule = [];

    for (let year = 1; year <= Math.min(10, loanTerm); year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let month = 1; month <= 12; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        
        yearlyPrincipal += principalPayment;
        yearlyInterest += interestPayment;
        balance -= principalPayment;
      }

      schedule.push({
        year,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        balance: Math.round(balance)
      });
    }

    return schedule;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number, decimals: number = 1) => {
    return `${value.toFixed(decimals)}%`;
  };

  const metrics = calculateAffordabilityMetrics();
  const amortizationSchedule = generateAmortizationSchedule();

  const pieData = [
    { name: 'Principal & Interest', value: Math.round(calculateMonthlyPayment()), color: '#3b82f6' },
    { name: 'Property Taxes', value: Math.round(propertyTaxes / 12), color: '#ef4444' },
    { name: 'Insurance', value: Math.round(insurance / 12), color: '#10b981' },
    { name: 'HOA Fees', value: hoaFees, color: '#f59e0b' }
  ];

  const generateReport = () => {
    const reportData = {
      propertyDetails: {
        propertyPrice,
        downPayment,
        loanAmount,
        interestRate: interestRate[0],
        loanTerm,
        propertyType
      },
      monthlyPayments: {
        principalAndInterest: calculateMonthlyPayment(),
        totalPayment: calculateTotalMonthlyPayment(),
        breakdown: pieData
      },
      affordabilityAnalysis: metrics,
      amortizationSchedule,
      generatedDate: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('lending-affordability-results', JSON.stringify(reportData));

    // Generate downloadable report
    const reportContent = `
LENDING AFFORDABILITY ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}

PROPERTY DETAILS:
- Property Price: ${formatCurrency(propertyPrice)}
- Down Payment: ${formatCurrency(downPayment)} (${formatPercent(downPaymentPercentage)})
- Loan Amount: ${formatCurrency(loanAmount)}
- Interest Rate: ${formatPercent(interestRate[0])}
- Loan Term: ${loanTerm} years
- Property Type: ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}

MONTHLY PAYMENT BREAKDOWN:
- Principal & Interest: ${formatCurrency(calculateMonthlyPayment())}
- Property Taxes: ${formatCurrency(propertyTaxes / 12)}
- Insurance: ${formatCurrency(insurance / 12)}
- HOA Fees: ${formatCurrency(hoaFees)}
- Total Monthly Payment: ${formatCurrency(metrics.totalMonthlyPayment)}

AFFORDABILITY ANALYSIS:
- Front-End Ratio: ${formatPercent(metrics.frontEndRatio)}
- Back-End Ratio: ${formatPercent(metrics.backEndRatio)}
- Qualification Status: ${metrics.qualifies ? 'QUALIFIES' : 'DOES NOT QUALIFY'}
- Monthly Income: ${formatCurrency(monthlyIncome)}
- Total Monthly Debts: ${formatCurrency(monthlyDebts + metrics.totalMonthlyPayment)}

${propertyType === 'investment' ? `
INVESTMENT ANALYSIS:
- Gross Rental Income: ${formatCurrency(rentalIncome)}
- Effective Rental Income: ${formatCurrency(rentalIncome * (1 - vacancyRate[0] / 100))}
- Monthly Cash Flow: ${formatCurrency(metrics.cashFlow)}
- Cash-on-Cash Return: ${formatPercent((metrics.cashFlow * 12) / downPayment * 100)}
` : ''}

FIRST 5 YEARS AMORTIZATION:
${amortizationSchedule.slice(0, 5).map(year => 
  `Year ${year.year}: Principal: ${formatCurrency(year.principal)}, Interest: ${formatCurrency(year.interest)}, Balance: ${formatCurrency(year.balance)}`
).join('\n')}

This analysis is for educational purposes only. Consult with a qualified mortgage professional.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lending-affordability-analysis.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Home className="h-6 w-6 text-primary" />
            Lending Affordability Estimator
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="property" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="property">Property Details</TabsTrigger>
            <TabsTrigger value="payments">Monthly Payments</TabsTrigger>
            <TabsTrigger value="affordability">Affordability</TabsTrigger>
            <TabsTrigger value="amortization">Amortization</TabsTrigger>
          </TabsList>

          <TabsContent value="property" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Property Price</Label>
                    <Input
                      type="number"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Down Payment</Label>
                    <Input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPercent(downPaymentPercentage)} of purchase price
                    </p>
                  </div>
                  <div>
                    <Label>Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary Residence</SelectItem>
                        <SelectItem value="secondary">Secondary Home</SelectItem>
                        <SelectItem value="investment">Investment Property</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Loan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Loan Amount</Label>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(loanAmount)}
                    </div>
                  </div>
                  <div>
                    <Label>Interest Rate: {formatPercent(interestRate[0])}</Label>
                    <Slider
                      value={interestRate}
                      onValueChange={setInterestRate}
                      max={12}
                      min={3}
                      step={0.125}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Loan Term (years)</Label>
                    <Select value={loanTerm.toString()} onValueChange={(value) => setLoanTerm(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 years</SelectItem>
                        <SelectItem value="20">20 years</SelectItem>
                        <SelectItem value="25">25 years</SelectItem>
                        <SelectItem value="30">30 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Income & Expenses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Monthly Gross Income</Label>
                    <Input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Monthly Debt Payments</Label>
                    <Input
                      type="number"
                      value={monthlyDebts}
                      onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Property Expenses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Annual Property Taxes</Label>
                    <Input
                      type="number"
                      value={propertyTaxes}
                      onChange={(e) => setPropertyTaxes(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Annual Insurance</Label>
                    <Input
                      type="number"
                      value={insurance}
                      onChange={(e) => setInsurance(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Monthly HOA Fees</Label>
                    <Input
                      type="number"
                      value={hoaFees}
                      onChange={(e) => setHoaFees(Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              {propertyType === 'investment' && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Investment Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Monthly Rental Income</Label>
                        <Input
                          type="number"
                          value={rentalIncome}
                          onChange={(e) => setRentalIncome(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Vacancy Rate: {formatPercent(vacancyRate[0])}</Label>
                        <Slider
                          value={vacancyRate}
                          onValueChange={setVacancyRate}
                          max={20}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Maintenance Reserve: {formatPercent(maintenanceReserve[0])}</Label>
                        <Slider
                          value={maintenanceReserve}
                          onValueChange={setMaintenanceReserve}
                          max={20}
                          min={5}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Monthly Payment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {pieData.map((item) => (
                        <div key={item.name} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="font-medium">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>Total Monthly Payment</span>
                          <span>{formatCurrency(metrics.totalMonthlyPayment)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {propertyType === 'investment' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Cash Flow Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Gross Rental Income</span>
                          <span>{formatCurrency(rentalIncome)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vacancy Allowance</span>
                          <span className="text-red-500">-{formatCurrency(rentalIncome * (vacancyRate[0] / 100))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Effective Rental Income</span>
                          <span>{formatCurrency(rentalIncome * (1 - vacancyRate[0] / 100))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Monthly Payment</span>
                          <span className="text-red-500">-{formatCurrency(metrics.totalMonthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Maintenance Reserve</span>
                          <span className="text-red-500">-{formatCurrency(rentalIncome * (1 - vacancyRate[0] / 100) * (maintenanceReserve[0] / 100))}</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Net Monthly Cash Flow</span>
                            <span className={metrics.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(metrics.cashFlow)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Payment Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart data={pieData} cx="50%" cy="50%" outerRadius={80}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                       <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                     </RechartsPieChart>
                   </ResponsiveContainer>
                 </CardContent>
               </Card>
             </div>
           </TabsContent>

          <TabsContent value="affordability" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Qualification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${metrics.qualifies ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.qualifies ? 'QUALIFIED' : 'NOT QUALIFIED'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on standard DTI ratios
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Front-End Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${metrics.frontEndRatio <= 28 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(metrics.frontEndRatio)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Housing costs / Income (≤28%)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Back-End Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${metrics.backEndRatio <= 36 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(metrics.backEndRatio)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total debt / Income (≤36%)
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Affordability Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Monthly Income & Expenses</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Gross Monthly Income</span>
                          <span>{formatCurrency(monthlyIncome)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Housing Payment (PITI)</span>
                          <span>{formatCurrency(metrics.totalMonthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Other Monthly Debts</span>
                          <span>{formatCurrency(monthlyDebts)}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2">
                          <span>Total Monthly Obligations</span>
                          <span>{formatCurrency(monthlyDebts + metrics.totalMonthlyPayment)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Remaining Income</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>After Housing Payment</span>
                          <span>{formatCurrency(monthlyIncome - metrics.totalMonthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>After All Debt Payments</span>
                          <span>{formatCurrency(monthlyIncome - monthlyDebts - metrics.totalMonthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2">
                          <span>Available for Other Expenses</span>
                          <span className="text-green-600">
                            {formatCurrency(monthlyIncome - monthlyDebts - metrics.totalMonthlyPayment)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amortization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Amortization Schedule (First 10 Years)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={amortizationSchedule}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="principal" stackId="a" fill="#10b981" name="Principal" />
                      <Bar dataKey="interest" stackId="a" fill="#ef4444" name="Interest" />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left p-2">Year</th>
                          <th className="text-right p-2">Principal</th>
                          <th className="text-right p-2">Interest</th>
                          <th className="text-right p-2">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {amortizationSchedule.map((year) => (
                          <tr key={year.year} className="border-b">
                            <td className="p-2">{year.year}</td>
                            <td className="text-right p-2">{formatCurrency(year.principal)}</td>
                            <td className="text-right p-2">{formatCurrency(year.interest)}</td>
                            <td className="text-right p-2">{formatCurrency(year.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={generateReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Analysis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};