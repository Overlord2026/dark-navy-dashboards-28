
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAnalyticsTracking } from '@/hooks/useAnalytics';
import { CheckCircle, Clock, User, FileText, Settings, Briefcase } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  current: boolean;
}

export function AdvisorOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Add your professional information and credentials',
      icon: <User className="h-4 w-4" />,
      completed: false,
      current: true
    },
    {
      id: 'documents',
      title: 'Upload Documents',
      description: 'Add compliance documents and certifications',
      icon: <FileText className="h-4 w-4" />,
      completed: false,
      current: false
    },
    {
      id: 'branding',
      title: 'Portal Branding',
      description: 'Customize your client portal appearance',
      icon: <Settings className="h-4 w-4" />,
      completed: false,
      current: false
    },
    {
      id: 'services',
      title: 'Service Setup',
      description: 'Configure your service offerings and pricing',
      icon: <Briefcase className="h-4 w-4" />,
      completed: false,
      current: false
    }
  ]);

  const { trackOnboardingStep } = useAnalyticsTracking();

  useEffect(() => {
    // Track when advisor onboarding starts
    trackOnboardingStep('advisor_onboarding_started');
  }, [trackOnboardingStep]);

  const handleStepComplete = (stepIndex: number) => {
    const step = steps[stepIndex];
    
    // Track step completion
    trackOnboardingStep(`advisor_${step.id}_completed`, true);
    
    setSteps(prev => prev.map((s, i) => ({
      ...s,
      completed: i <= stepIndex,
      current: i === stepIndex + 1
    })));
    
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
      
      // Track next step started
      const nextStep = steps[stepIndex + 1];
      trackOnboardingStep(`advisor_${nextStep.id}_started`);
    } else {
      // All steps completed
      trackOnboardingStep('advisor_onboarding_completed', true);
    }
  };

  const progress = (steps.filter(s => s.completed).length / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Your Advisor Portal</h1>
        <p className="text-muted-foreground">Let's get you set up in just a few quick steps</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Onboarding Progress</CardTitle>
              <CardDescription>
                Complete these steps to activate your full advisor experience
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {steps.filter(s => s.completed).length} of {steps.length} complete
            </Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {steps.map((step, index) => (
          <Card 
            key={step.id} 
            className={`transition-all ${
              step.current ? 'ring-2 ring-primary' : ''
            } ${step.completed ? 'bg-green-50 border-green-200' : ''}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    step.completed 
                      ? 'bg-green-100 text-green-600' 
                      : step.current 
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.completed ? <CheckCircle className="h-4 w-4" /> : step.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {step.completed ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  ) : step.current ? (
                    <Button 
                      onClick={() => handleStepComplete(index)}
                      size="sm"
                    >
                      Complete Step
                    </Button>
                  ) : (
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {progress === 100 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Congratulations! Your setup is complete.
            </h3>
            <p className="text-green-700 mb-4">
              You're all set to start managing your clients and growing your practice.
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
