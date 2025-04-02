
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useDiagnostics } from "@/hooks/useDiagnostics";

export interface CoreServicesSummaryProps {
  report: any;
  isLoading: boolean;
}

export const CoreServicesSummary = ({ report, isLoading }: CoreServicesSummaryProps) => {
  const { applyDiagnosticFix, fixInProgress } = useDiagnostics();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 rounded-lg border">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no report is available yet, show empty state
  if (!report) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Run diagnostics to see system health summary
          </p>
        </CardContent>
      </Card>
    );
  }

  const services = [
    { key: "navigation", title: "Navigation Routing", icon: "route" },
    { key: "forms", title: "Form Validation", icon: "form" },
    { key: "database", title: "Database Connection", icon: "database" },
    { key: "api", title: "API Integration", icon: "api" },
    { key: "authentication", title: "Authentication", icon: "auth" },
  ];

  // Calculate overall health percentage
  const calculateHealthPercentage = () => {
    const statuses = services.map(service => report[service.key]?.status || "unknown");
    const total = statuses.length;
    const healthy = statuses.filter(status => status === "success").length;
    return Math.round((healthy / total) * 100);
  };

  const healthPercentage = calculateHealthPercentage();
  
  // Get color for health indicator
  const getHealthColor = () => {
    if (healthPercentage >= 80) return "bg-green-500"; 
    if (healthPercentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get all issues sorted by severity
  const getAllIssues = () => {
    const allTests = [
      ...(report.securityTests || []),
      ...(report.apiIntegrationTests || []),
      ...(report.navigationTests || []),
      ...(report.permissionsTests || [])
    ];
    
    // Filter out success tests
    const issues = allTests.filter(test => test.status !== "success");
    
    // Sort by severity: error first, then warning
    return issues.sort((a, b) => {
      if (a.status === "error" && b.status !== "error") return -1;
      if (a.status !== "error" && b.status === "error") return 1;
      return 0;
    });
  };

  const priorityIssues = getAllIssues().slice(0, 3);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.key}
                    className={`p-4 rounded-lg border flex items-start gap-2 transition-colors ${
                      report[service.key]?.status === "error" 
                        ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" 
                        : report[service.key]?.status === "warning"
                        ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                        : ""
                    }`}
                  >
                    <StatusIcon status={report[service.key]?.status || "warning"} />
                    <div>
                      <h3 className="font-medium">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {report[service.key]?.message || "No data available"}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="p-4 rounded-lg border flex flex-col col-span-3 md:col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">System Health</h3>
                    <Badge variant={
                      report.overall === "success" ? "success" : 
                      report.overall === "warning" ? "warning" : 
                      "destructive"
                    }>
                      {report.overall.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <Progress 
                      value={healthPercentage} 
                      className="h-2" 
                      indicatorClassName={getHealthColor()}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {healthPercentage}% of systems operational
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {priorityIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Priority Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {priorityIssues.map((issue, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${getStatusColor(issue.status)}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-2">
                      <StatusIcon status={issue.status} className="mt-0.5" />
                      <div>
                        <h3 className="font-medium">
                          {issue.name || issue.service || issue.route || issue.endpoint || "Issue"}
                        </h3>
                        <p className="text-sm text-muted-foreground">{issue.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-7 sm:ml-0">
                      {issue.canAutoFix && (
                        <Button 
                          size="sm" 
                          onClick={() => applyDiagnosticFix(
                            issue.id || `${index}`, 
                            issue.category || (issue.service ? "api" : issue.route ? "navigation" : "security"),
                            issue.name || issue.service || issue.route || issue.endpoint || ""
                          )}
                          disabled={!!fixInProgress}
                          className="gap-1"
                        >
                          Quick Fix
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                      {issue.documentationUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="gap-1"
                          onClick={() => window.open(issue.documentationUrl, '_blank')}
                        >
                          Learn More
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {getAllIssues().length > 3 && (
              <div className="mt-4 text-center">
                <Button variant="outline">
                  View All Issues ({getAllIssues().length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
