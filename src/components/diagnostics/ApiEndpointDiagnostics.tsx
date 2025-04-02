
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiDiagnostics } from '@/hooks/useApiDiagnostics';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, X, RotateCw, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ApiEndpointDiagnostics = () => {
  const { 
    results, 
    isRunning, 
    lastRun, 
    error, 
    runApiDiagnostics,
    getApiDiagnosticsSummary 
  } = useApiDiagnostics();
  
  // Run diagnostics on component mount if we don't have results yet
  useEffect(() => {
    if (results.length === 0 && !isRunning) {
      runApiDiagnostics();
    }
  }, [results.length, isRunning, runApiDiagnostics]);
  
  const summary = getApiDiagnosticsSummary();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">API Endpoint Diagnostics</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => runApiDiagnostics()}
              disabled={isRunning}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <RotateCw className={`h-4 w-4 ${isRunning ? "animate-spin" : ""}`} />
              Run Diagnostics
            </Button>
            {lastRun && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs">
                  {new Date(lastRun).toLocaleTimeString()}
                </span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
            <p className="font-semibold">Error running API diagnostics:</p>
            <p>{error.message}</p>
          </div>
        )}
        
        <div className="mb-4 grid grid-cols-4 gap-3 text-center">
          <div className="p-3 border rounded-md">
            <div className="text-lg font-bold">{summary.total}</div>
            <div className="text-sm text-muted-foreground">Total Endpoints</div>
          </div>
          <div className="p-3 border rounded-md bg-green-50 border-green-200">
            <div className="text-lg font-bold text-green-600">{summary.success}</div>
            <div className="text-sm text-green-700">Success</div>
          </div>
          <div className="p-3 border rounded-md bg-amber-50 border-amber-200">
            <div className="text-lg font-bold text-amber-600">{summary.warnings}</div>
            <div className="text-sm text-amber-700">Warnings</div>
          </div>
          <div className="p-3 border rounded-md bg-red-50 border-red-200">
            <div className="text-lg font-bold text-red-600">{summary.errors}</div>
            <div className="text-sm text-red-700">Errors</div>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left">Endpoint</th>
                <th className="px-4 py-2 text-left">Method</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Response Time</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isRunning ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <RotateCw className="h-6 w-6 animate-spin mb-2" />
                      <p>Testing API endpoints...</p>
                    </div>
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    No API diagnostics data available
                  </td>
                </tr>
              ) : (
                results.map((result, index) => (
                  <tr key={index} className="hover:bg-muted/30">
                    <td className="px-4 py-3 overflow-hidden text-ellipsis">
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[220px]">
                        {result.url}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={
                        result.method === "GET" ? "bg-blue-50 border-blue-200 text-blue-800" :
                        result.method === "POST" ? "bg-green-50 border-green-200 text-green-800" :
                        result.method === "PUT" ? "bg-amber-50 border-amber-200 text-amber-800" :
                        result.method === "DELETE" ? "bg-red-50 border-red-200 text-red-800" :
                        ""
                      }>
                        {result.method}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {result.status === 'success' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : result.status === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                        {result.status === 'success' ? (
                          <span className="text-green-600">Success</span>
                        ) : result.status === 'warning' ? (
                          <span className="text-amber-600">Warning</span>
                        ) : (
                          <span className="text-red-600">Error</span>
                        )}
                      </div>
                      {result.errorMessage && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {result.errorMessage}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-mono">
                        {result.responseTime.toFixed(0)}ms
                      </div>
                      {result.responseStatus && (
                        <div className="text-xs text-muted-foreground">
                          Status: {result.responseStatus}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
