
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowRight, AlertTriangle, Zap, CheckCircle, History, InfoIcon, Wrench } from "lucide-react";
import { getOverallStatusColor } from "./StatusIcon";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";
import { QuickFix, useDiagnostics } from "@/hooks/useDiagnostics";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { FixHistoryLog } from "./FixHistoryLog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DiagnosticsWizard } from "./DiagnosticsWizard";

interface DiagnosticsHeaderProps {
  isLoading: boolean;
  timestamp: string | null;
  status: DiagnosticTestStatus;
  quickFixes: QuickFix[];
}

export const DiagnosticsHeader = ({ 
  isLoading, 
  timestamp, 
  status, 
  quickFixes 
}: DiagnosticsHeaderProps) => {
  const { applyQuickFix, quickFixLoading, refreshDiagnostics } = useDiagnostics();
  const [rerunning, setRerunning] = useState(false);
  const [showFixHistory, setShowFixHistory] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedFix, setSelectedFix] = useState<string | null>(null);

  // Get color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />;
      case 'medium':
        return <Zap className="h-4 w-4 text-yellow-500 mr-2" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />;
      default:
        return <Zap className="h-4 w-4 text-gray-500 mr-2" />;
    }
  };

  // Get health percentage based on status
  const getHealthPercentage = () => {
    switch (status) {
      case 'success':
        return 100;
      case 'warning':
        return 70;
      case 'error':
        return 30;
      default:
        return 50;
    }
  };

  // Handle re-running diagnostics
  const handleRerunDiagnostics = async () => {
    setRerunning(true);
    try {
      await refreshDiagnostics();
      toast.success("Diagnostics check completed", {
        description: "System status has been updated"
      });
    } catch (error) {
      toast.error("Failed to run diagnostics", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setRerunning(false);
    }
  };

  // Handle applying a quick fix
  const handleApplyFix = async (fixId: string) => {
    setSelectedFix(fixId);
    try {
      const result = await applyQuickFix(fixId);
      if (result) {
        const fixTitle = quickFixes.find(f => f.id === fixId)?.title || "issue"; // Changed from 'name' to 'title'
        toast.success(`Fixed: ${fixTitle}`, {
          description: "The issue has been resolved successfully"
        });
      } else {
        toast.error("Failed to apply fix", {
          description: "Please try again or contact support"
        });
      }
    } catch (error) {
      toast.error("Error applying fix", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setSelectedFix(null);
    }
  };

  // Group fixes by severity for better organization
  const getGroupedFixes = () => {
    const high = quickFixes.filter(fix => fix.severity === 'high');
    const medium = quickFixes.filter(fix => fix.severity === 'medium');
    const low = quickFixes.filter(fix => fix.severity === 'low');
    const other = quickFixes.filter(fix => !['high', 'medium', 'low'].includes(fix.severity));
    
    return { high, medium, low, other };
  };

  const groupedFixes = getGroupedFixes();

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Card */}
          <div className="col-span-1 flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-semibold">System Status</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getOverallStatusColor(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {timestamp ? `Last check: ${new Date(timestamp).toLocaleString()}` : 'No diagnostics run yet'}
            </p>
            
            <div className="mt-1 mb-4 flex gap-2">
              <Button 
                onClick={handleRerunDiagnostics} 
                disabled={rerunning || isLoading}
                className="flex-1 gap-2"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 ${rerunning ? 'animate-spin' : ''}`} />
                {rerunning ? 'Re-checking...' : 'Re-run Diagnostics'}
              </Button>
              
              <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="default"
                    className="gap-2"
                    disabled={isLoading || rerunning}
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
            </div>
            
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-3 gap-1 text-xs text-muted-foreground"
                onClick={() => setShowFixHistory(!showFixHistory)}
              >
                <History className="h-3.5 w-3.5" />
                {showFixHistory ? 'Hide Fix History' : 'Show Fix History'}
              </Button>
              
              {showFixHistory && <FixHistoryLog />}
            </div>
            
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">Health</span>
                <span className="text-sm font-medium">{getHealthPercentage()}%</span>
              </div>
              <Progress 
                value={getHealthPercentage()} 
                className="h-2.5" 
                indicatorClassName={
                  status === "success" ? "bg-green-500" : 
                  status === "warning" ? "bg-yellow-500" : 
                  "bg-red-500"
                }
              />
            </div>
          </div>
          
          {/* Quick Fixes */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Recommended Actions</h3>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">{quickFixes.length} issue{quickFixes.length > 1 ? 's' : ''} found</span>
                {isLoading && <RefreshCw className="ml-2 h-3 w-3 animate-spin" />}
              </div>
            </div>
            
            {quickFixes.length > 0 ? (
              <div className="space-y-4">
                {/* High severity fixes */}
                {groupedFixes.high.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500 mr-1.5" />
                      Critical Issues
                    </h4>
                    {groupedFixes.high.slice(0, 2).map((fix) => (
                      <div key={fix.id} className="flex items-center justify-between p-3 rounded-lg border border-red-200 dark:border-red-800/60 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <div className="flex items-center">
                          {getSeverityIcon(fix.severity)}
                          <div>
                            <span className="text-sm font-medium">{fix.title}</span> {/* Changed from 'name' to 'title' */}
                            <div className="flex items-center mt-0.5">
                              <span className={`w-2 h-2 rounded-full ${getSeverityColor(fix.severity)}`}></span>
                              <span className="text-xs text-muted-foreground ml-1.5">{fix.area} | {fix.severity} priority</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-1 h-7">
                                <InfoIcon className="h-3 w-3" />
                                <span className="hidden sm:inline">Details</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{fix.title}</DialogTitle> {/* Changed from 'name' to 'title' */}
                                <DialogDescription>Issue details and recommended fix</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="flex items-center gap-2">
                                  <Badge className={`px-2 py-0.5 ${getSeverityBadgeClass(fix.severity)}`}>
                                    {fix.severity} priority
                                  </Badge>
                                  <Badge variant="outline">{fix.area}</Badge>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-medium">Description</h4>
                                  <p className="text-sm">{fix.description}</p>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-medium">Impact</h4>
                                  <p className="text-sm">
                                    This issue may affect {fix.area.toLowerCase()} functionality and should be addressed immediately.
                                  </p>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-medium">Recommended Action</h4>
                                  <p className="text-sm">
                                    Click "Apply Fix" to automatically resolve this issue.
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex justify-end">
                                <Button 
                                  onClick={() => handleApplyFix(fix.id)}
                                  disabled={quickFixLoading || selectedFix === fix.id}
                                >
                                  {selectedFix === fix.id ? "Applying..." : "Apply Fix"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            size="sm" 
                            onClick={() => handleApplyFix(fix.id)}
                            disabled={quickFixLoading || selectedFix === fix.id}
                            className="gap-1"
                          >
                            {selectedFix === fix.id ? (
                              <>
                                <RefreshCw className="h-3 w-3 animate-spin" />
                                Fixing...
                              </>
                            ) : (
                              <>
                                Apply Fix
                                <ArrowRight className="h-3 w-3" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Medium severity fixes */}
                {groupedFixes.medium.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center">
                      <Zap className="h-3.5 w-3.5 text-yellow-500 mr-1.5" />
                      Important Issues
                    </h4>
                    {groupedFixes.medium.slice(0, 1).map((fix) => (
                      <div key={fix.id} className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 dark:border-yellow-800/60 bg-yellow-50/50 dark:bg-yellow-900/10 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
                        <div className="flex items-center">
                          {getSeverityIcon(fix.severity)}
                          <div>
                            <span className="text-sm font-medium">{fix.title}</span> {/* Changed from 'name' to 'title' */}
                            <div className="flex items-center mt-0.5">
                              <span className={`w-2 h-2 rounded-full ${getSeverityColor(fix.severity)}`}></span>
                              <span className="text-xs text-muted-foreground ml-1.5">{fix.area} | {fix.severity} priority</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleApplyFix(fix.id)}
                          disabled={quickFixLoading || selectedFix === fix.id}
                          className="gap-1"
                          variant="secondary"
                        >
                          {selectedFix === fix.id ? "Fixing..." : "Apply Fix"}
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Low severity fixes */}
                {(groupedFixes.low.length > 0 || groupedFixes.other.length > 0) && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center">
                      <CheckCircle className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                      Other Issues
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[...groupedFixes.low, ...groupedFixes.other].slice(0, 2).map((fix) => (
                        <div key={fix.id} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-sm font-medium">{fix.title}</span> {/* Changed from 'name' to 'title' */}
                              <div className="text-xs text-muted-foreground mt-0.5">{fix.area}</div>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => handleApplyFix(fix.id)}
                              disabled={quickFixLoading || selectedFix === fix.id}
                              variant="ghost"
                              className="h-7 px-2"
                            >
                              Fix
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {quickFixes.length > 4 && (
                  <div className="text-center pt-2">
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={() => setIsWizardOpen(true)}
                      className="text-sm"
                    >
                      View all {quickFixes.length} issues in repair wizard
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-5 rounded-lg border border-green-200 dark:border-green-800 flex flex-col items-center">
                <CheckCircle className="h-10 w-10 mb-2" />
                <p className="text-center">All system checks passed! No issues found requiring immediate action.</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={handleRerunDiagnostics}
                  className="mt-2"
                >
                  Run another check
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get severity badge class
const getSeverityBadgeClass = (severity?: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    case 'low':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    default:
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  }
};
