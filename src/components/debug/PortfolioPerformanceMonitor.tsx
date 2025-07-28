import React, { memo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Database, Zap } from 'lucide-react';

interface PortfolioPerformanceMonitorProps {
  componentName: string;
  renderCount: number;
  dataFetchTime?: number;
  cacheHits?: number;
  memoizedCalculations?: number;
  interestCount?: number;
}

export const PortfolioPerformanceMonitor = memo(({ 
  componentName, 
  renderCount,
  dataFetchTime = 0,
  cacheHits = 0,
  memoizedCalculations = 0,
  interestCount = 0
}: PortfolioPerformanceMonitorProps) => {
  const [mountTime] = useState(Date.now());
  const [renderTimes, setRenderTimes] = useState<number[]>([]);

  useEffect(() => {
    const renderTime = performance.now();
    setRenderTimes(prev => [...prev.slice(-4), renderTime - mountTime]);
  }, [renderCount, mountTime]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const avgRenderTime = renderTimes.length > 0 
    ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length 
    : 0;

  const getPerformanceStatus = () => {
    if (renderCount > 15) return { color: 'destructive' as const, label: 'High Re-renders' };
    if (avgRenderTime > 150) return { color: 'outline' as const, label: 'Slow Renders' };
    if (cacheHits > 3) return { color: 'default' as const, label: 'Optimized' };
    return { color: 'secondary' as const, label: 'Normal' };
  };

  const status = getPerformanceStatus();

  return (
    <Card className="border-dashed border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/10 text-xs">
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Portfolio Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-emerald-600 dark:text-emerald-400">Component:</span>
          <span className="font-mono text-[10px]">{componentName}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex items-center gap-1">
            <Zap className="h-2 w-2" />
            <span>Renders: {renderCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-2 w-2" />
            <span>Avg: {avgRenderTime.toFixed(1)}ms</span>
          </div>
          <div className="flex items-center gap-1">
            <Database className="h-2 w-2" />
            <span>Cache: {cacheHits}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-2 w-2" />
            <span>Interests: {interestCount}</span>
          </div>
        </div>

        {dataFetchTime > 0 && (
          <div className="text-emerald-500 text-[10px]">
            Data Fetch: {dataFetchTime.toFixed(0)}ms
          </div>
        )}

        {memoizedCalculations > 0 && (
          <div className="text-emerald-500 text-[10px]">
            Memoized Calculations: {memoizedCalculations}
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-emerald-200/50">
          <Badge variant={status.color} className="text-[9px] py-0 px-1">
            {status.label}
          </Badge>
          <span className="text-emerald-400 text-[9px]">
            Portfolio Dashboard
          </span>
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return prevProps.componentName === nextProps.componentName && 
         prevProps.renderCount === nextProps.renderCount &&
         prevProps.dataFetchTime === nextProps.dataFetchTime &&
         prevProps.cacheHits === nextProps.cacheHits &&
         prevProps.memoizedCalculations === nextProps.memoizedCalculations &&
         prevProps.interestCount === nextProps.interestCount;
});

PortfolioPerformanceMonitor.displayName = 'PortfolioPerformanceMonitor';