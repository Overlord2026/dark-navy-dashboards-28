import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Save } from 'lucide-react';

interface PersistentNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSaveAndExit: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  nextLabel?: string;
  previousLabel?: string;
}

export const PersistentNavigation: React.FC<PersistentNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSaveAndExit,
  canGoNext = true,
  canGoPrevious = true,
  nextLabel = "Next",
  previousLabel = "Previous"
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={onPrevious}
            disabled={!canGoPrevious}
          >
            {previousLabel}
          </Button>

          <Button
            variant="ghost"
            onClick={onSaveAndExit}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save & Continue Later
          </Button>

          <Button 
            onClick={onNext}
            disabled={!canGoNext}
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};