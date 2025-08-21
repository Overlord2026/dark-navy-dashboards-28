
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Gauge, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PERFORMANCE_THRESHOLDS, KEY_ROUTES, getMemoryUsage } from '@/services/performance/performanceMonitorService';

type PerformanceData = {
  route: string;
  loadTime: number;
  status: 'success' | 'warning' | 'error';
  timestamp: number;
};

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceData[]>([]);
  const [memoryUsage, setMemoryUsage] = useState<{ 
    usagePercentage?: number;
    usedJSHeapSize?: number;
    totalJSHeapSize?: number; 
  }>({});
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    // Get memory usage
    setMemoryUsage(getMemoryUsage());
    
    // Fetch metrics from localStorage or other storage
    const storedMetrics: PerformanceData[] = [];
    
    // Try to load stored metrics
    try {
      KEY_ROUTES.forEach(route => {
        const metricKey = `perf_metric:route:${route}`;
        const storedMetric = localStorage.getItem(metricKey);
        
        if (storedMetric) {
          try {
            const metric = JSON.parse(storedMetric);
            storedMetrics.push(metric);
          } catch (e) {
            console.error(`Failed to parse stored metric for ${route}`);
          }
        }
      });
    } catch (e) {
      console.error("Failed to load performance metrics from storage", e);
    }
    
    setMetrics(storedMetrics);
    
    // Set up memory monitoring interval
    const interval = setInterval(() => {
      setMemoryUsage(getMemoryUsage());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [refreshToken]);
  
  const handleRefresh = () => {
    setRefreshToken(prev => prev + 1);
  };
  
  const getStatusColor = (status: 'success' | 'warning' | 'error'): string => {
    switch (status) {
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance Metrics
          </div>
        </CardTitle>
        <button 
          onClick={handleRefresh}
          className="text-xs text-muted-foreground hover:text-primary"
          aria-label="Refresh performance metrics"
        >
          Refresh
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              Memory Usage
            </h3>
            <Badge variant="outline" className="text-xs">
              {memoryUsage.usagePercentage?.toFixed(1)}% Used
            </Badge>
          </div>
          <Progress 
            value={memoryUsage.usagePercentage || 0} 
            className={
              (memoryUsage.usagePercentage || 0) > 80 
                ? "text-red-400" 
                : (memoryUsage.usagePercentage || 0) > 60 
                  ? "text-yellow-400" 
                  : "text-green-400"
            }
            aria-label={`Memory usage: ${memoryUsage.usagePercentage?.toFixed(1)}% used`}
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>
              {Math.round((memoryUsage.usedJSHeapSize || 0) / (1024 * 1024))} MB used
            </span>
            <span>
              {Math.round((memoryUsage.totalJSHeapSize || 0) / (1024 * 1024))} MB total
            </span>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium flex items-center gap-1 mb-3">
            <Clock className="h-4 w-4" />
            Page Load Times
          </h3>
          <div className="space-y-2">
            {metrics.length === 0 ? (
              <div className="text-center py-3 text-sm text-muted-foreground">
                No performance data available yet.
                <div className="text-xs mt-1">
                  Visit pages to collect metrics.
                </div>
              </div>
            ) : (
              metrics.map((metric) => (
                <div key={metric.route} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="truncate max-w-[180px]">{metric.route}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.loadTime.toFixed(0)} ms
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(100, (metric.loadTime / 30))}
                    className={
                      metric.status === 'error' 
                        ? "text-red-400" 
                        : metric.status === 'warning' 
                          ? "text-yellow-400" 
                          : "text-green-400"
                    }
                    aria-label={`Load time for ${metric.route}: ${metric.loadTime.toFixed(0)}ms`}
                  />
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <h3 className="text-sm font-medium flex items-center gap-1 mb-2">
            <BarChart className="h-4 w-4" />
            Performance Benchmarks
          </h3>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div>
              <div className="font-medium">Good</div>
              <div className="text-muted-foreground">
                &lt; {PERFORMANCE_THRESHOLDS.route.acceptable}ms
              </div>
            </div>
            <div>
              <div className="font-medium">Warning</div>
              <div className="text-muted-foreground">
                &gt; {PERFORMANCE_THRESHOLDS.route.warning}ms
              </div>
            </div>
            <div>
              <div className="font-medium">Poor</div>
              <div className="text-muted-foreground">
                &gt; {PERFORMANCE_THRESHOLDS.route.critical}ms
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
