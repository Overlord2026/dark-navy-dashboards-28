
import React from 'react';
import { NavigationTestResult } from '@/types/diagnostics';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface NavigationTestsProps {
  tests: NavigationTestResult[];
}

export function NavigationTests({ tests }: NavigationTestsProps) {
  if (!tests || tests.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No navigation tests have been run yet. Click "Start Navigation Tests" to begin.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Navigation Test Results</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-right">Load Time</TableHead>
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
              <TableCell>{test.route}</TableCell>
              <TableCell>{test.message}</TableCell>
              <TableCell className="text-right">
                {test.loadTime && `${test.loadTime}ms`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
