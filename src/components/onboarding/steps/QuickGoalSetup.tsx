import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Home, GraduationCap, Car, PiggyBank, Heart, Plane, Lock } from 'lucide-react';

interface QuickGoalSetupProps {
  onGoalCreate: (goalData: any) => void;
  persona: 'aspiring' | 'retiree';
  isLoading?: boolean;
  onFeatureGating: () => void;
}

export function QuickGoalSetup({ onGoalCreate, persona, isLoading, onFeatureGating }: QuickGoalSetupProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [timeframe, setTimeframe] = useState<string>('');

  const goalTypes = {
    aspiring: [
      { id: 'emergency_fund', label: 'Emergency Fund', icon: PiggyBank, amount: '10000', timeframe: '1_year', premium: false },
      { id: 'home_purchase', label: 'Buy a Home', icon: Home, amount: '50000', timeframe: '3_years', premium: false },
      { id: 'education', label: 'Education Fund', icon: GraduationCap, amount: '25000', timeframe: '2_years', premium: true },
      { id: 'vehicle', label: 'New Vehicle', icon: Car, amount: '30000', timeframe: '2_years', premium: false },
    ],
    retiree: [
      { id: 'retirement_income', label: 'Retirement Income', icon: PiggyBank, amount: '75000', timeframe: '10_years', premium: false },
      { id: 'healthcare_fund', label: 'Healthcare Fund', icon: Heart, amount: '100000', timeframe: '5_years', premium: true },
      { id: 'travel_fund', label: 'Travel & Experiences', icon: Plane, amount: '40000', timeframe: '3_years', premium: false },
      { id: 'legacy_planning', label: 'Legacy Planning', icon: Home, amount: '500000', timeframe: '20_years', premium: true },
    ]
  };

  const timeframes = [
    { id: '1_year', label: '1 Year' },
    { id: '2_years', label: '2 Years' },
    { id: '3_years', label: '3 Years' },
    { id: '5_years', label: '5 Years' },
    { id: '10_years', label: '10 Years' },
    { id: '20_years', label: '20+ Years' }
  ];

  const currentGoals = goalTypes[persona];

  const handleGoalSelect = (goalId: string) => {
    const goal = currentGoals.find(g => g.id === goalId);
    if (goal?.premium) {
      onFeatureGating();
      return;
    }
    
    setSelectedGoal(goalId);
    if (goal) {
      setAmount(goal.amount);
      setTimeframe(goal.timeframe);
    }
  };

  const handleSubmit = () => {
    const selectedGoalData = currentGoals.find(g => g.id === selectedGoal);
    
    onGoalCreate({
      type: selectedGoal,
      amount: parseInt(amount) || 0,
      target_date: new Date(Date.now() + (timeframe === '1_year' ? 365 : 
                                         timeframe === '2_years' ? 730 :
                                         timeframe === '3_years' ? 1095 :
                                         timeframe === '5_years' ? 1825 :
                                         timeframe === '10_years' ? 3650 : 7300) * 24 * 60 * 60 * 1000).toISOString(),
      priority: persona === 'aspiring' ? 'high' : 'medium'
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">What's your first financial goal?</h2>
        <p className="text-muted-foreground">We'll help you create a plan to achieve it</p>
      </div>

      {/* Quick Goal Templates */}
      <div className="grid grid-cols-2 gap-3">
        {currentGoals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoal === goal.id;
          
          return (
            <Card 
              key={goal.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-sm relative ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/50'
              }`}
              onClick={() => handleGoalSelect(goal.id)}
            >
              {goal.premium && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              
              <CardContent className="p-4 text-center">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${
                  goal.premium ? 'text-yellow-600' : 'text-primary'
                }`} />
                <h3 className="font-medium text-sm">{goal.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  ${parseInt(goal.amount).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Goal Input */}
      {selectedGoal && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customize Your Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Target Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  placeholder="25000"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Target Timeframe</Label>
              <RadioGroup 
                value={timeframe} 
                onValueChange={setTimeframe}
                className="grid grid-cols-3 gap-2"
              >
                {timeframes.map((tf) => (
                  <div key={tf.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={tf.id} id={tf.id} />
                    <Label htmlFor={tf.id} className="text-sm cursor-pointer">
                      {tf.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={!selectedGoal || !amount || !timeframe || isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Goal...' : 'Create My Goal'}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <Button variant="ghost" size="sm" onClick={() => onGoalCreate({ skipped: true })}>
          Skip for now - I'll set goals later
        </Button>
      </div>
    </div>
  );
}