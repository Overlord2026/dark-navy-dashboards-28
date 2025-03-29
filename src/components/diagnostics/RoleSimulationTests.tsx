
import { UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusColor } from "./StatusIcon";
import { getAccessStatusBadge } from "./StatusBadges";

interface RoleSimulationTestsProps {
  tests: any[];
}

export const getAccessStatusIcon = (status: string, expected: boolean) => {
  if ((status === 'granted' && expected) || (status === 'denied' && !expected)) {
    return <span className="h-5 w-5 text-green-500">✓</span>;
  } else {
    return <span className="h-5 w-5 text-red-500">✗</span>;
  }
};

export const RoleSimulationTests = ({ tests }: RoleSimulationTestsProps) => {
  const roles = ['client', 'advisor', 'admin', 'accountant', 'attorney'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          User Role Simulation Tests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Role Access Testing</h3>
          <p className="text-sm text-muted-foreground">
            These tests simulate different user roles accessing various system modules to ensure proper authorization boundaries.
          </p>
        </div>
        
        <div className="space-y-6">
          {roles.map(role => (
            <div key={role} className="space-y-3">
              <h4 className="text-md font-semibold capitalize border-b pb-1">
                {role} Role Access
              </h4>
              {tests
                .filter((test) => test.role === role)
                .map((test, index) => (
                  <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-2">
                        {getAccessStatusIcon(test.accessStatus, test.expectedAccess)}
                        <div>
                          <span className="font-medium">Module: {test.module}</span>
                          <p className="text-xs mt-1">
                            Expected: {test.expectedAccess ? "Access Allowed" : "Access Denied"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getAccessStatusBadge(test.accessStatus)}
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          {test.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{test.message}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
