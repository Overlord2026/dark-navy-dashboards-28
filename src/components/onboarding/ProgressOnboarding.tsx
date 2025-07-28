import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Circle,
  ArrowRight,
  Star,
  Target,
  Trophy,
  Gift,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useEventTracking } from '@/hooks/useEventTracking';
import { toast } from 'sonner';
import { Celebration } from '@/components/ConfettiAnimation';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  quickWin: string;
  completed: boolean;
  action?: () => void;
  href?: string;
  priority: 'high' | 'medium' | 'low';
  timeEstimate: string;
  reward?: string;
}

interface ProgressOnboardingProps {
  onComplete?: () => void;
  role?: string;
}

export const ProgressOnboarding: React.FC<ProgressOnboardingProps> = ({ 
  onComplete, 
  role: propRole 
}) => {
  const { userProfile } = useUser();
  const { trackEvent } = useEventTracking();
  const role = propRole || userProfile?.role || 'client';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);

  useEffect(() => {
    setSteps(getEnhancedOnboardingSteps(role));
    trackEvent('onboarding', 'onboarding_started', { role });
  }, [role, trackEvent]);

  const getEnhancedOnboardingSteps = (userRole: string): OnboardingStep[] => {
    const baseSteps = {
      client: [
        {
          id: 'welcome',
          title: 'Welcome to Your Family Office',
          description: 'Discover the wealth management tools at your fingertips',
          quickWin: 'See your personalized dashboard',
          completed: false,
          priority: 'high' as const,
          timeEstimate: '2 min',
          reward: 'Unlock dashboard insights'
        },
        {
          id: 'profile',
          title: 'Set Up Your Financial Profile',
          description: 'Help us personalize your wealth management experience',
          quickWin: 'Get custom investment recommendations',
          completed: false,
          href: '/settings',
          priority: 'high' as const,
          timeEstimate: '5 min',
          reward: '$500 in fee credits'
        },
        {
          id: 'goals',
          title: 'Define Your Financial Goals',
          description: 'Set targets for retirement, education, and major purchases',
          quickWin: 'See your progress tracking dashboard',
          completed: false,
          href: '/planning/goals',
          priority: 'high' as const,
          timeEstimate: '8 min',
          reward: 'Personalized roadmap'
        },
        {
          id: 'accounts',
          title: 'Connect Your Accounts',
          description: 'Link bank accounts and investments for complete visibility',
          quickWin: 'Real-time net worth tracking',
          completed: false,
          href: '/accounts',
          priority: 'medium' as const,
          timeEstimate: '10 min',
          reward: 'Automated portfolio insights'
        },
        {
          id: 'advisor',
          title: 'Meet Your Advisory Team',
          description: 'Schedule your first strategy session',
          quickWin: 'Book your complimentary consultation',
          completed: false,
          href: '/advisory',
          priority: 'medium' as const,
          timeEstimate: '3 min',
          reward: 'Free financial review ($500 value)'
        }
      ],
      advisor: [
        {
          id: 'welcome',
          title: 'Welcome to Your Advisor Hub',
          description: 'Explore powerful tools to grow your practice',
          quickWin: 'Tour your new workspace',
          completed: false,
          priority: 'high' as const,
          timeEstimate: '3 min',
          reward: 'Advanced analytics access'
        },
        {
          id: 'practice',
          title: 'Set Up Your Practice Profile',
          description: 'Showcase your expertise and services',
          quickWin: 'Professional profile goes live',
          completed: false,
          href: '/advisor/profile',
          priority: 'high' as const,
          timeEstimate: '10 min',
          reward: 'Lead generation boost'
        },
        {
          id: 'clients',
          title: 'Import Your Client Portfolio',
          description: 'Seamlessly migrate your existing client base',
          quickWin: 'Centralized client management',
          completed: false,
          href: '/advisor/clients',
          priority: 'high' as const,
          timeEstimate: '15 min',
          reward: 'Free data migration'
        },
        {
          id: 'referrals',
          title: 'Activate Referral Engine',
          description: 'Start earning from day one with our referral program',
          quickWin: 'Generate your first referral link',
          completed: false,
          href: '/advisor/referrals',
          priority: 'medium' as const,
          timeEstimate: '5 min',
          reward: '$500 referral bonus'
        }
      ],
      accountant: [
        {
          id: 'welcome',
          title: 'Welcome to Your Tax & Accounting Suite',
          description: 'Streamline your practice with integrated workflows',
          quickWin: 'See tax automation in action',
          completed: false,
          priority: 'high' as const,
          timeEstimate: '3 min',
          reward: 'Tax workflow automation'
        },
        {
          id: 'practice',
          title: 'Configure Your Practice Settings',
          description: 'Set up tax workflows and client communication',
          quickWin: 'Automated client portals',
          completed: false,
          href: '/tax/setup',
          priority: 'high' as const,
          timeEstimate: '12 min',
          reward: 'Premium templates library'
        },
        {
          id: 'integrations',
          title: 'Connect Your Tax Software',
          description: 'Integrate with existing tools for seamless workflows',
          quickWin: 'Bi-directional data sync',
          completed: false,
          href: '/integrations',
          priority: 'medium' as const,
          timeEstimate: '8 min',
          reward: 'Free integration setup'
        }
      ]
    };

    return baseSteps[userRole as keyof typeof baseSteps] || baseSteps.client;
  };

  const completeStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
    
    // Track completion
    trackEvent('onboarding', `${stepId}_completed`, { role });
    
    // Check for milestones
    const completedCount = steps.filter(s => s.completed).length + 1;
    const milestones = [
      { count: 1, title: 'Quick Starter', reward: 'Welcome bonus unlocked!' },
      { count: 3, title: 'Getting Started', reward: 'Progress champion!' },
      { count: 5, title: 'Onboarding Complete', reward: 'Full access unlocked!' }
    ];
    
    const milestone = milestones.find(m => m.count === completedCount);
    if (milestone && !completedMilestones.includes(milestone.title)) {
      setCompletedMilestones(prev => [...prev, milestone.title]);
      setShowCelebration(true);
      toast.success(`🎉 ${milestone.title}! ${milestone.reward}`);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    
    // Move to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const progress = (steps.filter(s => s.completed).length / steps.length) * 100;
  const timeRemaining = steps
    .filter(s => !s.completed)
    .reduce((total, step) => total + parseInt(step.timeEstimate), 0);

  return (
    <>
      <Celebration trigger={showCelebration} />
      
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Quick Setup Guide</CardTitle>
                <CardDescription>
                  Get the most out of your platform in just {timeRemaining} minutes
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              <Target className="h-3 w-3 mr-1" />
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          
          <div className="space-y-3">
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{steps.filter(s => s.completed).length} of {steps.length} completed</span>
              <span>{timeRemaining} min remaining</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                index === currentStep && !step.completed
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                  : step.completed 
                    ? 'border-green-200 bg-green-50/50' 
                    : 'border-muted bg-muted/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {step.completed ? (
                    <div className="relative">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
                    </div>
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <div className="flex gap-2">
                      {step.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Essential
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {step.timeEstimate}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Quick Win: {step.quickWin}
                    </span>
                  </div>
                  
                  {step.reward && (
                    <div className="flex items-center gap-2 mb-3">
                      <Gift className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">{step.reward}</span>
                    </div>
                  )}
                  
                  {!step.completed && index === currentStep && (
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => completeStep(step.id)}
                        className="flex items-center gap-2"
                      >
                        {step.href ? 'Get Started' : 'Mark Complete'}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      {index > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        >
                          Previous
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {progress === 100 && (
            <div className="text-center py-8 border-t mt-6">
              <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">🎉 Setup Complete!</h3>
              <p className="text-muted-foreground mb-6">
                You're ready to unlock the full potential of your family office platform
              </p>
              <div className="flex gap-3 justify-center">
                <Button size="lg" onClick={onComplete}>
                  Explore Your Dashboard
                </Button>
                <Button variant="outline" size="lg">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};