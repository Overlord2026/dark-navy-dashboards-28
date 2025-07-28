import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarChart, Calculator, Crown } from 'lucide-react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TAX_BRACKETS_2024 = [
  { min: 0, max: 11000, rate: 10, color: '#22c55e' },
  { min: 11001, max: 44725, rate: 12, color: '#3b82f6' },
  { min: 44726, max: 95375, rate: 22, color: '#f59e0b' },
  { min: 95376, max: 182050, rate: 24, color: '#f97316' },
  { min: 182051, max: 231250, rate: 32, color: '#ef4444' },
  { min: 231251, max: 578125, rate: 35, color: '#dc2626' },
  { min: 578126, max: Infinity, rate: 37, color: '#991b1b' }
];

const TaxBracketProjector: React.FC<{ subscriptionTier: string }> = ({ subscriptionTier }) => {
  const [income, setIncome] = useState(75000);
  const [filingStatus, setFilingStatus] = useState('single');
  const [deductions, setDeductions] = useState(13850);

  const isPremium = subscriptionTier === 'premium';
  const isBasic = subscriptionTier === 'basic' || isPremium;

  const calculateTax = (taxableIncome: number) => {
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of TAX_BRACKETS_2024) {
      if (remainingIncome <= 0) break;
      
      const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min + 1);
      tax += (taxableInThisBracket * bracket.rate) / 100;
      remainingIncome -= taxableInThisBracket;
    }

    return tax;
  };

  const taxableIncome = Math.max(0, income - deductions);
  const totalTax = calculateTax(taxableIncome);
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
  const marginalRate = TAX_BRACKETS_2024.find(bracket => 
    taxableIncome >= bracket.min && taxableIncome <= bracket.max
  )?.rate || 10;

  const bracketData = TAX_BRACKETS_2024.map(bracket => ({
    bracket: `${bracket.rate}%`,
    min: bracket.min,
    max: bracket.max === Infinity ? 600000 : bracket.max,
    rate: bracket.rate,
    inBracket: taxableIncome >= bracket.min && taxableIncome <= bracket.max
  }));

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          Tax Bracket Projector
          {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
        <CardDescription>
          Visualize your current and projected tax brackets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Label htmlFor="deductions">Total Deductions</Label>
            <Input
              id="deductions"
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="filing">Filing Status</Label>
            <select 
              id="filing"
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
              <option value="head">Head of Household</option>
            </select>
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
              <p className="text-xl font-bold text-red-600">{formatCurrency(totalTax)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Effective Rate</p>
              <p className="text-xl font-bold text-blue-600">{effectiveRate.toFixed(1)}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Marginal Rate</p>
              <p className="text-xl font-bold text-purple-600">{marginalRate}%</p>
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
              <Bar dataKey="max" fill="#e5e7eb" />
            </RechartsBar>
          </ResponsiveContainer>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            You're currently in the <Badge variant="outline">{marginalRate}%</Badge> tax bracket
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxBracketProjector;