
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import { AlertTriangle, Check, ExternalLink, Shield, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusIcon } from "./StatusIcon"; 
import { LoadingState } from "./LoadingState";

export function QuickDiagnosticsDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    diagnosticResults, 
    isLoading, 
    refreshDiagnostics, 
    quickFixes,
    applyQuickFix,
    quickFixLoading
  } = useDiagnostics();

  // Calculate status counts
  const getStatusCounts = () => {
    if (!diagnosticResults) return { success: 0, warning: 0, error: 0 };
    
    const allTests = [
      ...diagnosticResults.securityTests,
      ...diagnosticResults.performanceTests,
      ...diagnosticResults.formValidationTests,
      ...diagnosticResults.navigationTests,
      ...diagnosticResults.apiIntegrationTests
    ];
    
    return {
      success: allTests.filter(test => test.status === "success").length,
      warning: allTests.filter(test => test.status === "warning").length,
      error: allTests.filter(test => test.status === "error").length
    };
  };
  
  const statusCounts = getStatusCounts();
  
  // Get critical issues
  const getCriticalIssues = () => {
    if (!diagnosticResults) return [];
    
    return diagnosticResults.securityTests
      .filter(test => test.status === "error" && test.severity === "critical")
      .map(test => ({
        name: test.name,
        area: "security",
        message: `Critical security issue: ${test.name}`
      }));
  };
  
  const criticalIssues = getCriticalIssues();

  // Get recommendation for quick fix
  const getRecommendation = () => {
    if (criticalIssues.length > 0) {
      return "Address critical security issues first";
    }
    
    if (statusCounts.error > 5) {
      return "Multiple errors detected - run full diagnostics";
    }
    
    return "System health looks good";
  };

  const renderStatusSummary = () => {
    return (
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="flex flex-col items-center p-3 rounded-lg bg-green-500/10">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
            <Check className="h-5 w-5 text-green-500" />
          </div>
          <span className="text-xl font-bold">{statusCounts.success}</span>
          <span className="text-sm text-muted-foreground">Passed</span>
        </div>
        
        <div className="flex flex-col items-center p-3 rounded-lg bg-amber-500/10">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <span className="text-xl font-bold">{statusCounts.warning}</span>
          <span className="text-sm text-muted-foreground">Warnings</span>
        </div>
        
        <div className="flex flex-col items-center p-3 rounded-lg bg-red-500/10">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
            <Shield className="h-5 w-5 text-red-500" />
          </div>
          <span className="text-xl font-bold">{statusCounts.error}</span>
          <span className="text-sm text-muted-foreground">Errors</span>
        </div>
      </div>
    );
  };

  const renderCriticalIssues = () => {
    if (criticalIssues.length === 0) {
      return (
        <div className="p-4 bg-green-500/10 rounded-lg my-4">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-500 font-medium">No critical issues detected</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4 bg-red-500/10 rounded-lg my-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <p className="text-red-500 font-medium mb-2">{criticalIssues.length} critical {criticalIssues.length === 1 ? 'issue' : 'issues'} detected</p>
            <ul className="list-disc list-inside space-y-1">
              {criticalIssues.map((issue, index) => (
                <li key={index} className="text-sm text-muted-foreground">{issue.message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderQuickFixes = () => {
    if (quickFixes.length === 0) {
      return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg my-4">
          <p className="text-muted-foreground">No quick fixes available</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3 my-4">
        {quickFixes.map((fix) => (
          <div 
            key={fix.id}
            className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="mb-3 sm:mb-0">
              <div className="flex items-center">
                <StatusBadge severity={fix.severity} />
                <h4 className="font-medium ml-2">{fix.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{fix.description}</p>
            </div>
            <Button
              onClick={() => applyQuickFix(fix.id)}
              disabled={quickFixLoading}
              variant="outline"
              className="ml-auto"
              size="sm"
            >
              Apply Fix
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            System Diagnostics
          </DialogTitle>
          <DialogDescription>
            Check the health and status of your system
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <LoadingState message="Running system diagnostics..." />
        ) : diagnosticResults ? (
          <div>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="issues">Issues ({statusCounts.error + statusCounts.warning})</TabsTrigger>
                <TabsTrigger value="fixes">Quick Fixes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                {renderStatusSummary()}
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">System Recommendation</h3>
                  <p className="text-sm text-muted-foreground">{getRecommendation()}</p>
                </div>
                
                {renderCriticalIssues()}
              </TabsContent>
              
              <TabsContent value="issues" className="mt-4">
                {(statusCounts.error + statusCounts.warning) > 0 ? (
                  <div className="space-y-3">
                    {diagnosticResults.securityTests
                      .filter(test => test.status !== "success")
                      .map((test, index) => (
                        <div key={`sec-${index}`} className="p-3 border rounded-lg flex items-start">
                          <StatusIcon status={test.status} className="mt-0.5 mr-2" />
                          <div>
                            <p className="font-medium">{test.name}</p>
                            <p className="text-sm text-muted-foreground">Security: {test.severity} severity</p>
                          </div>
                        </div>
                      ))}
                    
                    {diagnosticResults.performanceTests
                      .filter(test => test.status !== "success")
                      .map((test, index) => (
                        <div key={`perf-${index}`} className="p-3 border rounded-lg flex items-start">
                          <StatusIcon status={test.status} className="mt-0.5 mr-2" />
                          <div>
                            <p className="font-medium">{test.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Response time: {test.responseTime}ms | CPU: {test.cpuUsage}%
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/10 rounded-lg my-4">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-green-600 dark:text-green-400">No issues detected</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="fixes" className="mt-4">
                {renderQuickFixes()}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-4">No diagnostic data available</p>
            <Button 
              onClick={() => refreshDiagnostics()}
              className="flex items-center"
            >
              <Zap className="h-4 w-4 mr-2" />
              Run Diagnostics
            </Button>
          </div>
        )}
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          
          <div className="flex space-x-2 mb-2 sm:mb-0">
            <Button
              variant="secondary"
              onClick={() => refreshDiagnostics()}
              disabled={isLoading}
            >
              <Zap className="h-4 w-4 mr-2" />
              Run Quick Check
            </Button>
            
            <Button
              variant="default"
              onClick={() => window.location.href = '/system-diagnostics'}
              className="flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Diagnostics
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Simple status badge component for this file
function StatusBadge({ severity }: { severity: string }) {
  const getBadgeStyles = () => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeStyles()}`}>
      {severity}
    </span>
  );
}
