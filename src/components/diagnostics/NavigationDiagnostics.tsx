
import React, { useState, useEffect } from "react";
import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getNavigationDiagnosticsSummary } from "@/services/diagnostics/navigationDiagnostics";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { DiagnosticsSummaryCards } from "./navigation/DiagnosticsSummaryCards";
import { NavigationRouteTabs } from "./navigation/NavigationRouteTabs";
import { LoadingSpinner } from "./navigation/LoadingSpinner";
import { NoResultsMessage } from "./navigation/NoResultsMessage";

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
          <LoadingSpinner />
        ) : diagnosticsResults ? (
          <div className="space-y-6">
            <DiagnosticsSummaryCards 
              overallStatus={diagnosticsResults.overallStatus}
              totalRoutes={diagnosticsResults.totalRoutes}
              successCount={diagnosticsResults.successCount}
              warningCount={diagnosticsResults.warningCount}
              errorCount={diagnosticsResults.errorCount}
            />
            
            <NavigationRouteTabs 
              results={diagnosticsResults.results}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        ) : (
          <NoResultsMessage />
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
