
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useAccessibilityAudit } from "@/hooks/useAccessibilityAudit";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function AccessibilityAudit() {
  const { auditResults, isRunning, runAudit, auditSummary } = useAccessibilityAudit();

  return (
    <ThreeColumnLayout 
      activeMainItem="diagnostics" 
      title="Accessibility Audit"
    >
      <div className="space-y-6 p-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Accessibility Audit</h1>
          <p className="text-muted-foreground mt-1">
            Scan your application for accessibility issues and get recommendations for fixes
          </p>
        </div>

        <div className="mb-6">
          <Button 
            onClick={runAudit} 
            disabled={isRunning}
            className="mb-4"
          >
            {isRunning ? 'Running Audit...' : 'Run Accessibility Audit'}
          </Button>
          
          {auditResults.length === 0 && !isRunning && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No audit results</AlertTitle>
              <AlertDescription>
                Run an audit to check your application for accessibility issues.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {auditResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Audit Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {auditSummary.critical}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">Critical Issues</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {auditSummary.serious}
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-400">Serious Issues</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {auditSummary.moderate}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">Moderate Issues</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {auditSummary.minor}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Minor Issues</div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Issues Found</h2>
              <div className="space-y-4">
                {auditResults.map((issue) => (
                  <div 
                    key={issue.id}
                    className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className={`h-3 w-3 rounded-full ${
                          issue.impact === 'critical' ? 'bg-red-500' : 
                          issue.impact === 'serious' ? 'bg-orange-500' : 
                          issue.impact === 'moderate' ? 'bg-yellow-500' : 
                          'bg-blue-500'
                        }`}
                      />
                      <h3 className="font-medium">{issue.rule}</h3>
                    </div>
                    <p className="text-muted-foreground mt-2">{issue.message}</p>
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Element:</span> {issue.element}
                    </div>
                    {issue.recommendation && (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-800">
                        <span className="font-medium">Recommendation:</span> {issue.recommendation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ThreeColumnLayout>
  );
}
