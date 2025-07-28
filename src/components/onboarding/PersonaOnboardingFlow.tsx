import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowRight, Star, Target, Trophy } from 'lucide-react';
import { useRoleContext } from '@/context/RoleContext';
import { toast } from 'sonner';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: () => void;
  href?: string;
  priority: 'high' | 'medium' | 'low';
}

interface PersonaOnboardingProps {
  onComplete?: () => void;
}

export const PersonaOnboardingFlow: React.FC<PersonaOnboardingProps> = ({ onComplete }) => {
  const { getCurrentRole, getCurrentClientTier } = useRoleContext();
  const role = getCurrentRole();
  const tier = getCurrentClientTier();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const onboardingKey = `onboarding-completed-${role}-${tier}`;
    const hasCompleted = localStorage.getItem(onboardingKey);
    
    if (!hasCompleted) {
      setSteps(getOnboardingSteps(role, tier));
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [role, tier]);

  const getOnboardingSteps = (userRole: string, userTier: string): OnboardingStep[] => {
    const baseSteps = {
      client: [
        {
          id: 'welcome',
          title: 'Welcome to Your Family Office',
          description: 'Get an overview of available tools and services',
          completed: false,
          priority: 'high' as const,
        },
        {
          id: 'profile',
          title: 'Complete Your Profile',
          description: 'Help us personalize your experience',
          completed: false,
          href: '/settings',
          priority: 'high' as const,
        },
        {
          id: 'education',
          title: 'Explore Education Center',
          description: 'Discover financial planning resources',
          completed: false,
          href: '/education',
          priority: 'medium' as const,
        }
      ],
      advisor: [
        {
          id: 'welcome',
          title: 'Welcome to Your Advisor Portal',
          description: 'Explore client management and business tools',
          completed: false,
          priority: 'high' as const,
        },
        {
          id: 'clients',
          title: 'Import Your Client List',
          description: 'Add your existing clients to the platform',
          completed: false,
          href: '/advisor/clients',
          priority: 'high' as const,
        },
        {
          id: 'referrals',
          title: 'Set Up Referral Program',
          description: 'Start earning rewards for referrals',
          completed: false,
          href: '/advisor/referrals',
          priority: 'medium' as const,
        }
      ],
      accountant: [
        {
          id: 'welcome',
          title: 'Welcome to Your Tax & Accounting Hub',
          description: 'Set up your professional practice dashboard',
          completed: false,
          priority: 'high' as const,
        },
        {
          id: 'tax-setup',
          title: 'Configure Tax Services',
          description: 'Set up your tax preparation workflow',
          completed: false,
          href: '/tax-planning',
          priority: 'high' as const,
        }
      ],
      consultant: [
        {
          id: 'welcome',
          title: 'Welcome to Your Consulting Platform',
          description: 'Discover tools for strategic advisory services',
          completed: false,
          priority: 'high' as const,
        },
        {
          id: 'projects',
          title: 'Create Your First Project',
          description: 'Set up project management for clients',
          completed: false,
          priority: 'high' as const,
        }
      ],
      attorney: [
        {
          id: 'welcome',
          title: 'Welcome to Your Legal Services Hub',
          description: 'Access estate planning and legal document tools',
          completed: false,
          priority: 'high' as const,
        },
        {
          id: 'estate',
          title: 'Explore Estate Planning Tools',
          description: 'Review comprehensive estate planning resources',
          completed: false,
          href: '/estate-planning',
          priority: 'high' as const,
        }
      ],
      admin: [
        {
          id: 'welcome',
          title: 'Welcome to Admin Console',
          description: 'Configure platform settings and user management',
          completed: false,
          priority: 'high' as const,
        },
        {
          id: 'users',
          title: 'Set Up User Management',
          description: 'Configure roles and permissions',
          completed: false,
          href: '/admin-portal',
          priority: 'high' as const,
        }
      ]
    };

    // Add premium-specific steps for clients
    if (userRole === 'client' && userTier === 'premium') {
      baseSteps.client.push({
        id: 'premium',
        title: 'Explore Premium Features',
        description: 'Unlock advanced wealth management tools',
        completed: false,
        href: '/wealth/premium',
        priority: 'medium' as const,
      });
    }

    return baseSteps[userRole as keyof typeof baseSteps] || baseSteps.client;
  };

  const completeStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const dismissOnboarding = () => {
    const onboardingKey = `onboarding-completed-${role}-${tier}`;
    localStorage.setItem(onboardingKey, 'true');
    setIsVisible(false);
    onComplete?.();
    toast.success('Onboarding completed! You can access these features anytime.');
  };

  const progress = (steps.filter(s => s.completed).length / steps.length) * 100;

  if (!isVisible || steps.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Getting Started
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={dismissOnboarding}
            >
              Skip Tour
            </Button>
          </div>
          <CardDescription>
            Let's get you set up with the tools you need most
          </CardDescription>
          <Progress value={progress} className="mt-2" />
          <p className="text-sm text-muted-foreground">
            {steps.filter(s => s.completed).length} of {steps.length} completed
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`p-4 rounded-lg border transition-all ${
                index === currentStep 
                  ? 'border-primary bg-primary/5' 
                  : step.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-muted'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{step.title}</h3>
                    {step.priority === 'high' && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                  
                  {!step.completed && index === currentStep && (
                    <div className="mt-3 flex gap-2">
                      {step.href ? (
                        <Button 
                          size="sm" 
                          onClick={() => {
                            completeStep(step.id);
                            // In a real app, navigate to step.href
                            toast.success(`${step.title} completed!`);
                          }}
                          className="flex items-center gap-2"
                        >
                          Get Started
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => completeStep(step.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {progress === 100 && (
            <div className="text-center py-6">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Congratulations!</h3>
              <p className="text-muted-foreground mb-4">
                You've completed the getting started tour
              </p>
              <Button onClick={dismissOnboarding}>
                Continue to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};