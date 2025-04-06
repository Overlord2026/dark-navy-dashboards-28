
import React, { useState, useEffect } from "react";
import { DiagnosticResultItem } from "@/components/diagnostics/DiagnosticResultItem";
import { Button } from "@/components/ui/button";
import { DiagnosticResult } from "@/types/diagnostics";
import { RefreshCw } from "lucide-react";

interface SimpleDiagnosticsViewProps {
  title: string;
  description?: string;
  results: DiagnosticResult[];
  onRunDiagnostics?: () => Promise<void>;
  loading?: boolean;
  showRefreshButton?: boolean;
  emptyMessage?: string;
}

export const SimpleDiagnosticsView = ({
  title,
  description,
  results,
  onRunDiagnostics,
  loading = false,
  showRefreshButton = true,
  emptyMessage = "No diagnostic results available"
}: SimpleDiagnosticsViewProps) => {
  // State for handling async loading
  const [isLoading, setIsLoading] = useState(loading);
  
  // Update local loading state when prop changes
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // Handle running diagnostics
  const handleRunDiagnostics = async () => {
    if (!onRunDiagnostics) return;
    
    setIsLoading(true);
    try {
      await onRunDiagnostics();
    } catch (error) {
      console.error("Error running diagnostics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate counts
  const successCount = results.filter(r => r.status === "success").length;
  const warningCount = results.filter(r => r.status === "warning").length;
  const errorCount = results.filter(r => r.status === "error").length;
  const totalTests = results.length;

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow">
      <div className="flex flex-col space-y-1.5 p-6 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
          {onRunDiagnostics && showRefreshButton && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRunDiagnostics}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Running...' : 'Run Tests'}</span>
            </Button>
          )}
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      
      {totalTests > 0 && (
        <div className="flex items-center justify-between px-6 pb-4">
          <div className="flex gap-3 text-sm">
            <span className="text-green-500">{successCount} passed</span>
            {warningCount > 0 && <span className="text-yellow-500">{warningCount} warnings</span>}
            {errorCount > 0 && <span className="text-red-500">{errorCount} errors</span>}
          </div>
          <span className="text-sm text-muted-foreground">{totalTests} tests total</span>
        </div>
      )}
      
      <div className="p-0">
        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground">
            <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin opacity-70" />
            <p>Running diagnostics...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>{emptyMessage}</p>
            {onRunDiagnostics && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRunDiagnostics}
                className="mt-4"
              >
                Run Diagnostics
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {results.map((result, index) => (
              <DiagnosticResultItem key={result.id || index} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
