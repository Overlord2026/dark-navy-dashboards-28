import React, { memo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Database, Zap, Award } from 'lucide-react';

interface EducationPerformanceMonitorProps {
  componentName: string;
  renderCount: number;
  dataFetchTime?: number;
  cacheHits?: number;
  memoizedCalculations?: number;
  coursesCount?: number;
  resourcesCount?: number;
}

export const EducationPerformanceMonitor = memo(({ 
  componentName, 
  renderCount,
  dataFetchTime = 0,
  cacheHits = 0,
  memoizedCalculations = 0,
  coursesCount = 0,
  resourcesCount = 0
}: EducationPerformanceMonitorProps) => {
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
    if (renderCount > 12) return { color: 'destructive' as const, label: 'High Re-renders' };
    if (avgRenderTime > 120) return { color: 'outline' as const, label: 'Slow Renders' };
    if (cacheHits > 4) return { color: 'default' as const, label: 'Optimized' };
    return { color: 'secondary' as const, label: 'Normal' };
  };

  const status = getPerformanceStatus();

  return (
    <Card className="border-dashed border-violet-200 bg-violet-50/50 dark:bg-violet-900/10 text-xs">
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-xs text-violet-700 dark:text-violet-300 flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          Education Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-violet-600 dark:text-violet-400">Component:</span>
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
            <Award className="h-2 w-2" />
            <span>Courses: {coursesCount}</span>
          </div>
        </div>

        {dataFetchTime > 0 && (
          <div className="text-violet-500 text-[10px]">
            Data Fetch: {dataFetchTime.toFixed(0)}ms
          </div>
        )}

        {memoizedCalculations > 0 && (
          <div className="text-violet-500 text-[10px]">
            Memoized: {memoizedCalculations} | Resources: {resourcesCount}
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-violet-200/50">
          <Badge variant={status.color} className="text-[9px] py-0 px-1">
            {status.label}
          </Badge>
          <span className="text-violet-400 text-[9px]">
            Education Dashboard
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
         prevProps.coursesCount === nextProps.coursesCount &&
         prevProps.resourcesCount === nextProps.resourcesCount;
});

EducationPerformanceMonitor.displayName = 'EducationPerformanceMonitor';