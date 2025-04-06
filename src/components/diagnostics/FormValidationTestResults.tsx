
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, AlertTriangle, XCircle, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FormValidationResult } from "@/hooks/useFormValidationDiagnostics";

interface FormValidationTestResultsProps {
  results: FormValidationResult[];
  isRunning: boolean;
  onRunTest: (formId: string, testIndex?: number) => void;
}

export const FormValidationTestResults: React.FC<FormValidationTestResultsProps> = ({
  results,
  isRunning,
  onRunTest,
}) => {
  // Helper function to render status icons
  const renderStatusIcon = (status: "success" | "warning" | "error") => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Helper function to render test case summary
  const renderTestCaseSummary = (result: FormValidationResult) => {
    if (!result.validationStats) return null;
    
    const { total, passed, failed } = result.validationStats;
    
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-300">
          {passed} Passed
        </Badge>
        {failed > 0 && (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-300">
            {failed} Failed
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">
          {total} test cases
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Form Validation Tests</CardTitle>
          <CardDescription>
            Results of form validation tests with both valid and invalid data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">Status</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead className="w-[150px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length > 0 ? (
                results.map((result) => (
                  <TableRow key={result.form}>
                    <TableCell>
                      {renderStatusIcon(result.status)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{result.formName}</div>
                      <div className="text-sm text-muted-foreground">{result.message}</div>
                    </TableCell>
                    <TableCell>
                      {renderTestCaseSummary(result)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={isRunning}
                        onClick={() => onRunTest(result.form)}
                        className="flex items-center gap-1"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Run Tests
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No form validation tests have been run yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* If a form has detailed test results, show them */}
      {results.filter(r => r.lastTestResult).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Latest Test Results</CardTitle>
            <CardDescription>
              Detailed results from the most recent form tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.filter(r => r.lastTestResult).map((result) => (
              <div key={`detail-${result.form}`} className="mb-6 last:mb-0">
                <div className="font-medium text-lg mb-2 flex items-center gap-2">
                  {renderStatusIcon(result.status)}
                  {result.formName}
                </div>
                
                {result.lastTestResult?.results ? (
                  <div className="space-y-4">
                    {result.lastTestResult.results.map((testCase: any, idx: number) => (
                      <Card key={idx} className="overflow-hidden">
                        <div className={`px-4 py-2 text-sm font-medium ${
                          testCase.submitted ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                        }`}>
                          {testCase.description}
                        </div>
                        <CardContent className="p-3">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Field</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead className="w-[80px]">Status</TableHead>
                                <TableHead>Error Message</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {testCase.fieldValidations.map((field: any, fieldIdx: number) => (
                                <TableRow key={fieldIdx}>
                                  <TableCell className="font-medium">{field.field}</TableCell>
                                  <TableCell>
                                    {typeof field.value === 'object' 
                                      ? (field.value instanceof Date 
                                        ? field.value.toLocaleDateString() 
                                        : JSON.stringify(field.value))
                                      : String(field.value)}
                                  </TableCell>
                                  <TableCell>
                                    {field.valid 
                                      ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      : <XCircle className="h-4 w-4 text-red-500" />
                                    }
                                  </TableCell>
                                  <TableCell className="text-red-500">
                                    {field.errorMessage || ''}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : result.lastTestResult?.result ? (
                  <Card key="single-test" className="overflow-hidden">
                    <div className={`px-4 py-2 text-sm font-medium ${
                      result.lastTestResult.result.submitted ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                    }`}>
                      {result.lastTestResult.testCase.description}
                    </div>
                    <CardContent className="p-3">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Field</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead className="w-[80px]">Status</TableHead>
                            <TableHead>Error Message</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.lastTestResult.result.fieldValidations.map((field: any, fieldIdx: number) => (
                            <TableRow key={fieldIdx}>
                              <TableCell className="font-medium">{field.field}</TableCell>
                              <TableCell>
                                {typeof field.value === 'object' 
                                  ? (field.value instanceof Date 
                                    ? field.value.toLocaleDateString() 
                                    : JSON.stringify(field.value))
                                  : String(field.value)}
                              </TableCell>
                              <TableCell>
                                {field.valid 
                                  ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  : <XCircle className="h-4 w-4 text-red-500" />
                                }
                              </TableCell>
                              <TableCell className="text-red-500">
                                {field.errorMessage || ''}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-sm text-muted-foreground">No detailed results available.</div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
