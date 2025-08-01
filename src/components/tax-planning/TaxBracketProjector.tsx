import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Crown } from 'lucide-react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTaxRules } from '@/hooks/useTaxRules';
import { FilingStatus } from '@/types/tax-rules';

const TaxBracketProjector: React.FC<{ subscriptionTier: string }> = ({ subscriptionTier }) => {
  const [income, setIncome] = useState(75000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [taxYear, setTaxYear] = useState(2024);
  const { getTaxBrackets, getStandardDeduction, calculateTax, loading } = useTaxRules();

  const isPremium = subscriptionTier === 'premium';

  // Get current tax data from rules system
  const brackets = getTaxBrackets(taxYear, filingStatus);
  const standardDeduction = getStandardDeduction(taxYear, filingStatus);
  const totalTax = calculateTax(income, taxYear, filingStatus);
  
  const taxableIncome = Math.max(0, income - standardDeduction);
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
  const marginalRate = brackets.find(bracket => 
    taxableIncome >= bracket.min_income && 
    (!bracket.max_income || taxableIncome <= bracket.max_income)
  )?.rate || 10;

  const bracketData = brackets.map(bracket => ({
    bracket: `${bracket.rate}%`,
    min: bracket.min_income,
    max: bracket.max_income || 600000,
    rate: bracket.rate,
    inBracket: taxableIncome >= bracket.min_income && 
               (!bracket.max_income || taxableIncome <= bracket.max_income),
    color: getColorForRate(bracket.rate)
  }));

  function getColorForRate(rate: number): string {
    const colorMap: Record<number, string> = {
      10: '#22c55e', 12: '#3b82f6', 22: '#f59e0b', 
      24: '#f97316', 32: '#ef4444', 35: '#dc2626', 37: '#991b1b'
    };
    return colorMap[rate] || '#6b7280';
  }

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          Tax Bracket Projector
          {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
        <CardDescription>
          Visualize your current and projected tax brackets using dynamic tax rules
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="income">Annual Income</Label>
            <Input
              id="income"
              type="number"
              value={income}
              onChange={(e) => setIncome(parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="taxYear">Tax Year</Label>
            <Select value={taxYear.toString()} onValueChange={(value) => setTaxYear(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filingStatus">Filing Status</Label>
            <Select value={filingStatus} onValueChange={(value) => setFilingStatus(value as FilingStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married_filing_jointly">Married Filing Jointly</SelectItem>
                <SelectItem value="married_filing_separately">Married Filing Separately</SelectItem>
                <SelectItem value="head_of_household">Head of Household</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="deductions">Standard Deduction</Label>
            <Input
              id="deductions"
              type="number"
              value={standardDeduction}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Taxable Income</p>
              <p className="text-xl font-bold">{formatCurrency(taxableIncome)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Tax</p>
              <p className="text-xl font-bold text-destructive">{formatCurrency(totalTax)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Effective Rate</p>
              <p className="text-xl font-bold text-primary">{effectiveRate.toFixed(1)}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Marginal Rate</p>
              <p className="text-xl font-bold text-secondary-foreground">{marginalRate}%</p>
            </CardContent>
          </Card>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBar data={bracketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bracket" />
              <YAxis tickFormatter={(value) => `$${value / 1000}K`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="max" fill="#3b82f6" />
            </RechartsBar>
          </ResponsiveContainer>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            You're currently in the <Badge variant="outline">{marginalRate}%</Badge> tax bracket
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tax data loaded from configurable rules system
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxBracketProjector;