
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Check, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import { QuickFix, FixHistoryEntry } from "@/types/diagnostics";

// Define component props
interface ApiIntegrationTestsProps {
  tests: any[];
  onRefresh?: () => void;
  fixes?: QuickFix[];
  fixHistory?: FixHistoryEntry[];
}

export function ApiIntegrationTests({
  tests = [],
  onRefresh,
  fixes = [],
  fixHistory = [],
}: ApiIntegrationTestsProps) {
  const { applyDiagnosticFix, fixInProgress } = useDiagnostics();
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  
  const toggleTest = (testId: string) => {
    if (expandedTestId === testId) {
      setExpandedTestId(null);
    } else {
      setExpandedTestId(testId);
    }
  };
  
  const isFixApplied = (serviceName: string) => {
    return fixHistory.some(fix => 
      // Changed from fix.title to fix.service to match the FixHistoryEntry type
      fix.service === serviceName
    );
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <Shield className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Healthy</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warning</Badge>;
      case "error":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
      default:
        return null;
    }
  };
  
  const runDiagnosticFix = async (testId: string, serviceName: string) => {
    try {
      await applyDiagnosticFix(testId, "api", serviceName);
    } catch (error) {
      console.error("Error applying fix:", error);
    }
  };
  
  if (!tests || tests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            API Integration Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-muted-foreground">No API integration tests available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5" />
          API Integration Tests
        </CardTitle>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tests.map((test) => {
            const isExpanded = expandedTestId === test.id;
            const isFixed = isFixApplied(test.service);
            const canApplyFix = test.status !== "success" && !isFixed && !fixInProgress;
            
            return (
              <div 
                key={test.id} 
                className="border rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30" onClick={() => toggleTest(test.id)}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <h3 className="font-medium">{test.service}</h3>
                      <p className="text-sm text-muted-foreground">{test.endpoint}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isFixed && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Fixed
                      </Badge>
                    )}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-3 border-t bg-muted/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Endpoint</p>
                        <p className="text-sm text-muted-foreground">{test.url || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Method</p>
                        <p className="text-sm text-muted-foreground">{test.method || "GET"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Expected Response</p>
                        <p className="text-sm text-muted-foreground">{test.expectedDataStructure || "Default response"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Response Time</p>
                        <p className="text-sm text-muted-foreground">{test.responseTime ? `${test.responseTime}ms` : "N/A"}</p>
                      </div>
                    </div>
                    
                    {test.errorMessage && (
                      <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                        {test.errorMessage}
                      </div>
                    )}
                    
                    {test.warningMessage && (
                      <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 rounded text-sm">
                        {test.warningMessage}
                      </div>
                    )}
                    
                    {canApplyFix && (
                      <div className="mt-3 flex justify-end">
                        <Button 
                          variant="default" 
                          size="sm"
                          disabled={!!fixInProgress}
                          onClick={() => runDiagnosticFix(test.id, test.service)}
                        >
                          {fixInProgress === test.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Fixing...
                            </>
                          ) : (
                            "Apply Fix"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
