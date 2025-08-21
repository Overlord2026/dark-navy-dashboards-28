import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
  variant?: 'default' | 'circular' | 'text' | 'card';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  count = 1,
  height = '20px',
  width = '100%',
  variant = 'default',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full aspect-square';
      case 'text':
        return 'rounded h-4';
      case 'card':
        return 'rounded-lg p-4 space-y-3';
      default:
        return 'rounded';
    }
  };

  const baseClasses = 'animate-pulse bg-muted';
  
  if (variant === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, getVariantClasses(), className)}
            style={{ minHeight: height }}
            role="progressbar"
            aria-label="Loading content"
          >
            <div className="h-6 bg-muted-foreground/20 rounded mb-2" />
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(baseClasses, getVariantClasses(), className)}
          style={{ height, width }}
          role="progressbar"
          aria-label="Loading content"
        />
      ))}
    </div>
  );
};