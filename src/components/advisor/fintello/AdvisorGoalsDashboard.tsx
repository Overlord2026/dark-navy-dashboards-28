import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Edit,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface GoalData {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  timeframe: string;
  status: 'on-track' | 'behind' | 'exceeded';
  category: 'revenue' | 'clients' | 'aum' | 'meetings';
}

export function AdvisorGoalsDashboard() {
  const [goals, setGoals] = useState<GoalData[]>([
    {
      id: '1',
      title: 'Annual Revenue Target',
      target: 1200000,
      current: 875000,
      unit: '$',
      timeframe: '2024',
      status: 'on-track',
      category: 'revenue'
    },
    {
      id: '2', 
      title: 'New Client Acquisitions',
      target: 50,
      current: 32,
      unit: 'clients',
      timeframe: '2024',
      status: 'on-track',
      category: 'clients'
    },
    {
      id: '3',
      title: 'Assets Under Management',
      target: 75000000,
      current: 45000000,
      unit: '$',
      timeframe: '2024',
      status: 'behind',
      category: 'aum'
    },
    {
      id: '4',
      title: 'Client Meetings Scheduled',
      target: 200,
      current: 165,
      unit: 'meetings',
      timeframe: '2024',
      status: 'exceeded',
      category: 'meetings'
    }
  ]);

  const getIcon = (category: string) => {
    switch (category) {
      case 'revenue': return DollarSign;
      case 'clients': return Users;
      case 'aum': return TrendingUp;
      case 'meetings': return Calendar;
      default: return Target;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-100';
      case 'behind': return 'text-red-600 bg-red-100';
      case 'exceeded': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return CheckCircle;
      case 'exceeded': return CheckCircle;
      case 'behind': return AlertCircle;
      default: return Target;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '$' && value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (unit === '$' && value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    if (unit === '$') {
      return `$${value.toLocaleString()}`;
    }
    return `${value} ${unit}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your 12-Month Goals</h2>
          <p className="text-muted-foreground">Track your progress against annual targets</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Targets
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {goals.map((goal) => {
          const Icon = getIcon(goal.category);
          const StatusIcon = getStatusIcon(goal.status);
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          
          return (
            <Card key={goal.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(goal.status)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {goal.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Current</p>
                    <p className="text-lg font-bold">{formatValue(goal.current, goal.unit)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Target</p>
                    <p className="text-lg font-bold">{formatValue(goal.target, goal.unit)}</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Timeframe: {goal.timeframe}</span>
                    <span>
                      {formatValue(goal.target - goal.current, goal.unit)} remaining
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {goals.filter(g => g.status === 'on-track' || g.status === 'exceeded').length}
              </div>
              <p className="text-sm text-muted-foreground">Goals On Track</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {goals.filter(g => g.status === 'behind').length}
              </div>
              <p className="text-sm text-muted-foreground">Behind Target</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(goals.reduce((acc, g) => acc + (g.current / g.target * 100), 0) / goals.length)}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}