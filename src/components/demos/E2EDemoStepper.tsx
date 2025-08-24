import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from '@/lib/analytics';

export interface E2EStep {
  id: string;
  title: string;
  description: string;
  toolKey: string;
  route: string;
  seedFunction: () => Promise<void>;
  duration: number; // seconds
}

export interface E2EDemo {
  id: string;
  title: string;
  description: string;
  steps: E2EStep[];
  finalRoute: string;
}

interface E2EDemoStepperProps {
  demo: E2EDemo;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const E2EDemoStepper: React.FC<E2EDemoStepperProps> = ({
  demo,
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (isOpen) {
      analytics.track('demo.e2e.start', { name: demo.id });
    }
  }, [isOpen, demo.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, timeRemaining]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleStart = async () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    const firstStep = demo.steps[0];
    await executeStep(firstStep);
    setTimeRemaining(firstStep.duration);
  };

  const handleNext = async () => {
    const nextStepIndex = currentStep + 1;
    
    if (nextStepIndex >= demo.steps.length) {
      // Demo complete - navigate to final route
      window.location.href = demo.finalRoute;
      analytics.track('demo.e2e.complete', { name: demo.id });
      onComplete();
      return;
    }

    setCurrentStep(nextStepIndex);
    const nextStep = demo.steps[nextStepIndex];
    await executeStep(nextStep);
    setTimeRemaining(nextStep.duration);
  };

  const handleSkip = () => {
    setTimeRemaining(0);
    handleNext();
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
    setTimeRemaining(0);
    onClose();
  };

  const executeStep = async (step: E2EStep) => {
    try {
      analytics.track('demo.e2e.step', { name: demo.id, toolKey: step.toolKey });
      
      // Execute the seeder function
      await step.seedFunction();
      
      // Navigate to the tool if not the final step
      if (currentStep < demo.steps.length - 1) {
        window.location.href = step.route;
      }
    } catch (error) {
      console.error('Error executing demo step:', error);
    }
  };

  const progress = ((currentStep + 1) / demo.steps.length) * 100;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="focus-trap"
          role="dialog"
          aria-labelledby="demo-title"
          aria-describedby="demo-description"
        >
          <Card className="w-full max-w-lg bg-background border shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 id="demo-title" className="text-xl font-semibold">
                  {demo.title}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p id="demo-description" className="text-sm text-muted-foreground mb-6">
                {demo.description}
              </p>

              {!isPlaying ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {demo.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        <span>{step.title}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={handleStart}
                    className="w-full focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Demo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Step {currentStep + 1} of {demo.steps.length}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {timeRemaining}s
                      </span>
                    </div>
                    <Progress value={progress} className="mb-2" />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-medium mb-1">
                      {demo.steps[currentStep]?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {demo.steps[currentStep]?.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePause}
                      className="focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      {isPaused ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Pause className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSkip}
                      className="focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNext}
                      className="flex-1 focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};