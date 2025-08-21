import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, PiggyBank, Target, AlertCircle } from 'lucide-react';

interface FirstCalculationProps {
  onCalculate: (calculationData: any) => void;
  persona: 'aspiring' | 'retiree';
  isLoading?: boolean;
}

export function FirstCalculation({ onCalculate, persona, isLoading }: FirstCalculationProps) {
  const [selectedCalculator, setSelectedCalculator] = useState<string>('');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  const calculators = {
    aspiring: [
      {
        id: 'emergency_fund',
        name: 'Emergency Fund Calculator',
        description: 'How much should you save for emergencies?',
        icon: PiggyBank,
        inputs: [
          { key: 'monthly_expenses', label: 'Monthly Expenses', type: 'number', placeholder: '3000' },
          { key: 'income_stability', label: 'Income Stability (1-5)', type: 'number', placeholder: '3' }
        ]
      },
      {
        id: 'savings_goal',
        name: 'Savings Goal Calculator',
        description: 'How much to save monthly for your goals?',
        icon: Target,
        inputs: [
          { key: 'goal_amount', label: 'Goal Amount', type: 'number', placeholder: '50000' },
          { key: 'years_to_goal', label: 'Years to Goal', type: 'number', placeholder: '5' },
          { key: 'current_savings', label: 'Current Savings', type: 'number', placeholder: '5000' }
        ]
      }
    ],
    retiree: [
      {
        id: 'retirement_income',
        name: 'Retirement Income Calculator',
        description: 'How much income will you have in retirement?',
        icon: TrendingUp,
        inputs: [
          { key: 'retirement_savings', label: 'Total Retirement Savings', type: 'number', placeholder: '500000' },
          { key: 'monthly_ss', label: 'Monthly Social Security', type: 'number', placeholder: '2000' },
          { key: 'other_income', label: 'Other Monthly Income', type: 'number', placeholder: '500' }
        ]
      },
      {
        id: 'withdrawal_rate',
        name: '4% Rule Calculator',
        description: 'How much can you safely withdraw?',
        icon: Calculator,
        inputs: [
          { key: 'portfolio_value', label: 'Portfolio Value', type: 'number', placeholder: '1000000' },
          { key: 'withdrawal_rate', label: 'Withdrawal Rate (%)', type: 'number', placeholder: '4' }
        ]
      }
    ]
  };

  const currentCalculators = calculators[persona];

  const handleCalculatorSelect = (calculatorId: string) => {
    setSelectedCalculator(calculatorId);
    setInputs({});
    setResult(null);
  };

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const calculateResult = () => {
    const calculator = currentCalculators.find(c => c.id === selectedCalculator);
    if (!calculator) return;

    let calculationResult: any;

    switch (selectedCalculator) {
      case 'emergency_fund':
        const monthlyExpenses = parseFloat(inputs.monthly_expenses) || 0;
        const stabilityFactor = parseFloat(inputs.income_stability) || 3;
        const months = stabilityFactor >= 4 ? 3 : stabilityFactor >= 3 ? 4 : 6;
        calculationResult = {
          recommended_amount: monthlyExpenses * months,
          months_covered: months,
          explanation: `Based on your income stability, we recommend ${months} months of expenses.`
        };
        break;

      case 'savings_goal':
        const goalAmount = parseFloat(inputs.goal_amount) || 0;
        const yearsToGoal = parseFloat(inputs.years_to_goal) || 1;
        const currentSavings = parseFloat(inputs.current_savings) || 0;
        const remainingAmount = goalAmount - currentSavings;
        const monthlyNeeded = remainingAmount / (yearsToGoal * 12);
        calculationResult = {
          monthly_savings_needed: Math.max(0, monthlyNeeded),
          total_to_save: Math.max(0, remainingAmount),
          explanation: `Save $${monthlyNeeded.toFixed(0)} monthly to reach your goal.`
        };
        break;

      case 'retirement_income':
        const retirementSavings = parseFloat(inputs.retirement_savings) || 0;
        const monthlySS = parseFloat(inputs.monthly_ss) || 0;
        const otherIncome = parseFloat(inputs.other_income) || 0;
        const monthlyFromSavings = (retirementSavings * 0.04) / 12;
        const totalMonthly = monthlyFromSavings + monthlySS + otherIncome;
        calculationResult = {
          monthly_income: totalMonthly,
          annual_income: totalMonthly * 12,
          income_sources: {
            savings: monthlyFromSavings,
            social_security: monthlySS,
            other: otherIncome
          },
          explanation: `Your estimated monthly retirement income is $${totalMonthly.toFixed(0)}.`
        };
        break;

      case 'withdrawal_rate':
        const portfolioValue = parseFloat(inputs.portfolio_value) || 0;
        const withdrawalRate = parseFloat(inputs.withdrawal_rate) || 4;
        const annualWithdrawal = portfolioValue * (withdrawalRate / 100);
        const monthlyWithdrawal = annualWithdrawal / 12;
        calculationResult = {
          annual_withdrawal: annualWithdrawal,
          monthly_withdrawal: monthlyWithdrawal,
          explanation: `You can safely withdraw $${monthlyWithdrawal.toFixed(0)} monthly.`
        };
        break;
    }

    setResult(calculationResult);
  };

  const handleSubmit = () => {
    onCalculate({
      type: selectedCalculator,
      input_values: inputs,
      result_value: result,
      recommendations: [result?.explanation || 'Calculation completed successfully']
    });
  };

  const selectedCalc = currentCalculators.find(c => c.id === selectedCalculator);
  const hasAllInputs = selectedCalc?.inputs.every(input => inputs[input.key]) || false;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Try a Quick Calculation</h2>
        <p className="text-muted-foreground">
          Get instant insights into your financial situation
        </p>
      </div>

      {/* Calculator Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        {currentCalculators.map((calc) => {
          const Icon = calc.icon;
          const isSelected = selectedCalculator === calc.id;
          
          return (
            <Card 
              key={calc.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/50'
              }`}
              onClick={() => handleCalculatorSelect(calc.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{calc.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{calc.description}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Calculator Inputs */}
      {selectedCalc && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <selectedCalc.icon className="h-5 w-5" />
              {selectedCalc.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCalc.inputs.map((input) => (
              <div key={input.key} className="space-y-2">
                <Label htmlFor={input.key}>{input.label}</Label>
                <Input
                  id={input.key}
                  type={input.type}
                  placeholder={input.placeholder}
                  value={inputs[input.key] || ''}
                  onChange={(e) => handleInputChange(input.key, e.target.value)}
                />
              </div>
            ))}

            <Button 
              onClick={calculateResult}
              disabled={!hasAllInputs}
              className="w-full"
              variant="outline"
            >
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
          <CardContent>
            <div className="space-y-3">
              <p className="text-green-700 font-medium">{result.explanation}</p>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-green-200">
                {Object.entries(result).map(([key, value]) => {
                  if (key === 'explanation' || typeof value === 'object') return null;
                  
                  return (
                    <div key={key} className="text-center">
                      <p className="text-lg font-bold text-green-800">
                        {typeof value === 'number' && key.includes('amount') || key.includes('income') || key.includes('withdrawal') 
                          ? `$${value.toLocaleString()}` 
                          : value}
                      </p>
                      <p className="text-xs text-green-600 capitalize">
                        {String(key).replace(/_/g, ' ')}
                      </p>
                    </div>
                  );
                })}
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-4"
              >
                {isLoading ? 'Saving Result...' : 'Continue to Dashboard'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skip Option */}
      <div className="text-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onCalculate({ skipped: true })}
        >
          Skip calculation - take me to my dashboard
        </Button>
      </div>
    </div>
  );
}