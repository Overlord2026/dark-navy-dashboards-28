import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, Calendar, Percent, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WithdrawalResult {
  yearsUntilDepletion: number;
  totalWithdrawn: number;
  finalBalance: number;
  chartData: Array<{ year: number; balance: number; withdrawn: number }>;
  sustainabilityRating: 'high' | 'medium' | 'low';
}

export const WithdrawalCalculator = () => {
  const [inputs, setInputs] = useState({
    accountBalance: 500000,
    annualWithdrawal: 25000,
    expectedReturn: 5.0,
    inflationRate: 2.5,
    withdrawalStrategy: 'fixed' // 'fixed', 'percentage', 'flexible'
  });

  const [results, setResults] = useState<WithdrawalResult | null>(null);

  const calculateWithdrawal = () => {
    const { accountBalance, annualWithdrawal, expectedReturn, inflationRate } = inputs;
    let balance = accountBalance;
    let year = 0;
    let totalWithdrawn = 0;
    const chartData = [];
    let currentWithdrawal = annualWithdrawal;

    while (balance > 0 && year < 50) {
      // Apply growth
      balance = balance * (1 + expectedReturn / 100);
      
      // Apply withdrawal
      if (balance >= currentWithdrawal) {
        balance -= currentWithdrawal;
        totalWithdrawn += currentWithdrawal;
      } else {
        totalWithdrawn += balance;
        balance = 0;
      }

      chartData.push({
        year: year + 1,
        balance: Math.max(0, balance),
        withdrawn: totalWithdrawn
      });

      // Adjust for inflation
      currentWithdrawal *= (1 + inflationRate / 100);
      year++;

      if (balance <= 0) break;
    }

    const withdrawalRate = (annualWithdrawal / accountBalance) * 100;
    let sustainabilityRating: 'high' | 'medium' | 'low' = 'high';
    
    if (withdrawalRate > 5) sustainabilityRating = 'low';
    else if (withdrawalRate > 4) sustainabilityRating = 'medium';

    setResults({
      yearsUntilDepletion: year,
      totalWithdrawn,
      finalBalance: balance,
      chartData,
      sustainabilityRating
    });
  };

  useEffect(() => {
    calculateWithdrawal();
  }, [inputs]);

  const updateInput = (key: keyof typeof inputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const getSustainabilityColor = (rating: string) => {
    switch (rating) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const withdrawalRate = (inputs.annualWithdrawal / inputs.accountBalance) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Withdrawal Strategy Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="accountBalance">Current Account Balance</Label>
            <Input
              id="accountBalance"
              type="number"
              value={inputs.accountBalance}
              onChange={(e) => updateInput('accountBalance', Number(e.target.value))}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualWithdrawal">Annual Withdrawal Amount</Label>
            <Input
              id="annualWithdrawal"
              type="number"
              value={inputs.annualWithdrawal}
              onChange={(e) => updateInput('annualWithdrawal', Number(e.target.value))}
              className="text-lg"
            />
            <div className="text-sm text-muted-foreground">
              Withdrawal Rate: {withdrawalRate.toFixed(1)}%
            </div>
          </div>

          <div className="space-y-2">
            <Label>Expected Annual Return: {inputs.expectedReturn}%</Label>
            <Slider
              value={[inputs.expectedReturn]}
              onValueChange={([value]) => updateInput('expectedReturn', value)}
              min={0}
              max={12}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Inflation Rate: {inputs.inflationRate}%</Label>
            <Slider
              value={[inputs.inflationRate]}
              onValueChange={([value]) => updateInput('inflationRate', value)}
              min={0}
              max={6}
              step={0.1}
              className="w-full"
            />
          </div>

          {withdrawalRate > 4 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {withdrawalRate > 5 
                  ? "High withdrawal rate may lead to early depletion of funds."
                  : "Moderate withdrawal rate - monitor portfolio performance regularly."
                }
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={calculateWithdrawal} className="w-full">
            Recalculate Strategy
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Withdrawal Projections
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {results.yearsUntilDepletion === 50 ? '50+' : results.yearsUntilDepletion}
                  </div>
                  <div className="text-sm text-muted-foreground">Years Until Depletion</div>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    ${results.totalWithdrawn.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Withdrawn</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                <span className="text-sm">Sustainability Rating:</span>
                <Badge 
                  variant="outline" 
                  className={getSustainabilityColor(results.sustainabilityRating)}
                >
                  {results.sustainabilityRating.toUpperCase()}
                </Badge>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `$${value.toLocaleString()}`,
                        name === 'balance' ? 'Remaining Balance' : 'Total Withdrawn'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="withdrawn" 
                      stroke="hsl(var(--secondary))" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                * Assumes constant withdrawal adjusted for inflation and consistent returns
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};