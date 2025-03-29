
import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { getAuthStatusBadge, getResponseTimeBadge } from "./StatusBadges";

interface ApiIntegrationTestsProps {
  tests: any[];
}

export const ApiIntegrationTests = ({ tests }: ApiIntegrationTestsProps) => {
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
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm px-2 py-1 rounded-full bg-muted">
                    {test.status}
                  </span>
                  <div className="flex items-center gap-2">
                    {getResponseTimeBadge(test.responseTime)}
                    {getAuthStatusBadge(test.authStatus)}
                  </div>
                </div>
              </div>
              <p className="text-sm mt-1">{test.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
