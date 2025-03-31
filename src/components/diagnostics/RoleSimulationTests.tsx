
import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";

interface RoleSimulationTestsProps {
  tests: any[];
  isLoading?: boolean;
}

export const RoleSimulationTests = ({ tests, isLoading = false }: RoleSimulationTestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Role Simulation Tests
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
                    <p className="text-sm">Module: {test.module}</p>
                  </div>
                </div>
                <span className="text-sm px-2 py-1 rounded-full bg-muted">
                  {test.accessStatus}
                </span>
              </div>
              <p className="text-sm mt-1">{test.message}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                <span>Expected access: {test.expectedAccess ? "Allowed" : "Denied"}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
