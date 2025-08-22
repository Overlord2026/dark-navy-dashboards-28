import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  ArrowRight,
  Share
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShareButton } from './ShareButton';

interface DemoStep {
  title: string;
  content: string;
  image: string;
  duration: number;
}

interface Demo {
  id: string;
  title: string;
  persona?: string;
  segment?: string;
  category?: string;
  description: string;
  shareMessage: string;
  steps: DemoStep[];
}

interface TourStepperProps {
  demo: Demo;
  isOpen: boolean;
  onClose: () => void;
}

export const TourStepper: React.FC<TourStepperProps> = ({ demo, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const isLastStep = currentStep === demo.steps.length - 1;
  const currentStepData = demo.steps[currentStep];

  // Auto-advance timer
  useEffect(() => {
    if (!isOpen || !isPlaying || isLastStep) return;

    const stepDuration = currentStepData?.duration || 10000;
    const interval = 100; // Update every 100ms for smooth progress
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const progressPercent = (elapsed / stepDuration) * 100;
      setProgress(progressPercent);
      setTimeRemaining(Math.ceil((stepDuration - elapsed) / 1000));

      if (elapsed >= stepDuration) {
        handleNext();
      }
    }, interval);

    return () => {
      clearInterval(timer);
      setProgress(0);
      setTimeRemaining(0);
    };
  }, [currentStep, isPlaying, isOpen, isLastStep, currentStepData?.duration]);

  // Reset when demo changes or opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsPlaying(true);
      setProgress(0);
      
      // Analytics
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('lp.persona.demo.open', { 
          demoId: demo.id,
          persona: demo.persona,
          segment: demo.segment,
          category: demo.category
        });
      }
    }
  }, [isOpen, demo.id, demo.persona, demo.segment, demo.category]);

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
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the dialog content for screen readers
      const dialogContent = document.querySelector('[role="dialog"]');
      if (dialogContent) {
        (dialogContent as HTMLElement).focus();
      }
    }
  }, [isOpen, currentStep]);

  const handleNext = useCallback(() => {
    if (isLastStep) return;
    setCurrentStep(prev => prev + 1);
    setProgress(0);
  }, [isLastStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setProgress(0);
    }
  }, [currentStep]);

  const handleStartWorkspace = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.persona.demo.complete', { 
        demoId: demo.id,
        persona: demo.persona,
        segment: demo.segment,
        category: demo.category,
        action: 'start_workspace'
      });
    }

    onClose();
    navigate('/onboarding', { 
      state: { 
        persona: demo.persona,
        segment: demo.segment,
        fromDemo: demo.id
      }
    });
  };

  const handleShare = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.persona.demo.complete', { 
        demoId: demo.id,
        persona: demo.persona,
        segment: demo.segment,
        category: demo.category,
        action: 'share'
      });
    }
  };

  if (!isOpen || !demo.steps.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl w-full h-[90vh] p-0 gap-0"
        aria-labelledby="demo-title"
        aria-describedby="demo-description"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 id="demo-title" className="text-xl font-semibold text-foreground">
              {demo.title}
            </h2>
            <p id="demo-description" className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {demo.steps.length}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isLastStep && (
              <Badge variant="secondary" className="text-xs">
                {timeRemaining}s remaining
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              aria-label="Close demo"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-100"
                style={{ width: `${((currentStep / demo.steps.length) * 100) + (progress / demo.steps.length)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {Math.round(((currentStep / demo.steps.length) * 100) + (progress / demo.steps.length))}%
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLastStep ? (
            // Finish screen
            <div className="h-full flex items-center justify-center p-8">
              <Card className="max-w-md w-full text-center">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Ready to get started?
                    </h3>
                    <p className="text-muted-foreground">
                      Join thousands who trust our platform to organize their financial life and keep proof every step of the way.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      size="lg"
                      onClick={handleStartWorkspace}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Start your workspace
                    </Button>

                    <ShareButton 
                      text={demo.shareMessage.replace('{url}', window.location.href)}
                      url={window.location.href}
                      onShare={handleShare}
                      className="w-full"
                      variant="outline"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Step content
            <div className="h-full flex flex-col lg:flex-row">
              {/* Image */}
              <div className="lg:w-1/2 bg-muted flex items-center justify-center p-8">
                <div className="max-w-md w-full aspect-square bg-background rounded-lg flex items-center justify-center">
                  <img 
                    src={currentStepData.image} 
                    alt={`Demo step ${currentStep + 1}: ${currentStepData.title}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                <div className="max-w-md">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {currentStepData.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {currentStepData.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        {!isLastStep && (
          <div className="flex items-center justify-between p-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
              aria-label="Previous step"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause demo' : 'Play demo'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button 
                variant="outline"
                onClick={handleNext}
                aria-label="Next step"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Screen reader announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {`Step ${currentStep + 1} of ${demo.steps.length}: ${currentStepData?.title}`}
        </div>
      </DialogContent>
    </Dialog>
  );
};