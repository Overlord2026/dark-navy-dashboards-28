import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, PiggyBank, TrendingUp, Target } from 'lucide-react';

interface WizardCalculatorStepProps {
  onComplete: (calcData: any) => void;
  persona: 'aspiring' | 'retiree';
}

export function WizardCalculatorStep({ onComplete, persona }: WizardCalculatorStepProps) {
  const [selectedCalc, setSelectedCalc] = useState<string>('');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  const calculators = {
    aspiring: [
      {
        key: 'monte_carlo',
        title: 'SWAG/Monte Carlo',
        description: 'How much can you safely save monthly?',
        icon: TrendingUp,
        inputs: [
          { key: 'monthly_income', label: 'Monthly Income', placeholder: '5000' },
          { key: 'monthly_expenses', label: 'Monthly Expenses', placeholder: '3500' },
          { key: 'current_savings', label: 'Current Savings', placeholder: '10000' }
        ]
      }
    ],
    retiree: [
      {
        key: 'rmd_calculator',
        title: 'RMD Calculator',
        description: 'Required minimum distributions from retirement accounts',
        icon: Calculator,
        inputs: [
          { key: 'account_balance', label: 'Retirement Account Balance', placeholder: '500000' },
          { key: 'age', label: 'Current Age', placeholder: '72' }
        ]
      },
      {
        key: 'ss_timing',
        title: 'Social Security Timing',
        description: 'Optimize when to start benefits',
        icon: Target,
        inputs: [
          { key: 'full_benefit', label: 'Full Retirement Benefit', placeholder: '2500' },
          { key: 'birth_year', label: 'Birth Year', placeholder: '1955' }
        ]
      }
    ]
  };

  const currentCalcs = calculators[persona];
  const calculator = currentCalcs.find(c => c.key === selectedCalc);

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const runCalculation = () => {
    if (!calculator) return;

    let calculationResult: any;

    switch (selectedCalc) {
      case 'monte_carlo':
        const income = parseFloat(inputs.monthly_income) || 0;
        const expenses = parseFloat(inputs.monthly_expenses) || 0;
        const surplus = income - expenses;
        const safeRate = surplus * 0.8; // 80% of surplus for safety
        
        calculationResult = {
          safe_monthly_savings: Math.max(0, safeRate),
          annual_savings_potential: Math.max(0, safeRate * 12),
          explanation: `Based on your income and expenses, you can safely save $${safeRate.toFixed(0)} monthly.`,
          confidence: surplus > 0 ? 'High' : 'Review needed'
        };
        break;

      case 'rmd_calculator':
        const balance = parseFloat(inputs.account_balance) || 0;
        const age = parseInt(inputs.age) || 72;
        // Simplified RMD calculation using IRS life expectancy tables
        const lifeFactor = Math.max(1, 27.4 - (age - 72)); // Approximate
        const rmdAmount = balance / lifeFactor;
        
        calculationResult = {
          annual_rmd: rmdAmount,
          monthly_rmd: rmdAmount / 12,
          explanation: `Your required minimum distribution is $${rmdAmount.toFixed(0)} annually.`,
          tax_note: 'RMDs are subject to ordinary income tax'
        };
        break;

      case 'ss_timing':
        const fullBenefit = parseFloat(inputs.full_benefit) || 0;
        const birthYear = parseInt(inputs.birth_year) || 1955;
        const earlyBenefit = fullBenefit * 0.75; // Roughly 25% reduction for early
        const delayedBenefit = fullBenefit * 1.32; // Roughly 32% increase for delay
        
        calculationResult = {
          age_62_benefit: earlyBenefit,
          full_retirement_benefit: fullBenefit,
          age_70_benefit: delayedBenefit,
          explanation: `Delaying benefits from 62 to 70 increases monthly income by $${(delayedBenefit - earlyBenefit).toFixed(0)}.`,
          recommendation: 'Consider health, longevity, and cash needs'
        };
        break;
    }

    setResult(calculationResult);
  };

  const handleAddToPlan = () => {
    onComplete({
      calc_key: selectedCalc,
      result: result,
      added_to_plan: true
    });
  };

  const hasAllInputs = calculator?.inputs.every(input => inputs[input.key]) || false;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Try a quick calculation</h2>
        <p className="text-muted-foreground">
          {persona === 'aspiring' 
            ? 'See how much you can safely save each month'
            : 'Optimize your retirement income strategy'
          }
        </p>
      </div>

      {/* Calculator Selection */}
      <div className="space-y-3">
        {currentCalcs.map((calc) => {
          const Icon = calc.icon;
          const isSelected = selectedCalc === calc.key;
          
          return (
            <Card 
              key={calc.key}
              className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedCalc(calc.key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{calc.title}</h3>
                    <p className="text-sm text-muted-foreground">{calc.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Calculator Inputs */}
      {calculator && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <calculator.icon className="h-5 w-5" />
              {calculator.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {calculator.inputs.map((input) => (
              <div key={input.key} className="space-y-2">
                <Label htmlFor={input.key}>{input.label}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id={input.key}
                    type="number"
                    placeholder={input.placeholder}
                    value={inputs[input.key] || ''}
                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            ))}

            <Button 
              onClick={runCalculation}
              disabled={!hasAllInputs}
              className="w-full"
              variant="outline"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-green-700 font-medium">{result.explanation}</p>
            
            {/* Key Metrics Display */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-green-200">
              {Object.entries(result).map(([key, value]) => {
                if (key === 'explanation' || typeof value === 'object' || typeof value === 'string') return null;
                
                return (
                  <div key={key} className="text-center">
                    <p className="text-lg font-bold text-green-800">
                      ${typeof value === 'number' ? value.toLocaleString() : String(value)}
                    </p>
                    <p className="text-xs text-green-600 capitalize">
                      {String(key).replace(/_/g, ' ')}
                    </p>
                  </div>
                );
              })}
            </div>

            <Button 
              onClick={handleAddToPlan}
              className="w-full mt-4"
            >
              Add to Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}