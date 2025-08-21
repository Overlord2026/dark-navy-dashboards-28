import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, GraduationCap, PiggyBank, Heart, Plane, CreditCard } from 'lucide-react';

interface WizardGoalStepProps {
  onComplete: (goalData: any) => void;
  persona: 'aspiring' | 'retiree';
}

export function WizardGoalStep({ onComplete, persona }: WizardGoalStepProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [customDate, setCustomDate] = useState<string>('');

  const goalTemplates = {
    aspiring: [
      {
        key: 'emergency_fund',
        title: 'Emergency Fund',
        icon: PiggyBank,
        defaultAmount: 10000,
        defaultYears: 1,
        description: '3-6 months of expenses'
      },
      {
        key: 'down_payment',
        title: 'Down Payment',
        icon: Home,
        defaultAmount: 60000,
        defaultYears: 3,
        description: 'For your first home'
      },
      {
        key: 'debt_paydown',
        title: 'Debt Paydown',
        icon: CreditCard,
        defaultAmount: 25000,
        defaultYears: 2,
        description: 'Eliminate high-interest debt'
      },
      {
        key: 'college',
        title: 'College Fund',
        icon: GraduationCap,
        defaultAmount: 50000,
        defaultYears: 10,
        description: 'Education savings'
      }
    ],
    retiree: [
      {
        key: 'income_plan',
        title: 'Income Plan',
        icon: PiggyBank,
        defaultAmount: 75000,
        defaultYears: 5,
        description: 'Annual retirement income'
      },
      {
        key: 'bucket_list',
        title: 'Bucket-List Trip',
        icon: Plane,
        defaultAmount: 30000,
        defaultYears: 2,
        description: 'Dream vacation or experience'
      },
      {
        key: 'health_reserve',
        title: 'HSA/Health Reserve',
        icon: Heart,
        defaultAmount: 100000,
        defaultYears: 5,
        description: 'Healthcare cost preparation'
      },
      {
        key: 'charitable',
        title: 'Charitable Giving',
        icon: Heart,
        defaultAmount: 25000,
        defaultYears: 3,
        description: 'Planned philanthropy'
      }
    ]
  };

  const currentGoals = goalTemplates[persona];
  const selectedTemplate = currentGoals.find(g => g.key === selectedGoal);

  const handleGoalSelect = (goalKey: string) => {
    setSelectedGoal(goalKey);
    const template = currentGoals.find(g => g.key === goalKey);
    if (template) {
      setCustomAmount(template.defaultAmount.toString());
      const targetDate = new Date();
      targetDate.setFullYear(targetDate.getFullYear() + template.defaultYears);
      setCustomDate(targetDate.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = () => {
    const template = currentGoals.find(g => g.key === selectedGoal);
    const goalData = {
      goal_key: selectedGoal,
      title: template?.title,
      amount: parseInt(customAmount) || template?.defaultAmount || 0,
      target_date: customDate,
      persona_default: customAmount === template?.defaultAmount.toString()
    };

    onComplete(goalData);
  };

  const canSubmit = selectedGoal && customAmount && customDate;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Pick your top priority—no wrong choices</h2>
        <p className="text-muted-foreground">
          {persona === 'aspiring' 
            ? 'Let\'s start building your financial foundation'
            : 'Let\'s optimize your retirement strategy'
          }
        </p>
      </div>

      {/* Goal Templates */}
      <div className="grid grid-cols-2 gap-3">
        {currentGoals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoal === goal.key;
          
          return (
            <Card 
              key={goal.key}
              className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/50'
              }`}
              onClick={() => handleGoalSelect(goal.key)}
            >
              <CardContent className="p-4 text-center">
                <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-sm">{goal.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  ${goal.defaultAmount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {goal.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Goal Customization */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <selectedTemplate.icon className="h-5 w-5" />
              Customize Your {selectedTemplate.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Target Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="pl-8"
                    placeholder={selectedTemplate.defaultAmount.toString()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Target Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                />
              </div>
            </div>

            <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
              <strong>SMART Goal:</strong> Save ${parseInt(customAmount || '0').toLocaleString()} 
              for {selectedTemplate.title.toLowerCase()} by {customDate ? new Date(customDate).toLocaleDateString() : 'target date'}
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full"
            >
              Create This Goal
            </Button>
          </CardContent>
        </Card>
      )}

      {!selectedGoal && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Choose a goal template above to get started with SMART defaults
          </p>
        </div>
      )}
    </div>
  );
}