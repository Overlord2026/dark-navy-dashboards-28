import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ArrowRight, ArrowLeft, User, Users, Award, Shield } from 'lucide-react';
import { NILPersonaType, OnboardingFlow } from '@/types/nil';
import { createOnboardingFlow, updateStepCompletion, isOnboardingComplete } from '@/lib/nil/onboarding';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { SportDetailsStep } from './steps/SportDetailsStep';
import { PlaidConnectionStep } from './steps/PlaidConnectionStep';
import { DocumentUploadStep } from './steps/DocumentUploadStep';
import { InviteTeamStep } from './steps/InviteTeamStep';
import { DashboardTourStep } from './steps/DashboardTourStep';

interface NILOnboardingWizardProps {
  personaType: NILPersonaType;
  onComplete: (flow: OnboardingFlow) => void;
  onExit?: () => void;
}

const PERSONA_CONFIG = {
  athlete: {
    icon: User,
    title: 'Athlete Onboarding',
    subtitle: 'Set up your NIL profile and tools',
    color: 'from-blue-500 to-purple-600'
  },
  family: {
    icon: Users,
    title: 'Family Member Setup',
    subtitle: 'Connect with your athlete and set permissions',
    color: 'from-green-500 to-blue-500'
  },
  advisor: {
    icon: Award,
    title: 'Advisor Setup',
    subtitle: 'Configure your professional tools and access',
    color: 'from-purple-500 to-pink-500'
  },
  coach: {
    icon: Award,
    title: 'Coach Setup',
    subtitle: 'Set up coaching tools and athlete access',
    color: 'from-orange-500 to-red-500'
  },
  admin: {
    icon: Shield,
    title: 'Admin Setup',
    subtitle: 'Configure administrative access and tools',
    color: 'from-red-500 to-purple-600'
  },
  brand: {
    icon: Award,
    title: 'Brand Setup',
    subtitle: 'Set up your brand profile and marketplace access',
    color: 'from-yellow-500 to-orange-500'
  }
};

export function NILOnboardingWizard({ personaType, onComplete, onExit }: NILOnboardingWizardProps) {
  const [flow, setFlow] = useState<OnboardingFlow>(() => createOnboardingFlow(personaType));
  const [isLoading, setIsLoading] = useState(false);

  const config = PERSONA_CONFIG[personaType];
  const IconComponent = config.icon;
  const currentStep = flow.steps[flow.currentStep];

  const handleStepComplete = async (stepId: string, data?: any) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedFlow = updateStepCompletion(flow, stepId, true);
    setFlow(updatedFlow);
    
    // Store step data (in real app, this would be API call)
    if (data) {
      localStorage.setItem(`nil_step_${stepId}`, JSON.stringify(data));
    }
    
    setIsLoading(false);
    
    // Check if onboarding is complete
    if (isOnboardingComplete(updatedFlow)) {
      onComplete(updatedFlow);
    }
  };

  const goToPreviousStep = () => {
    if (flow.currentStep > 0) {
      setFlow(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const goToNextStep = () => {
    if (flow.currentStep < flow.steps.length - 1) {
      setFlow(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const renderStepComponent = () => {
    if (!currentStep) return null;

    const stepProps = {
      onComplete: (data?: any) => handleStepComplete(currentStep.id, data),
      isLoading
    };

    switch (currentStep.component) {
      case 'PersonalInfoStep':
        return <PersonalInfoStep {...stepProps} />;
      case 'SportDetailsStep':
        return <SportDetailsStep {...stepProps} />;
      case 'PlaidConnectionStep':
        return <PlaidConnectionStep {...stepProps} />;
      case 'DocumentUploadStep':
        return <DocumentUploadStep {...stepProps} />;
      case 'InviteTeamStep':
        return <InviteTeamStep {...stepProps} />;
      case 'DashboardTourStep':
        return <DashboardTourStep {...stepProps} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Step component not implemented yet</p>
            <Button onClick={() => handleStepComplete(currentStep.id)}>
              Mark as Complete
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className={`bg-gradient-to-r ${config.color} text-white rounded-t-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconComponent className="h-8 w-8" />
                <div>
                  <CardTitle className="text-2xl">{config.title}</CardTitle>
                  <p className="text-white/90">{config.subtitle}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">
                  <Clock className="h-4 w-4 inline mr-1" />
                  ~{flow.estimatedTimeMinutes} minutes
                </div>
                <Badge variant="secondary" className="mt-1">
                  Step {flow.currentStep + 1} of {flow.steps.length}
                </Badge>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <Progress value={flow.completionPercentage} className="h-2" />
              <div className="flex justify-between text-sm mt-2 opacity-90">
                <span>Progress</span>
                <span>{flow.completionPercentage}% Complete</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Steps Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Onboarding Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flow.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    step.completed
                      ? 'border-green-500 bg-green-50'
                      : index === flow.currentStep
                      ? 'border-primary bg-primary/5'
                      : 'border-muted bg-muted/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className={`h-5 w-5 rounded-full border-2 ${
                        index === flow.currentStep ? 'border-primary bg-primary' : 'border-muted'
                      }`} />
                    )}
                    <span className="font-medium text-sm">{step.title}</span>
                    {step.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        {currentStep && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  {flow.currentStep + 1}
                </span>
                {currentStep.title}
                {currentStep.required && (
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                )}
              </CardTitle>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </CardHeader>
            <CardContent>
              {renderStepComponent()}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={flow.currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {onExit && (
                  <Button variant="ghost" onClick={onExit}>
                    Exit
                  </Button>
                )}
                
                {currentStep && !currentStep.completed && !currentStep.required && (
                  <Button
                    variant="outline"
                    onClick={goToNextStep}
                    disabled={flow.currentStep >= flow.steps.length - 1}
                  >
                    Skip
                  </Button>
                )}

                <Button
                  onClick={goToNextStep}
                  disabled={flow.currentStep >= flow.steps.length - 1 || !currentStep?.completed}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}