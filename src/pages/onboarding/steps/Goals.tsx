import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, Plus, Trash2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount?: number;
  targetDate?: string;
  priority: 'high' | 'medium' | 'low';
}

interface GoalsData {
  primaryGoals: Goal[];
  timeHorizon: string;
  riskTolerance: string;
}

interface GoalsProps {
  onComplete: (data: GoalsData) => void;
  persona: string;
  segment: string;
  initialData?: Partial<GoalsData>;
}

const suggestedGoals = {
  retirees: [
    { title: 'Optimize RMD Strategy', description: 'Minimize taxes on required minimum distributions' },
    { title: 'Healthcare Planning', description: 'Plan for long-term care expenses' },
    { title: 'Legacy Planning', description: 'Maximize inheritance for heirs' }
  ],
  aspiring: [
    { title: 'Emergency Fund', description: 'Build 6 months of expenses in savings' },
    { title: 'Home Down Payment', description: 'Save for first home purchase' },
    { title: 'Retirement Savings', description: 'Maximize 401(k) and IRA contributions' }
  ],
  hnw: [
    { title: 'Tax Optimization', description: 'Implement advanced tax strategies' },
    { title: 'Estate Planning', description: 'Structure wealth transfer efficiently' },
    { title: 'Alternative Investments', description: 'Diversify with private markets' }
  ],
  uhnw: [
    { title: 'Family Governance', description: 'Establish family office structure' },
    { title: 'Philanthropic Strategy', description: 'Optimize charitable giving' },
    { title: 'Succession Planning', description: 'Plan business and wealth transition' }
  ]
};

export const Goals: React.FC<GoalsProps> = ({
  onComplete,
  persona,
  segment,
  initialData
}) => {
  const [goals, setGoals] = useState<Goal[]>(
    initialData?.primaryGoals || []
  );
  const [timeHorizon, setTimeHorizon] = useState(initialData?.timeHorizon || '');
  const [riskTolerance, setRiskTolerance] = useState(initialData?.riskTolerance || '');

  const suggestions = suggestedGoals[segment as keyof typeof suggestedGoals] || suggestedGoals.aspiring;

  const addGoal = (suggestion?: { title: string; description: string }) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: suggestion?.title || '',
      description: suggestion?.description || '',
      priority: 'medium'
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, field: keyof Goal, value: any) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    ));
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const addSuggestedGoal = (suggestion: { title: string; description: string }) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: suggestion.title,
      description: suggestion.description,
      priority: 'medium'
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: GoalsData = {
      primaryGoals: goals,
      timeHorizon,
      riskTolerance
    };

    analytics.trackEvent('onboarding.step_completed', {
      step: 'goals',
      persona,
      segment,
      goals_count: goals.length,
      time_horizon: timeHorizon,
      risk_tolerance: riskTolerance
    });

    onComplete(data);
  };

  const handleSkip = () => {
    analytics.trackEvent('onboarding.step_completed', {
      step: 'goals',
      persona,
      segment,
      skipped: true
    });
    
    onComplete({
      primaryGoals: [],
      timeHorizon: '',
      riskTolerance: ''
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Define Your Goals</CardTitle>
        <CardDescription>
          Tell us about your financial objectives to personalize your experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Suggested Goals */}
          {suggestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Common Goals for {segment} Families</h3>
              <div className="grid gap-2">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{suggestion.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addSuggestedGoal(suggestion)}
                        className="ml-2"
                      >
                        Add
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Custom Goals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Your Goals</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addGoal()}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Goal
              </Button>
            </div>

            {goals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No goals added yet. Use the suggestions above or click "Add Goal" to create custom goals.
              </p>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <Card key={goal.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor={`title-${goal.id}`}>Goal Title</Label>
                            <Input
                              id={`title-${goal.id}`}
                              value={goal.title}
                              onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                              placeholder="Enter goal title"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`description-${goal.id}`}>Description</Label>
                            <Textarea
                              id={`description-${goal.id}`}
                              value={goal.description}
                              onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                              placeholder="Describe your goal in more detail"
                              rows={2}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`amount-${goal.id}`}>Target Amount ($)</Label>
                              <Input
                                id={`amount-${goal.id}`}
                                type="number"
                                value={goal.targetAmount || ''}
                                onChange={(e) => updateGoal(goal.id, 'targetAmount', Number(e.target.value) || undefined)}
                                placeholder="Optional"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`date-${goal.id}`}>Target Date</Label>
                              <Input
                                id={`date-${goal.id}`}
                                type="date"
                                value={goal.targetDate || ''}
                                onChange={(e) => updateGoal(goal.id, 'targetDate', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeGoal(goal.id)}
                          className="ml-4 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove goal</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Risk & Time Horizon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Investment Time Horizon</Label>
              <div className="space-y-2">
                {[
                  { value: 'short', label: 'Short-term (1-3 years)' },
                  { value: 'medium', label: 'Medium-term (3-10 years)' },
                  { value: 'long', label: 'Long-term (10+ years)' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`horizon-${option.value}`}
                      checked={timeHorizon === option.value}
                      onCheckedChange={(checked) => {
                        if (checked) setTimeHorizon(option.value);
                      }}
                    />
                    <Label 
                      htmlFor={`horizon-${option.value}`}
                      className="text-sm font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Risk Tolerance</Label>
              <div className="space-y-2">
                {[
                  { value: 'conservative', label: 'Conservative' },
                  { value: 'moderate', label: 'Moderate' },
                  { value: 'aggressive', label: 'Aggressive' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`risk-${option.value}`}
                      checked={riskTolerance === option.value}
                      onCheckedChange={(checked) => {
                        if (checked) setRiskTolerance(option.value);
                      }}
                    />
                    <Label 
                      htmlFor={`risk-${option.value}`}
                      className="text-sm font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Continue
            </Button>
            <Button type="button" variant="outline" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};