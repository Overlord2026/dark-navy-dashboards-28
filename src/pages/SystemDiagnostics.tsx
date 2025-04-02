
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { RefreshCw, ActivitySquare, Zap, AlertTriangle, ShieldAlert, Wrench, FileText } from "lucide-react";
import { DiagnosticsHeader } from "@/components/diagnostics/DiagnosticsHeader";
import { DiagnosticsRunner } from "@/components/diagnostics/DiagnosticsRunner";
import { DiagnosticsTabs } from "@/components/diagnostics/DiagnosticsTabs";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import { toast } from "sonner";
import { NavigationDiagnostics } from "@/components/diagnostics/NavigationDiagnostics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DiagnosticsWizard } from "@/components/diagnostics/DiagnosticsWizard";
import { DetailedLogViewer } from "@/components/diagnostics/DetailedLogViewer";

export default function SystemDiagnostics() {
  const {
    isRunning,
    isLoading,
    diagnosticResults,
    lastRunTimestamp,
    quickFixes,
    runSystemDiagnostics,
    refreshDiagnostics,
    getOverallStatus,
    fixHistory
  } = useDiagnostics();

  const [navigatorExpanded, setNavigatorExpanded] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isLogViewerOpen, setIsLogViewerOpen] = useState(false);

  const handleRunDiagnostics = async () => {
    if (isRunning) return;
    
    toast.info("Starting full system diagnostics...");
    try {
      await refreshDiagnostics();
      toast.success("Diagnostics completed", {
        description: "System status has been updated"
      });
    } catch (error) {
      toast.error("Diagnostics failed to complete", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
      console.error("Diagnostics error:", error);
    }
  };

  useEffect(() => {
    if (!diagnosticResults && !isLoading) {
      runSystemDiagnostics();
    }
  }, [diagnosticResults, isLoading, runSystemDiagnostics]);

  const calculateIssueCounts = () => {
    if (!diagnosticResults) {
      return { errors: 0, warnings: 0, success: 0 };
    }

    const allTests = [
      ...(diagnosticResults.securityTests || []),
      ...(diagnosticResults.navigationTests || []),
      ...(diagnosticResults.permissionsTests || []),
      ...(diagnosticResults.formValidationTests || []),
      ...(diagnosticResults.apiIntegrationTests || []),
      ...(diagnosticResults.roleSimulationTests || []),
      ...(diagnosticResults.performanceTests || [])
    ];

    return {
      errors: allTests.filter(test => test.status === "error").length,
      warnings: allTests.filter(test => test.status === "warning").length,
      success: allTests.filter(test => test.status === "success").length
    };
  };

  const issueCounts = calculateIssueCounts();

  const getCriticalIssues = () => {
    if (!diagnosticResults) return [];
    
    const securityIssues = (diagnosticResults.securityTests || [])
      .filter(test => test.status === "error" && test.severity === "critical")
      .map(test => ({
        type: "security",
        name: test.name,
        message: test.message,
        severity: test.severity
      }));
      
    const apiIssues = (diagnosticResults.apiIntegrationTests || [])
      .filter(test => test.status === "error")
      .map(test => ({
        type: "api",
        name: test.service,
        message: test.message,
        severity: "high"
      }));
      
    return [...securityIssues, ...apiIssues].slice(0, 3);
  };

  const criticalIssues = getCriticalIssues();

  return (
    <ThreeColumnLayout title="System Diagnostics">
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold mb-2 sm:mb-0">System Diagnostics</h1>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={handleRunDiagnostics}
              disabled={isRunning}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? "Running..." : "Run Full Diagnostics"}
            </Button>
            
            <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="gap-2"
                >
                  <Wrench className="h-4 w-4" />
                  Repair Wizard
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>System Repair Wizard</DialogTitle>
                  <DialogDescription>
                    Follow these steps to fix system issues in order of priority
                  </DialogDescription>
                </DialogHeader>
                <DiagnosticsWizard />
              </DialogContent>
            </Dialog>
            
            <Dialog open={isLogViewerOpen} onOpenChange={setIsLogViewerOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Detailed Logs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>System Logs</DialogTitle>
                  <DialogDescription>
                    Detailed diagnostic logs and events
                  </DialogDescription>
                </DialogHeader>
                <DetailedLogViewer />
              </DialogContent>
            </Dialog>
            
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

        {diagnosticResults && !isLoading && !isRunning && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800/30 flex items-center justify-center mr-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-red-800 dark:text-red-300 font-medium">Errors</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-400">{issueCounts.errors}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-800 dark:text-red-300 hover:text-red-900 hover:bg-red-100 dark:hover:bg-red-800/40"
                  onClick={() => {
                    const tabsWithErrors = ["security", "api", "navigation", "permissions", "forms"];
                    for (const tab of tabsWithErrors) {
                      if (diagnosticResults[`${tab}Tests`]?.some((t: any) => t.status === "error")) {
                        document.querySelector(`[value="${tab}"]`)?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true })
                        );
                        break;
                      }
                    }
                  }}
                >
                  View
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-800/30 flex items-center justify-center mr-3">
                    <ShieldAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">Warnings</p>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-400">{issueCounts.warnings}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-yellow-800 dark:text-yellow-300 hover:text-yellow-900 hover:bg-yellow-100 dark:hover:bg-yellow-800/40"
                  onClick={() => {
                    const tabsWithWarnings = ["security", "performance", "api", "navigation"];
                    for (const tab of tabsWithWarnings) {
                      if (diagnosticResults[`${tab}Tests`]?.some((t: any) => t.status === "warning")) {
                        document.querySelector(`[value="${tab}"]`)?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true })
                        );
                        break;
                      }
                    }
                  }}
                >
                  View
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center mr-3">
                    <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-green-800 dark:text-green-300 font-medium">Passed</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-400">{issueCounts.success}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-green-800 dark:text-green-300 hover:text-green-900 hover:bg-green-100 dark:hover:bg-green-800/40"
                  onClick={() => {
                    document.querySelector(`[value="overview"]`)?.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    );
                  }}
                >
                  View
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <DiagnosticsHeader
          isLoading={isLoading}
          timestamp={lastRunTimestamp}
          status={getOverallStatus()}
          quickFixes={quickFixes}
        />
        
        <div className="mt-6">
          {isRunning && (
            <div className="bg-muted/50 p-6 rounded-lg flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-lg font-medium">Running Diagnostics...</p>
                <p className="text-sm text-muted-foreground mt-1">This may take a few moments</p>
              </div>
            </div>
          )}

          {criticalIssues.length > 0 && !isRunning && (
            <Card className="mb-6 border-red-200 dark:border-red-800">
              <CardHeader className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Issues Detected
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {criticalIssues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{issue.name}</p>
                        <p className="text-sm text-muted-foreground">{issue.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={() => setIsWizardOpen(true)}
                    className="gap-2"
                  >
                    <Wrench className="h-4 w-4" />
                    Fix Issues
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {diagnosticResults && !isRunning && (
            <DiagnosticsTabs
              results={diagnosticResults}
              recommendations={quickFixes}
              isLoading={isLoading}
              fixHistory={fixHistory}
            />
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
