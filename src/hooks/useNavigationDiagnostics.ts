
import { useState } from 'react';
import { testAllNavigationRoutes } from '@/services/diagnostics/navigationDiagnostics';
import { NavigationTestResult } from '@/types/diagnostics';

export const useNavigationDiagnostics = () => {
  const [results, setResults] = useState<Record<string, NavigationTestResult[]>>({});
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const diagnosticResults = await testAllNavigationRoutes();
      setResults(diagnosticResults);
      
      // Count results by status for the summary
      const allResults = Object.values(diagnosticResults).flat();
      const errorCount = allResults.filter(r => r.status === "error").length;
      const warningCount = allResults.filter(r => r.status === "warning").length;
      const successCount = allResults.filter(r => r.status === "success").length;
      
      return {
        results: diagnosticResults,
        errorCount,
        warningCount,
        successCount,
      };
    } catch (error) {
      console.error("Navigation diagnostics error:", error);
      throw error;
    } finally {
      setIsRunning(false);
    }
  };

  return { runDiagnostics, results, isRunning };
};
