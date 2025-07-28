import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  mountTime: number;
  totalCalculationTime: number;
  expensiveOperations: Array<{
    name: string;
    duration: number;
    timestamp: number;
  }>;
}

interface Props {
  componentName: string;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export const FamilyWealthPerformanceMonitor: React.FC<Props> = ({ 
  componentName, 
  onMetricsUpdate 
}) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    mountTime: Date.now(),
    totalCalculationTime: 0,
    expensiveOperations: []
  });

  const renderStartTime = useRef<number>(Date.now());

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  useEffect(() => {
    renderStartTime.current = Date.now();
  });

  useEffect(() => {
    const renderEndTime = Date.now();
    const renderDuration = renderEndTime - renderStartTime.current;
    
    metricsRef.current.renderCount++;
    metricsRef.current.lastRenderTime = renderDuration;
    
    // Track expensive renders (>16ms for 60fps)
    if (renderDuration > 16) {
      metricsRef.current.expensiveOperations.push({
        name: 'render',
        duration: renderDuration,
        timestamp: renderEndTime
      });
      
      // Keep only last 10 expensive operations
      if (metricsRef.current.expensiveOperations.length > 10) {
        metricsRef.current.expensiveOperations.shift();
      }
    }

    // Update parent component if callback provided
    if (onMetricsUpdate) {
      onMetricsUpdate({ ...metricsRef.current });
    }
  });

  const metrics = metricsRef.current;
  const averageRenderTime = metrics.expensiveOperations.length > 0 
    ? metrics.expensiveOperations.reduce((acc, op) => acc + op.duration, 0) / metrics.expensiveOperations.length
    : metrics.lastRenderTime;

  const getPerformanceStatus = () => {
    if (averageRenderTime > 50) return 'critical';
    if (averageRenderTime > 16) return 'warning';
    return 'good';
  };

  const status = getPerformanceStatus();

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur border shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>🚀 {componentName} Performance</span>
          <Badge 
            variant={status === 'critical' ? 'destructive' : status === 'warning' ? 'secondary' : 'default'}
            className="text-xs"
          >
            {status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-1">
        <div className="grid grid-cols-2 gap-2">
          <div>Renders: <span className="font-mono">{metrics.renderCount}</span></div>
          <div>Last: <span className="font-mono">{metrics.lastRenderTime}ms</span></div>
          <div>Avg: <span className="font-mono">{averageRenderTime.toFixed(1)}ms</span></div>
          <div>Uptime: <span className="font-mono">{((Date.now() - metrics.mountTime) / 1000).toFixed(0)}s</span></div>
        </div>
        
        {metrics.expensiveOperations.length > 0 && (
          <div className="mt-2 pt-2 border-t">
            <div className="text-muted-foreground mb-1">Recent Expensive Operations:</div>
            {metrics.expensiveOperations.slice(-3).map((op, i) => (
              <div key={i} className="text-xs">
                {op.name}: <span className="font-mono text-yellow-600">{op.duration}ms</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 pt-2 border-t text-muted-foreground">
          Target: &lt;16ms for 60fps
        </div>
      </CardContent>
    </Card>
  );
};

// Hook for tracking expensive operations
export const usePerformanceTracking = () => {
  const trackOperation = (name: string, operation: () => any) => {
    const startTime = performance.now();
    const result = operation();
    const duration = performance.now() - startTime;
    
    if (process.env.NODE_ENV === 'development' && duration > 5) {
      console.warn(`🐌 Expensive operation "${name}": ${duration.toFixed(2)}ms`);
    }
    
    return result;
  };

  return { trackOperation };
};
