import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Home, GraduationCap, Plane } from 'lucide-react';

export const GoalCenter = () => {
  const goals = [
    {
      title: 'Retirement Fund',
      target: 2500000,
      current: 1750000,
      icon: Target,
      color: 'text-blue-600',
      eta: '2034'
    },
    {
      title: 'Dream Home',
      target: 850000,
      current: 425000,
      icon: Home,
      color: 'text-green-600',
      eta: '2026'
    },
    {
      title: 'Children\'s Education',
      target: 400000,
      current: 320000,
      icon: GraduationCap,
      color: 'text-purple-600',
      eta: '2028'
    },
    {
      title: 'European Vacation',
      target: 25000,
      current: 18000,
      icon: Plane,
      color: 'text-orange-600',
      eta: '2025'
    }
  ];

  const calculateProgress = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Goal Center & Timeline</CardTitle>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((goal, index) => {
            const progress = calculateProgress(goal.current, goal.target);
            return (
              <Card key={index} className="border-2 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <goal.icon className={`h-5 w-5 ${goal.color}`} />
                    <h4 className="font-medium text-sm">{goal.title}</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${goal.current.toLocaleString()}</span>
                      <span>${goal.target.toLocaleString()}</span>
                    </div>
                    
                    <Progress value={progress} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{progress}%</span>
                      <span className="text-xs text-muted-foreground">ETA: {goal.eta}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};