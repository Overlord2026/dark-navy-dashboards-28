import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import { OnboardingState, OnboardingStepData } from '@/types/onboarding';
import { WelcomeStep } from './steps/WelcomeStep';
import { ClientInfoStep } from './steps/ClientInfoStep';
import { CustodianSelectionStep } from './steps/CustodianSelectionStep';
import { DocumentUploadStep } from './steps/DocumentUploadStep';
import { DigitalApplicationStep } from './steps/DigitalApplicationStep';
import { TaskListStep } from './steps/TaskListStep';
import { ComplianceStep } from './steps/ComplianceStep';
import { ConfirmationStep } from './steps/ConfirmationStep';
import { AIAssistant } from './AIAssistant';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ClientOnboardingFlowProps {
  initialState?: Partial<OnboardingState>;
  onComplete?: (state: OnboardingState) => void;
  brandSettings?: {
    logo?: string;
    primaryColor?: string;
    companyName?: string;
  };
}

const ONBOARDING_STEPS = [
  { id: 1, title: 'Welcome', component: WelcomeStep },
  { id: 2, title: 'Client Information', component: ClientInfoStep },
  { id: 3, title: 'Custodian Selection', component: CustodianSelectionStep },
  { id: 4, title: 'Document Upload', component: DocumentUploadStep },
  { id: 5, title: 'Digital Application', component: DigitalApplicationStep },
  { id: 6, title: 'Task Management', component: TaskListStep },
  { id: 7, title: 'Compliance Review', component: ComplianceStep },
  { id: 8, title: 'Confirmation', component: ConfirmationStep },
];

export const ClientOnboardingFlow: React.FC<ClientOnboardingFlowProps> = ({
  initialState,
  onComplete,
  brandSettings
}) => {
  const [currentStep, setCurrentStep] = useState(initialState?.currentStep || 1);
  const [onboardingData, setOnboardingData] = useState<OnboardingStepData>(
    initialState || {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const { toast } = useToast();

  const progressPercentage = Math.round((currentStep / ONBOARDING_STEPS.length) * 100);

  const handleStepComplete = async (stepData: Partial<OnboardingStepData>) => {
    setIsLoading(true);
    try {
      const updatedData = { ...onboardingData, ...stepData };
      setOnboardingData(updatedData);

      // Save to database
      await saveOnboardingState(updatedData);

      if (currentStep < ONBOARDING_STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        // Onboarding complete
        const finalState: OnboardingState = {
          ...updatedData,
          currentStep,
          totalSteps: ONBOARDING_STEPS.length,
          progressPercentage: 100,
          status: 'completed',
          priority: 'medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        onComplete?.(finalState);
      }

      toast({
        title: "Progress Saved",
        description: "Your information has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveOnboardingState = async (data: OnboardingStepData) => {
    // This would save to the estate_intake table once the migration is complete
    // For now, we'll just simulate the save
    console.log('Saving onboarding state:', data);
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || step === currentStep - 1) {
      setCurrentStep(step);
    }
  };

  const currentStepConfig = ONBOARDING_STEPS.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepConfig?.component;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {brandSettings?.logo && (
                <img 
                  src={brandSettings.logo} 
                  alt="Company Logo" 
                  className="h-8 w-auto"
                />
              )}
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Client Onboarding
                </h1>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep} of {ONBOARDING_STEPS.length}: {currentStepConfig?.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                AI Assistant
              </Button>
              <Badge variant="secondary">
                {progressPercentage}% Complete
              </Badge>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {/* Step Navigation */}
          <div className="mt-4 flex flex-wrap gap-2">
            {ONBOARDING_STEPS.map((step) => (
              <Button
                key={step.id}
                variant={step.id === currentStep ? "default" : step.id < currentStep ? "secondary" : "outline"}
                size="sm"
                onClick={() => goToStep(step.id)}
                disabled={step.id > currentStep + 1}
                className="flex items-center gap-2"
              >
                {step.id < currentStep && (
                  <CheckCircle className="h-3 w-3" />
                )}
                {step.id === currentStep && (
                  <Clock className="h-3 w-3" />
                )}
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.id}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentStepConfig?.title}
                  {currentStep < ONBOARDING_STEPS.length && (
                    <Badge variant="outline" className="ml-2">
                      Required
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {CurrentStepComponent && (
                  <CurrentStepComponent
                    data={onboardingData}
                    onComplete={handleStepComplete}
                    onNext={() => setCurrentStep(Math.min(currentStep + 1, ONBOARDING_STEPS.length))}
                    onPrevious={() => setCurrentStep(Math.max(currentStep - 1, 1))}
                    isLoading={isLoading}
                    brandSettings={brandSettings}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          {showAIAssistant && (
            <div className="w-80">
              <AIAssistant
                currentStep={currentStep}
                onboardingData={onboardingData}
                onClose={() => setShowAIAssistant(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};