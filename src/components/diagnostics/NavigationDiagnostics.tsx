
import React, { useState, useEffect } from "react";
import { Link, Navigation, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { getNavigationDiagnosticsSummary } from "@/services/diagnostics/navigationDiagnostics";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

export function NavigationDiagnostics() {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticsResults, setDiagnosticsResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { userProfile } = useUser();
  const navigate = useNavigate();
  
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
    setIsLoading(true);
    try {
      const results = await getNavigationDiagnosticsSummary();
      setDiagnosticsResults(results);
      
      if (results.errorCount > 0) {
        toast.error(`Found ${results.errorCount} navigation errors`, {
          description: "Check the diagnostics for details"
        });
      } else if (results.warningCount > 0) {
        toast.warning(`Found ${results.warningCount} navigation warnings`, {
          description: "Check the diagnostics for details"
        });
      } else {
        toast.success("All navigation routes are healthy", {
          description: `${results.totalRoutes} routes checked`
        });
      }
    } catch (error) {
      console.error("Error running navigation diagnostics:", error);
      toast.error("Failed to run navigation diagnostics");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Run diagnostics when component mounts (for admin users only)
    if (isAdmin) {
      runNavigationDiagnostics();
    }
    
    // No cleanup needed for this effect
    return undefined;
  }, [isAdmin]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };
  
  const renderTabContent = (categoryKey: string) => {
    if (!diagnosticsResults || !diagnosticsResults.results) {
      return <p>No results available</p>;
    }
    
    const results = 
      categoryKey === "all" 
        ? Object.values(diagnosticsResults.results).flat() 
        : diagnosticsResults.results[categoryKey] || [];
    
    return (
      <div className="space-y-3">
        {results.map((test: any, index: number) => (
          <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon status={test.status} />
                <span className="font-medium">{test.route}</span>
              </div>
              <Badge variant={
                test.status === "success" ? "success" : 
                test.status === "warning" ? "outline" : "destructive"
              }>
                {test.status}
              </Badge>
            </div>
            <p className="text-sm mt-1">{test.message}</p>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            <CardTitle>Admin Tools: Navigation Diagnostics</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={runNavigationDiagnostics}
            disabled={isLoading}
          >
            {isLoading ? "Running..." : "Run Diagnostics"}
          </Button>
        </div>
        <CardDescription>
          Verify that all navigation tabs and routes are functioning properly
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : diagnosticsResults ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border ${diagnosticsResults.overallStatus === "success" ? "border-success/50 bg-success/10" : diagnosticsResults.overallStatus === "warning" ? "border-warning/50 bg-warning/10" : "border-destructive/50 bg-destructive/10"}`}>
                <div className="text-center">
                  <div className="text-sm font-medium mb-2">Overall Status</div>
                  <div className="flex justify-center">
                    {getStatusIcon(diagnosticsResults.overallStatus)}
                  </div>
                  <div className="mt-1 font-semibold capitalize">{diagnosticsResults.overallStatus}</div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="text-center">
                  <div className="text-sm font-medium mb-2">Total Routes</div>
                  <div className="text-2xl font-bold">{diagnosticsResults.totalRoutes}</div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="text-center">
                  <div className="text-sm font-medium mb-2">Status Breakdown</div>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-success"></div>
                      {diagnosticsResults.successCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-warning"></div>
                      {diagnosticsResults.warningCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-destructive"></div>
                      {diagnosticsResults.errorCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-6">
                <TabsTrigger value="all">All Routes</TabsTrigger>
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="educationSolutions">Education</TabsTrigger>
                <TabsTrigger value="familyWealth">Family Wealth</TabsTrigger>
                <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                {renderTabContent("all")}
              </TabsContent>
              
              <TabsContent value="home" className="mt-4">
                {renderTabContent("home")}
              </TabsContent>
              
              <TabsContent value="educationSolutions" className="mt-4">
                {renderTabContent("educationSolutions")}
              </TabsContent>
              
              <TabsContent value="familyWealth" className="mt-4">
                {renderTabContent("familyWealth")}
              </TabsContent>
              
              <TabsContent value="collaboration" className="mt-4">
                {renderTabContent("collaboration")}
              </TabsContent>
              
              <TabsContent value="investments" className="mt-4">
                {renderTabContent("investments")}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">No diagnostics data available. Run the diagnostics to check navigation health.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Run this diagnostic before adding new navigation items to ensure existing paths are working correctly.
        </p>
      </CardFooter>
    </Card>
  );
}
