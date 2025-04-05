import { useState, useCallback } from 'react';
import { ApiEndpointDiagnosticResult } from '@/services/diagnostics/types';
import { testApiEndpoints } from '@/services/diagnostics/apiDiagnostics';
import { toast } from 'sonner';

export function useApiDiagnostics() {
  const [results, setResults] = useState<ApiEndpointDiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const runApiDiagnostics = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      const diagnosticResults = await testApiEndpoints();
      // Convert ApiEndpointTestResult[] to ApiEndpointDiagnosticResult[]
      const convertedResults: ApiEndpointDiagnosticResult[] = diagnosticResults.map(result => ({
        ...result,
        expectedDataStructure: result.expectedDataStructure || "Unknown data structure",
      }));
      
      setResults(convertedResults);
      setLastRun(new Date().toISOString());
      
      // Disable toast notifications for API diagnostics
      // const errorCount = diagnosticResults.filter(r => r.status === 'error').length;
      // const warningCount = diagnosticResults.filter(r => r.status === 'warning').length;
      
      // if (errorCount > 0) {
      //   toast.error(`API Diagnostics complete with ${errorCount} errors`, {
      //     description: `${warningCount} warnings were also found.`
      //   });
      // } else if (warningCount > 0) {
      //   toast.warning(`API Diagnostics complete with ${warningCount} warnings`, {
      //     description: 'No critical errors were found.'
      //   });
      // } else {
      //   toast.success('API Diagnostics completed successfully', {
      //     description: 'All API endpoints are operating as expected.'
      //   });
      // }
      
      return convertedResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      // Only keep permission-related toast errors
      if (errorMessage.toLowerCase().includes("permission")) {
        toast.error('API Diagnostics failed to run', {
          description: errorMessage
        });
      }
      
      return [];
    } finally {
      setIsRunning(false);
    }
  }, []);

  const getApiDiagnosticsSummary = useCallback(() => {
    const total = results.length;
    const successCount = results.filter(r => r.status === 'success').length;
    const warningCount = results.filter(r => r.status === 'warning').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    let overall: "success" | "warning" | "error" = "success";
    if (errorCount > 0) {
      overall = "error";
    } else if (warningCount > 0) {
      overall = "warning";
    }

    return {
      overall,
      total,
      success: successCount,
      warnings: warningCount,
      errors: errorCount,
      timestamp: lastRun || new Date().toISOString()
    };
  }, [results, lastRun]);

  return {
    results,
    isRunning,
    lastRun,
    error,
    runApiDiagnostics,
    getApiDiagnosticsSummary
  };
}
