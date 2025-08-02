import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle } from 'lucide-react';
import { OnboardingStepData } from '@/types/onboarding';

interface ComplianceStepProps {
  data: OnboardingStepData;
  onComplete: (stepData: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

export const ComplianceStep: React.FC<ComplianceStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious
}) => {
  const handleSave = () => {
    onComplete({
      compliance: {
        kycStatus: 'passed',
        amlStatus: 'passed',
        ofacStatus: 'passed'
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Compliance Review
        </h2>
        <p className="text-muted-foreground">Regulatory compliance checks.</p>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>KYC Verification</span>
            <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Passed</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>AML Screening</span>
            <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Passed</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>OFAC Check</span>
            <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Passed</Badge>
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