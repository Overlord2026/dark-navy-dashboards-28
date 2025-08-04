import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, User, Award, Target, Clock, Shield, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  optional?: boolean;
}

interface OnboardingStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSteps?: OnboardingStep[];
}

const OnboardingStepsModal: React.FC<OnboardingStepsModalProps> = ({ 
  isOpen, 
  onClose,
  initialSteps
}) => {
  const navigate = useNavigate();
  
  const defaultSteps: OnboardingStep[] = [
    {
      id: 'review-profile',
      title: 'Review your imported profile',
      description: 'Auto-filled from LinkedIn',
      icon: <User className="w-5 h-5" />,
      completed: true
    },
    {
      id: 'credentials',
      title: 'Add additional credentials or licenses',
      description: 'Optional - Enhance your profile',
      icon: <Award className="w-5 h-5" />,
      completed: false,
      optional: true
    },
    {
      id: 'focus',
      title: 'Select your focus',
      description: 'Advisor, Attorney, CPA, Consultant, etc.',
      icon: <Target className="w-5 h-5" />,
      completed: false
    },
    {
      id: 'availability',
      title: 'Set your availability/preferred contact',
      description: 'How clients can reach you',
      icon: <Clock className="w-5 h-5" />,
      completed: false
    },
    {
      id: 'privacy',
      title: 'Confirm privacy and communication preferences',
      description: 'Control your data and notifications',
      icon: <Shield className="w-5 h-5" />,
      completed: false
    },
    {
      id: 'explore',
      title: 'Explore premium features or book a welcome call',
      description: 'Get the most out of your membership',
      icon: <Rocket className="w-5 h-5" />,
      completed: false,
      optional: true
    }
  ];

  const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps || defaultSteps);

  const toggleStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const handleFinish = () => {
    onClose();
    navigate('/professional-dashboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Complete Your Professional Setup
          </DialogTitle>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              {completedSteps} of {totalSteps} steps completed
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                step.completed ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : 'border-border'
              }`}
              onClick={() => toggleStep(step.id)}
            >
              <div className="mt-1">
                {step.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-primary">{step.icon}</div>
                  <h3 className={`font-semibold ${step.completed ? 'text-green-700 dark:text-green-300' : ''}`}>
                    Step {index + 1}: {step.title}
                  </h3>
                  {step.optional && (
                    <Badge variant="secondary" className="text-xs">
                      Optional
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-6 border-t">
          <Button 
            onClick={handleFinish}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            size="lg"
          >
            <Rocket className="w-5 h-5 mr-2" />
            🚀 Finish & Explore Marketplace
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingStepsModal;