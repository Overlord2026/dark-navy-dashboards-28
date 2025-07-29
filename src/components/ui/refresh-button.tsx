import React, { useState } from 'react';
import { RefreshCw, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
  onOptimizeCache?: () => Promise<void>;
  onClearCache?: () => Promise<void>;
  refreshing?: boolean;
  lastRefresh?: Date | null;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showDropdown?: boolean;
  className?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  onOptimizeCache,
  onClearCache,
  refreshing = false,
  lastRefresh,
  disabled = false,
  size = 'default',
  variant = 'outline',
  showDropdown = false,
  className
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatLastRefresh = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleRefresh = async () => {
    if (refreshing || disabled) return;
    await onRefresh();
  };

  const handleOptimize = async () => {
    if (onOptimizeCache) {
      await onOptimizeCache();
    }
    setIsMenuOpen(false);
  };

  const handleClearCache = async () => {
    if (onClearCache) {
      await onClearCache();
    }
    setIsMenuOpen(false);
  };

  const tooltipContent = (
    <div className="text-xs">
      <p>Refresh documents from server</p>
      {lastRefresh && (
        <p className="text-muted-foreground mt-1">
          Last updated: {formatLastRefresh(lastRefresh)}
        </p>
      )}
    </div>
  );

  if (showDropdown && (onOptimizeCache || onClearCache)) {
    return (
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={variant}
                  size={size}
                  disabled={disabled}
                  className={cn(
                    'flex items-center gap-1',
                    className
                  )}
                >
                  <RefreshCw 
                    className={cn(
                      'h-4 w-4',
                      refreshing && 'animate-spin',
                      size === 'sm' && 'h-3 w-3'
                    )} 
                  />
                  <span className="hidden sm:inline">
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>{tooltipContent}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Documents
          </DropdownMenuItem>
          
          {onOptimizeCache && (
            <DropdownMenuItem onClick={handleOptimize}>
              <Download className="h-4 w-4 mr-2" />
              Optimize Cache
            </DropdownMenuItem>
          )}
          
          {onClearCache && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleClearCache}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cache
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleRefresh}
            disabled={refreshing || disabled}
            className={cn(
              'flex items-center gap-1',
              className
            )}
          >
            <RefreshCw 
              className={cn(
                'h-4 w-4',
                refreshing && 'animate-spin',
                size === 'sm' && 'h-3 w-3'
              )} 
            />
            <span className="hidden sm:inline">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};