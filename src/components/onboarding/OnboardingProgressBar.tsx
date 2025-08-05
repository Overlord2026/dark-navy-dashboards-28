import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  status: 'in_progress' | 'completed' | 'abandoned' | 'paused';
  lastActiveAt?: string;
  estimatedCompletion?: string;
}

export const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({
  currentStep,
  totalSteps,
  progressPercentage,
  status,
  lastActiveAt,
  estimatedCompletion
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused':
      case 'abandoned':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'paused':
      case 'abandoned':
        return 'bg-yellow-500';
      default:
        return 'bg-primary';
    }
  };

  const getLastActiveText = () => {
    if (!lastActiveAt) return '';
    
    const date = new Date(lastActiveAt);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <Badge variant="secondary" className="text-xs">
            {Math.round(progressPercentage)}% Complete
          </Badge>
        </div>
        
        <div className="flex flex-col md:items-end text-xs text-muted-foreground">
          {estimatedCompletion && (
            <span>{estimatedCompletion}</span>
          )}
          {lastActiveAt && (
            <span>Last active: {getLastActiveText()}</span>
          )}
        </div>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className="h-2"
        indicatorClassName={`transition-all duration-500 ${getStatusColor()}`}
      />
      
      {status === 'paused' && (
        <div className="text-xs text-muted-foreground">
          Your progress has been saved. Continue anytime from where you left off.
        </div>
      )}
    </div>
  );
};