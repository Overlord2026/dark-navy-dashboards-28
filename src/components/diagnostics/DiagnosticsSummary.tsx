
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { NavigationTests } from './NavigationTests';
import { StatusBadges } from './StatusBadges';
import { toast } from 'sonner';
import { getNavigationDiagnosticsSummary } from '@/services/diagnostics/navigationDiagnostics';
import { X, RefreshCw, Zap } from 'lucide-react';
import { useDiagnosticsContext } from '@/context/DiagnosticsContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { runDiagnostics } from '@/services/diagnostics';

export function DiagnosticsSummary() {
  const { isDiagnosticsModeEnabled, toggleDiagnosticsMode } = useDiagnosticsContext();
  const [isRunning, setIsRunning] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('navigation');
  
  const runAllDiagnostics = async () => {
    setIsRunning(true);
    try {
      toast.info("Running system diagnostics...");
      const results = await runDiagnostics();
      setDiagnosticResults(results);
      
      if (results.overall === 'error') {
        toast.error("Diagnostics found errors", {
          description: "See the diagnostics panel for details"
        });
      } else if (results.overall === 'warning') {
        toast.warning("Diagnostics found warnings", {
          description: "See the diagnostics panel for details"
        });
      } else {
        toast.success("All diagnostics passed", {
          description: "System is functioning normally"
        });
      }
    } catch (error) {
      console.error('Error running diagnostics:', error);
      toast.error("Failed to run diagnostics", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  useEffect(() => {
    if (isDiagnosticsModeEnabled && !diagnosticResults) {
      runAllDiagnostics();
    }
  }, [isDiagnosticsModeEnabled]);
  
  if (!isDiagnosticsModeEnabled) return null;
  
  // Calculate summary counts
  const getTestSummary = (testArray: any[] = []) => {
    const total = testArray.length;
    const success = testArray.filter(t => t.status === 'success').length;
    const warnings = testArray.filter(t => t.status === 'warning').length;
    const errors = testArray.filter(t => t.status === 'error').length;
    
    let status = 'success';
    if (errors > 0) status = 'error';
    else if (warnings > 0) status = 'warning';
    
    return { total, success, warnings, errors, status };
  };
  
  return (
    <Sheet open={isDiagnosticsModeEnabled} onOpenChange={toggleDiagnosticsMode}>
      <SheetContent className="sm:max-w-md md:max-w-xl lg:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>System Diagnostics</SheetTitle>
            <Button variant="ghost" size="icon" onClick={toggleDiagnosticsMode}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription>
            Run diagnostics to check system health and identify issues
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {diagnosticResults && (
                <span>Last run: {new Date().toLocaleTimeString()}</span>
              )}
            </div>
            <Button 
              onClick={runAllDiagnostics} 
              disabled={isRunning}
              size="sm"
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Run Diagnostics
                </>
              )}
            </Button>
          </div>
          
          {isRunning ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p className="text-lg font-semibold">Running Diagnostics...</p>
                <p className="text-sm text-muted-foreground">This may take a moment</p>
              </div>
            </div>
          ) : diagnosticResults ? (
            <div className="space-y-6">
              {/* Overall summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Diagnostic Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusBadges
                    total={Object.values(diagnosticResults).flat().filter(Array.isArray).length}
                    success={diagnosticResults.overall === 'success' ? 1 : 0}
                    warnings={diagnosticResults.overall === 'warning' ? 1 : 0}
                    errors={diagnosticResults.overall === 'error' ? 1 : 0}
                    status={diagnosticResults.overall}
                  />
                </CardContent>
              </Card>
              
              {/* Tabs for different diagnostic categories */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="navigation">Navigation</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                  <TabsTrigger value="forms">Forms</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="navigation" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Navigation Tests</CardTitle>
                      <CardDescription>
                        Status of navigation routes and components
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        {diagnosticResults?.navigationTests && (
                          <StatusBadges
                            {...getTestSummary(diagnosticResults.navigationTests)}
                          />
                        )}
                      </div>
                      <NavigationTests tests={diagnosticResults?.navigationTests || []} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="permissions" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Permission Tests</CardTitle>
                      <CardDescription>
                        Status of user permissions and access controls
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        {diagnosticResults?.permissionsTests && (
                          <StatusBadges
                            {...getTestSummary(diagnosticResults.permissionsTests)}
                          />
                        )}
                      </div>
                      <NavigationTests tests={diagnosticResults?.permissionsTests || []} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="api" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">API Integration Tests</CardTitle>
                      <CardDescription>
                        Status of API endpoints and services
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        {diagnosticResults?.apiIntegrationTests && (
                          <StatusBadges
                            {...getTestSummary(diagnosticResults.apiIntegrationTests)}
                          />
                        )}
                      </div>
                      <NavigationTests tests={diagnosticResults?.apiIntegrationTests || []} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="forms" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Form Validation Tests</CardTitle>
                      <CardDescription>
                        Status of form validation and submission
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        {diagnosticResults?.formValidationTests && (
                          <StatusBadges
                            {...getTestSummary(diagnosticResults.formValidationTests)}
                          />
                        )}
                      </div>
                      <NavigationTests tests={diagnosticResults?.formValidationTests || []} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="performance" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Performance Tests</CardTitle>
                      <CardDescription>
                        Application performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        {diagnosticResults?.performanceTests && (
                          <StatusBadges
                            {...getTestSummary(diagnosticResults.performanceTests)}
                          />
                        )}
                      </div>
                      <NavigationTests tests={diagnosticResults?.performanceTests || []} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">No Diagnostic Data</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Run diagnostics to check system health
                </p>
                <Button onClick={runAllDiagnostics}>Run Diagnostics</Button>
              </div>
            </div>
          )}
        </div>
        
        <SheetFooter className="pt-4 flex flex-col gap-2 sm:flex-row">
          <div className="text-xs text-muted-foreground">
            Press <kbd className="px-1 py-0.5 bg-muted rounded">Alt+Shift+D</kbd> to toggle diagnostics
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
