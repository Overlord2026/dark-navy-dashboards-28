import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';
import { OnboardingStepData } from '@/types/onboarding';

interface TaskListStepProps {
  data: OnboardingStepData;
  onComplete: (stepData: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

export const TaskListStep: React.FC<TaskListStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious
}) => {
  const handleSave = () => {
    onComplete({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Task Management
        </h2>
        <p className="text-muted-foreground">Track your onboarding progress.</p>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle>Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Personal information completed</span>
              <Badge variant="default">Done</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-warning" />
              <span>Account applications pending</span>
              <Badge variant="secondary">In Progress</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">Previous</Button>
        <Button onClick={handleSave} className="btn-primary-gold">Continue</Button>
      </div>
    </div>
  );
};