
import React from 'react';
import { FormValidationTestResult } from '@/types/diagnostics';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { CheckCircle, AlertTriangle, AlertCircle, Play } from 'lucide-react';

interface FormValidationTestResultsProps {
  results: FormValidationTestResult[];
  isRunning: boolean;
  onRunTest: (formId: string, testIndex?: number) => void;
}

export function FormValidationTestResults({ 
  results, 
  isRunning,
  onRunTest 
}: FormValidationTestResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center p-12 border border-dashed rounded-md">
        <p className="text-muted-foreground">No form validation tests have been run yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Form</TableHead>
            <TableHead>Test</TableHead>
            <TableHead>Result</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={result.id}>
              <TableCell>
                {result.status === "pass" || result.status === "success" ? (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    <span>Pass</span>
                  </div>
                ) : result.status === "warn" || result.status === "warning" ? (
                  <div className="flex items-center text-amber-500">
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    <span>Warning</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    <span>Fail</span>
                  </div>
                )}
              </TableCell>
              <TableCell>{result.formName}</TableCell>
              <TableCell>{result.testName}</TableCell>
              <TableCell>{result.message}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onRunTest(result.formId, index)}
                  disabled={isRunning}
                  className="flex items-center"
                >
                  <Play className="mr-1 h-3 w-3" />
                  Run Again
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
