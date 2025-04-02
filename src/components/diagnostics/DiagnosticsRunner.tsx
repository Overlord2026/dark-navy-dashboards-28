
import { useState } from "react";
import { runDiagnostics, runQuickSystemCheck } from "@/services/diagnosticsService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Check, Shell, Zap } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function DiagnosticsRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [quickCheckResult, setQuickCheckResult] = useState<any>(null);
  const navigate = useNavigate();
  
  const runQuickCheck = async () => {
    setIsRunning(true);
    try {
      toast.info("Running quick system check...");
      const result = await runQuickSystemCheck();
      setQuickCheckResult(result);
      
      if (result.success) {
        toast.success(`Quick check complete: ${result.status}`, {
          description: "Check the details for more information"
        });
      } else {
        toast.error("Quick system check failed", {
          description: result.error || "Unknown error occurred"
        });
      }
    } catch (error) {
      console.error("Error running quick check:", error);
      toast.error("Failed to run system check", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const goToFullDiagnostics = () => {
    navigate("/system-diagnostics");
  };
  
  const getStatusIcon = () => {
    if (!quickCheckResult) return null;
    
    if (!quickCheckResult.success) {
      return <AlertTriangle className="h-8 w-8 text-red-500" />;
    }
    
    switch (quickCheckResult.status) {
      case "success":
        return <Check className="h-8 w-8 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      default:
        return <Shell className="h-8 w-8 text-gray-500" />;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shell className="h-5 w-5" />
          System Diagnostics
        </CardTitle>
        <CardDescription>
          Check the health of your application and identify issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        {quickCheckResult ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            {getStatusIcon()}
            <h3 className="text-xl font-semibold">
              System Status: {quickCheckResult.status?.charAt(0).toUpperCase() + quickCheckResult.status?.slice(1) || "Unknown"}
            </h3>
            {quickCheckResult.success ? (
              <div className="text-center text-sm text-muted-foreground">
                <p>Diagnostics ran successfully at {new Date(quickCheckResult.timestamp).toLocaleTimeString()}</p>
                {quickCheckResult.result?.overall !== "success" && (
                  <p className="mt-2">Some issues were detected. Run a full diagnostics for more details.</p>
                )}
              </div>
            ) : (
              <div className="text-center text-sm text-red-500">
                <p>Diagnostics failed: {quickCheckResult.error || "Unknown error"}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Shell className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              Run a quick system check to evaluate the health of your application
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={runQuickCheck} 
          disabled={isRunning}
          className="gap-2"
        >
          <Zap className={`h-4 w-4 ${isRunning ? "animate-spin" : ""}`} />
          {isRunning ? "Running..." : "Quick Check"}
        </Button>
        <Button onClick={goToFullDiagnostics} className="gap-2">
          <Shell className="h-4 w-4" />
          Full Diagnostics
        </Button>
      </CardFooter>
    </Card>
  );
}
