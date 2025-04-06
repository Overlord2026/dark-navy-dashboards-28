
import { useState } from "react";
import { NavigationTestResult } from "@/types/diagnostics";
import { testAllNavigationRoutes } from "@/services/diagnostics/navigationDiagnostics";

export function useNavigationDiagnostics() {
  const [results, setResults] = useState<NavigationTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      const diagnosticResults = await testAllNavigationRoutes();
      setResults(diagnosticResults);
      return diagnosticResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsRunning(false);
    }
  };

  const getDiagnosticSummary = () => {
    const totalRoutes = results.length;
    const successCount = results.filter(r => r.status === "success").length;
    const warningCount = results.filter(r => r.status === "warning").length;
    const errorCount = results.filter(r => r.status === "error").length;
    
    let overall: "success" | "warning" | "error" = "success";
    if (errorCount > 0) {
      overall = "error";
    } else if (warningCount > 0) {
      overall = "warning";
    }

    return {
      overall,
      total: totalRoutes,
      success: successCount,
      warnings: warningCount,
      errors: errorCount,
      timestamp: new Date().toISOString()
    };
  };

  return {
    results,
    isRunning,
    error,
    runDiagnostics,
    getDiagnosticSummary
  };
}
