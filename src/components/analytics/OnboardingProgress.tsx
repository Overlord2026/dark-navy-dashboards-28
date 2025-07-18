import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { OnboardingProgress as OnboardingProgressType } from '@/hooks/useAnalytics';
import { UserCheck, Users } from 'lucide-react';

interface OnboardingProgressProps {
  data: OnboardingProgressType[];
  loading: boolean;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ data, loading }) => {
  const advisorSteps = data.filter(item => item.userType === 'advisor');
  const clientSteps = data.filter(item => item.userType === 'client');

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'bg-success';
    if (rate >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No onboarding data available</p>
        </CardContent>
      </Card>
    );
  }

  const renderStepsList = (steps: OnboardingProgressType[], title: string, icon: React.ReactNode) => (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No onboarding steps tracked</p>
        ) : (
          steps.map((step, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{step.stepName}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {step.completedCount}/{step.totalCount}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {step.completionRate.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Progress 
                value={step.completionRate} 
                className="h-2"
                indicatorClassName={getCompletionColor(step.completionRate)}
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Onboarding Progress</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {renderStepsList(
          advisorSteps, 
          'Advisor Onboarding', 
          <UserCheck className="h-5 w-5" />
        )}
        
        {renderStepsList(
          clientSteps, 
          'Client Onboarding', 
          <Users className="h-5 w-5" />
        )}
      </div>
    </div>
  );
};