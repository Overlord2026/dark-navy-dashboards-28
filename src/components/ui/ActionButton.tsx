import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PremiumBadge, PremiumWrapper } from '@/components/ui/premium-badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick?: () => void;
  isPremium?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  tooltip?: string;
}

export function ActionButton({
  icon: Icon,
  label,
  description,
  onClick,
  isPremium = false,
  disabled = false,
  variant = 'outline',
  size = 'md',
  className,
  tooltip
}: ActionButtonProps) {
  const sizeClasses = {
    sm: 'h-auto p-3',
    md: 'h-auto p-4', 
    lg: 'h-auto p-6'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const button = (
    <Button
      variant={variant}
      className={cn(
        sizeClasses[size],
        'flex flex-col items-start gap-2 transition-all duration-200',
        isPremium && 'border-amber-200 hover:border-amber-300 bg-gradient-to-br from-amber-50/30 to-orange-50/30',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center gap-2 w-full">
        <Icon className={cn(iconSizes[size], isPremium && 'text-amber-600')} />
        <span className={cn('font-medium', isPremium && 'text-amber-700')}>{label}</span>
        {isPremium && <PremiumBadge size="sm" variant="crown" />}
      </div>
      {description && (
        <span className="text-xs text-muted-foreground text-left">
          {description}
        </span>
      )}
    </Button>
  );

  if (isPremium) {
    return (
      <PremiumWrapper isPremium={true} showBadge={false} disabled={disabled}>
        {tooltip ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {button}
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : button}
      </PremiumWrapper>
    );
  }

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}