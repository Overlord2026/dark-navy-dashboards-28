
import React from "react";
import { Globe, ChevronDown, ExternalLink, Wrench, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDiagnostics } from "@/hooks/useDiagnostics";

interface ApiIntegrationTestsProps {
  tests: any[];
  isLoading?: boolean;
}

export const ApiIntegrationTests = ({ tests, isLoading = false }: ApiIntegrationTestsProps) => {
  const { applyDiagnosticFix, fixInProgress, fixHistory } = useDiagnostics();
  
  // Check if an issue has been fixed
  const isFixed = (testId: string, service: string) => {
    return fixHistory.some(fix => 
      fix.id === `api-${testId}` || 
      fix.name.toLowerCase().includes(service.toLowerCase())
    );
  };
  
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
          {tests.map((test, index) => {
            const testId = `api-${index}`;
            const fixed = test.status === "success" || isFixed(testId, test.service);
            
            return (
              <Collapsible 
                key={index} 
                className={`rounded-md border ${
                  fixed ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20" : 
                  getStatusColor(test.status)
                }`}
              >
                <CollapsibleTrigger className="p-3 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      {fixed ? 
                        <Check className="h-5 w-5 text-green-500" /> : 
                        <StatusIcon status={test.status} />
                      }
                      <div>
                        <span className="font-medium">{test.service}</span>
                        <p className="text-sm">Endpoint: {test.endpoint}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {fixed ? (
                        <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400">
                          Fixed
                        </span>
                      ) : (
                        <span className="text-sm px-2 py-1 rounded-full bg-muted">
                          {test.status}
                        </span>
                      )}
                      <ChevronDown className="h-4 w-4 transition-transform ui-expanded:rotate-180" />
                    </div>
                  </div>
                  <p className="text-sm mt-1 text-left">
                    {fixed ? "This issue has been resolved" : test.message}
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                    <span>Response time: {test.responseTime}ms</span>
                    {test.authStatus && !fixed && (
                      <span>Auth: {test.authStatus.replace('_', ' ')}</span>
                    )}
                  </div>
                </CollapsibleTrigger>
                
                {!fixed && test.status !== "success" && (
                  <div className="px-3 pt-0 pb-3">
                    <div className="flex flex-wrap gap-2">
                      {test.canAutoFix && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            applyDiagnosticFix(testId, "apiIntegration", test.service);
                          }}
                          disabled={fixInProgress === testId}
                          className="flex items-center gap-1"
                        >
                          <Wrench className="h-3.5 w-3.5" />
                          {fixInProgress === testId ? "Fixing..." : "Fix Issue"}
                        </Button>
                      )}
                      
                      {test.documentationUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(test.documentationUrl, '_blank');
                          }}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Learn More
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                <CollapsibleContent>
                  <div className="p-3 pt-0 border-t mt-2">
                    <div className="space-y-3">
                      {fixed ? (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">Resolution Details:</h4>
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-xs">
                            <p className="text-green-800 dark:text-green-300">This issue has been resolved and verified.</p>
                            {fixHistory.find(fix => fix.id === testId || fix.name.toLowerCase().includes(test.service.toLowerCase())) && (
                              <p className="mt-1 text-muted-foreground">
                                Fixed on: {new Date(fixHistory.find(fix => 
                                  fix.id === testId || 
                                  fix.name.toLowerCase().includes(test.service.toLowerCase())
                                )?.timestamp || "").toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : test.status !== "success" ? (
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
                          
                          {test.fixMessage && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-1">Fix Details:</h4>
                              <p className="text-sm">{test.fixMessage}</p>
                            </div>
                          )}
                        </>
                      ) : (
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
