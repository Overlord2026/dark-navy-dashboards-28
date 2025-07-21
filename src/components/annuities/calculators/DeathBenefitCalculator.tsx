import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Shield, Heart, DollarSign, Users } from "lucide-react";

interface DeathBenefitResult {
  guaranteedBenefit: number;
  accumulatedValue: number;
  totalPremiums: number;
  benefitRatio: number;
  chartData: Array<{ year: number; benefit: number; premium: number; accumulated: number }>;
  beneficiaryData: Array<{ name: string; value: number; color: string }>;
}

export const DeathBenefitCalculator = () => {
  const [inputs, setInputs] = useState({
    currentAge: 55,
    initialPremium: 100000,
    annualPremium: 5000,
    benefitType: 'guaranteed-minimum', // 'guaranteed-minimum', 'stepped-up', 'roll-up'
    rollUpRate: 5.0,
    expectedReturn: 6.0,
    beneficiaries: 2
  });

  const [results, setResults] = useState<DeathBenefitResult | null>(null);

  const calculateDeathBenefit = () => {
    const { currentAge, initialPremium, annualPremium, benefitType, rollUpRate, expectedReturn } = inputs;
    const chartData = [];
    const colors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];
    
    let accumulatedValue = initialPremium;
    let totalPremiums = initialPremium;
    let guaranteedBenefit = initialPremium;

    for (let year = 1; year <= 30; year++) {
      // Add annual premium
      accumulatedValue += annualPremium;
      totalPremiums += annualPremium;
      
      // Apply market growth
      accumulatedValue *= (1 + expectedReturn / 100);

      // Calculate death benefit based on type
      switch (benefitType) {
        case 'guaranteed-minimum':
          guaranteedBenefit = Math.max(totalPremiums, accumulatedValue);
          break;
        case 'stepped-up':
          guaranteedBenefit = Math.max(guaranteedBenefit, accumulatedValue);
          break;
        case 'roll-up':
          guaranteedBenefit = totalPremiums * Math.pow(1 + rollUpRate / 100, year);
          guaranteedBenefit = Math.max(guaranteedBenefit, accumulatedValue);
          break;
      }

      chartData.push({
        year,
        benefit: guaranteedBenefit,
        premium: totalPremiums,
        accumulated: accumulatedValue
      });
    }

    const benefitRatio = guaranteedBenefit / totalPremiums;
    
    // Generate beneficiary distribution data
    const beneficiaryData = Array.from({ length: inputs.beneficiaries }, (_, i) => ({
      name: `Beneficiary ${i + 1}`,
      value: Math.round(guaranteedBenefit / inputs.beneficiaries),
      color: colors[i % colors.length]
    }));

    setResults({
      guaranteedBenefit,
      accumulatedValue,
      totalPremiums,
      benefitRatio,
      chartData,
      beneficiaryData
    });
  };

  useEffect(() => {
    calculateDeathBenefit();
  }, [inputs]);

  const updateInput = (key: keyof typeof inputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const getBenefitTypeDescription = (type: string) => {
    switch (type) {
      case 'guaranteed-minimum':
        return 'Higher of premiums paid or account value';
      case 'stepped-up':
        return 'Account value locked at highest point';
      case 'roll-up':
        return 'Guaranteed growth rate on premiums';
      default:
        return '';
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Death Benefit Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <Label htmlFor="initialPremium">Initial Premium</Label>
            <Input
              id="initialPremium"
              type="number"
              value={inputs.initialPremium}
              onChange={(e) => updateInput('initialPremium', Number(e.target.value))}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualPremium">Annual Premium</Label>
            <Input
              id="annualPremium"
              type="number"
              value={inputs.annualPremium}
              onChange={(e) => updateInput('annualPremium', Number(e.target.value))}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefitType">Death Benefit Type</Label>
            <Select value={inputs.benefitType} onValueChange={(value) => updateInput('benefitType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guaranteed-minimum">Guaranteed Minimum</SelectItem>
                <SelectItem value="stepped-up">Stepped Up</SelectItem>
                <SelectItem value="roll-up">Roll Up</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">
              {getBenefitTypeDescription(inputs.benefitType)}
            </div>
          </div>

          {inputs.benefitType === 'roll-up' && (
            <div className="space-y-2">
              <Label>Roll-up Rate: {inputs.rollUpRate}%</Label>
              <Slider
                value={[inputs.rollUpRate]}
                onValueChange={([value]) => updateInput('rollUpRate', value)}
                min={3}
                max={8}
                step={0.1}
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Expected Market Return: {inputs.expectedReturn}%</Label>
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
            <Label>Number of Beneficiaries: {inputs.beneficiaries}</Label>
            <Slider
              value={[inputs.beneficiaries]}
              onValueChange={([value]) => updateInput('beneficiaries', value)}
              min={1}
              max={4}
              step={1}
              className="w-full"
            />
          </div>

          <Button onClick={calculateDeathBenefit} className="w-full">
            Recalculate Benefits
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Legacy Protection Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    ${results.guaranteedBenefit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-muted-foreground">Death Benefit</div>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {results.benefitRatio.toFixed(1)}x
                  </div>
                  <div className="text-sm text-muted-foreground">Benefit Ratio</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Total Premiums:</span>
                  <span className="font-medium">${results.totalPremiums.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Account Value:</span>
                  <span className="font-medium">${results.accumulatedValue.toLocaleString()}</span>
                </div>
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.chartData.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `$${value.toLocaleString()}`,
                        name === 'benefit' ? 'Death Benefit' : 
                        name === 'premium' ? 'Total Premiums' : 'Account Value'
                      ]}
                    />
                    <Bar dataKey="benefit" fill="hsl(var(--primary))" />
                    <Bar dataKey="premium" fill="hsl(var(--muted))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {results.beneficiaryData.length > 1 && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Beneficiary Distribution
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {results.beneficiaryData.map((beneficiary, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-accent/5 rounded">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: beneficiary.color }}
                          />
                          <span>{beneficiary.name}</span>
                        </div>
                        <span className="font-medium">${beneficiary.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground text-center">
                * Death benefit calculations are estimates and subject to policy terms and conditions
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};