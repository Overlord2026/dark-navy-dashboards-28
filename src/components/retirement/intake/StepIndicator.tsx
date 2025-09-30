import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  completedSteps: number[];
}

export function StepIndicator({ totalSteps, currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
        const isCompleted = completedSteps.includes(step);
        const isCurrent = currentStep === step;
        
        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                isCompleted && !isCurrent && 'bg-primary/20 text-primary',
                !isCurrent && !isCompleted && 'bg-muted text-muted-foreground'
              )}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{step}</span>
              )}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  'w-8 h-0.5 mx-1 transition-all',
                  isCompleted ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
