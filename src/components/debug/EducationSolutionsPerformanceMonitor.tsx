import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Clock, Zap, BarChart3, RotateCcw, GraduationCap } from "lucide-react";
import { measureRouteLoad } from "@/utils/performance";

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  memoryUsage?: number;
  lessonsLoaded: number;
  videosLoaded: number;
  lastUpdate: Date;
}

export const EducationSolutionsPerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    lessonsLoaded: 0,
    videosLoaded: 0,
    lastUpdate: new Date()
  });
  const [isCollapsed, setIsCollapsed] = useState(true);

  const trackRender = useCallback(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        renderCount: prev.renderCount + 1,
        lastRenderTime: renderTime,
        averageRenderTime: ((prev.averageRenderTime * (prev.renderCount - 1)) + renderTime) / prev.renderCount,
        lastUpdate: new Date()
      }));
    };
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      lessonsLoaded: 0,
      videosLoaded: 0,
      lastUpdate: new Date()
    });
  }, []);

  useEffect(() => {
    const cleanup = measureRouteLoad('EducationSolutions');
    const endTracking = trackRender();
    
    // Simulate content loading tracking
    setMetrics(prev => ({
      ...prev,
      lessonsLoaded: prev.lessonsLoaded + 1,
      videosLoaded: prev.videosLoaded + 1
    }));

    return () => {
      cleanup();
      endTracking();
    };
  }, [trackRender]);

  // Memory usage tracking (if available)
  useEffect(() => {
    if ('memory' in performance) {
      const updateMemory = () => {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: (performance as any).memory?.usedJSHeapSize
        }));
      };

      const interval = setInterval(updateMemory, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };

  const getPerformanceStatus = () => {
    if (metrics.averageRenderTime < 16) return { label: "Excellent", variant: "default" as const };
    if (metrics.averageRenderTime < 33) return { label: "Good", variant: "secondary" as const };
    if (metrics.averageRenderTime < 50) return { label: "Warning", variant: "outline" as const };
    return { label: "Poor", variant: "destructive" as const };
  };

  if (process.env.NODE_ENV === 'production') return null;

  const status = getPerformanceStatus();

  return (
    <Card className="fixed bottom-4 left-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Education Performance
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={status.variant} className="text-xs">
              {status.label}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? "▲" : "▼"}
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs">
          Dev Mode • {metrics.lastUpdate.toLocaleTimeString()}
        </CardDescription>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="pt-2 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-3 w-3 text-blue-500" />
              <span>Renders: {metrics.renderCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-green-500" />
              <span>Last: {metrics.lastRenderTime.toFixed(1)}ms</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span>Avg: {metrics.averageRenderTime.toFixed(1)}ms</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-purple-500" />
              <span>Memory: {formatBytes(metrics.memoryUsage)}</span>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Lessons Loaded:</span>
              <span>{metrics.lessonsLoaded}</span>
            </div>
            <div className="flex justify-between">
              <span>Videos Loaded:</span>
              <span>{metrics.videosLoaded}</span>
            </div>
            <div className="flex justify-between">
              <span>Target FPS:</span>
              <span className={metrics.averageRenderTime < 16 ? "text-green-500" : "text-red-500"}>
                {metrics.averageRenderTime < 16 ? "60 FPS ✓" : "< 60 FPS"}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={resetMetrics}
            className="w-full text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset Metrics
          </Button>

          <div className="text-xs text-muted-foreground border-t pt-2">
            <div>• Tracks education content loading</div>
            <div>• Target: &lt;16ms for 60 FPS</div>
            <div>• Memory usage when available</div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};