
import React from "react";
import { Link, ChevronDown, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface NavigationTestsProps {
  tests: any[];
  isLoading?: boolean;
}

export const NavigationTests = ({ tests, isLoading = false }: NavigationTestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Navigation Route Tests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test, index) => (
            <Collapsible key={index} className={`rounded-md border ${getStatusColor(test.status)}`}>
              <CollapsibleTrigger className="p-3 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={test.status} />
                    <span className="font-medium">{test.route}</span>
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
                          <p>[{new Date().toISOString()}] Navigation issue detected</p>
                          <p>Route: {test.route}</p>
                          <p>Status: {test.status}</p>
                          {test.component && <p>Component: {test.component}</p>}
                          {test.errorType && <p>Error Type: {test.errorType}</p>}
                          {test.attemptCount && <p>Attempt Count: {test.attemptCount}</p>}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Recommended Steps:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Verify route configuration in routes.tsx</li>
                          {test.component && (
                            <li>Check that the {test.component} component exists and is exported correctly</li>
                          )}
                          {test.errorType?.includes("permission") && (
                            <li>Review access control settings for this route</li>
                          )}
                          {test.errorType?.includes("not found") && (
                            <li>Ensure the route path is correctly defined</li>
                          )}
                          {test.status === "error" && (
                            <li className="text-destructive font-medium">
                              Fix this route issue before deploying to production
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      {test.relatedFiles && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">Related Files:</h4>
                          <ul className="list-disc list-inside text-sm">
                            {test.relatedFiles.map((file: string, i: number) => (
                              <li key={i}>{file}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                  
                  {test.status === "success" && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Route Details:</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Component: </span>
                          {test.component || test.route.split('/').pop()}
                        </div>
                        {test.lastTested && (
                          <div className="text-sm">
                            <span className="font-medium">Last Tested: </span>
                            {new Date(test.lastTested).toLocaleString()}
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="font-medium">Status: </span>
                          <span className="text-green-600">Operational</span>
                        </div>
                        <div className="mt-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            <span>Visit Route</span>
                          </Button>
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
