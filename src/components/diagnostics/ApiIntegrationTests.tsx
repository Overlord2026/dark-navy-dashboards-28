
import React from "react";
import { Globe, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

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
            <Collapsible key={index} className={`rounded-md border ${getStatusColor(test.status)}`}>
              <CollapsibleTrigger className="p-3 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <StatusIcon status={test.status} />
                    <div>
                      <span className="font-medium">{test.service}</span>
                      <p className="text-sm">Endpoint: {test.endpoint}</p>
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
                <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                  <span>Response time: {test.responseTime}ms</span>
                  {test.authStatus && (
                    <span>Auth: {test.authStatus.replace('_', ' ')}</span>
                  )}
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-3 pt-0 border-t mt-2">
                  <div className="space-y-3">
                    {test.status !== "success" && (
                      <>
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">Detailed Log:</h4>
                          <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                            <p>[{new Date().toISOString()}] Error connecting to {test.service} API</p>
                            <p>Endpoint: {test.endpoint}</p>
                            <p>Status: {test.status}</p>
                            <p>Response Time: {test.responseTime}ms</p>
                            {test.authStatus && <p>Auth Status: {test.authStatus}</p>}
                            {test.errorCode && <p>Error Code: {test.errorCode}</p>}
                            {test.statusCode && <p>HTTP Status: {test.statusCode}</p>}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Recommended Steps:</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {test.authStatus?.includes("invalid") && (
                              <li>Check API credentials and update them in settings</li>
                            )}
                            {test.authStatus?.includes("expired") && (
                              <li>Renew API token in the developer portal</li>
                            )}
                            {test.responseTime > 1000 && (
                              <li>API response time is slow, check network connectivity</li>
                            )}
                            <li>Verify the API endpoint is correct and accessible</li>
                            <li>Check service status at provider's status page</li>
                            {test.status === "error" && (
                              <li className="text-destructive font-medium">
                                Contact system administrator if issue persists
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        {test.documentation && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Documentation:</h4>
                            <a 
                              href={test.documentation} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-sm text-blue-500 hover:underline"
                            >
                              View API documentation
                            </a>
                          </div>
                        )}
                      </>
                    )}
                    
                    {test.status === "success" && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Connection Details:</h4>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Response Time: </span>
                            <Badge variant={
                              test.responseTime < 300 ? "success" :
                              test.responseTime < 800 ? "warning" : "destructive"
                            }>
                              {test.responseTime}ms
                            </Badge>
                          </div>
                          {test.lastUpdated && (
                            <div className="text-sm">
                              <span className="font-medium">Last Updated: </span>
                              {new Date(test.lastUpdated).toLocaleString()}
                            </div>
                          )}
                          <div className="text-sm">
                            <span className="font-medium">Status: </span>
                            <span className="text-green-600">Operational</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
