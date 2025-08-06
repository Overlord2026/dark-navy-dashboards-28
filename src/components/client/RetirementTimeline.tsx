import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export const RetirementTimeline = () => {
  const currentAge = 55;
  const retirementAge = 65;
  const yearsToRetirement = retirementAge - currentAge;
  const retirementProgress = ((currentAge - 25) / (retirementAge - 25)) * 100; // Assuming career started at 25

  const timelineEvents = [
    {
      age: 62,
      title: 'Early Social Security',
      description: 'Earliest eligibility for reduced benefits',
      status: 'upcoming',
      importance: 'medium',
      yearsAway: 62 - currentAge
    },
    {
      age: 65,
      title: 'Full Retirement Age',
      description: 'Medicare eligibility and full retirement',
      status: 'target',
      importance: 'high',
      yearsAway: 65 - currentAge
    },
    {
      age: 67,
      title: 'Full Social Security',
      description: 'Maximum Social Security benefits',
      status: 'optimal',
      importance: 'high',
      yearsAway: 67 - currentAge
    },
    {
      age: 70,
      title: 'Maximum Benefits',
      description: 'Delayed retirement credits max out',
      status: 'future',
      importance: 'medium',
      yearsAway: 70 - currentAge
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-amber-100 text-amber-800';
      case 'target': return 'bg-blue-100 text-blue-800';
      case 'optimal': return 'bg-emerald-100 text-emerald-800';
      case 'future': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Your Retirement Timeline
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            {yearsToRetirement} Years to Go
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Key milestones and decisions on your path to retirement
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Retirement Progress</span>
            <span className="font-medium">{Math.round(retirementProgress)}% Complete</span>
          </div>
          <Progress value={retirementProgress} className="h-3" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Career Start (25)</span>
            <span className="font-medium">You Are Here ({currentAge})</span>
            <span>Target Retirement ({retirementAge})</span>
          </div>
        </div>

        {/* Timeline Events */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Upcoming Milestones
          </h4>
          
          {timelineEvents.map((event, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
              <div className="text-center min-w-[60px]">
                <div className="text-lg font-bold text-primary">
                  {event.age}
                </div>
                <div className="text-xs text-muted-foreground">
                  {event.yearsAway > 0 ? `${event.yearsAway}y` : 'Now'}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-sm">{event.title}</h5>
                  <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                    {event.status}
                  </Badge>
                  {event.importance === 'high' && (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium text-sm">Next Steps</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" size="sm" className="justify-start h-auto p-3">
              <DollarSign className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium text-sm">Review Social Security Strategy</div>
                <div className="text-xs text-muted-foreground">Optimize your claiming strategy</div>
              </div>
            </Button>
            <Button variant="outline" size="sm" className="justify-start h-auto p-3">
              <TrendingUp className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium text-sm">Add Retirement Goal</div>
                <div className="text-xs text-muted-foreground">Set target income and savings</div>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};