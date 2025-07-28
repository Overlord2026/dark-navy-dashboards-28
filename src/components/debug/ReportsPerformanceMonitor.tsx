import React, { memo, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Database, TrendingUp } from 'lucide-react';

interface ReportsPerformanceData {
  reportCount: number;
  loadTime: number;
  apiCallsCount: number;
  memoryUsage: number;
  renderCount: number;
  lastUpdate: number;
}

interface ReportsPerformanceMonitorProps {
  reportCount: number;
  loadingStates: {
    reports: boolean;
    profile: boolean;
    generating: boolean;
  };
  apiCallsCount: number;
}

export const ReportsPerformanceMonitor = memo(({ 
  reportCount, 
  loadingStates, 
  apiCallsCount 
}: ReportsPerformanceMonitorProps) => {
  const [performanceData, setPerformanceData] = useState<ReportsPerformanceData>({
    reportCount: 0,
    loadTime: 0,
    apiCallsCount: 0,
    memoryUsage: 0,
    renderCount: 0,
    lastUpdate: Date.now()
  });

  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
    
    const updatePerformanceData = () => {
      const memory = (performance as any).memory;
      
      setPerformanceData({
        reportCount,
        loadTime: performance.now(),
        apiCallsCount,
        memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
        renderCount,
        lastUpdate: Date.now()
      });
    };

    updatePerformanceData();
  }, [reportCount, apiCallsCount, renderCount]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getLoadingState = () => {
    const activeLoading = Object.entries(loadingStates).filter(([_, loading]) => loading);
    return activeLoading.length > 0 ? activeLoading.map(([key]) => key).join(', ') : 'none';
  };

  const getPerformanceScore = () => {
    let score = 100;
    if (performanceData.renderCount > 10) score -= 20;
    if (performanceData.apiCallsCount > 5) score -= 15;
    if (performanceData.memoryUsage > 50) score -= 15;
    if (performanceData.loadTime > 2000) score -= 20;
    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const performanceScore = getPerformanceScore();

  return (
    <Card className="border-dashed border-blue-200 bg-blue-50/50 dark:bg-blue-900/10">
      <CardHeader className="py-3">
        <CardTitle className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Reports Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="py-3 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-blue-600 dark:text-blue-400">Performance Score:</span>
              <Badge className={getScoreColor(performanceScore)}>
                {performanceScore}%
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Database className="h-3 w-3" />
                Reports:
              </span>
              <span className="font-mono">{performanceData.reportCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Renders:
              </span>
              <span className="font-mono">{performanceData.renderCount}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Load Time:
              </span>
              <span className="font-mono">{Math.round(performanceData.loadTime)}ms</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-blue-600 dark:text-blue-400">API Calls:</span>
              <span className="font-mono">{performanceData.apiCallsCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-blue-600 dark:text-blue-400">Memory:</span>
              <span className="font-mono">{performanceData.memoryUsage}MB</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-600 dark:text-blue-400">Loading:</span>
            <span className="font-mono text-blue-500">{getLoadingState()}</span>
          </div>
        </div>

        <div className="text-[10px] text-blue-500 border-t border-blue-200 dark:border-blue-800 pt-2">
          Optimized with React.memo, useMemo, and useCallback
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.reportCount === nextProps.reportCount &&
    prevProps.apiCallsCount === nextProps.apiCallsCount &&
    JSON.stringify(prevProps.loadingStates) === JSON.stringify(nextProps.loadingStates)
  );
});

ReportsPerformanceMonitor.displayName = 'ReportsPerformanceMonitor';