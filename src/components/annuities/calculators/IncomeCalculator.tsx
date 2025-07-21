import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { DollarSign, Calendar, Percent, TrendingUp } from "lucide-react";

interface CalculationResult {
  monthlyIncome: number;
  annualIncome: number;
  totalIncome: number;
  breakEvenAge: number;
  chartData: Array<{ age: number; cumulativeIncome: number; totalPaid: number }>;
}

export const IncomeCalculator = () => {
  const [inputs, setInputs] = useState({
    initialDeposit: 100000,
    currentAge: 65,
    startAge: 65,
    annualRate: 4.5,
    inflationAdjusted: false
  });

  const [results, setResults] = useState<CalculationResult | null>(null);

  const calculateIncome = () => {
    const { initialDeposit, currentAge, startAge, annualRate } = inputs;
    const monthlyRate = annualRate / 100 / 12;
    const yearsToStart = Math.max(0, startAge - currentAge);
    
    // Simple immediate annuity calculation for demonstration
    const adjustedPrincipal = initialDeposit * Math.pow(1 + annualRate / 100, yearsToStart);
    const monthlyIncome = (adjustedPrincipal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -300)); // 25 years of payments
    const annualIncome = monthlyIncome * 12;
    
    // Generate chart data
    const chartData = [];
    let cumulativeIncome = 0;
    
    for (let age = startAge; age <= startAge + 30; age++) {
      cumulativeIncome += annualIncome;
      chartData.push({
        age,
        cumulativeIncome,
        totalPaid: initialDeposit
      });
    }

    const breakEvenAge = startAge + Math.ceil(initialDeposit / annualIncome);

    setResults({
      monthlyIncome,
      annualIncome,
      totalIncome: cumulativeIncome,
      breakEvenAge,
      chartData
    });
  };

  useEffect(() => {
    calculateIncome();
  }, [inputs]);

  const updateInput = (key: keyof typeof inputs, value: number | boolean) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Income Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="initialDeposit">Initial Deposit</Label>
            <Input
              id="initialDeposit"
              type="number"
              value={inputs.initialDeposit}
              onChange={(e) => updateInput('initialDeposit', Number(e.target.value))}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label>Current Age: {inputs.currentAge}</Label>
            <Slider
              value={[inputs.currentAge]}
              onValueChange={([value]) => updateInput('currentAge', value)}
              min={18}
              max={85}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Income Start Age: {inputs.startAge}</Label>
            <Slider
              value={[inputs.startAge]}
              onValueChange={([value]) => updateInput('startAge', value)}
              min={inputs.currentAge}
              max={85}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Expected Annual Rate: {inputs.annualRate}%</Label>
            <Slider
              value={[inputs.annualRate]}
              onValueChange={([value]) => updateInput('annualRate', value)}
              min={1}
              max={8}
              step={0.1}
              className="w-full"
            />
          </div>

          <Button onClick={calculateIncome} className="w-full">
            Recalculate
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Projected Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    ${results.monthlyIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Income</div>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    ${results.annualIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-muted-foreground">Annual Income</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                <span className="text-sm">Break-even Age:</span>
                <Badge variant="outline">{results.breakEvenAge} years old</Badge>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `$${value.toLocaleString()}`,
                        name === 'cumulativeIncome' ? 'Cumulative Income' : 'Total Paid'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cumulativeIncome" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalPaid" 
                      stroke="hsl(var(--destructive))" 
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                * Projections are estimates based on inputs and do not guarantee future performance
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};