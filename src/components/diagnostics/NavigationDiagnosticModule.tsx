
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getNavigationDiagnosticsSummary } from "@/services/diagnostics/navigationDiagnostics";

export const NavigationDiagnosticModule = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticsResults, setDiagnosticsResults] = useState<any>(null);
  
  const runNavigationDiagnostics = async () => {
    setIsLoading(true);
    try {
      const results = await getNavigationDiagnosticsSummary();
      setDiagnosticsResults(results);
      
      if (results.errorCount > 0) {
        toast.error(`Found ${results.errorCount} navigation errors`, {
          description: "Check the diagnostics for details"
        });
      } else if (results.warningCount > 0) {
        toast.warning(`Found ${results.warningCount} navigation warnings`, {
          description: "Check the diagnostics for details"
        });
      } else {
        toast.success("All navigation routes are healthy", {
          description: `${results.totalRoutes} routes checked`
        });
      }
    } catch (error) {
      console.error("Error running navigation diagnostics:", error);
      toast.error("Failed to run navigation diagnostics");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation Diagnostics</CardTitle>
        <CardDescription>
          Check if all routes are configured correctly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button 
            onClick={runNavigationDiagnostics}
            disabled={isLoading}
          >
            {isLoading ? "Running Diagnostics..." : "Run Navigation Diagnostics"}
          </Button>
        </div>
        
        {diagnosticsResults && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="text-lg font-medium mb-2">Diagnostic Results</h3>
            <div>
              <p>Status: {diagnosticsResults.overallStatus}</p>
              <p>Total Routes: {diagnosticsResults.totalRoutes}</p>
              <p>Successful: {diagnosticsResults.successCount}</p>
              <p>Warnings: {diagnosticsResults.warningCount}</p>
              <p>Errors: {diagnosticsResults.errorCount}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NavigationDiagnosticModule;
