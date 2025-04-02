
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { RefreshCw, ActivitySquare } from "lucide-react";
import { DiagnosticsHeader } from "@/components/diagnostics/DiagnosticsHeader";
import { DiagnosticsRunner } from "@/components/diagnostics/DiagnosticsRunner";
import { DiagnosticsTabs } from "@/components/diagnostics/DiagnosticsTabs";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import { toast } from "sonner";
import { NavigationDiagnostics } from "@/components/diagnostics/NavigationDiagnostics";

export default function SystemDiagnostics() {
  const {
    isRunning,
    isLoading,
    diagnosticResults,
    lastRunTimestamp,
    quickFixes,
    runSystemDiagnostics,
    refreshDiagnostics,
    getOverallStatus
  } = useDiagnostics();

  const [navigatorExpanded, setNavigatorExpanded] = useState(false);

  const handleRunDiagnostics = async () => {
    if (isRunning) return;
    
    toast.info("Starting full system diagnostics...");
    try {
      await refreshDiagnostics();
      toast.success("Diagnostics completed");
    } catch (error) {
      toast.error("Diagnostics failed to complete");
      console.error("Diagnostics error:", error);
    }
  };

  useEffect(() => {
    if (!diagnosticResults && !isLoading) {
      runSystemDiagnostics();
    }
  }, [diagnosticResults, isLoading, runSystemDiagnostics]);

  return (
    <ThreeColumnLayout title="System Diagnostics">
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold mb-2 sm:mb-0">System Diagnostics</h1>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleRunDiagnostics}
              disabled={isRunning}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? "Running..." : "Run Full Diagnostics"}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setNavigatorExpanded(!navigatorExpanded)}
              className="gap-2"
            >
              <ActivitySquare className="h-4 w-4" />
              {navigatorExpanded ? "Hide Navigation Check" : "Show Navigation Check"}
            </Button>
          </div>
        </div>
        
        {navigatorExpanded && (
          <div className="mb-8">
            <NavigationDiagnostics />
          </div>
        )}

        <DiagnosticsHeader
          isLoading={isLoading}
          timestamp={lastRunTimestamp}
          status={getOverallStatus()}
          quickFixes={quickFixes}
        />
        
        <div className="mt-6">
          {/* Using an empty div here since DiagnosticsRunner doesn't need the isRunning prop */}
          <div className="mb-6">
            {isRunning && (
              <div className="bg-muted/50 p-6 rounded-lg flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-lg font-medium">Running Diagnostics...</p>
                  <p className="text-sm text-muted-foreground mt-1">This may take a few moments</p>
                </div>
              </div>
            )}
          </div>

          {diagnosticResults && !isRunning && (
            <DiagnosticsTabs
              report={diagnosticResults}
              recommendations={quickFixes}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
