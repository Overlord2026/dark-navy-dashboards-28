
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, RefreshCw, Shield } from "lucide-react";
import { runDiagnostics } from "@/services/diagnostics/index";
import { DiagnosticTestStatus } from "@/types/diagnostics/common";

export interface DiagnosticsSummaryProps {
  showControls?: boolean;
  onRefresh?: () => void;
}

export const DiagnosticsSummary: React.FC<DiagnosticsSummaryProps> = ({
  showControls = true,
  onRefresh
}) => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const diagnosticResults = await runDiagnostics();
      setResults(diagnosticResults);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to run diagnostics'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const handleRefresh = () => {
    runTests();
    if (onRefresh) onRefresh();
  };

  const getStatusIcon = (status: DiagnosticTestStatus) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      case "error":
        return <Shield className="h-8 w-8 text-red-500" />;
      default:
        return <RefreshCw className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Diagnostics</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Running diagnostics...</p>
            </div>
          </div>
        ) : error ? (
          <div className="py-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-red-700">Diagnostics Error</h3>
            <p className="text-sm text-red-600 mt-1">{error.message}</p>
          </div>
        ) : results ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            {getStatusIcon(results.overall)}
            <h3 className="text-xl font-semibold">
              System Status: {results.overall.charAt(0).toUpperCase() + results.overall.slice(1)}
            </h3>
            <p className="text-center text-sm text-muted-foreground">
              Diagnostics ran successfully at {new Date(results.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p>No diagnostic results available</p>
          </div>
        )}
      </CardContent>
      {showControls && (
        <CardFooter className="flex justify-center">
          <Button onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Running..." : "Run Diagnostics"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
