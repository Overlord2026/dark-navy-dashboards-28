
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { NavigationTests } from "./NavigationTests";
import { StatusBadges } from "./StatusBadges";
import { NavigationDiagnosticResult, DiagnosticSummary } from "@/types/diagnostics";
import { getNavigationDiagnosticsSummary } from "@/services/diagnostics/navigationDiagnostics";
import { LoadingState } from "./LoadingState";
import { useNavigationDiagnostics } from "@/hooks/useNavigationDiagnostics";
import { runAllTabDiagnostics } from "@/services/diagnostics/tabDiagnostics";
import { useUser } from "@/context/UserContext";

const NavigationDiagnosticModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<Record<string, NavigationDiagnosticResult[]>>({});
  const [tabResults, setTabResults] = useState<Record<string, NavigationDiagnosticResult>>({});
  const [summary, setSummary] = useState<DiagnosticSummary | null>(null);
  const { userProfile } = useUser();
  
  // Check if user is an admin
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  
  // If not admin, redirect to dashboard
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      toast.error("You don't have permission to access diagnostics");
    }
  }, [isAdmin, navigate]);
  
  // If not admin, don't render anything
  if (!isAdmin) {
    return null;
  }

  const runNavigationDiagnostics = async () => {
    setIsRunning(true);
    
    try {
      // Get detailed route diagnostics
      const diagnosticSummary = await getNavigationDiagnosticsSummary();
      setResults(diagnosticSummary.results);
      
      // Get tab-specific diagnostics
      const tabDiagnostics = await runAllTabDiagnostics();
      setTabResults(tabDiagnostics);
      
      // Set summary
      setSummary({
        overall: diagnosticSummary.overallStatus,
        total: diagnosticSummary.totalRoutes,
        success: diagnosticSummary.successCount,
        warnings: diagnosticSummary.warningCount,
        errors: diagnosticSummary.errorCount,
        timestamp: new Date().toISOString()
      });
      
      toast.success("Navigation diagnostics completed", {
        description: "Check the results for any issues that need attention."
      });
    } catch (error) {
      console.error("Error running navigation diagnostics:", error);
      toast.error("Failed to run navigation diagnostics", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  useEffect(() => {
    // Run diagnostics when the component mounts (only for admin users)
    if (isAdmin) {
      runNavigationDiagnostics();
    }
  }, [isAdmin]);
  
  // Flatten all test results for the "All Tests" view
  const allTests = Object.values(results).flat();
  
  // Filter tests by status
  const successTests = allTests.filter(test => test.status === "success");
  const warningTests = allTests.filter(test => test.status === "warning");
  const errorTests = allTests.filter(test => test.status === "error");
  
  // Filter tab-specific tests
  const tabOnlyTests = Object.values(tabResults);
  
  // Determine diagnostic status
  const hasErrors = allTests.some(test => test.status === "error");
  const hasWarnings = allTests.some(test => test.status === "warning");
  const overallStatus = hasErrors ? "error" : hasWarnings ? "warning" : "success";
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Navigation Health Check</CardTitle>
            <CardDescription>
              Admin Tools: Verify all navigation routes and components are working properly
            </CardDescription>
          </div>
          <Button 
            onClick={runNavigationDiagnostics} 
            disabled={isRunning}
            variant="default"
          >
            {isRunning ? "Running..." : "Run Diagnostics"}
          </Button>
        </CardHeader>
        <CardContent>
          {isRunning ? (
            <LoadingState message="Running navigation diagnostics..." />
          ) : summary ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <StatusBadges 
                  total={summary.total} 
                  success={summary.success} 
                  warnings={summary.warnings} 
                  errors={summary.errors} 
                  status={summary.overall}
                />
              </div>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Routes</TabsTrigger>
                  <TabsTrigger value="tabs">Main Tabs</TabsTrigger>
                  <TabsTrigger value="success">Success ({successTests.length})</TabsTrigger>
                  <TabsTrigger value="warning">Warnings ({warningTests.length})</TabsTrigger>
                  <TabsTrigger value="error">Errors ({errorTests.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <NavigationTests tests={allTests} />
                </TabsContent>
                
                <TabsContent value="tabs">
                  <NavigationTests tests={tabOnlyTests} />
                </TabsContent>
                
                <TabsContent value="success">
                  <NavigationTests tests={successTests} />
                </TabsContent>
                
                <TabsContent value="warning">
                  <NavigationTests tests={warningTests} />
                </TabsContent>
                
                <TabsContent value="error">
                  <NavigationTests tests={errorTests} />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center p-6">
              <p className="text-muted-foreground">No diagnostic data available. Run diagnostics to check navigation health.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/system-diagnostics')}
        >
          View System Diagnostics
        </Button>
      </div>
    </div>
  );
};

export default NavigationDiagnosticModule;
