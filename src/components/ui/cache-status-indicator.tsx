import React from 'react';
import { Database, Clock, AlertTriangle, CheckCircle2, HardDrive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CacheMetadata } from '@/services/documentCache';

interface CacheStatusIndicatorProps {
  cacheMetadata: CacheMetadata | null;
  loading?: boolean;
  hitRate?: number;
  lastRefresh?: Date | null;
  className?: string;
}

export const CacheStatusIndicator: React.FC<CacheStatusIndicatorProps> = ({
  cacheMetadata,
  loading = false,
  hitRate = 0,
  lastRefresh,
  className
}) => {
  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getCacheStatus = () => {
    if (loading) {
      return {
        icon: Database,
        variant: 'secondary' as const,
        text: 'Loading...',
        iconClassName: 'animate-pulse text-blue-500'
      };
    }

    if (!cacheMetadata) {
      return {
        icon: AlertTriangle,
        variant: 'destructive' as const,
        text: 'No Cache',
        iconClassName: 'text-red-500'
      };
    }

    const usagePercent = (cacheMetadata.cacheSize / cacheMetadata.maxCacheSize) * 100;
    
    if (usagePercent > 90) {
      return {
        icon: AlertTriangle,
        variant: 'destructive' as const,
        text: 'Cache Full',
        iconClassName: 'text-red-500'
      };
    }

    if (hitRate > 80) {
      return {
        icon: CheckCircle2,
        variant: 'default' as const,
        text: 'Optimized',
        iconClassName: 'text-green-500'
      };
    }

    return {
      icon: HardDrive,
      variant: 'outline' as const,
      text: 'Active',
      iconClassName: 'text-blue-500'
    };
  };

  const status = getCacheStatus();
  const Icon = status.icon;

  const tooltipContent = cacheMetadata && (
    <div className="space-y-2 text-xs">
      <div className="grid grid-cols-2 gap-2">
        <span>Items:</span>
        <span className="text-right">{cacheMetadata.totalItems}</span>
        
        <span>Size:</span>
        <span className="text-right">{formatBytes(cacheMetadata.cacheSize)}</span>
        
        <span>Hit Rate:</span>
        <span className="text-right">{hitRate.toFixed(1)}%</span>
        
        {lastRefresh && (
          <>
            <span>Last Sync:</span>
            <span className="text-right">{formatTimeAgo(lastRefresh.getTime())}</span>
          </>
        )}
      </div>
      
      {cacheMetadata.maxCacheSize > 0 && (
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-1">
            <span>Storage</span>
            <span>{((cacheMetadata.cacheSize / cacheMetadata.maxCacheSize) * 100).toFixed(1)}%</span>
          </div>
          <Progress 
            value={(cacheMetadata.cacheSize / cacheMetadata.maxCacheSize) * 100} 
            className="h-1" 
          />
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={status.variant}
            className={cn(
              'flex items-center gap-1 text-xs px-2 py-1 cursor-help',
              className
            )}
          >
            <Icon className={cn('h-3 w-3', status.iconClassName)} />
            <span className="hidden sm:inline">{status.text}</span>
            {cacheMetadata && (
              <span className="hidden md:inline text-muted-foreground">
                ({cacheMetadata.totalItems})
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          {tooltipContent || (
            <p>
              {loading 
                ? 'Loading cache information...' 
                : 'Cache not available'
              }
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};