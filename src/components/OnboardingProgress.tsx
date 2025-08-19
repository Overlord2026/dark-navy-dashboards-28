import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  className?: string;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
  steps,
  className
}) => {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-muted-foreground">
            {progressPercentage}% complete
          </span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2"
          aria-label={`Onboarding progress: ${progressPercentage}% complete`}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div
              key={step}
              className={cn(
                "flex flex-col items-center space-y-1 text-xs",
                "min-w-0 flex-1"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                  "transition-colors duration-200",
                  {
                    "bg-primary text-primary-foreground": isCompleted || isCurrent,
                    "bg-muted text-muted-foreground": !isCompleted && !isCurrent,
                    "ring-2 ring-primary ring-offset-2": isCurrent
                  }
                )}
                aria-label={`Step ${stepNumber}: ${step}`}
              >
                {isCompleted ? (
                  <span className="sr-only">Completed</span>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={cn(
                  "text-center truncate w-full px-1",
                  {
                    "text-foreground": isCompleted || isCurrent,
                    "text-muted-foreground": !isCompleted && !isCurrent
                  }
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};