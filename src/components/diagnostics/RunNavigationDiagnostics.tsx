
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigationDiagnostics } from "@/hooks/useNavigationDiagnostics";
import { NavigationTestResult } from "@/types/diagnostics";

export const RunNavigationDiagnostics: React.FC = () => {
  const { runDiagnostics, isRunning, results } = useNavigationDiagnostics();
  const [showResults, setShowResults] = useState(false);
  
  const handleRunDiagnostics = async () => {
    try {
      const data = await runDiagnostics();
      if (data) {
        setShowResults(true);
        
        // Get all results flattened
        const allResults = Object.values(data.results).flat();
        const errorCount = allResults.filter(r => r.status === "error").length;
        const warningCount = allResults.filter(r => r.status === "warning").length;
        
        if (errorCount > 0) {
          toast.error(`Found ${errorCount} navigation errors`);
        } else if (warningCount > 0) {
          toast.warning(`Found ${warningCount} navigation warnings`);
        } else {
          toast.success("All navigation routes are working properly");
        }
      }
    } catch (error) {
      toast.error("Failed to run navigation diagnostics");
      console.error(error);
    }
  };
  
  const getStatusColor = (status: NavigationTestResult['status']) => {
    switch (status) {
      case "success": return "bg-green-100 border-green-200 text-green-800";
      case "warning": return "bg-yellow-100 border-yellow-200 text-yellow-800";
      case "error": return "bg-red-100 border-red-200 text-red-800";
      default: return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };
  
  const renderTestResults = (tests: NavigationTestResult[]) => {
    return tests.map((test) => (
      <div 
        key={test.id} 
        className={`p-2 mb-2 rounded border ${getStatusColor(test.status)}`}
      >
        <div className="font-medium">{test.route}</div>
        <div className="text-sm">{test.message}</div>
      </div>
    ));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Navigation Menu Diagnostics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-4">
            Run a diagnostic test on all navigation routes to ensure they are working properly.
          </p>
          <Button 
            onClick={handleRunDiagnostics} 
            disabled={isRunning}
          >
            {isRunning ? "Running Diagnostics..." : "Run Navigation Diagnostics"}
          </Button>
        </div>
        
        {showResults && results && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg">Diagnostic Results</h3>
            
            {Object.entries(results).map(([category, tests]) => (
              <div key={category} className="mb-4">
                <h4 className="font-medium mb-2 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h4>
                {tests.length > 0 ? renderTestResults(tests) : (
                  <p className="text-sm text-muted-foreground">No tests for this category</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {isRunning ? "Running tests..." : "Ready to run diagnostics"}
      </CardFooter>
    </Card>
  );
};

export default RunNavigationDiagnostics;
