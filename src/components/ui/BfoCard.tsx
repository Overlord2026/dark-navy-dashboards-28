import React from 'react';
import { cn } from '@/lib/utils';

interface BfoCardProps {
  children: React.ReactNode;
  className?: string;
  hasHeader?: boolean;
  headerContent?: React.ReactNode;
}

export function BfoCard({ children, className, hasHeader = false, headerContent }: BfoCardProps) {
  return (
    <div className={cn("bfo-card", className)}>
      {hasHeader && headerContent && (
        <div className="bfo-card-header">
          {headerContent}
        </div>
      )}
      {children}
    </div>
  );
}

// Convenience exports for common patterns
export function BfoStatCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bfo-stat", className)}>
      {children}
    </div>
  );
}

export function BfoChip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("bfo-chip", className)}>
      {children}
    </span>
  );
}