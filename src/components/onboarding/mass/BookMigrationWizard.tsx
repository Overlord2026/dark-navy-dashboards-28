import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { 
  Upload, 
  Map, 
  Users, 
  UserCheck, 
  FileCheck, 
  PenTool, 
  Rocket,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

interface BookMigrationWizardProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onboardingType: 'solo' | 'firm' | null;
}

const wizardSteps = [
  {
    id: 1,
    title: 'Upload Book',
    description: 'Upload Files: CSV, XLSX, PDF, or Direct API Connect',
    icon: Upload,
    status: 'completed'
  },
  {
    id: 2,
    title: 'Auto-Map Fields',
    description: 'Mapping Wizard: Client Name, Account #, Plan Type…',
    icon: Map,
    status: 'current'
  },
  {
    id: 3,
    title: 'Review Clients',
    description: 'Table: Name, Account, Status, Errors, Compliance?',
    icon: Users,
    status: 'pending'
  },
  {
    id: 4,
    title: 'Assign Advisors',
    description: 'Bulk or Individual assignment',
    icon: UserCheck,
    status: 'pending'
  },
  {
    id: 5,
    title: 'Compliance Checklist',
    description: 'Auto-triggered tasks—ADV, U4, AML, etc.',
    icon: FileCheck,
    status: 'pending'
  },
  {
    id: 6,
    title: 'E-Sign Docs',
    description: 'E-sign onboarding, consents, disclosures',
    icon: PenTool,
    status: 'pending'
  },
  {
    id: 7,
    title: 'Launch',
    description: 'Launch Portal & Schedule Training',
    icon: Rocket,
    status: 'pending'
  }
];

export const BookMigrationWizard = ({ 
  currentStep, 
  setCurrentStep, 
  onboardingType 
}: BookMigrationWizardProps) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.includes(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const handleNextStep = () => {
    if (currentStep < wizardSteps.length) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          Book Migration Wizard
          {onboardingType && (
            <Badge variant="secondary">
              {onboardingType === 'solo' ? 'Solo Advisor' : 'Firm/Team'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {wizardSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isClickable = step.id <= currentStep || isCompleted;
            
            return (
              <div
                key={step.id}
                className={`p-4 border rounded-lg transition-all duration-200 ${
                  isClickable ? 'cursor-pointer hover:bg-muted/50' : 'opacity-60'
                } ${
                  isCurrent ? 'border-primary bg-primary/5' : 'border-border'
                } ${
                  isCompleted ? 'border-green-500/50 bg-green-500/5' : ''
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isCompleted ? 'bg-green-500 text-white' : 
                      isCurrent ? 'bg-primary text-white' : 'bg-muted'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {isCurrent && (
                    <ChevronRight className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {wizardSteps.length}
          </div>
          <Button 
            onClick={handleNextStep}
            disabled={currentStep >= wizardSteps.length}
            className="flex items-center gap-2"
          >
            {currentStep === wizardSteps.length ? 'Complete' : 'Next Step'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};