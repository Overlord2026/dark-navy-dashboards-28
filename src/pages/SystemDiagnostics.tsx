
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { runDiagnostics, runQuickSystemCheck } from "@/services/diagnosticsService";
import { toast } from "sonner";
import { DiagnosticsHeader } from "@/components/diagnostics/DiagnosticsHeader";
import { DiagnosticsTabs } from "@/components/diagnostics/DiagnosticsTabs";
import { LoadingState } from "@/components/diagnostics/LoadingState";
import { logger } from "@/services/logging/loggingService";
import { Recommendation } from "@/components/diagnostics/RecommendationsList";
import { useUser } from "@/context/UserContext";
import { Navigate, Link } from "react-router-dom";
import { ShieldX, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SystemDiagnostics() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [pageAccessError, setPageAccessError] = useState<string | null>(null);
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";

  // Redirect non-admin users
  if (!isAdmin) {
    toast.error("You don't have permission to access the diagnostics page");
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    // Initialize logging system when component mounts
    logger.initialize({
      minLevel: "info",
      retentionPeriod: 7,
      enableRealTimeAlerts: true
    });
    
    logger.info("System Diagnostics page loaded", undefined, "SystemDiagnostics");
    
    // Perform a quick system check on load to see if diagnostics is accessible
    const checkSystemAccess = async () => {
      try {
        const quickCheck = await runQuickSystemCheck();
        if (!quickCheck.success) {
          setPageAccessError("Could not access system diagnostics. Please try again later.");
          toast.error("Diagnostics service is currently unavailable");
        } else {
          // If quick check was successful, run the full diagnostics
          runSystemCheck();
        }
      } catch (error) {
        setPageAccessError("Error accessing diagnostics. Please contact support.");
        toast.error("Could not initialize diagnostics service");
        logger.error("Failed to run quick system check", error, "SystemDiagnostics");
      }
    };
    
    checkSystemAccess();
  }, []);

  const runSystemCheck = async () => {
    setIsLoading(true);
    setPageAccessError(null);
    logger.info("Starting system health check", undefined, "SystemDiagnostics");
    
    try {
      const diagnosticReport = await runDiagnostics();
      setReport(diagnosticReport);
      
      // Generate recommendations based on report
      const newRecommendations = generateRecommendations(diagnosticReport);
      setRecommendations(newRecommendations);
      
      logger.info("System health check completed successfully", undefined, "SystemDiagnostics");
      toast.success("System health check completed");
    } catch (error) {
      console.error("Diagnostic error:", error);
      logger.error("Failed to complete system health check", error, "SystemDiagnostics");
      toast.error("Failed to complete system health check");
      setPageAccessError("Could not complete diagnostics. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = (report: any): Recommendation[] => {
    const recs: Recommendation[] = [];
    
    if (report.forms.status !== 'success') {
      recs.push({
        text: "Review form validation in advisor feedback forms to ensure proper data collection.",
        priority: report.forms.status === 'error' ? 'high' : 'medium'
      });
    }
    
    if (report.api.status !== 'success') {
      recs.push({
        text: "Optimize API responses in professional directory to improve load times.",
        priority: report.api.status === 'error' ? 'high' : 'medium'
      });
    }
    
    if (report.navigation.status !== 'success') {
      recs.push({
        text: "Check navigation routing to ensure all pages are accessible.",
        priority: report.navigation.status === 'error' ? 'high' : 'medium'
      });
    }
    
    if (report.database.status !== 'success') {
      recs.push({
        text: "Verify database connections and optimize query performance.",
        priority: report.database.status === 'error' ? 'high' : 'medium'
      });
    }
    
    if (report.authentication.status !== 'success') {
      recs.push({
        text: "Review authentication flows for potential security improvements.",
        priority: report.authentication.status === 'error' ? 'critical' : 'high'
      });
    }
    
    const failedNavTests = report.navigationTests.filter((test: any) => test.status === 'error' || test.status === 'warning');
    if (failedNavTests.length > 0) {
      recs.push({
        text: `Fix navigation issues with routes: ${failedNavTests.map((t: any) => t.route).join(', ')}`,
        priority: failedNavTests.some((t: any) => t.status === 'error') ? 'high' : 'medium'
      });
    }
    
    const failedPermTests = report.permissionsTests.filter((test: any) => test.status === 'error' || test.status === 'warning');
    if (failedPermTests.length > 0) {
      recs.push({
        text: `Review permission configuration for roles: ${[...new Set(failedPermTests.map((t: any) => t.role))].join(', ')}`,
        priority: failedPermTests.some((t: any) => t.status === 'error') ? 'high' : 'medium'
      });
    }
    
    const failedIconTests = report.iconTests.filter((test: any) => test.status === 'error' || test.status === 'warning');
    if (failedIconTests.length > 0) {
      recs.push({
        text: `Fix icon display issues in: ${[...new Set(failedIconTests.map((t: any) => t.location))].join(', ')}`,
        priority: 'low'
      });
    }
    
    const failedFormTests = report.formValidationTests.filter((test: any) => test.status === 'error' || test.status === 'warning');
    if (failedFormTests.length > 0) {
      recs.push({
        text: `Address form validation issues in: ${failedFormTests.map((t: any) => t.formName).join(', ')}`,
        priority: failedFormTests.some((t: any) => t.status === 'error') ? 'high' : 'medium'
      });
      
      failedFormTests.forEach((formTest: any) => {
        if (formTest.fields) {
          const fieldIssues = formTest.fields.filter((field: any) => field.status === 'error' || field.status === 'warning');
          if (fieldIssues.length > 0) {
            recs.push({
              text: `Fix ${formTest.formName} field validation for: ${fieldIssues.map((f: any) => f.fieldName).join(', ')}`,
              priority: fieldIssues.some((f: any) => f.status === 'error') ? 'medium' : 'low'
            });
          }
        }
      });
    }
    
    const failedApiTests = report.apiIntegrationTests.filter((test: any) => test.status === 'error' || test.status === 'warning');
    if (failedApiTests.length > 0) {
      recs.push({
        text: `Address API connection issues with: ${failedApiTests.map((t: any) => t.service).join(', ')}`,
        priority: failedApiTests.some((t: any) => t.status === 'error') ? 'high' : 'medium'
      });
      
      const slowApiResponses = failedApiTests.filter((test: any) => test.status === 'warning' && test.responseTime > 500);
      if (slowApiResponses.length > 0) {
        recs.push({
          text: `Optimize slow API connections with: ${slowApiResponses.map((t: any) => t.service).join(', ')}`,
          priority: 'medium'
        });
      }
      
      const authIssues = failedApiTests.filter((test: any) => test.authStatus === 'invalid' || test.authStatus === 'expired');
      if (authIssues.length > 0) {
        recs.push({
          text: `Refresh authentication credentials for: ${authIssues.map((t: any) => t.service).join(', ')}`,
          priority: 'high'
        });
      }
    }
    
    const failedRoleTests = report.roleSimulationTests.filter((test: any) => test.status === 'error' || test.status === 'warning');
    if (failedRoleTests.length > 0) {
      recs.push({
        text: `Fix role access issues for: ${[...new Set(failedRoleTests.map((t: any) => t.role))].join(', ')}`,
        priority: failedRoleTests.some((t: any) => t.status === 'error') ? 'high' : 'medium'
      });
      
      const incorrectAccess = failedRoleTests.filter((test: any) => 
        (test.expectedAccess && test.accessStatus !== 'granted') || 
        (!test.expectedAccess && test.accessStatus === 'granted')
      );
      
      if (incorrectAccess.length > 0) {
        recs.push({
          text: `Review permission policies for modules: ${[...new Set(incorrectAccess.map((t: any) => t.module))].join(', ')}`,
          priority: 'high'
        });
      }
    }
    
    // Performance test recommendations
    if (report.performanceTests) {
      const slowResponses = report.performanceTests.filter((test: any) => test.responseTime > 1000);
      if (slowResponses.length > 0) {
        recs.push({
          text: `Optimize slow page loads: ${slowResponses.map((t: any) => t.name).join(', ')} (${slowResponses.map((t: any) => `${t.responseTime}ms`).join(', ')})`,
          priority: 'medium'
        });
      }
      
      const highCpuUsage = report.performanceTests.filter((test: any) => test.cpuUsage > 70);
      if (highCpuUsage.length > 0) {
        recs.push({
          text: `Reduce CPU usage in: ${highCpuUsage.map((t: any) => t.name).join(', ')} (${highCpuUsage.map((t: any) => `${t.cpuUsage}%`).join(', ')})`,
          priority: 'high'
        });
      }
      
      const highMemoryUsage = report.performanceTests.filter((test: any) => test.memoryUsage > 100);
      if (highMemoryUsage.length > 0) {
        recs.push({
          text: `Investigate potential memory leaks in: ${highMemoryUsage.map((t: any) => t.name).join(', ')}`,
          priority: 'high'
        });
      }
      
      const concurrencyIssues = report.performanceTests.filter((test: any) => 
        test.concurrentUsers > 30 && (test.status === 'error' || test.status === 'warning')
      );
      if (concurrencyIssues.length > 0) {
        recs.push({
          text: `Improve handling of concurrent users in: ${concurrencyIssues.map((t: any) => t.name).join(', ')}`,
          priority: 'medium'
        });
      }
    }
    
    // Security recommendations based on critical issues
    const criticalSecurityIssues = report.securityTests?.filter((test: any) => 
      test.status !== 'success' && test.severity === 'critical'
    );
    
    if (criticalSecurityIssues?.length > 0) {
      criticalSecurityIssues.forEach((issue: any) => {
        recs.push({
          text: `CRITICAL SECURITY ISSUE: ${issue.name} - ${issue.message}`,
          priority: 'critical'
        });
      });
    }
    
    // Add logging recommendations with appropriate priorities
    recs.push({
      text: "Configure error logging to capture critical system events for troubleshooting.",
      priority: 'medium'
    });
    
    recs.push({
      text: "Review log retention settings to comply with data retention policies.",
      priority: 'low'
    });
    
    recs.push({
      text: "Enable real-time alerts for critical errors to improve response time.",
      priority: 'medium'
    });
    
    return recs;
  };

  return (
    <ThreeColumnLayout title="System Diagnostics">
      <div className="space-y-6 p-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <DiagnosticsHeader 
            isLoading={isLoading} 
            report={report}
            onRunDiagnostics={runSystemCheck}
          />
          
          {/* Developer Access Control Link - Only visible to administrators */}
          {isAdmin && (
            <Button variant="outline" asChild className="gap-2">
              <Link to="/developer-access-control">
                <Users className="h-4 w-4" />
                <span>Manage Developer Access</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          )}
        </div>

        {pageAccessError ? (
          <div className="p-8 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-center">
            <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
              Diagnostics Error
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{pageAccessError}</p>
            <button 
              onClick={runSystemCheck}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-700 dark:text-red-200 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : isLoading && !report ? (
          <LoadingState />
        ) : (
          <DiagnosticsTabs 
            report={report}
            recommendations={recommendations}
            isLoading={isLoading}
          />
        )}
      </div>
    </ThreeColumnLayout>
  );
}
