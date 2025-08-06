import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { abTesting } from '@/lib/abTesting';

interface OnboardingProgressBarProps {
  completedSteps: number;
  totalSteps: number;
  onComplete?: () => void;
}

export const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({
  completedSteps,
  totalSteps,
  onComplete
}) => {
  const { user } = useAuth();
  const progressPercent = (completedSteps / totalSteps) * 100;

  // A/B Test for progress display format
  const progressVariant = abTesting.getVariant('onboarding_progress_display', user?.id || 'anonymous');
  const displayType = progressVariant?.config.displayType || 'percentage';

  const getDisplayText = () => {
    if (displayType === 'percentage') {
      return `${Math.round(progressPercent)}% complete`;
    } else {
      const remaining = totalSteps - completedSteps;
      return remaining > 0 ? `${remaining} steps remaining` : 'Complete!';
    }
  };

  // Track completion if at 100%
  React.useEffect(() => {
    if (progressPercent === 100 && onComplete) {
      onComplete();
      abTesting.trackConversion('onboarding_progress_display', progressVariant?.id || 'unknown', user?.id || 'anonymous', 'onboarding_completed');
    }
  }, [progressPercent, onComplete, progressVariant?.id, user?.id]);

  if (progressPercent === 100) {
    return null; // Hide when complete
  }

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-foreground">Complete Your Setup</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            {getDisplayText()}
          </div>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </CardContent>
    </Card>
  );
};