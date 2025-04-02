
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowRight, AlertTriangle, Zap, CheckCircle } from "lucide-react";
import { getOverallStatusColor } from "./StatusIcon";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";
import { QuickFix, useDiagnostics } from "@/hooks/useDiagnostics";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  const { applyQuickFix, quickFixLoading } = useDiagnostics();

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
              <div className="space-y-2">
                {quickFixes.slice(0, 3).map((fix) => (
                  <div key={fix.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center">
                      {getSeverityIcon(fix.severity)}
                      <div>
                        <span className="text-sm font-medium">{fix.name}</span>
                        <div className="flex items-center mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${getSeverityColor(fix.severity)}`}></span>
                          <span className="text-xs text-muted-foreground ml-1.5">{fix.area} | {fix.severity} priority</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => applyQuickFix(fix.id)}
                      disabled={quickFixLoading}
                      className="gap-1"
                    >
                      Apply Fix
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {quickFixes.length > 3 && (
                  <div className="text-center pt-1">
                    <Button variant="ghost" size="sm" className="text-sm">
                      View {quickFixes.length - 3} more issues
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm">No issues found requiring immediate action.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
