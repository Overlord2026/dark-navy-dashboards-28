
import React, { useState, FC, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";
import { FormValidationTestResult } from "@/services/diagnostics/types";

interface FormValidationTestResultsProps {
  results: any[];
  isRunning: boolean;
  onRunTest: (formId: string, testIndex?: number) => void;
}

export const FormValidationTestResults: FC<FormValidationTestResultsProps> = ({
  results,
  isRunning,
  onRunTest,
}) => {
  const [expandedForms, setExpandedForms] = useState<Record<string, boolean>>({});

  const toggleFormExpanded = useCallback((formId: string) => {
    setExpandedForms((prev) => ({
      ...prev,
      [formId]: !prev[formId],
    }));
  }, []);

  if (results.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No form validation test results available. Run tests to see results here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => {
        const lastTestResult = result.lastTestResult as FormValidationTestResult;
        const isExpanded = expandedForms[result.form] || false;
        const hasValidationIssues = lastTestResult?.validationDetails?.invalidFields?.length > 0 ||
                                   lastTestResult?.validationDetails?.unexpectedErrors?.length > 0 ||
                                   lastTestResult?.validationDetails?.missingErrors?.length > 0;

        return (
          <Card key={`${result.form}-${index}`} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFormExpanded(result.form)}
              >
                <div className="flex items-center gap-2">
                  {lastTestResult?.status === "error" ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : lastTestResult?.status === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  
                  <CardTitle className="text-lg">
                    {result.formName}
                  </CardTitle>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      lastTestResult?.status === "error" 
                        ? "bg-red-50 text-red-700 border-red-200" 
                        : lastTestResult?.status === "warning"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }
                  >
                    {lastTestResult?.success ? "Passed" : "Failed"}
                  </Badge>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            {isExpanded && (
              <CardContent className="pb-3 border-t pt-3">
                <div>
                  {lastTestResult?.message && (
                    <p className={`text-sm mb-3 ${
                      lastTestResult.status === "error" 
                        ? "text-red-600" 
                        : lastTestResult.status === "warning"
                        ? "text-yellow-600"
                        : ""
                    }`}>
                      {lastTestResult.message}
                    </p>
                  )}

                  {lastTestResult?.fields && lastTestResult.fields.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Form Fields:</h4>
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Field</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Validations</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {lastTestResult.fields.map((field, i) => (
                              <tr key={i} className={field.errors?.length ? "bg-red-50" : ""}>
                                <td className="px-3 py-2 text-sm">{field.name}</td>
                                <td className="px-3 py-2 text-sm text-muted-foreground">{field.type}</td>
                                <td className="px-3 py-2">
                                  {field.errors?.length ? (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Valid</Badge>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-sm">
                                  {field.validations?.join(', ') || 'None'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {hasValidationIssues && (
                    <div className="mb-4 p-3 border rounded-md bg-red-50">
                      <h4 className="text-sm font-medium text-red-700 mb-2">Validation Issues:</h4>
                      <ul className="space-y-1 text-sm text-red-700">
                        {lastTestResult?.validationDetails?.invalidFields?.map((field, i) => (
                          <li key={`invalid-${i}`}>• Invalid field: {field}</li>
                        ))}
                        {lastTestResult?.validationDetails?.unexpectedErrors?.map((error, i) => (
                          <li key={`unexpected-${i}`}>• Unexpected error: {error}</li>
                        ))}
                        {lastTestResult?.validationDetails?.missingErrors?.map((missing, i) => (
                          <li key={`missing-${i}`}>• Missing error for: {missing}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRunTest(result.form)}
                      disabled={isRunning}
                    >
                      <Play className="h-3.5 w-3.5 mr-1" />
                      Run Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};
