import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Sparkles, 
  CheckCircle, 
  ChevronRight, 
  Users, 
  CreditCard, 
  Target, 
  UserCheck, 
  LayoutDashboard,
  Info,
  X,
  Shield
} from 'lucide-react';
import { useCelebration } from '@/hooks/useCelebration';

interface PremiumOnboardingFlowProps {
  onComplete: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  optional: boolean;
}

export const PremiumOnboardingFlow: React.FC<PremiumOnboardingFlowProps> = ({ onComplete }) => {
  const { triggerCelebration, CelebrationComponent } = useCelebration();
  const [currentStep, setCurrentStep] = useState(0);
  const [showFiduciaryPopup, setShowFiduciaryPopup] = useState(false);
  
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'household',
      title: 'Set up household',
      description: 'Add family members (optional)',
      icon: Users,
      completed: false,
      optional: true
    },
    {
      id: 'accounts',
      title: 'Link accounts',
      description: 'Connect via Plaid or add manually',
      icon: CreditCard,
      completed: false,
      optional: true
    },
    {
      id: 'goals',
      title: 'Set goals and priorities',
      description: 'Define your financial objectives',
      icon: Target,
      completed: false,
      optional: true
    },
    {
      id: 'professionals',
      title: 'Choose trusted professionals',
      description: 'Browse experts or skip for now',
      icon: UserCheck,
      completed: false,
      optional: true
    },
    {
      id: 'dashboard',
      title: 'See Your Dashboard',
      description: 'Complete setup and explore',
      icon: LayoutDashboard,
      completed: false,
      optional: false
    }
  ]);

  const progress = (steps.filter(step => step.completed).length / steps.length) * 100;

  const markStepCompleted = useCallback((stepId: string) => {
    setSteps(prev => {
      const newSteps = prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      );
      
      // Trigger celebration for milestone completion
      const completedCount = newSteps.filter(s => s.completed).length;
      if (completedCount === 2 || completedCount === 4) {
        triggerCelebration('milestone', `Great progress! ${completedCount} steps completed!`);
      }
      
      return newSteps;
    });
  }, [triggerCelebration]);

  const handleStepClick = (stepId: string, index: number) => {
    markStepCompleted(stepId);
    
    if (stepId === 'dashboard') {
      triggerCelebration('success', 'Welcome to your Family Office Dashboard!');
      setTimeout(() => onComplete(), 2000);
    } else {
      setCurrentStep(Math.min(index + 1, steps.length - 1));
    }
  };

  const handleFinish = () => {
    triggerCelebration('success', 'Setup complete!');
    setTimeout(() => onComplete(), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 relative">
      {CelebrationComponent}
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-gold" />
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Welcome to the Family Office Experience
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            You're in control. We're here to help.
          </p>
          
          {/* Fiduciary Duty Tooltip */}
          <TooltipProvider>
            <Tooltip open={showFiduciaryPopup} onOpenChange={setShowFiduciaryPopup}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-accent hover:text-accent/80 touch-target"
                  onClick={() => setShowFiduciaryPopup(!showFiduciaryPopup)}
                  aria-label="Learn about our fiduciary duty principles"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Our Fiduciary Duty Principles™
                  <Info className="h-4 w-4 ml-2" />
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="max-w-sm p-4 bg-card border border-border shadow-lg"
                sideOffset={8}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">Our Fiduciary Duty Principles™</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFiduciaryPopup(false)}
                    className="h-6 w-6 p-0 touch-target"
                    aria-label="Close fiduciary duty information"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Always your best interest, always transparent. No commissions.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Setup Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-3 bg-muted" />
        </motion.div>

        {/* Steps Checklist */}
        <Card className="premium-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              Let's get you set up in just a few steps
            </h2>
            
            <div className="space-y-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = index === currentStep;
                const isAccessible = index <= currentStep;
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-4 rounded-lg border transition-all duration-300 ${
                      step.completed 
                        ? 'bg-success/10 border-success/20' 
                        : isActive 
                        ? 'bg-accent/5 border-accent/20' 
                        : 'bg-muted/5 border-border'
                    }`}
                  >
                    <Button
                      onClick={() => isAccessible && handleStepClick(step.id, index)}
                      disabled={!isAccessible}
                      variant="ghost"
                      className={`w-full justify-start p-0 h-auto touch-target ${
                        !isAccessible ? 'opacity-50 cursor-not-allowed' : 'hover:bg-transparent'
                      }`}
                      aria-label={`${step.title} - ${step.completed ? 'completed' : 'not completed'}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full transition-all duration-300 ${
                            step.completed 
                              ? 'bg-success text-success-foreground' 
                              : isActive 
                              ? 'bg-accent text-accent-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {step.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <IconComponent className="h-5 w-5" />
                            )}
                          </div>
                          
                          <div className="text-left">
                            <h3 className="font-semibold text-lg text-foreground">
                              {step.title}
                              {step.optional && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  Optional
                                </Badge>
                              )}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {step.description}
                            </p>
                          </div>
                        </div>
                        
                        {!step.completed && isAccessible && (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Marketplace Upsell */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 rounded-lg bg-gradient-to-r from-accent/10 to-emerald/10 border border-accent/20"
            >
              <h3 className="font-semibold text-foreground mb-2">
                Discover curated solutions & experts
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Always at your pace. No sales pressure. Learn, compare, choose.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="touch-target border-accent text-accent hover:bg-accent/10"
              >
                Explore Marketplace
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <AnimatePresence>
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <GoldButton
                onClick={handleFinish}
                className="flex items-center gap-2 px-8 py-4 text-lg"
              >
                <LayoutDashboard className="h-5 w-5" />
                Enter Your Dashboard
              </GoldButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};