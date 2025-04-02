
import React, { useState, useEffect } from "react";
import { testNavigation } from "@/services/diagnostics/navigationTests";
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDiagnosticsContext } from "@/context/DiagnosticsContext";

/**
 * NavigationHealthIndicator - A developer-only component that displays real-time diagnostic results
 * 
 * This component runs navigation diagnostics in the background and displays the results
 * using a simple card layout with colored status indicators. It's only visible in
 * development or when diagnostics mode is enabled.
 * 
 * The component will:
 * - Run diagnostic tests in the background
 * - Display each navigation route with its current status
 * - Update automatically at a set interval
 * - Show tooltips with detailed error messages when hovering over failed tests
 */
export function NavigationHealthIndicator() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { isDevelopmentMode, isDiagnosticsModeEnabled } = useDiagnosticsContext();
  
  // Only show the component in development mode or when diagnostics are enabled
  const isVisible = isDevelopmentMode || isDiagnosticsModeEnabled;
  
  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const navigationResults = await testNavigation();
      setResults(navigationResults);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error running navigation diagnostics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run diagnostics on mount and every 60 seconds
  useEffect(() => {
    if (!isVisible) return;
    
    runDiagnostics();
    
    // Set up interval for automatic refresh
    const interval = setInterval(runDiagnostics, 60000);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  // Calculate summary stats
  const getStats = () => {
    const total = results.length;
    const success = results.filter(r => r.status === "success").length;
    const warning = results.filter(r => r.status === "warning").length;
    const error = results.filter(r => r.status === "error").length;
    
    return { total, success, warning, error };
  };
  
  // Don't render anything in production mode unless diagnostics is enabled
  if (!isVisible) return null;
  
  const stats = getStats();
  
  // Determine overall status
  const getOverallStatus = () => {
    if (stats.error > 0) return "error";
    if (stats.warning > 0) return "warning";
    return "success";
  };
  
  return (
    <Card className="navigation-health-indicator fixed bottom-4 right-4 w-80 shadow-lg z-50 opacity-90 hover:opacity-100 transition-opacity">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <span>Navigation Health</span>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              {
                success: <CheckCircle className="h-4 w-4 text-green-500" />,
                warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
                error: <XCircle className="h-4 w-4 text-red-500" />
              }[getOverallStatus()]
            )}
          </CardTitle>
          <button 
            onClick={runDiagnostics} 
            className="text-xs text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            Refresh
          </button>
        </div>
        <div className="flex gap-1 text-xs">
          <Badge variant="success" className="text-[10px]">
            {stats.success} OK
          </Badge>
          {stats.warning > 0 && (
            <Badge variant="warning" className="text-[10px]">
              {stats.warning} Warnings
            </Badge>
          )}
          {stats.error > 0 && (
            <Badge variant="destructive" className="text-[10px]">
              {stats.error} Errors
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="max-h-60 overflow-y-auto pb-2">
        <TooltipProvider>
          <div className="space-y-2">
            {results.length > 0 ? (
              results.map((result, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`px-2 py-1 rounded text-xs flex items-center justify-between cursor-help
                        ${result.status === "success" ? "bg-green-50 dark:bg-green-900/20" : 
                          result.status === "warning" ? "bg-yellow-50 dark:bg-yellow-900/20" : 
                          "bg-red-50 dark:bg-red-900/20"}`}
                    >
                      <span className="truncate">{result.route}</span>
                      {
                        {
                          success: <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />,
                          warning: <AlertTriangle className="h-3 w-3 text-yellow-500 shrink-0" />,
                          error: <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                        }[result.status]
                      }
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-72">
                    <div className="text-xs">
                      <div className="font-semibold mb-1">{result.route}</div>
                      <div>{result.message}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))
            ) : isLoading ? (
              <div className="text-center py-4">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Running diagnostics...</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-muted-foreground">No data available</p>
              </div>
            )}
          </div>
        </TooltipProvider>
      </CardContent>
      {lastUpdated && (
        <div className="px-6 py-2 text-[10px] text-muted-foreground border-t">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </Card>
  );
}
