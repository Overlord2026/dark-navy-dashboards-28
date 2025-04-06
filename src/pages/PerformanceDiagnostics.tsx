
import React, { useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { PerformanceMetrics } from "@/components/diagnostics/PerformanceMetrics";
import { PerformanceTests } from "@/components/diagnostics/PerformanceTests";
import { runPerformanceTests } from "@/services/diagnostics/performanceTests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePagePerformance } from "@/hooks/usePagePerformance";
import { Activity, Gauge, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { logPerformanceReport } from "@/services/performance/performanceMonitorService";
import { toast } from "sonner";

export default function PerformanceDiagnostics() {
  const [performanceTests, setPerformanceTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Monitor this page's performance
  usePagePerformance('/diagnostics/performance', { logToConsole: true });
  
  const handleRunTests = async () => {
    setIsLoading(true);
    try {
      const results = await runPerformanceTests();
      setPerformanceTests(results);
      toast.success("Performance tests completed", {
        description: `${results.length} tests run successfully`
      });
    } catch (error) {
      toast.error("Failed to run performance tests", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogReport = async () => {
    try {
      await logPerformanceReport();
      toast.success("Performance report generated", {
        description: "Report has been logged to the system"
      });
    } catch (error) {
      toast.error("Failed to generate performance report", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  useEffect(() => {
    // Load performance tests on mount
    handleRunTests();
  }, []);

  return (
    <ThreeColumnLayout 
      activeMainItem="diagnostics" 
      title="Performance Diagnostics"
    >
      <div className="space-y-6 p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Performance Diagnostics</h1>
            <p className="text-muted-foreground mt-1">
              Monitor load times and resource utilization across key pages
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleLogReport}
              className="flex items-center gap-1"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Log Report</span>
            </Button>
            <Button 
              onClick={handleRunTests} 
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <Gauge className="h-4 w-4" />
              <span>{isLoading ? 'Running...' : 'Run Tests'}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <PerformanceMetrics />
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Resource Utilization Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 flex items-center justify-center h-[300px] text-muted-foreground text-center">
                  <div>
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Resource utilization charts would appear here.</p>
                    <p className="text-xs mt-2">
                      This would typically show CPU, memory, and network usage over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <PerformanceTests 
            tests={performanceTests}
            isLoading={isLoading} 
          />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
