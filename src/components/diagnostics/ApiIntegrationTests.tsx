
import React from "react";
import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";

interface ApiIntegrationTestsProps {
  tests: any[];
  isLoading?: boolean;
}

export const ApiIntegrationTests = ({ tests, isLoading = false }: ApiIntegrationTestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          API Integration Tests
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
                    <span className="font-medium">{test.service}</span>
                    <p className="text-sm">Endpoint: {test.endpoint}</p>
                  </div>
                </div>
                <span className="text-sm px-2 py-1 rounded-full bg-muted">
                  {test.status}
                </span>
              </div>
              <p className="text-sm mt-1">{test.message}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Response time: {test.responseTime}ms</span>
                  {test.authStatus && (
                    <span>Auth: {test.authStatus.replace('_', ' ')}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
