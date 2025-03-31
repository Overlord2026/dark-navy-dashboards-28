
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, CheckCircle, XCircle, ExternalLink, RefreshCw } from "lucide-react";
import { runQuickSystemCheck } from "@/services/diagnosticsService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const DiagnosticsOverview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticsResult, setDiagnosticsResult] = useState<any>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const result = await runQuickSystemCheck();
      setDiagnosticsResult(result);
      setLastRun(new Date().toISOString());
    } catch (error) {
      console.error("Diagnostics error:", error);
      toast.error("Failed to run diagnostics");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    runDiagnostics();
  }, []);
  
  const getStatusIcon = () => {
    if (!diagnosticsResult) return <Activity className="h-5 w-5 text-muted-foreground" />;
    
    const status = diagnosticsResult.status;
    if (status === "success") return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === "warning") return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };
  
  const getStatusText = () => {
    if (!diagnosticsResult) return "Not checked";
    
    const status = diagnosticsResult.status;
    if (status === "success") return "All systems operational";
    if (status === "warning") return "System issues detected";
    return "Critical issues detected";
  };
  
  const handleViewFullReport = () => {
    navigate("/system-diagnostics");
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Status
        </CardTitle>
        <CardDescription>
          {lastRun ? `Last checked: ${new Date(lastRun).toLocaleString()}` : "System has not been checked"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            disabled={isLoading}
            onClick={runDiagnostics}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Checking..." : "Refresh"}
          </Button>
        </div>
        
        {diagnosticsResult && diagnosticsResult.status !== "success" && (
          <div className="mt-4 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {diagnosticsResult.status === "warning" 
                ? "Some issues were detected that require attention" 
                : "Critical issues detected that require immediate attention"}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-1"
          onClick={handleViewFullReport}
        >
          <ExternalLink className="h-4 w-4" />
          View Full Diagnostic Report
        </Button>
      </CardFooter>
    </Card>
  );
};
