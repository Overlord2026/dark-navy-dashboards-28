import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge-extended";
import { Activity, AlertTriangle, Check, RefreshCw, Shield, Terminal, Wrench, Zap } from "lucide-react";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import { QuickDiagnosticsDialog } from "@/components/diagnostics/QuickDiagnosticsDialog";
import { QuickFix } from "@/types/diagnostics";

export default function SystemHealthDashboard() {
  const { diagnosticResults, isLoading, quickFixes, applyQuickFix, quickFixLoading, runSystemDiagnostics, refreshDiagnostics } = useDiagnostics();
  const [isDiagnosticsDialogOpen, setIsDiagnosticsDialogOpen] = useState(false);
  const [selectedFixId, setSelectedFixId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!diagnosticResults && !isLoading) {
      runSystemDiagnostics();
    }
  }, [diagnosticResults, isLoading, runSystemDiagnostics]);
  
  const handleQuickFix = async (fixId: string) => {
    setSelectedFixId(fixId);
    try {
      await applyQuickFix(fixId);
    } finally {
      setSelectedFixId(null);
    }
  };
  
  const getSystemStatusUI = () => {
    if (!diagnosticResults) {
      return (
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
          <span>Unknown</span>
        </div>
      );
    }
    
    switch (diagnosticResults.overall) {
      case "success":
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Healthy</span>
          </div>
        );
      case "warning":
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span>Warning</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Critical</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
            <span>Unknown</span>
          </div>
        );
    }
  };
  
  return (
    <ThreeColumnLayout title="System Health">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-2 md:mb-0">System Health Dashboard</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshDiagnostics()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsDiagnosticsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Terminal className="h-4 w-4" />
              Quick Diagnostics
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <Card className="mb-6">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-lg font-medium">Loading System Status...</p>
                <p className="text-sm text-muted-foreground mt-1">Please wait while we analyze your system</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{getSystemStatusUI()}</div>
                    {diagnosticResults && (
                      <Activity className={`h-8 w-8 ${
                        diagnosticResults.overall === "success" ? "text-green-500" :
                        diagnosticResults.overall === "warning" ? "text-yellow-500" : "text-red-500"
                      }`} />
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {diagnosticResults?.securityTests?.some(t => t.status === "error") ? (
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span>At Risk</span>
                        </div>
                      ) : diagnosticResults?.securityTests?.some(t => t.status === "warning") ? (
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span>Warning</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Secure</span>
                        </div>
                      )}
                    </div>
                    <Shield className={`h-8 w-8 ${
                      diagnosticResults?.securityTests?.some(t => t.status === "error") ? "text-red-500" :
                      diagnosticResults?.securityTests?.some(t => t.status === "warning") ? "text-yellow-500" : "text-green-500"
                    }`} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {diagnosticResults?.performanceTests?.some(t => t.status === "error") ? (
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span>Poor</span>
                        </div>
                      ) : diagnosticResults?.performanceTests?.some(t => t.status === "warning") ? (
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span>Average</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Excellent</span>
                        </div>
                      )}
                    </div>
                    <Zap className={`h-8 w-8 ${
                      diagnosticResults?.performanceTests?.some(t => t.status === "error") ? "text-red-500" :
                      diagnosticResults?.performanceTests?.some(t => t.status === "warning") ? "text-yellow-500" : "text-green-500"
                    }`} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">API Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {diagnosticResults?.apiIntegrationTests?.some(t => t.status === "error") ? (
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span>Failing</span>
                        </div>
                      ) : diagnosticResults?.apiIntegrationTests?.some(t => t.status === "warning") ? (
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span>Degraded</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Connected</span>
                        </div>
                      )}
                    </div>
                    <Terminal className={`h-8 w-8 ${
                      diagnosticResults?.apiIntegrationTests?.some(t => t.status === "error") ? "text-red-500" :
                      diagnosticResults?.apiIntegrationTests?.some(t => t.status === "warning") ? "text-yellow-500" : "text-green-500"
                    }`} />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {quickFixes && quickFixes.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Recommended Fixes
                  </CardTitle>
                  <CardDescription>
                    Apply these fixes to improve system health and performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickFixes.slice(0, 4).map((fix: QuickFix) => (
                    <div key={fix.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {fix.severity === "critical" || fix.severity === "high" ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : fix.severity === "medium" ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                          <h3 className="font-medium">{fix.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {fix.description}
                        </p>
                      </div>
                      <div className="ml-4">
                        <Button
                          size="sm"
                          variant="default"
                          disabled={quickFixLoading || selectedFixId === fix.id}
                          onClick={() => handleQuickFix(fix.id)}
                        >
                          {selectedFixId === fix.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Fixing...
                            </>
                          ) : (
                            "Apply Fix"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                {quickFixes.length > 4 && (
                  <CardFooter className="flex justify-center border-t pt-4">
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = "/system-diagnostics"}>
                      View All Fixes ({quickFixes.length})
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    API Endpoint Status
                  </CardTitle>
                  <CardDescription>
                    Health status of critical API endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {diagnosticResults?.apiIntegrationTests ? (
                      diagnosticResults.apiIntegrationTests.slice(0, 5).map((test, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{test.service}</p>
                            <p className="text-xs text-muted-foreground">{test.endpoint || "Main Endpoint"}</p>
                          </div>
                          <Badge
                            variant={
                              test.status === "success" ? "outline" :
                              test.status === "warning" ? "warning" : "destructive"
                            }
                            className={
                              test.status === "success" ? "bg-green-50 text-green-700 border-green-200" :
                              test.status === "warning" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                              "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {test.status === "success" ? "Healthy" :
                             test.status === "warning" ? "Degraded" : "Error"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No API endpoints data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                {diagnosticResults?.apiIntegrationTests && diagnosticResults.apiIntegrationTests.length > 5 && (
                  <CardFooter className="flex justify-center border-t pt-4">
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = "/system-diagnostics"}>
                      View All Endpoints
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Audit
                  </CardTitle>
                  <CardDescription>
                    Latest security audit results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {diagnosticResults?.securityTests ? (
                      diagnosticResults.securityTests.slice(0, 5).map((test, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{test.name}</p>
                            <p className="text-xs text-muted-foreground">{test.category || "General"}</p>
                          </div>
                          <Badge
                            variant={
                              test.status === "success" ? "outline" :
                              test.status === "warning" ? "warning" : "destructive"
                            }
                            className={
                              test.status === "success" ? "bg-green-50 text-green-700 border-green-200" :
                              test.status === "warning" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                              "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {test.status === "success" ? "Secure" :
                             test.status === "warning" ? "Warning" : "Vulnerable"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No security audit data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                {diagnosticResults?.securityTests && diagnosticResults.securityTests.length > 5 && (
                  <CardFooter className="flex justify-center border-t pt-4">
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = "/system-diagnostics"}>
                      View Full Audit
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </>
        )}
        
        <QuickDiagnosticsDialog
          open={isDiagnosticsDialogOpen}
          onOpenChange={setIsDiagnosticsDialogOpen}
        />
      </div>
    </ThreeColumnLayout>
  );
}
