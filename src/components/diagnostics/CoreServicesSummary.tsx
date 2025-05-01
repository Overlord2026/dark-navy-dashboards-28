
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, AlertTriangle, Shield, Zap, PieChart } from "lucide-react";
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
    { key: "navigation", title: "Navigation Routing", icon: "route", description: "Checks all routes and navigation paths" },
    { key: "forms", title: "Form Validation", icon: "form", description: "Validates form inputs and submission processes" },
    { key: "database", title: "Database Connection", icon: "database", description: "Tests database connectivity and performance" },
    { key: "api", title: "API Integration", icon: "api", description: "Verifies external API connections" },
    { key: "authentication", title: "Authentication", icon: "auth", description: "Checks login and session management" },
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

  // Get all issues sorted by severity and impact
  const getAllIssues = () => {
    const allTests = [
      ...(report.securityTests || []).map(test => ({ ...test, category: "security", impact: getSeverityImpact(test.severity) })),
      ...(report.apiIntegrationTests || []).map(test => ({ ...test, category: "api", impact: 85 })),
      ...(report.navigationTests || []).map(test => ({ ...test, category: "navigation", impact: 75 })),
      ...(report.permissionsTests || []).map(test => ({ ...test, category: "permissions", impact: 80 }))
    ];
    
    // Filter out success tests
    const issues = allTests.filter(test => test.status !== "success");
    
    // Sort by status (error first) then by impact/severity
    return issues.sort((a, b) => {
      if (a.status === "error" && b.status !== "error") return -1;
      if (a.status !== "error" && b.status === "error") return 1;
      return b.impact - a.impact;
    });
  };

  // Get impact score based on severity
  const getSeverityImpact = (severity: string): number => {
    switch (severity) {
      case 'critical': return 100;
      case 'high': return 90;
      case 'medium': return 70;
      case 'low': return 50;
      default: return 60;
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'api':
        return <ExternalLink className="h-4 w-4 text-blue-500" />;
      case 'performance':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'navigation':
        return <PieChart className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
  };

  const priorityIssues = getAllIssues().slice(0, 3);
  const healthStatus = healthPercentage >= 80 ? "Good" : healthPercentage >= 50 ? "Fair" : "Poor";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Health Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-lg border shadow-sm col-span-1 bg-gradient-to-br from-card to-muted/20">
                <h3 className="text-lg font-medium mb-2">Overall Health</h3>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      healthPercentage >= 80 
                        ? 'bg-green-500' 
                        : healthPercentage >= 50 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                    } mr-2`}></div>
                    <span className="font-medium">{healthStatus}</span>
                  </div>
                  <Badge variant={
                    report.overall === "success" ? "success" : 
                    report.overall === "warning" ? "warning" : 
                    "destructive"
                  }>
                    {report.overall.toUpperCase()}
                  </Badge>
                </div>
                <Progress 
                  value={healthPercentage} 
                  className="h-2.5" 
                  indicatorClassName={getHealthColor()}
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm font-medium">{healthPercentage}% operational</p>
                  <div className="flex gap-2 text-xs">
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      {getAllIssues().filter(i => i.status === "success").length} Passed
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                      {getAllIssues().filter(i => i.status === "warning").length} Warnings
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                      {getAllIssues().filter(i => i.status === "error").length} Errors
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map((service) => (
                    <div
                      key={service.key}
                      className={`p-4 rounded-lg border flex flex-col transition-colors ${
                        report[service.key]?.status === "error" 
                          ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" 
                          : report[service.key]?.status === "warning"
                          ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                          : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <StatusIcon status={report[service.key]?.status || "warning"} />
                        <div>
                          <h3 className="font-medium">{service.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        {report[service.key]?.message || "No data available"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Issues Section */}
      {priorityIssues.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Priority Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityIssues.map((issue, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${getStatusColor(issue.status)}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {getCategoryIcon(issue.category)}
                        </div>
                        <div className="mt-1 text-xs font-medium">{issue.category}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {issue.name || issue.service || issue.route || issue.endpoint || "Issue"}
                          </h3>
                          <Badge 
                            variant={issue.status === "error" ? "destructive" : "warning"}
                            className="ml-2"
                          >
                            {issue.severity || (issue.status === "error" ? "High" : "Medium")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.message}</p>
                        {issue.remediation && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Recommendation: </span> 
                            {issue.remediation}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-11 sm:ml-0">
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
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // Find first tab with issues
                    const tabWithMostIssues = ["security", "api", "navigation", "permissions"]
                      .sort((a, b) => {
                        const aCount = (report[`${a}Tests`] || []).filter((t: any) => t.status !== "success").length;
                        const bCount = (report[`${b}Tests`] || []).filter((t: any) => t.status !== "success").length;
                        return bCount - aCount;
                      })[0];
                    
                    document.querySelector(`[value="${tabWithMostIssues}"]`)?.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    );
                  }}
                >
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
