import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, Clock, Database, RefreshCw, Eye, EyeOff } from "lucide-react";

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  maxRenderTime: number;
  dataFetchTime: number;
  memoryUsage: number;
  componentMounts: number;
  expensiveOperations: {
    calculations: number;
    apiCalls: number;
    rerenders: number;
  };
}

interface PropertiesPerformanceMonitorProps {
  componentName?: string;
  trackRenders?: boolean;
  trackMemory?: boolean;
  onPerformanceData?: (metrics: PerformanceMetrics) => void;
}

const PropertiesPerformanceMonitor: React.FC<PropertiesPerformanceMonitorProps> = ({
  componentName = "Properties",
  trackRenders = true,
  trackMemory = true,
  onPerformanceData
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    maxRenderTime: 0,
    dataFetchTime: 0,
    memoryUsage: 0,
    componentMounts: 0,
    expensiveOperations: {
      calculations: 0,
      apiCalls: 0,
      rerenders: 0
    }
  });

  const [isVisible, setIsVisible] = useState(false);
  const [renderTimes, setRenderTimes] = useState<number[]>([]);

  const updateMetrics = useCallback((updates: Partial<PerformanceMetrics>) => {
    setMetrics(prev => {
      const newMetrics = { ...prev, ...updates };
      if (onPerformanceData) {
        onPerformanceData(newMetrics);
      }
      return newMetrics;
    });
  }, [onPerformanceData]);

  const trackRender = useCallback(() => {
    if (!trackRenders) return;

    const renderStart = performance.now();
    
    // Simulate render time tracking
    setTimeout(() => {
      const renderTime = performance.now() - renderStart;
      
      setRenderTimes(prev => {
        const newTimes = [...prev, renderTime].slice(-50); // Keep last 50 render times
        const average = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
        const max = Math.max(...newTimes);
        
        updateMetrics({
          renderCount: metrics.renderCount + 1,
          lastRenderTime: renderTime,
          averageRenderTime: average,
          maxRenderTime: max,
          expensiveOperations: {
            ...metrics.expensiveOperations,
            rerenders: metrics.expensiveOperations.rerenders + 1
          }
        });
        
        return newTimes;
      });
    }, 0);
  }, [trackRenders, metrics, updateMetrics]);

  const trackDataFetch = useCallback((fetchTime: number) => {
    updateMetrics({
      dataFetchTime: fetchTime,
      expensiveOperations: {
        ...metrics.expensiveOperations,
        apiCalls: metrics.expensiveOperations.apiCalls + 1
      }
    });
  }, [metrics, updateMetrics]);

  const trackCalculation = useCallback(() => {
    updateMetrics({
      expensiveOperations: {
        ...metrics.expensiveOperations,
        calculations: metrics.expensiveOperations.calculations + 1
      }
    });
  }, [metrics, updateMetrics]);

  useEffect(() => {
    trackRender();
  }, [trackRender]);

  useEffect(() => {
    updateMetrics({
      componentMounts: metrics.componentMounts + 1
    });
    
    // Track memory usage if supported
    if (trackMemory && 'memory' in performance) {
      const memInfo = (performance as any).memory;
      updateMetrics({
        memoryUsage: memInfo.usedJSHeapSize / 1024 / 1024 // Convert to MB
      });
    }
  }, []);

  useEffect(() => {
    // Expose tracking functions globally for development
    if (process.env.NODE_ENV === 'development') {
      (window as any).propertiesPerformance = {
        trackDataFetch,
        trackCalculation,
        getMetrics: () => metrics,
        reset: () => {
          setMetrics({
            renderCount: 0,
            lastRenderTime: 0,
            averageRenderTime: 0,
            maxRenderTime: 0,
            dataFetchTime: 0,
            memoryUsage: 0,
            componentMounts: 0,
            expensiveOperations: {
              calculations: 0,
              apiCalls: 0,
              rerenders: 0
            }
          });
          setRenderTimes([]);
        }
      };
    }
  }, [trackDataFetch, trackCalculation, metrics]);

  const getPerformanceStatus = () => {
    if (metrics.averageRenderTime > 16) return { status: "poor", color: "destructive" };
    if (metrics.averageRenderTime > 8) return { status: "ok", color: "secondary" };
    return { status: "good", color: "default" };
  };

  const resetMetrics = () => {
    setMetrics({
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      maxRenderTime: 0,
      dataFetchTime: 0,
      memoryUsage: 0,
      componentMounts: 0,
      expensiveOperations: {
        calculations: 0,
        apiCalls: 0,
        rerenders: 0
      }
    });
    setRenderTimes([]);
  };

  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const performanceStatus = getPerformanceStatus();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsVisible(!isVisible)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <Monitor className="h-4 w-4 ml-1" />
        </Button>
        
        {isVisible && (
          <Card className="w-80 bg-background/95 backdrop-blur-sm border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  {componentName} Performance
                </span>
                <Badge variant={performanceStatus.color as any} className="text-xs">
                  {performanceStatus.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Renders: {metrics.renderCount}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Avg: {metrics.averageRenderTime.toFixed(2)}ms
                  </div>
                  <div className="text-muted-foreground">
                    Max: {metrics.maxRenderTime.toFixed(2)}ms
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    <span>API Calls: {metrics.expensiveOperations.apiCalls}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Fetch: {metrics.dataFetchTime.toFixed(2)}ms
                  </div>
                  <div className="text-muted-foreground">
                    Calcs: {metrics.expensiveOperations.calculations}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span>Mounts: {metrics.componentMounts}</span>
                  {trackMemory && (
                    <span>Memory: {metrics.memoryUsage.toFixed(1)}MB</span>
                  )}
                </div>
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={resetMetrics}
                className="w-full h-7 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PropertiesPerformanceMonitor;