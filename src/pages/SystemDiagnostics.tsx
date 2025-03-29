
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { runDiagnostics } from "@/services/diagnosticsService";
import { AlertCircle, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function SystemDiagnostics() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const runSystemCheck = async () => {
    setIsLoading(true);
    try {
      const diagnosticReport = await runDiagnostics();
      setReport(diagnosticReport);
      
      // Generate recommendations based on report
      const newRecommendations = generateRecommendations(diagnosticReport);
      setRecommendations(newRecommendations);
      
      toast.success("System health check completed");
    } catch (error) {
      console.error("Diagnostic error:", error);
      toast.error("Failed to complete system health check");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runSystemCheck();
  }, []);

  const generateRecommendations = (report: any): string[] => {
    const recs: string[] = [];
    
    if (report.forms.status !== 'success') {
      recs.push("Review form validation in advisor feedback forms to ensure proper data collection.");
    }
    
    if (report.api.status !== 'success') {
      recs.push("Optimize API responses in professional directory to improve load times.");
    }
    
    if (report.navigation.status !== 'success') {
      recs.push("Check navigation routing to ensure all pages are accessible.");
    }
    
    if (report.database.status !== 'success') {
      recs.push("Verify database connections and optimize query performance.");
    }
    
    if (report.authentication.status !== 'success') {
      recs.push("Review authentication flows for potential security improvements.");
    }
    
    // Add general recommendations
    recs.push("Consider implementing periodic automated health checks to monitor system performance.");
    
    return recs;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800";
      case 'warning':
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800";
      case 'error':
        return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
      default:
        return "bg-card";
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200";
      case 'warning':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200";
      case 'critical':
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
      default:
        return "";
    }
  };

  return (
    <ThreeColumnLayout title="System Diagnostics">
      <div className="space-y-6 p-4 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">System Health Check</h1>
          <p className="text-muted-foreground mt-1">
            Diagnostics to ensure optimal system performance
          </p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            {report && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOverallStatusColor(report.overall)}`}>
                System Status: {report.overall.charAt(0).toUpperCase() + report.overall.slice(1)}
              </span>
            )}
          </div>
          <Button 
            onClick={runSystemCheck} 
            disabled={isLoading} 
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Running Diagnostics..." : "Run Diagnostics"}
          </Button>
        </div>

        {report ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(report).filter(([key]) => key !== 'overall' && key !== 'timestamp').map(([key, value]: [string, any]) => (
                <Card key={key} className={`border ${getStatusColor(value.status)}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(value.status)}
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{value.message}</p>
                    {value.details && (
                      <p className="text-sm text-muted-foreground mt-2">{value.details}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 text-xs">
                        {index + 1}
                      </div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Last updated: {report.timestamp ? new Date(report.timestamp).toLocaleString() : "N/A"}
              </CardFooter>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-10">
              <div className="flex flex-col items-center justify-center text-center">
                <RefreshCw className="h-10 w-10 text-muted-foreground animate-spin" />
                <h3 className="mt-4 text-lg font-medium">Running system diagnostics...</h3>
                <p className="text-muted-foreground mt-2">This may take a moment</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ThreeColumnLayout>
  );
}
