
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DiagnosticsRunner } from "@/components/diagnostics/DiagnosticsRunner";
import { QuickDiagnosticsButton } from "@/components/diagnostics/QuickDiagnosticsButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, FileWarning, Cpu, Gauge, Shield } from "lucide-react";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function SystemHealthDashboard() {
  const { quickFixes, applyQuickFix, quickFixLoading } = useDiagnostics();
  const [selectedFixId, setSelectedFixId] = useState<string | null>(null);
  
  const handleApplyFix = async (fixId: string) => {
    setSelectedFixId(fixId);
    try {
      const result = await applyQuickFix(fixId);
      if (result) {
        toast.success(`Applied fix successfully: ${quickFixes.find(f => f.id === fixId)?.name}`);
      } else {
        toast.error("Failed to apply fix");
      }
    } catch (error) {
      toast.error("Error applying fix");
      console.error("Error applying fix:", error);
    } finally {
      setSelectedFixId(null);
    }
  };
  
  return (
    <ThreeColumnLayout title="System Health Dashboard">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">System Health Dashboard</h1>
          <QuickDiagnosticsButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DiagnosticsRunner />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileWarning className="h-5 w-5" />
                System Issues
              </CardTitle>
              <CardDescription>
                Detected issues that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quickFixes.length > 0 ? (
                <div className="space-y-3">
                  {quickFixes.map((fix) => (
                    <div 
                      key={fix.id}
                      className="p-3 border rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="mb-2 sm:mb-0">
                        <div className="flex items-center">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full 
                            ${fix.severity === 'high' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                              : fix.severity === 'medium' 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                            {fix.severity}
                          </span>
                          <h4 className="font-medium ml-2">{fix.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{fix.description}</p>
                      </div>
                      <Button
                        onClick={() => handleApplyFix(fix.id)}
                        disabled={quickFixLoading || selectedFixId === fix.id}
                        variant="outline"
                        className="ml-auto whitespace-nowrap"
                        size="sm"
                      >
                        {selectedFixId === fix.id ? "Applying..." : "Apply Fix"}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <FileWarning className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No issues detected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full md:w-auto md:inline-flex">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span>System</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  View application performance metrics and identify bottlenecks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Run a full diagnostics check to see detailed performance metrics
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/system-diagnostics'} 
                    className="mt-4"
                  >
                    Run Full Diagnostics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
                <CardDescription>
                  Security audit results and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Run a full diagnostics check to see detailed security status
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/system-diagnostics'} 
                    className="mt-4"
                  >
                    Run Full Diagnostics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  System Resources
                </CardTitle>
                <CardDescription>
                  Resource usage and system health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Run a full diagnostics check to see detailed system resource usage
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/system-diagnostics'} 
                    className="mt-4"
                  >
                    Run Full Diagnostics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
