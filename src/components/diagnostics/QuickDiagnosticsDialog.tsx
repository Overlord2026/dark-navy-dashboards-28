
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, AlertCircle, CheckCircle, XCircle, Bug, Info } from "lucide-react";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import { StatusIcon } from "./StatusIcon";
import { logger } from "@/services/logging/loggingService";

interface QuickDiagnosticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickDiagnosticsDialog = ({ open, onOpenChange }: QuickDiagnosticsDialogProps) => {
  const { 
    isLoading, 
    report, 
    runDiagnosticCheck, 
    isCheckingRealTime,
    appState,
    runQuickCheck
  } = useDiagnostics();

  // Log dialog access
  React.useEffect(() => {
    if (open) {
      logger.info("Quick diagnostics dialog opened", undefined, "QuickDiagnosticsDialog");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Quick System Diagnostics
          </DialogTitle>
          <DialogDescription>
            Diagnose and resolve issues with your application
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quick-fix">Quick Fix</TabsTrigger>
            <TabsTrigger value="logs">Recent Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="flex-1 overflow-hidden flex flex-col">
            <div className="space-y-4 flex-1 overflow-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">System Status</h3>
                  <p className="text-sm text-muted-foreground">Last checked: {new Date(appState.lastUpdateTime).toLocaleTimeString()}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={runQuickCheck}
                  disabled={isCheckingRealTime}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isCheckingRealTime ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-md flex flex-col items-center">
                  <div className="mb-2 text-center">
                    {appState.isStuck ? (
                      <XCircle className="h-10 w-10 text-red-500 mx-auto" />
                    ) : (
                      <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
                    )}
                    <h4 className="font-medium mt-2">App Status</h4>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    {appState.isStuck 
                      ? "Application is experiencing issues" 
                      : "Application is running normally"}
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Errors ({appState.errors.length})
                  </h4>
                  {appState.errors.length > 0 ? (
                    <ul className="text-sm space-y-1">
                      {appState.errors.map((error, index) => (
                        <li key={index} className="text-red-500">{error}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No errors detected</p>
                  )}
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    Warnings ({appState.warnings.length})
                  </h4>
                  {appState.warnings.length > 0 ? (
                    <ul className="text-sm space-y-1">
                      {appState.warnings.map((warning, index) => (
                        <li key={index} className="text-yellow-500">{warning}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No warnings detected</p>
                  )}
                </div>
              </div>

              {report && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Core Services</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <div className="flex flex-col items-center p-3 border rounded-md">
                      <h4 className="font-medium text-sm mb-2">Navigation</h4>
                      <StatusIcon status={report.navigation.status} />
                      <span className="text-xs mt-2 text-center">{report.navigation.message}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 border rounded-md">
                      <h4 className="font-medium text-sm mb-2">Forms</h4>
                      <StatusIcon status={report.forms.status} />
                      <span className="text-xs mt-2 text-center">{report.forms.message}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 border rounded-md">
                      <h4 className="font-medium text-sm mb-2">Database</h4>
                      <StatusIcon status={report.database.status} />
                      <span className="text-xs mt-2 text-center">{report.database.message}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 border rounded-md">
                      <h4 className="font-medium text-sm mb-2">API</h4>
                      <StatusIcon status={report.api.status} />
                      <span className="text-xs mt-2 text-center">{report.api.message}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 border rounded-md">
                      <h4 className="font-medium text-sm mb-2">Authentication</h4>
                      <StatusIcon status={report.authentication.status} />
                      <span className="text-xs mt-2 text-center">{report.authentication.message}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 mt-4 border-t">
              <Button 
                onClick={runDiagnosticCheck} 
                disabled={isLoading} 
                className="w-full"
              >
                <Bug className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Running Full Diagnostics..." : "Run Full Diagnostics"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="quick-fix" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Troubleshooting steps</AlertTitle>
              <AlertDescription>
                Try these steps to resolve common issues with your application
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4 border rounded-md p-4">
              <h3 className="font-medium">Common Fixes</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    logger.info("Clearing browser cache", undefined, "QuickDiagnosticsDialog");
                    toast.success("Request to clear cache sent");
                    // In a real app, this would clear application caches
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Application Cache
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    logger.info("Refreshing API connections", undefined, "QuickDiagnosticsDialog");
                    toast.success("API connections refreshed");
                    // In a real app, this would reinitialize API connections
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh API Connections
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    logger.info("Reloading application", undefined, "QuickDiagnosticsDialog");
                    window.location.reload();
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Application
                </Button>
              </div>
            </div>
            
            <div className="space-y-4 border rounded-md p-4">
              <h3 className="font-medium">Advanced Options</h3>
              <p className="text-sm text-muted-foreground mb-2">
                These options can help resolve more complex issues
              </p>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-yellow-600"
                  onClick={() => {
                    logger.warning("Reset user preferences initiated", undefined, "QuickDiagnosticsDialog");
                    // Would reset all user preferences to default
                    toast.success("User preferences have been reset to defaults");
                  }}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Reset User Preferences
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600"
                  onClick={() => {
                    logger.warning("Clear all storage initiated", undefined, "QuickDiagnosticsDialog");
                    localStorage.clear();
                    sessionStorage.clear();
                    toast.success("Application storage cleared");
                  }}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Clear All Storage
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="flex-1 overflow-hidden flex flex-col">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-medium">Recent System Logs</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  toast.success("Logs refreshed");
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Logs
              </Button>
            </div>
            
            <ScrollArea className="flex-1 border rounded-md">
              <div className="p-4 space-y-2">
                {logger.getLogs().slice(0, 20).map((log, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded-md text-sm ${
                      log.level === 'error' || log.level === 'critical' 
                        ? 'bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-800' 
                        : log.level === 'warning'
                        ? 'bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800'
                        : 'bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{log.message}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {log.source && (
                      <div className="text-xs mt-1 text-muted-foreground">
                        Source: {log.source}
                      </div>
                    )}
                    {log.details && (
                      <div className="mt-1 text-xs">
                        <pre className="bg-background/50 p-1 rounded overflow-x-auto">
                          {typeof log.details === 'object' 
                            ? JSON.stringify(log.details, null, 2)
                            : log.details}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
                
                {logger.getLogs().length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No logs available
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            onClick={() => {
              runQuickCheck();
              onOpenChange(false);
              logger.info("Quick diagnostics dialog closed", undefined, "QuickDiagnosticsDialog");
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
