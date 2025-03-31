
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadges } from "./StatusBadges";
import { runDiagnostics } from "@/services/diagnostics";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "./LoadingState";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useDiagnostics } from "@/hooks/useDiagnostics";

interface QuickDiagnosticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickDiagnosticsDialog = ({
  open,
  onOpenChange,
}: QuickDiagnosticsDialogProps) => {
  const { 
    diagnosticResults, 
    isLoading, 
    loadingMessage, 
    refreshDiagnostics,
    quickFixes,
    applyQuickFix, 
    quickFixLoading,
  } = useDiagnostics();
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    if (open && !diagnosticResults) {
      refreshDiagnostics();
    }
  }, [open, diagnosticResults, refreshDiagnostics]);

  const getStatusIcon = (status: DiagnosticTestStatus) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const renderSummary = () => {
    if (!diagnosticResults) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Navigation</h3>
              {getStatusIcon(diagnosticResults.navigation.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {diagnosticResults.navigation.message}
            </p>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Forms</h3>
              {getStatusIcon(diagnosticResults.forms.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {diagnosticResults.forms.message}
            </p>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Database</h3>
              {getStatusIcon(diagnosticResults.database.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {diagnosticResults.database.message}
            </p>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">API</h3>
              {getStatusIcon(diagnosticResults.api.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {diagnosticResults.api.message}
            </p>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Authentication</h3>
              {getStatusIcon(diagnosticResults.authentication.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {diagnosticResults.authentication.message}
            </p>
          </div>
        </div>

        {quickFixes && quickFixes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Quick Fixes Available</h3>
            <div className="space-y-2">
              {quickFixes.map((fix, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                  <div>
                    <p className="font-medium">{fix.name}</p>
                    <p className="text-sm text-muted-foreground">{fix.description}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      applyQuickFix(fix.id);
                      toast.success(`Applied fix: ${fix.name}`);
                    }}
                    disabled={quickFixLoading}
                  >
                    Apply Fix
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              toast.info("Running full diagnostics...");
              refreshDiagnostics();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Run Full Diagnostics
          </Button>
        </div>
      </div>
    );
  };

  const renderPerformance = () => {
    if (!diagnosticResults || !diagnosticResults.performanceTests) return null;
    
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Performance analysis of application functions and API calls
        </div>
        
        <div className="space-y-3">
          {diagnosticResults.performanceTests.map((test, index) => (
            <div key={index} className="bg-card rounded-lg p-3 border">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{test.name}</h3>
                <StatusBadges status={test.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{test.message}</p>
              {test.responseTime && (
                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Response time:</span>{" "}
                    <span className={test.responseTime > 1000 ? "text-red-500" : "text-green-500"}>
                      {test.responseTime}ms
                    </span>
                  </div>
                  {test.cpuUsage && (
                    <div>
                      <span className="text-muted-foreground">CPU:</span>{" "}
                      <span className={test.cpuUsage > 50 ? "text-yellow-500" : "text-green-500"}>
                        {test.cpuUsage}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            toast.info("Running performance diagnostics");
            refreshDiagnostics();
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Rerun Performance Tests
        </Button>
      </div>
    );
  };

  const renderSecurity = () => {
    if (!diagnosticResults || !diagnosticResults.securityTests) return null;
    
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Security analysis of authentication, permissions, and data protection
        </div>
        
        <div className="space-y-3">
          {diagnosticResults.securityTests.map((test, index) => (
            <div key={index} className={`bg-card rounded-lg p-3 border ${
              test.severity === 'critical' ? 'border-red-500' : 
              test.severity === 'high' ? 'border-orange-500' : 
              test.severity === 'medium' ? 'border-yellow-500' : 'border'
            }`}>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{test.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    test.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                    test.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : 
                    test.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  }`}>
                    {test.severity}
                  </span>
                  <StatusBadges status={test.status} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{test.message}</p>
              {test.remediation && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Remediation:</span>{" "}
                  <span className="text-foreground">{test.remediation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            toast.info("Running security diagnostics");
            refreshDiagnostics();
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Rerun Security Tests
        </Button>
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>System Diagnostics</DialogTitle>
          <DialogDescription>
            Quick check of system health and performance
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <LoadingState message={loadingMessage} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              {renderSummary()}
            </TabsContent>

            <TabsContent value="performance">
              {renderPerformance()}
            </TabsContent>

            <TabsContent value="security">
              {renderSecurity()}
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              toast.success("Diagnostics complete");
              onOpenChange(false);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
