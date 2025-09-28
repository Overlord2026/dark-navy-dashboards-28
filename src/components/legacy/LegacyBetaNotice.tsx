import React from 'react';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LegacyBetaNoticeProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function LegacyBetaNotice({ variant = 'default', className }: LegacyBetaNoticeProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 text-xs">
          Legacy Beta
        </Badge>
        <span className="text-xs text-muted-foreground">New feature</span>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-start gap-3 p-4 rounded-lg border border-amber-500/20 bg-amber-500/5',
      className
    )}>
      <InfoIcon className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">SWAG™ Legacy Planning</h4>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 text-xs">
            Beta
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          This feature is in beta. Some functionality may change as we continue to improve the experience.
        </p>
      </div>
    </div>
  );
}

export default LegacyBetaNotice;