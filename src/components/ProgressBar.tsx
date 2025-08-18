import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressBarProps {
  steps: ProgressStep[];
  title?: string;
  showStepList?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  title,
  showStepList = true,
  className = ''
}) => {
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            {title}
            <Badge variant="outline">
              {completedSteps} of {steps.length}
            </Badge>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
        
        {showStepList && (
          <div className="space-y-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className={`h-5 w-5 ${step.current ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
                <span className={`text-sm ${step.current ? 'font-medium text-primary' : step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};