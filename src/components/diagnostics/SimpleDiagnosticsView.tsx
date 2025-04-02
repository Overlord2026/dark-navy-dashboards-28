
import React, { useEffect, useState } from 'react';
import { testNavigation } from '@/services/diagnostics/navigationTests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDiagnosticsContext } from '@/context/DiagnosticsContext';

interface DiagnosticResult {
  route: string;
  status: 'success' | 'warning' | 'error';
  message?: string;
}

/**
 * SimpleDiagnosticsView - A developer-friendly component that shows basic diagnostics results
 * 
 * This is a simplified version of the full diagnostics system, designed for quick checks
 * during development. It runs navigation diagnostics and displays the results in a
 * clean, easy-to-understand format.
 */
const SimpleDiagnosticsView: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDevelopmentMode, isDiagnosticsModeEnabled } = useDiagnosticsContext();
  
  // Only show in development mode or when diagnostics are enabled
  const isVisible = isDevelopmentMode || isDiagnosticsModeEnabled;

  useEffect(() => {
    if (!isVisible) return;

    const runDiagnostics = async () => {
      try {
        setLoading(true);
        const navResults = await testNavigation();
        setResults(navResults);
      } catch (error) {
        console.error('Error running diagnostics:', error);
      } finally {
        setLoading(false);
      }
    };

    runDiagnostics();
    
    // Refresh diagnostics every 2 minutes
    const intervalId = setInterval(runDiagnostics, 120000);
    return () => clearInterval(intervalId);
  }, [isVisible]);

  if (!isVisible) return null;
  
  // Calculate summary counts
  const getStats = () => {
    const total = results.length;
    const success = results.filter(r => r.status === 'success').length;
    const warning = results.filter(r => r.status === 'warning').length;
    const error = results.filter(r => r.status === 'error').length;
    
    return { total, success, warning, error };
  };
  
  const stats = getStats();

  return (
    <Card className="max-w-md mx-auto my-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Navigation Diagnostics</span>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {stats.success} OK
          </Badge>
          {stats.warning > 0 && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              {stats.warning} Warnings
            </Badge>
          )}
          {stats.error > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {stats.error} Errors
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading && results.length === 0 ? (
          <div className="flex flex-col items-center py-4">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">Running diagnostics...</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {results.map((result) => (
              <li 
                key={result.route} 
                className={`p-3 rounded-md flex items-start justify-between
                  ${result.status === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 
                   result.status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                   'bg-red-50 dark:bg-red-900/20'}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : result.status === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">{result.route}</span>
                  </div>
                  {result.message && (
                    <p className="text-sm mt-1 ml-6">{result.message}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <div className="text-xs text-muted-foreground mt-4 text-right">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleDiagnosticsView;
