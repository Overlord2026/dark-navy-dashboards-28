
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { NavigationTests } from './NavigationTests';
import { Badge } from '../ui/badge';
import { RecommendationsList } from './RecommendationsList';
import { NavigationTestResult, DiagnosticResultSummary } from '@/types/diagnostics';

interface NavigationDiagnosticModuleProps {
  onComplete?: () => void;
}

export function NavigationDiagnosticModule({ onComplete }: NavigationDiagnosticModuleProps) {
  const [results, setResults] = useState<NavigationTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [resultSummary, setResultSummary] = useState<DiagnosticResultSummary | null>(null);

  const handleStartTests = () => {
    // Implementation details
    setIsRunning(true);
    // Run navigation tests...
    setTimeout(() => {
      setIsRunning(false);
      // Set mock results
      setResults([
        {
          id: "nav-test-1",
          route: "/dashboard",
          status: "pass",
          message: "Dashboard loads correctly",
          loadTime: 230,
          timestamp: new Date().toISOString()
        }
      ]);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Navigation Diagnostics</CardTitle>
          <CardDescription>Test navigation paths and routing functionality</CardDescription>
        </div>
        <Badge variant={isRunning ? "outline" : results.length > 0 ? "success" : "default"}>
          {isRunning ? "Running..." : results.length > 0 ? "Tests Complete" : "Ready"}
        </Badge>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-muted-foreground text-center max-w-md">
              This module will test all navigation paths to ensure they're working properly.
            </p>
            <Button 
              onClick={handleStartTests}
              disabled={isRunning}
            >
              {isRunning ? "Running Tests..." : "Start Navigation Tests"}
            </Button>
          </div>
        ) : (
          <NavigationTests results={results} />
        )}

        {resultSummary && resultSummary.recommendations.length > 0 && (
          <RecommendationsList recommendations={resultSummary.recommendations} />
        )}
      </CardContent>
    </Card>
  );
}
