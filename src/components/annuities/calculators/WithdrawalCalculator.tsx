import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, AlertTriangle, Calculator, DollarSign } from "lucide-react";

interface WithdrawalInputs {
  currentValue: string;
  withdrawalAmount: string;
  withdrawalType: string;
  currentAge: string;
  expectedReturn: string;
  inflationRate: string;
}

export const WithdrawalCalculator = () => {
  const [inputs, setInputs] = useState<WithdrawalInputs>({
    currentValue: "",
    withdrawalAmount: "",
    withdrawalType: "percentage",
    currentAge: "",
    expectedReturn: "5.0",
    inflationRate: "3.0"
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateWithdrawal = useMemo(() => {
    if (!inputs.currentValue || !inputs.withdrawalAmount || !inputs.currentAge) return null;

    const currentValue = parseFloat(inputs.currentValue);
    const currentAge = parseInt(inputs.currentAge);
    const annualReturn = parseFloat(inputs.expectedReturn) / 100;
    const inflation = parseFloat(inputs.inflationRate) / 100;

    let annualWithdrawal: number;
    if (inputs.withdrawalType === "percentage") {
      annualWithdrawal = currentValue * (parseFloat(inputs.withdrawalAmount) / 100);
    } else {
      annualWithdrawal = parseFloat(inputs.withdrawalAmount);
    }

    // Calculate how long money will last
    let balance = currentValue;
    let year = 0;
    const yearlyData = [];

    while (balance > 0 && year < 50) {
      const withdrawalThisYear = annualWithdrawal * Math.pow(1 + inflation, year);
      const beginningBalance = balance;
      
      // Apply return
      balance = balance * (1 + annualReturn);
      
      // Subtract withdrawal
      balance = Math.max(0, balance - withdrawalThisYear);
      
      yearlyData.push({
        year: year + 1,
        age: currentAge + year,
        beginningBalance,
        withdrawal: withdrawalThisYear,
        endingBalance: balance
      });

      year++;
    }

    const withdrawalRate = (annualWithdrawal / currentValue) * 100;
    const sustainabilityScore = withdrawalRate <= 4 ? 100 : Math.max(0, 100 - (withdrawalRate - 4) * 10);

    return {
      annualWithdrawal,
      monthlyWithdrawal: annualWithdrawal / 12,
      withdrawalRate,
      yearsUntilDepletion: balance > 0 ? null : year,
      sustainabilityScore,
      yearlyProjections: yearlyData.slice(0, 10), // First 10 years
      totalYears: yearlyData.length
    };
  }, [inputs]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setResults(calculateWithdrawal);
      setIsCalculating(false);
    }, 1000);
  };

  const updateInput = (field: keyof WithdrawalInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setResults(null);
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Withdrawal Strategy
          </CardTitle>
          <CardDescription>
            Plan your withdrawal strategy to make your money last
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentValue">Current Annuity Value ($)</Label>
              <Input
                id="currentValue"
                value={inputs.currentValue}
                onChange={(e) => updateInput('currentValue', e.target.value)}
                placeholder="500000"
                type="number"
              />
            </div>
            <div>
              <Label htmlFor="currentAge">Current Age</Label>
              <Input
                id="currentAge"
                value={inputs.currentAge}
                onChange={(e) => updateInput('currentAge', e.target.value)}
                placeholder="65"
                type="number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="withdrawalType">Withdrawal Method</Label>
            <Select value={inputs.withdrawalType} onValueChange={(value) => updateInput('withdrawalType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage of Balance</SelectItem>
                <SelectItem value="fixed">Fixed Dollar Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="withdrawalAmount">
              {inputs.withdrawalType === "percentage" ? "Annual Withdrawal (%)" : "Annual Withdrawal ($)"}
            </Label>
            <Input
              id="withdrawalAmount"
              value={inputs.withdrawalAmount}
              onChange={(e) => updateInput('withdrawalAmount', e.target.value)}
              placeholder={inputs.withdrawalType === "percentage" ? "4.0" : "20000"}
              type="number"
              step={inputs.withdrawalType === "percentage" ? "0.1" : "1000"}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
              <Input
                id="expectedReturn"
                value={inputs.expectedReturn}
                onChange={(e) => updateInput('expectedReturn', e.target.value)}
                placeholder="5.0"
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
              <Input
                id="inflationRate"
                value={inputs.inflationRate}
                onChange={(e) => updateInput('inflationRate', e.target.value)}
                placeholder="3.0"
                type="number"
                step="0.1"
              />
            </div>
          </div>

          <Button 
            onClick={handleCalculate} 
            disabled={isCalculating || !inputs.currentValue || !inputs.withdrawalAmount || !inputs.currentAge}
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
                Calculate Withdrawal Strategy
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Withdrawal Analysis
          </CardTitle>
          <CardDescription>
            Your withdrawal strategy sustainability
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-xl font-bold text-primary">
                    ${results.monthlyWithdrawal.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Withdrawal</div>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <div className="text-xl font-bold text-secondary">
                    {results.withdrawalRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Withdrawal Rate</div>
                </div>
              </div>

              {/* Sustainability Score */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Sustainability Score</span>
                  <span className={`font-bold ${getSustainabilityColor(results.sustainabilityScore)}`}>
                    {results.sustainabilityScore}/100
                  </span>
                </div>
                <Progress value={results.sustainabilityScore} className="h-2" />
                {results.sustainabilityScore < 60 && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>High risk of depleting funds early</span>
                  </div>
                )}
              </div>

              {/* Duration Analysis */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Fund Duration</span>
                  <span className="font-bold">
                    {results.yearsUntilDepletion ? `${results.yearsUntilDepletion} years` : "30+ years"}
                  </span>
                </div>
                {results.yearsUntilDepletion && (
                  <div className="text-sm text-muted-foreground">
                    Funds projected to be depleted at age {parseInt(inputs.currentAge) + results.yearsUntilDepletion}
                  </div>
                )}
              </div>

              {/* Yearly Projections */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">10-Year Projection</h4>
                <div className="max-h-48 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-1">Year</th>
                        <th className="text-left p-1">Age</th>
                        <th className="text-right p-1">Withdrawal</th>
                        <th className="text-right p-1">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.yearlyProjections.map((projection: any, index: number) => (
                        <tr key={index} className="border-b border-muted/50">
                          <td className="p-1">{projection.year}</td>
                          <td className="p-1">{projection.age}</td>
                          <td className="text-right p-1">${projection.withdrawal.toLocaleString()}</td>
                          <td className="text-right p-1">${projection.endingBalance.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Save Strategy</Button>
                <Button variant="outline" className="flex-1">Compare Scenarios</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter your details to analyze withdrawal sustainability</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};