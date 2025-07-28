import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceTestProps {
  componentName: string;
  renderCount: number;
}

// Memoized component to track re-renders in development
export const PerformanceTest = memo(({ componentName, renderCount }: PerformanceTestProps) => {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="border-dashed border-amber-200 bg-amber-50/50 dark:bg-amber-900/10">
      <CardHeader className="py-2">
        <CardTitle className="text-xs text-amber-700 dark:text-amber-300">
          Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="text-xs space-y-1">
          <div className="text-amber-600 dark:text-amber-400">
            Component: {componentName}
          </div>
          <div className="text-amber-600 dark:text-amber-400">
            Renders: {renderCount}
          </div>
          <div className="text-amber-500 text-[10px]">
            Optimized with React.memo and useMemo
          </div>
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return prevProps.componentName === nextProps.componentName && 
         prevProps.renderCount === nextProps.renderCount;
});

PerformanceTest.displayName = 'PerformanceTest';