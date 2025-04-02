
import React from "react";
import { Users, ChevronDown, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
            <Collapsible key={index} className={`rounded-md border ${getStatusColor(test.status)}`}>
              <CollapsibleTrigger className="p-3 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <StatusIcon status={test.status} />
                    <div>
                      <span className="font-medium">Role: {test.role}</span>
                      <p className="text-sm">Module: {test.module}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm px-2 py-1 rounded-full bg-muted">
                      {test.accessStatus}
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform ui-expanded:rotate-180" />
                  </div>
                </div>
                <p className="text-sm mt-1 text-left">{test.message}</p>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-3 pt-0 border-t mt-2">
                  <div className="mt-2 text-xs">
                    <span className="font-medium">Expected access: </span>
                    <span>{test.expectedAccess ? "Allowed" : "Denied"}</span>
                  </div>
                  
                  {test.status !== "success" && (
                    <>
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Detailed Log:</h4>
                        <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                          <p>[{new Date().toISOString()}] Role simulation issue detected</p>
                          <p>Role: {test.role}</p>
                          <p>Module: {test.module}</p>
                          <p>Access Status: {test.accessStatus}</p>
                          <p>Status: {test.status}</p>
                          <p>Expected Access: {test.expectedAccess ? "Allowed" : "Denied"}</p>
                          {test.actualAccess !== undefined && (
                            <p>Actual Access: {test.actualAccess ? "Allowed" : "Denied"}</p>
                          )}
                          {test.securityLevel && <p>Security Level: {test.securityLevel}</p>}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Recommended Steps:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Review role definition for {test.role}</li>
                          <li>Check access control matrix for module: {test.module}</li>
                          {test.expectedAccess && test.status === "error" && (
                            <li>Fix permissions to allow access for this role</li>
                          )}
                          {!test.expectedAccess && test.status === "error" && (
                            <li>Fix permissions to prevent access for this role</li>
                          )}
                          <li>Verify navigation restrictions match permissions</li>
                          {test.status === "error" && (
                            <li className="text-destructive font-medium">
                              This is a security issue that must be addressed
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm">View Security Configuration</span>
                      </div>
                    </>
                  )}
                  
                  {test.status === "success" && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1">Role Simulation Details:</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Role: </span>
                          {test.role}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Module: </span>
                          {test.module}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Access Status: </span>
                          {test.accessStatus}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Status: </span>
                          <span className="text-green-600">Correctly Configured</span>
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
