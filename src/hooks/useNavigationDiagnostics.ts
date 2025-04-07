
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
      return {
        results: diagnosticResults,
        errorCount: Object.values(diagnosticResults).flat().filter(r => r.status === "error").length,
        warningCount: Object.values(diagnosticResults).flat().filter(r => r.status === "warning").length,
        successCount: Object.values(diagnosticResults).flat().filter(r => r.status === "success").length,
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
