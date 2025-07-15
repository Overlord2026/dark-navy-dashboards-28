import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";

const YEAR = new Date().getFullYear();
const LIMIT_SELF = 4300;   // update when IRS releases new limits
const LIMIT_FAMILY = 8600;
const CATCH_UP = 1000;

export default function HSACalculator() {
  const [coverage, setCoverage] = useState<'self' | 'family'>('family');
  const [age50, setAge50] = useState(false);
  const [annualIncome, setAnnualIncome] = useState(100000);
  const [marginalTaxRate, setMarginalTaxRate] = useState(0.22);

  const limit = coverage === 'self' ? LIMIT_SELF : LIMIT_FAMILY;
  const maxContribution = limit + (age50 ? CATCH_UP : 0);
  const taxSavings = maxContribution * marginalTaxRate;
  const afterTaxCost = maxContribution - taxSavings;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">HSA Contribution Calculator · {YEAR}</h1>
        <p className="text-muted-foreground">
          Calculate your HSA contribution limits and potential tax savings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Contribution Details
            </CardTitle>
            <CardDescription>
              Enter your coverage type and eligibility information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">HDHP Coverage Type</label>
              <Select value={coverage} onValueChange={(value: 'self' | 'family') => setCoverage(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coverage type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Self-Only</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="age50" 
                checked={age50} 
                onCheckedChange={(checked) => setAge50(checked as boolean)}
              />
              <label htmlFor="age50" className="text-sm font-medium cursor-pointer">
                I will be 55+ this calendar year (catch-up contribution: ${CATCH_UP.toLocaleString()})
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estimated Marginal Tax Rate</label>
              <Select value={marginalTaxRate.toString()} onValueChange={(value) => setMarginalTaxRate(parseFloat(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.10">10%</SelectItem>
                  <SelectItem value="0.12">12%</SelectItem>
                  <SelectItem value="0.22">22%</SelectItem>
                  <SelectItem value="0.24">24%</SelectItem>
                  <SelectItem value="0.32">32%</SelectItem>
                  <SelectItem value="0.35">35%</SelectItem>
                  <SelectItem value="0.37">37%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Contribution Summary
            </CardTitle>
            <CardDescription>
              Your HSA contribution limits and tax benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Maximum Annual Contribution</p>
                <p className="text-2xl font-bold text-primary">
                  ${maxContribution.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Estimated Tax Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  ${taxSavings.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">After-Tax Cost</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${afterTaxCost.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Monthly Contribution</span>
                <span className="font-medium">${(maxContribution / 12).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Bi-weekly Contribution</span>
                <span className="font-medium">${(maxContribution / 26).toFixed(0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Benefits Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              HSA Tax Benefits
            </CardTitle>
            <CardDescription>
              Understanding the triple tax advantage of HSA contributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-green-600">Tax Deductible</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Contributions reduce your taxable income
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-blue-600">Tax-Free Growth</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Investment gains grow without taxation
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-purple-600">Tax-Free Withdrawals</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  No taxes on qualified medical expenses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> Figures reflect IRS limits for {YEAR}. Employer contributions count toward the same annual cap. 
            Consult with a tax professional for personalized advice. HSA eligibility requires enrollment in a High Deductible Health Plan (HDHP).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}