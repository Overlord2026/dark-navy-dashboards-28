
import React from "react";
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";

interface SecurityTestsProps {
  tests: any[];
  isLoading?: boolean;
}

export const SecurityTests = ({ tests, isLoading = false }: SecurityTestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Tests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <StatusIcon status={test.status} />
                  <div>
                    <span className="font-medium">{test.name}</span>
                    <p className="text-sm">Category: {test.category.replace('-', ' ')}</p>
                  </div>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  test.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  test.severity === 'high' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                  test.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {test.severity}
                </span>
              </div>
              <p className="text-sm mt-1">{test.message}</p>
              {test.remediation && (
                <div className="mt-2 p-2 border-l-2 border-primary/40 bg-muted/30">
                  <p className="text-xs font-medium">Remediation:</p>
                  <p className="text-xs text-muted-foreground">{test.remediation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
