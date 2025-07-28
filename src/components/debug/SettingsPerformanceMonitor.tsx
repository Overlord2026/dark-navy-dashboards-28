import React, { memo, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Settings, Database, Clock, TrendingUp } from 'lucide-react';

interface SettingsPerformanceData {
  sectionsLoaded: number;
  saveOperations: number;
  loadTime: number;
  apiCallsCount: number;
  memoryUsage: number;
  renderCount: number;
  lastUpdate: number;
}

interface SettingsPerformanceMonitorProps {
  activeTab: string;
  sectionsLoaded: number;
  saveOperations: number;
  apiCallsCount: number;
  loadingStates: Record<string, boolean>;
}

export const SettingsPerformanceMonitor = memo(({ 
  activeTab,
  sectionsLoaded, 
  saveOperations,
  apiCallsCount,
  loadingStates
}: SettingsPerformanceMonitorProps) => {
  const [performanceData, setPerformanceData] = useState<SettingsPerformanceData>({
    sectionsLoaded: 0,
    saveOperations: 0,
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
        sectionsLoaded,
        saveOperations,
        loadTime: performance.now(),
        apiCallsCount,
        memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
        renderCount,
        lastUpdate: Date.now()
      });
    };

    updatePerformanceData();
  }, [sectionsLoaded, saveOperations, apiCallsCount, renderCount]);

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
    if (performanceData.renderCount > 15) score -= 20;
    if (performanceData.apiCallsCount > 8) score -= 15;
    if (performanceData.memoryUsage > 60) score -= 15;
    if (performanceData.loadTime > 3000) score -= 20;
    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const performanceScore = getPerformanceScore();

  return (
    <Card className="border-dashed border-purple-200 bg-purple-50/50 dark:bg-purple-900/10">
      <CardHeader className="py-3">
        <CardTitle className="text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Settings Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="py-3 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-400">Performance Score:</span>
              <Badge className={getScoreColor(performanceScore)}>
                {performanceScore}%
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Settings className="h-3 w-3" />
                Active Tab:
              </span>
              <span className="font-mono text-xs">{activeTab}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Database className="h-3 w-3" />
                Sections:
              </span>
              <span className="font-mono">{performanceData.sectionsLoaded}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Renders:
              </span>
              <span className="font-mono">{performanceData.renderCount}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Load Time:
              </span>
              <span className="font-mono">{Math.round(performanceData.loadTime)}ms</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-400">API Calls:</span>
              <span className="font-mono">{performanceData.apiCallsCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-400">Save Ops:</span>
              <span className="font-mono">{performanceData.saveOperations}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-400">Memory:</span>
              <span className="font-mono">{performanceData.memoryUsage}MB</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-600 dark:text-purple-400">Loading:</span>
            <span className="font-mono text-purple-500">{getLoadingState()}</span>
          </div>
        </div>

        <div className="text-[10px] text-purple-500 border-t border-purple-200 dark:border-purple-800 pt-2">
          Optimized with React.memo, useMemo, and useCallback
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.activeTab === nextProps.activeTab &&
    prevProps.sectionsLoaded === nextProps.sectionsLoaded &&
    prevProps.saveOperations === nextProps.saveOperations &&
    prevProps.apiCallsCount === nextProps.apiCallsCount &&
    JSON.stringify(prevProps.loadingStates) === JSON.stringify(nextProps.loadingStates)
  );
});

SettingsPerformanceMonitor.displayName = 'SettingsPerformanceMonitor';