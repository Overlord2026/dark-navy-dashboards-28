
import React from 'react';
import { PerformanceTestResult } from '@/types/diagnostics';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface PerformanceTestsProps {
  tests: PerformanceTestResult[];
}

export function PerformanceTests({ tests }: PerformanceTestsProps) {
  if (!tests || tests.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No performance tests have been run yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Performance Test Results</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Component</TableHead>
            <TableHead>Metric</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Threshold</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell>
                {test.status === "pass" || test.status === "success" ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Pass</span>
                  </div>
                ) : test.status === "warn" || test.status === "warning" ? (
                  <div className="flex items-center text-amber-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Warning</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>Fail</span>
                  </div>
                )}
              </TableCell>
              <TableCell>{test.component}</TableCell>
              <TableCell>{test.metric}</TableCell>
              <TableCell className="text-right">{test.value}</TableCell>
              <TableCell className="text-right">{test.threshold}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
