
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";

interface PermissionTestsProps {
  tests: any[];
  isLoading?: boolean;
}

export const PermissionTests = ({ tests, isLoading = false }: PermissionTestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Permission Tests
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
                    <span className="font-medium">Role: {test.role}</span>
                    <p className="text-sm">Permission: {test.permission}</p>
                  </div>
                </div>
                <span className="text-sm px-2 py-1 rounded-full bg-muted">
                  {test.status}
                </span>
              </div>
              <p className="text-sm mt-1">{test.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
