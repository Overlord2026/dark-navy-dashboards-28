
import React from "react";
import { Lock, ChevronDown, User, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
            <Collapsible key={index} className={`rounded-md border ${getStatusColor(test.status)}`}>
              <CollapsibleTrigger className="p-3 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <StatusIcon status={test.status} />
                    <div>
                      <span className="font-medium">Role: {test.role}</span>
                      <p className="text-sm">Permission: {test.permission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm px-2 py-1 rounded-full bg-muted">
                      {test.status}
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform ui-expanded:rotate-180" />
                  </div>
                </div>
                <p className="text-sm mt-1 text-left">{test.message}</p>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-3 pt-0 border-t mt-2">
                  {test.status !== "success" && (
                    <>
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Detailed Log:</h4>
                        <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                          <p>[{new Date().toISOString()}] Permission issue detected</p>
                          <p>Role: {test.role}</p>
                          <p>Permission: {test.permission}</p>
                          <p>Status: {test.status}</p>
                          {test.resource && <p>Resource: {test.resource}</p>}
                          {test.expectedAccess !== undefined && (
                            <p>Expected Access: {test.expectedAccess ? "Allowed" : "Denied"}</p>
                          )}
                          {test.actualAccess !== undefined && (
                            <p>Actual Access: {test.actualAccess ? "Allowed" : "Denied"}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Recommended Steps:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Review role-based access control settings</li>
                          {test.permission.includes("read") && test.status === "error" && (
                            <li>Check read permissions in access control list</li>
                          )}
                          {test.permission.includes("write") && test.status === "error" && (
                            <li>Verify write permissions in access control list</li>
                          )}
                          {test.permission.includes("admin") && (
                            <li>Ensure administrative roles are properly configured</li>
                          )}
                          <li>Check permission configuration in <code>src/services/permissions</code></li>
                          {test.status === "error" && (
                            <li className="text-destructive font-medium">
                              This is a security issue that should be addressed immediately
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-4 w-4" />
                          <span>Role Management</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <UserCog className="h-4 w-4" />
                          <span>Permission Settings</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {test.status === "success" && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1">Permission Details:</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Role: </span>
                          {test.role}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Permission: </span>
                          {test.permission}
                        </div>
                        {test.resource && (
                          <div className="text-sm">
                            <span className="font-medium">Resource: </span>
                            {test.resource}
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="font-medium">Status: </span>
                          <span className="text-green-600">Properly Configured</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
