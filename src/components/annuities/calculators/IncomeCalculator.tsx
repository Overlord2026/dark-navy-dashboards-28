import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calculator } from "lucide-react";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { PremiumPlaceholder } from "@/components/premium/PremiumPlaceholder";

interface CalculationInputs {
  investmentAmount: string;
  age: string;
  annuityType: string;
  rateType: string;
  guaranteedRate: string;
  startAge: string;
}

export const IncomeCalculator = () => {
  const { checkFeatureAccessByKey } = useFeatureAccess();
  const hasAdvancedCalculators = checkFeatureAccessByKey('premium_analytics_access');

  const [inputs, setInputs] = useState<CalculationInputs>({
    investmentAmount: "",
    age: "",
    annuityType: "immediate",
    rateType: "fixed",
    guaranteedRate: "4.5",
    startAge: ""
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Mock calculation - in real implementation, this would call backend APIs
  const calculateIncome = useMemo(() => {
    if (!inputs.investmentAmount || !inputs.age) return null;

    const investment = parseFloat(inputs.investmentAmount);
    const currentAge = parseInt(inputs.age);
    const rate = parseFloat(inputs.guaranteedRate) / 100;
    const startAge = inputs.startAge ? parseInt(inputs.startAge) : currentAge;

    if (inputs.annuityType === "immediate") {
      const monthlyIncome = (investment * rate) / 12;
      return {
        monthlyIncome: monthlyIncome.toFixed(2),
        annualIncome: (monthlyIncome * 12).toFixed(2),
        totalLifetimeIncome: ((monthlyIncome * 12) * 25).toFixed(2) // Assuming 25 year payout
      };
    } else {
      const yearsToStart = startAge - currentAge;
      const accumulatedValue = investment * Math.pow(1 + rate, yearsToStart);
      const monthlyIncome = (accumulatedValue * rate) / 12;
      return {
        monthlyIncome: monthlyIncome.toFixed(2),
        annualIncome: (monthlyIncome * 12).toFixed(2),
        accumulatedValue: accumulatedValue.toFixed(2),
        totalLifetimeIncome: ((monthlyIncome * 12) * 25).toFixed(2)
      };
    }
  }, [inputs]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setResults(calculateIncome);
      setIsCalculating(false);
    }, 1000);
  };

  const updateInput = (field: keyof CalculationInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setResults(null); // Clear results when inputs change
  };

  if (!hasAdvancedCalculators) {
    return (
      <PremiumPlaceholder
        featureId="premium_analytics_access"
        featureName="Advanced Income Calculator"
      >
        <div className="text-center py-12">
          <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Advanced Income Calculator</h3>
          <p className="text-muted-foreground mb-4">
            Get detailed income projections with multiple scenarios and tax considerations.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Multiple Scenarios</h4>
              <p className="text-muted-foreground">Compare different annuity types</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Tax Projections</h4>
              <p className="text-muted-foreground">See after-tax income estimates</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Inflation Adjustment</h4>
              <p className="text-muted-foreground">Future purchasing power analysis</p>
            </div>
          </div>
        </div>
      </PremiumPlaceholder>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Income Calculator
          </CardTitle>
          <CardDescription>
            Calculate your potential guaranteed income from an annuity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="investment">Investment Amount ($)</Label>
              <Input
                id="investment"
                value={inputs.investmentAmount}
                onChange={(e) => updateInput('investmentAmount', e.target.value)}
                placeholder="250000"
                type="number"
              />
            </div>
            <div>
              <Label htmlFor="age">Your Current Age</Label>
              <Input
                id="age"
                value={inputs.age}
                onChange={(e) => updateInput('age', e.target.value)}
                placeholder="65"
                type="number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="annuityType">Annuity Type</Label>
            <Select value={inputs.annuityType} onValueChange={(value) => updateInput('annuityType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate Annuity</SelectItem>
                <SelectItem value="deferred">Deferred Annuity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {inputs.annuityType === "deferred" && (
            <div>
              <Label htmlFor="startAge">Income Start Age</Label>
              <Input
                id="startAge"
                value={inputs.startAge}
                onChange={(e) => updateInput('startAge', e.target.value)}
                placeholder="70"
                type="number"
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rateType">Rate Type</Label>
              <Select value={inputs.rateType} onValueChange={(value) => updateInput('rateType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Rate</SelectItem>
                  <SelectItem value="variable">Variable Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rate">Guaranteed Rate (%)</Label>
              <Input
                id="rate"
                value={inputs.guaranteedRate}
                onChange={(e) => updateInput('guaranteedRate', e.target.value)}
                placeholder="4.5"
                type="number"
                step="0.1"
              />
            </div>
          </div>

          <Button 
            onClick={handleCalculate} 
            disabled={isCalculating || !inputs.investmentAmount || !inputs.age}
            className="w-full"
          >
            {isCalculating ? (
              <>
                <Calculator className="h-4 w-4 mr-2 animate-pulse" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Income
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Income Projection
          </CardTitle>
          <CardDescription>
            Your guaranteed income estimates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    ${parseFloat(results.monthlyIncome).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Income</div>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    ${parseFloat(results.annualIncome).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Annual Income</div>
                </div>
              </div>

              {inputs.annuityType === "deferred" && results.accumulatedValue && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Accumulated Value at Start</span>
                    <span className="font-medium">${parseFloat(results.accumulatedValue).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Lifetime Income (25 years)</span>
                  <span className="font-medium">${parseFloat(results.totalLifetimeIncome).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Return on Investment</span>
                  <span className="font-medium text-green-600">
                    {((parseFloat(results.totalLifetimeIncome) / parseFloat(inputs.investmentAmount) - 1) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Guaranteed Income</Badge>
                <Badge variant="outline">Tax-Deferred Growth</Badge>
                {inputs.rateType === "fixed" && <Badge variant="outline">Principal Protected</Badge>}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Save Calculation</Button>
                <Button variant="outline" className="flex-1">Compare Options</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter your details and click calculate to see income projections</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};