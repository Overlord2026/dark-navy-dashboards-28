import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, ExternalLink } from 'lucide-react';
import { OnboardingStepData } from '@/types/onboarding';

interface DigitalApplicationStepProps {
  data: OnboardingStepData;
  onComplete: (stepData: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

export const DigitalApplicationStep: React.FC<DigitalApplicationStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  isLoading
}) => {
  const [applications, setApplications] = useState(
    data.digitalApplication?.applications || []
  );

  const handleSave = () => {
    onComplete({
      digitalApplication: { applications }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Digital Applications
        </h2>
        <p className="text-muted-foreground">
          Your account applications are ready for digital signature.
        </p>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle>Account Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <h4 className="font-semibold">Schwab Individual Account</h4>
              <p className="text-sm text-muted-foreground">Ready for signature</p>
            </div>
            <Button className="btn-primary-gold">
              Sign Now <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">Previous</Button>
        <Button onClick={handleSave} className="btn-primary-gold">
          Continue
        </Button>
      </div>
    </div>
  );
};