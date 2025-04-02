
import React, { useEffect } from 'react';
import { useApiDiagnostics } from '@/hooks/useApiDiagnostics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusIcon } from './StatusIcon';
import { Button } from '@/components/ui/button';
import { RefreshCw, Server } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDiagnosticsContext } from '@/context/DiagnosticsContext';

export function ApiEndpointDiagnostics() {
  const {
    results,
    isRunning,
    lastRun,
    error,
    runApiDiagnostics,
    getApiDiagnosticsSummary
  } = useApiDiagnostics();
  
  const { isDevelopmentMode } = useDiagnosticsContext();
  
  // Run diagnostics once when the component mounts
  useEffect(() => {
    if (isDevelopmentMode && results.length === 0) {
      runApiDiagnostics();
    }
  }, [isDevelopmentMode, results.length, runApiDiagnostics]);
  
  const summary = getApiDiagnosticsSummary();
  
  const getStatusColor = (status: 'success' | 'warning' | 'error'): string => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/20';
    }
  };
  
  const getMethodColor = (method: string): string => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'POST':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'PUT':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            <CardTitle>API Endpoint Diagnostics</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runApiDiagnostics}
            disabled={isRunning}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running...' : 'Run Diagnostics'}
          </Button>
        </div>
        
        {lastRun && (
          <div className="text-xs text-muted-foreground">
            Last run: {new Date(lastRun).toLocaleString()}
          </div>
        )}
        
        {summary.total > 0 && (
          <div className="flex items-center gap-2 text-sm mt-1">
            <Badge variant={summary.overall === 'success' ? 'success' : summary.overall}>
              {summary.overall.toUpperCase()}
            </Badge>
            <span>
              {summary.success} succeeded, {summary.warnings} warnings, {summary.errors} errors
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 border rounded-md border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
            <p className="font-medium">Error running diagnostics</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}
        
        {isRunning && results.length === 0 && (
          <div className="flex justify-center items-center p-6">
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Running API diagnostics...</p>
            </div>
          </div>
        )}
        
        {!isRunning && results.length === 0 && (
          <div className="text-center p-6 border rounded-md border-dashed">
            <Server className="h-8 w-8 mx-auto text-muted-foreground" />
            <h3 className="mt-2 font-medium">No API Diagnostics Run Yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Run the diagnostics to test all API endpoints in the application.
            </p>
            <Button
              variant="secondary"
              onClick={runApiDiagnostics}
              className="mt-4"
            >
              Run Now
            </Button>
          </div>
        )}
        
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <Collapsible
                key={index}
                className={`rounded-md border ${getStatusColor(result.status)}`}
              >
                <CollapsibleTrigger className="w-full p-3 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={result.status} />
                      <div>
                        <span className="font-medium">{result.name}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Badge variant="outline" className={`text-xs ${getMethodColor(result.method)}`}>
                            {result.method}
                          </Badge>
                          <span>{result.url}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={result.status}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <Separator />
                  <div className="p-3 text-sm space-y-2">
                    <div>
                      <span className="font-medium">Response Time:</span>{' '}
                      <span className={
                        result.responseTime < 200 
                          ? 'text-green-600 dark:text-green-400' 
                          : result.responseTime < 1000 
                            ? 'text-amber-600 dark:text-amber-400' 
                            : 'text-red-600 dark:text-red-400'
                      }>
                        {result.responseTime}ms
                      </span>
                    </div>
                    
                    {result.responseStatus && (
                      <div>
                        <span className="font-medium">HTTP Status:</span>{' '}
                        <span className={
                          result.responseStatus >= 200 && result.responseStatus < 300
                            ? 'text-green-600 dark:text-green-400'
                            : result.responseStatus >= 300 && result.responseStatus < 400
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-red-600 dark:text-red-400'
                        }>
                          {result.responseStatus}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium">Expected Data:</span>{' '}
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">
                        {result.expectedDataStructure}
                      </code>
                    </div>
                    
                    {result.actualDataStructure && (
                      <div>
                        <span className="font-medium">Actual Data:</span>{' '}
                        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">
                          {result.actualDataStructure}
                        </code>
                        {' '}
                        <span className={result.structureMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {result.structureMatch ? '(Matches)' : '(Mismatch)'}
                        </span>
                      </div>
                    )}
                    
                    {result.authStatus && (
                      <div>
                        <span className="font-medium">Auth Status:</span>{' '}
                        <span className={
                          result.authStatus === 'valid'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }>
                          {result.authStatus}
                        </span>
                      </div>
                    )}
                    
                    {result.errorMessage && (
                      <div className="mt-3 p-2 border rounded-md border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
                        <span className="font-medium">Error:</span>{' '}
                        <span>{result.errorMessage}</span>
                      </div>
                    )}
                    
                    {result.status === 'warning' && !result.errorMessage && (
                      <div className="mt-3 p-2 border rounded-md border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/20 dark:text-yellow-300">
                        <span className="font-medium">Warning:</span>{' '}
                        <span>The API call completed but with warnings.</span>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
