import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Clock, Activity, TrendingUp } from 'lucide-react';

interface GoalsPerformanceMonitorProps {
  renderCount: number;
  goalCount: number;
  calculationTime?: number;
  lastUpdate?: Date;
}

export const GoalsPerformanceMonitor = memo(({
  renderCount,
  goalCount,
  calculationTime = 0,
  lastUpdate
}: GoalsPerformanceMonitorProps) => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    avgRenderTime: 0,
    totalRenders: 0,
    lastRenderTime: 0
  });

  const updateMetrics = useCallback(() => {
    const startTime = performance.now();
    
    // Simulate component render measurement
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setPerformanceMetrics(prev => ({
        avgRenderTime: (prev.avgRenderTime * prev.totalRenders + renderTime) / (prev.totalRenders + 1),
        totalRenders: prev.totalRenders + 1,
        lastRenderTime: renderTime
      }));
    });
  }, []);

  useEffect(() => {
    updateMetrics();
  }, [updateMetrics, renderCount]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getRenderPerformanceColor = (count: number) => {
    if (count <= 5) return 'bg-emerald-500';
    if (count <= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCalculationPerformanceColor = (time: number) => {
    if (time <= 10) return 'bg-emerald-500';
    if (time <= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="border-dashed border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 fixed bottom-4 right-4 w-80 z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <Target className="h-3 w-3" />
          Goals Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Renders
            </div>
            <Badge 
              className={`${getRenderPerformanceColor(renderCount)} text-white text-[10px] px-1`}
            >
              {renderCount}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Goals
            </div>
            <Badge className="bg-blue-500 text-white text-[10px] px-1">
              {goalCount}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Calc Time
            </div>
            <Badge 
              className={`${getCalculationPerformanceColor(calculationTime)} text-white text-[10px] px-1`}
            >
              {calculationTime.toFixed(1)}ms
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Avg Render
            </div>
            <Badge className="bg-slate-500 text-white text-[10px] px-1">
              {performanceMetrics.avgRenderTime.toFixed(1)}ms
            </Badge>
          </div>
        </div>

        <div className="text-[10px] text-blue-500 space-y-1">
          <div>Total Renders: {performanceMetrics.totalRenders}</div>
          <div>Last Update: {lastUpdate?.toLocaleTimeString() || 'Never'}</div>
          <div className="text-blue-400">
            Optimized with React.memo, useMemo, useCallback
          </div>
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.renderCount === nextProps.renderCount &&
    prevProps.goalCount === nextProps.goalCount &&
    prevProps.calculationTime === nextProps.calculationTime &&
    prevProps.lastUpdate?.getTime() === nextProps.lastUpdate?.getTime()
  );
});

GoalsPerformanceMonitor.displayName = 'GoalsPerformanceMonitor';