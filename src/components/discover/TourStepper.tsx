import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ShareButton } from './ShareButton';
import { X, ChevronLeft, ChevronRight, Play, Pause, ArrowRight } from 'lucide-react';

interface TourStep {
  title: string;
  content: string;
  image?: string;
  duration?: number; // seconds
}

interface TourStepperProps {
  isOpen: boolean;
  onClose: () => void;
  steps: TourStep[];
  persona: string;
}

export const TourStepper: React.FC<TourStepperProps> = ({
  isOpen,
  onClose,
  steps,
  persona
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const stepDuration = currentStepData?.duration || 10;

  // Auto-advance timer
  useEffect(() => {
    if (!isOpen || !isPlaying || isLastStep) return;

    setTimeRemaining(stepDuration);
    
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCurrentStep((current) => Math.min(current + 1, steps.length - 1));
          return stepDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, isPlaying, isOpen, stepDuration, steps.length, isLastStep]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsPlaying(true);
      setTimeRemaining(stepDuration);
      
      // Analytics
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('lp.persona.demo.open', { persona });
      }
    }
  }, [isOpen, persona, stepDuration]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentStep((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, steps.length]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      // Analytics - demo completed
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('lp.persona.demo.complete', { persona });
      }
      onClose();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  }, [isLastStep, onClose, persona]);

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleStartWorkspace = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.hero.cta', { persona, source: 'demo_finish' });
    }
    
    window.location.href = `/onboarding?persona=${persona}`;
  };

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  if (!currentStepData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-hidden"
        aria-live="polite"
        aria-label={`Demo step ${currentStep + 1} of ${steps.length}`}
      >
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {currentStepData.title}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
              {!isLastStep && (
                <span>
                  {isPlaying ? (
                    <>Auto-advancing in {timeRemaining}s</>
                  ) : (
                    'Paused'
                  )}
                </span>
              )}
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {currentStepData.image && (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <img 
                src={currentStepData.image} 
                alt={currentStepData.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            <p className="text-lg leading-relaxed">{currentStepData.content}</p>
          </div>

          {isLastStep ? (
            /* Finish Screen */
            <div className="space-y-6 pt-4 border-t">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Ready to get started?</h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gold hover:bg-gold-hover text-navy"
                    onClick={handleStartWorkspace}
                  >
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Start workspace
                  </Button>
                  <ShareButton 
                    text={`Check this out — a secure platform to organize everything in one place and keep a record you can trust: ${persona}`}
                    variant="outline"
                    size="lg"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Navigation Controls */
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Button
                variant="ghost"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};