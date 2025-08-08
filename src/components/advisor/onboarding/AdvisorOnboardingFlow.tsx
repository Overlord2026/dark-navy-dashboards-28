import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Settings, 
  Link2, 
  Shield, 
  Users, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'in-progress' | 'completed';
  actions: {
    primary: string;
    secondary?: string;
  };
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'import-clients',
    title: 'Import Clients',
    description: 'Upload your existing client list via CSV, connect LinkedIn, or add manually',
    icon: <Upload className="h-5 w-5" />,
    status: 'pending',
    actions: {
      primary: 'Upload CSV',
      secondary: 'Connect LinkedIn'
    }
  },
  {
    id: 'personalize-dashboard',
    title: 'Personalize Dashboard',
    description: 'Select your favorite tools, modules, and quick links for easy access',
    icon: <Settings className="h-5 w-5" />,
    status: 'pending',
    actions: {
      primary: 'Customize Dashboard',
      secondary: 'Use Default Setup'
    }
  },
  {
    id: 'setup-integrations',
    title: 'Set Up Integrations',
    description: 'Connect Plaid, Stripe, Twilio/SMS, Zoom/Google Meet, OpenAI, and Calendar',
    icon: <Link2 className="h-5 w-5" />,
    status: 'pending',
    actions: {
      primary: 'Connect Services',
      secondary: 'Skip for Now'
    }
  },
  {
    id: 'configure-compliance',
    title: 'Configure Compliance',
    description: 'Upload your ADV, set compliance reminders, and import CE records',
    icon: <Shield className="h-5 w-5" />,
    status: 'pending',
    actions: {
      primary: 'Upload ADV',
      secondary: 'Manual Setup'
    }
  },
  {
    id: 'invite-staff',
    title: 'Invite Staff & Set Roles',
    description: 'Add team members and assign appropriate permissions',
    icon: <Users className="h-5 w-5" />,
    status: 'pending',
    actions: {
      primary: 'Add Team Member',
      secondary: 'Skip for Now'
    }
  },
  {
    id: 'explore-demo',
    title: 'Explore Demo/Trial Features',
    description: 'Try SWAG Lead Score™, Demo AI Copilot, and test the Proposal Generator',
    icon: <Play className="h-5 w-5" />,
    status: 'pending',
    actions: {
      primary: 'Start Demo',
      secondary: 'Watch Tutorial'
    }
  }
];

interface AdvisorOnboardingFlowProps {
  onComplete: () => void;
  onStepComplete: (stepId: string) => void;
}

export function AdvisorOnboardingFlow({ onComplete, onStepComplete }: AdvisorOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(onboardingSteps);

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const handleStepComplete = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status: 'completed' as const } : step
    ));
    onStepComplete(stepId);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-primary" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Get Your Practice Set Up</h2>
          <Badge variant="outline">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{completedSteps} of {steps.length} completed</span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Steps Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <Card 
            key={step.id} 
            className={`cursor-pointer transition-colors ${
              index === currentStep 
                ? 'border-primary bg-primary/5' 
                : step.status === 'completed'
                ? 'border-green-200 bg-green-50'
                : 'border-border'
            }`}
            onClick={() => setCurrentStep(index)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {step.icon}
                  <CardTitle className="text-sm">{step.title}</CardTitle>
                </div>
                {getStatusIcon(step.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs">{step.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Step Detail */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center gap-3">
            {currentStepData.icon}
            <div>
              <CardTitle>{currentStepData.title}</CardTitle>
              <CardDescription>{currentStepData.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step-specific content would go here */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">
              Complete this step to continue setting up your advisor practice.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => handleStepComplete(currentStepData.id)}
                className="gap-2"
              >
                {currentStepData.actions.primary}
              </Button>
              {currentStepData.actions.secondary && (
                <Button 
                  variant="outline"
                  onClick={() => handleStepComplete(currentStepData.id)}
                >
                  {currentStepData.actions.secondary}
                </Button>
              )}
            </div>
          </div>

          {/* Step-specific tips */}
          <div className="text-sm text-muted-foreground">
            <strong>Pro Tip:</strong> {getStepTip(currentStepData.id)}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button 
          onClick={handleNext}
          className="gap-2"
        >
          {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <Card className="bg-accent/20 border-accent/40">
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" size="sm">
              Watch Setup Video
            </Button>
            <Button variant="outline" size="sm">
              Book Concierge Demo
            </Button>
            <Button variant="outline" size="sm">
              Chat with Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getStepTip(stepId: string): string {
  const tips: Record<string, string> = {
    'import-clients': 'CSV imports save hours of manual entry. Include columns for name, email, phone, and any notes.',
    'personalize-dashboard': 'Your most-used tools should be visible without scrolling. You can always change this later.',
    'setup-integrations': 'Plaid and Stripe integrations unlock powerful portfolio and billing features.',
    'configure-compliance': 'Upload your current ADV to automatically populate compliance calendars and requirements.',
    'invite-staff': 'Set granular permissions to control what team members can see and edit.',
    'explore-demo': 'Try the demo features with sample data to see how they work before using with real clients.'
  };
  
  return tips[stepId] || 'Take your time with each step to ensure proper setup.';
}