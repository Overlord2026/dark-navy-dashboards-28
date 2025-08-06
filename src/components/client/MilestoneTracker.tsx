import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import { useCelebration } from '@/hooks/useCelebration';

export const MilestoneTracker = () => {
  const { triggerCelebration, CelebrationComponent } = useCelebration();

  const milestones = [
    {
      id: 'first_1k',
      title: 'First $1,000 Saved',
      description: 'Build your emergency fund foundation',
      target: 1000,
      current: 750,
      icon: DollarSign,
      completed: false,
      category: 'Savings'
    },
    {
      id: 'first_investment',
      title: 'First Investment Account',
      description: 'Open your first brokerage account',
      target: 1,
      current: 0,
      icon: TrendingUp,
      completed: false,
      category: 'Investing',
      isBoolean: true
    },
    {
      id: 'first_10k',
      title: 'First $10,000 Net Worth',
      description: 'Reach five-figure wealth milestone',
      target: 10000,
      current: 3250,
      icon: Trophy,
      completed: false,
      category: 'Net Worth'
    },
    {
      id: 'first_100k',
      title: 'First $100,000 Milestone',
      description: 'Join the six-figure club',
      target: 100000,
      current: 3250,
      icon: Target,
      completed: false,
      category: 'Net Worth'
    }
  ];

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCelebrateMilestone = (milestone: any) => {
    triggerCelebration('milestone', `Congratulations on reaching ${milestone.title}!`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Your Milestone Journey
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              Next-Gen Builder
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Track your wealth-building milestones and celebrate your progress
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {milestones.map((milestone) => {
            const progress = milestone.isBoolean 
              ? (milestone.current > 0 ? 100 : 0)
              : calculateProgress(milestone.current, milestone.target);
            const isNearCompletion = progress >= 75;

            return (
              <div key={milestone.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${milestone.completed ? 'bg-emerald-100' : 'bg-primary/10'}`}>
                      <milestone.icon className={`h-5 w-5 ${milestone.completed ? 'text-emerald-600' : 'text-primary'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{milestone.title}</h4>
                      <p className="text-xs text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant={milestone.completed ? 'default' : 'outline'} className="text-xs">
                      {milestone.category}
                    </Badge>
                    {!milestone.isBoolean && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(milestone.current)} / {formatCurrency(milestone.target)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress 
                    value={progress} 
                    className={`h-2 ${isNearCompletion ? 'bg-emerald-100' : ''}`}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {Math.round(progress)}% complete
                    </span>
                    {isNearCompletion && !milestone.completed && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleCelebrateMilestone(milestone)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Celebrate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full">
              <Target className="h-4 w-4 mr-2" />
              Set Custom Milestone
            </Button>
          </div>
        </CardContent>
      </Card>
      {CelebrationComponent}
    </>
  );
};