
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, RefreshCw, Shield, Terminal, Zap } from "lucide-react";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import { QuickFix } from "@/types/diagnostics";

interface QuickDiagnosticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickDiagnosticsDialog({
  open,
  onOpenChange,
}: QuickDiagnosticsDialogProps) {
  const { 
    diagnosticResults, 
    isLoading, 
    refreshDiagnostics, 
    quickFixes,
    applyQuickFix,
    quickFixLoading
  } = useDiagnostics();
  
  const [selectedFixId, setSelectedFixId] = useState<string | null>(null);
  
  const handleApplyFix = async (fixId: string) => {
    setSelectedFixId(fixId);
    try {
      await applyQuickFix(fixId);
    } finally {
      setSelectedFixId(null);
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge variant="destructive" className="bg-red-600">High</Badge>;
      case "medium":
        return <Badge variant="warning">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getAreaBadge = (area: string) => {
    switch (area) {
      case "security":
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Security</Badge>;
      case "performance":
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Performance</Badge>;
      case "config":
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">Config</Badge>;
      case "api":
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">API</Badge>;
      case "system":
        return <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">System</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Quick System Diagnostics
          </DialogTitle>
          <DialogDescription>
            Quickly check system status and apply fixes.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-muted-foreground">Running diagnostics...</p>
              </div>
            </div>
          ) : (
            <>
              {diagnosticResults && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      {diagnosticResults.overall === "success" ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : diagnosticResults.overall === "warning" ? (
                        <AlertTriangle className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <Shield className="h-6 w-6 text-red-500" />
                      )}
                      <div>
                        <h3 className="font-medium">System Status</h3>
                        <p className="text-sm text-muted-foreground">
                          {diagnosticResults.overall === "success"
                            ? "All systems operational"
                            : diagnosticResults.overall === "warning"
                            ? "Some issues detected"
                            : "Critical issues detected"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refreshDiagnostics()}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>

                  {quickFixes && quickFixes.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Recommended Fixes</h3>
                      {quickFixes.slice(0, 3).map((fix: QuickFix) => (
                        <div
                          key={fix.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{fix.title}</h4>
                              {getSeverityBadge(fix.severity)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {fix.description}
                            </p>
                            <div>{getAreaBadge(fix.area)}</div>
                          </div>
                          <div className="ml-4">
                            <Button
                              variant="default"
                              size="sm"
                              disabled={quickFixLoading || selectedFixId === fix.id}
                              onClick={() => handleApplyFix(fix.id)}
                            >
                              {selectedFixId === fix.id ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Fixing...
                                </>
                              ) : (
                                <>
                                  <Zap className="h-4 w-4 mr-2" />
                                  Fix Now
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
