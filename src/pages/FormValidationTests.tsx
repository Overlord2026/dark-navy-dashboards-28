
import React, { useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { useFormValidationDiagnostics } from "@/hooks/useFormValidationDiagnostics";
import { FormValidationTestResults } from "@/components/diagnostics/FormValidationTestResults";
import { PlayCircle, RefreshCw } from "lucide-react";
import { FormValidationTestResult } from "@/services/diagnostics/types";

export default function FormValidationTests() {
  const {
    results,
    isRunning,
    lastRun,
    error,
    availableForms,
    runAllFormTests,
    runFormTest,
    loadAvailableForms
  } = useFormValidationDiagnostics();

  useEffect(() => {
    loadAvailableForms();
  }, [loadAvailableForms]);

  const handleRunAllTests = async () => {
    await runAllFormTests();
  };

  const handleRunFormTest = async (formId: string, testIndex?: number) => {
    await runFormTest(formId, testIndex);
  };

  return (
    <ThreeColumnLayout activeMainItem="diagnostics" title="Form Validation Tests">
      <div className="space-y-6 p-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Form Validation Tests</h1>
            <p className="text-muted-foreground mt-1">
              Test all application forms with valid and invalid data
            </p>
            {lastRun && (
              <p className="text-xs text-muted-foreground mt-1">
                Last run: {new Date(lastRun).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isRunning}
              onClick={loadAvailableForms}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              size="sm"
              disabled={isRunning}
              onClick={handleRunAllTests}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Run All Tests
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-300 text-red-600 p-4 rounded-md">
            <h3 className="font-medium">Error</h3>
            <p>{error.message}</p>
          </div>
        )}

        <FormValidationTestResults
          results={results}
          isRunning={isRunning}
          onRunTest={handleRunFormTest}
        />

        {availableForms.length > 0 && results.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <h3 className="font-medium mb-2">Available Form Tests</h3>
            <p className="text-muted-foreground mb-4">
              {availableForms.length} form tests are available to run
            </p>
            <Button onClick={handleRunAllTests} disabled={isRunning}>
              {isRunning ? "Running Tests..." : "Run All Form Tests"}
            </Button>
          </div>
        )}
      </div>
    </ThreeColumnLayout>
  );
}
