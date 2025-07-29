import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface SyncStatusIndicatorProps {
  status: 'idle' | 'syncing' | 'error';
  lastSyncTime?: Date | null;
  className?: string;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  status,
  lastSyncTime,
  className
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'syncing':
        return {
          icon: RefreshCw,
          text: 'Syncing...',
          variant: 'secondary' as const,
          iconClassName: 'animate-spin text-blue-500',
          tooltip: 'Syncing data with server'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Sync Error',
          variant: 'destructive' as const,
          iconClassName: 'text-red-500',
          tooltip: 'Failed to sync with server'
        };
      default:
        return {
          icon: CheckCircle2,
          text: 'Synced',
          variant: 'outline' as const,
          iconClassName: 'text-green-500',
          tooltip: lastSyncTime 
            ? `Last synced: ${lastSyncTime.toLocaleTimeString()}`
            : 'Data is up to date'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={config.variant} 
            className={cn(
              'flex items-center gap-1 text-xs px-2 py-1',
              className
            )}
          >
            <Icon className={cn('h-3 w-3', config.iconClassName)} />
            <span className="hidden sm:inline">{config.text}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};