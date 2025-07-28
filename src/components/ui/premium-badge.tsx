import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Crown, Star, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'crown' | 'star' | 'zap' | 'sparkles';
  className?: string;
  tooltip?: string;
}

export function PremiumBadge({ 
  size = 'md', 
  variant = 'crown',
  className,
  tooltip = 'Premium Feature - Upgrade to access'
}: PremiumBadgeProps) {
  const iconMap = {
    crown: Crown,
    star: Star,
    zap: Zap,
    sparkles: Sparkles
  };

  const Icon = iconMap[variant];

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const badge = (
    <Badge 
      className={cn(
        'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-600 shadow-lg',
        'hover:from-amber-600 hover:to-orange-600 transition-all duration-200',
        sizeClasses[size],
        className
      )}
    >
      <Icon className={cn(iconSizes[size], 'mr-1')} />
      PREMIUM
    </Badge>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

interface PremiumWrapperProps {
  children: React.ReactNode;
  isPremium: boolean;
  showBadge?: boolean;
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
  disabled?: boolean;
}

export function PremiumWrapper({
  children,
  isPremium,
  showBadge = true,
  badgePosition = 'top-right',
  className,
  disabled = false
}: PremiumWrapperProps) {
  if (!isPremium) {
    return <>{children}</>;
  }

  const positionClasses = {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2'
  };

  return (
    <div className={cn(
      'relative',
      isPremium && 'ring-2 ring-amber-500/30 rounded-lg',
      isPremium && 'bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20',
      isPremium && 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-amber-500/5 before:to-orange-500/5 before:rounded-lg before:pointer-events-none',
      disabled && 'opacity-60 pointer-events-none',
      className
    )}>
      {children}
      {showBadge && (
        <div className={cn('absolute z-10', positionClasses[badgePosition])}>
          <PremiumBadge size="sm" />
        </div>
      )}
      {/* Premium watermark */}
      {isPremium && (
        <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden">
          <div className="absolute top-4 right-[-32px] bg-amber-500/10 text-amber-600/30 text-xs font-bold px-8 py-1 rotate-45 transform origin-center">
            PREMIUM
          </div>
        </div>
      )}
    </div>
  );
}

interface PremiumCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function PremiumCard({ children, title, description, className }: PremiumCardProps) {
  return (
    <div className={cn(
      'p-6 rounded-lg border-2 border-dashed border-amber-300/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50',
      'dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-700/50',
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Crown className="h-5 w-5 text-amber-600" />
        <h3 className="font-semibold text-amber-900 dark:text-amber-100">{title}</h3>
        <PremiumBadge size="sm" variant="sparkles" />
      </div>
      {description && (
        <p className="text-sm text-amber-800/80 dark:text-amber-200/80 mb-4">
          {description}
        </p>
      )}
      <div className="opacity-75">
        {children}
      </div>
    </div>
  );
}