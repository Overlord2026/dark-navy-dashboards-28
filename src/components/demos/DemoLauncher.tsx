import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, X, ExternalLink } from 'lucide-react';
import ShareButton from '@/components/ui/ShareButton';
import { PERSONA_CONFIG } from '@/config/personaConfig';
import demoConfig from '@/config/demoConfig.json';

interface SimpleDemoStep {
  h: string;
  p: string;
}

interface SimpleDemo {
  id: string;
  title: string;
  steps: SimpleDemoStep[];
  cta: string;
}

// Convert simple demo to full demo config format
const convertDemo = (demo: SimpleDemo) => ({
  id: demo.id,
  title: demo.title,
  description: `60-second interactive tour: ${demo.title}`,
  duration: demo.steps.length * 12, // 12 seconds per step
  steps: demo.steps.map((step, index) => ({
    title: step.h,
    description: step.p,
    duration: 12
  })),
  cta: demo.cta,
  route: `/start/${demo.id.replace('-', '/')}`
});

const getDemoById = (id: string) => {
  const simpleDemo = (demoConfig as SimpleDemo[]).find(d => d.id === id);
  return simpleDemo ? convertDemo(simpleDemo) : null;
};

interface DemoLauncherProps {
  demoId: string;
  open: boolean;
  onClose: () => void;
}

export default function DemoLauncher({ demoId, open, onClose }: DemoLauncherProps) {
  const demo = getDemoById(demoId);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const dialogRef = useRef<HTMLDivElement>(null);

  const currentStepData = demo?.steps[currentStep];
  const totalSteps = demo?.steps.length || 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Find related persona for CTA
  const relatedPersona = PERSONA_CONFIG.find(p => p.demoId === demoId);

  useEffect(() => {
    if (!demo || !open) return;

    if (isPlaying && currentStepData) {
      setTimeLeft(currentStepData.duration);
      setProgress(0);

      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleNextStep();
            return 0;
          }
          return prev - 1;
        });

        setProgress(prev => {
          const newProgress = prev + (100 / currentStepData.duration);
          return Math.min(newProgress, 100);
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentStep, isPlaying, open, demo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case ' ':
        case 'k':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          handleNextStep();
          break;
        case 'ArrowLeft':
        case 'j':
          e.preventDefault();
          handlePrevStep();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, isPlaying]);

  // Focus management
  useEffect(() => {
    if (open && dialogRef.current) {
      const focusableElement = dialogRef.current.querySelector('button');
      focusableElement?.focus();
    }
  }, [open]);

  const handleNextStep = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    }
  };

  const handlePrevStep = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setProgress(0);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(true);
    onClose();
  };

  const handlePersonaCTA = () => {
    if (relatedPersona) {
      const route = `/onboarding?persona=${relatedPersona.demoId}`;
      window.open(route, '_blank');
    }
  };

  if (!demo) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        ref={dialogRef}
        className="max-w-2xl w-full h-auto max-h-[90vh] overflow-hidden"
        aria-labelledby="demo-title"
        aria-describedby="demo-description"
      >
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle id="demo-title" className="text-xl font-semibold">
              {demo.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              aria-label="Close demo"
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p id="demo-description" className="text-sm text-muted-foreground">
            {demo.description}
          </p>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{timeLeft}s remaining</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          {currentStepData && (
            <Progress value={progress} className="h-1" />
          )}
        </div>

        {/* Current Step Content */}
        {currentStepData && (
          <div className="py-6 min-h-[200px] flex flex-col justify-center">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold">{currentStepData.title}</h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {currentStepData.description}
              </p>
              
              {/* Demo visualization placeholder */}
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Demo visualization</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Finish Screen */}
        {isLastStep && progress >= 100 && (
          <div className="py-6 text-center space-y-4">
            <h3 className="text-2xl font-semibold">Demo Complete!</h3>
            <p className="text-muted-foreground">
              Ready to get started with your own workspace?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {relatedPersona && (
                <Button onClick={handlePersonaCTA} className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  {relatedPersona.cta}
                </Button>
              )}
              
              <ShareButton
                title={`${demo.title} Demo`}
                text={`Check out this ${demo.title} demo - ${demo.description}`}
                url={`${window.location.origin}/demos/${demoId}`}
                variant="outline"
              />
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              aria-label="Previous step"
            >
              ← Prev
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextStep}
              disabled={isLastStep}
              aria-label="Next step"
            >
              Next →
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Press K to play/pause • ← → to navigate • ESC to close
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}