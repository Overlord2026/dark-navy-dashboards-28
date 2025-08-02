import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar } from 'lucide-react';
import { OnboardingStepData } from '@/types/onboarding';

interface ConfirmationStepProps {
  data: OnboardingStepData;
  onComplete: (stepData: Partial<OnboardingStepData>) => void;
  isLoading?: boolean;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  data,
  onComplete
}) => {
  const handleComplete = () => {
    onComplete({});
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Onboarding Complete!
        </h2>
        <p className="text-muted-foreground">
          Welcome to our wealth management platform.
        </p>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Your advisor will contact you within 24 hours to schedule your welcome call.</p>
          <Button onClick={handleComplete} className="btn-primary-gold w-full">
            Complete Onboarding
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};