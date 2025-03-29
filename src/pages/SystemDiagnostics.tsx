
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { runDiagnostics } from "@/services/diagnosticsService";
import { toast } from "sonner";
import { DiagnosticsHeader } from "@/components/diagnostics/DiagnosticsHeader";
import { DiagnosticsTabs } from "@/components/diagnostics/DiagnosticsTabs";
import { LoadingState } from "@/components/diagnostics/LoadingState";

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
    
    const failedNavTests = report.navigationTests.filter((test: any) => test.status === 'error' || test.status === 'warning');
    if (failedNavTests.length > 0) {
      recs.push(`Fix navigation issues with routes: ${failedNavTests.map((t: any) => t.route).join(', ')}`);
    }
    
    const failedPermTests = report.permissionsTests.filter((test: any) => test.status === 'error' || test.status === 'warning');
    if (failedPermTests.length > 0) {
      recs.push(`Review permission configuration for roles: ${[...new Set(failedPermTests.map((t: any) => t.role))].join(', ')}`);
    }
    
    const failedIconTests = report.iconTests.filter((test: any) => test.status === 'error' || test.status === 'warning');
    if (failedIconTests.length > 0) {
      recs.push(`Fix icon display issues in: ${[...new Set(failedIconTests.map((t: any) => t.location))].join(', ')}`);
    }
    
    const failedFormTests = report.formValidationTests.filter((test: any) => test.status === 'error' || test.status === 'warning');
    if (failedFormTests.length > 0) {
      recs.push(`Address form validation issues in: ${failedFormTests.map((t: any) => t.formName).join(', ')}`);
      
      failedFormTests.forEach((formTest: any) => {
        if (formTest.fields) {
          const fieldIssues = formTest.fields.filter((field: any) => field.status === 'error' || field.status === 'warning');
          if (fieldIssues.length > 0) {
            recs.push(`Fix ${formTest.formName} field validation for: ${fieldIssues.map((f: any) => f.fieldName).join(', ')}`);
          }
        }
      });
    }
    
    const failedApiTests = report.apiIntegrationTests.filter((test: any) => test.status === 'error' || test.status === 'warning');
    if (failedApiTests.length > 0) {
      recs.push(`Address API connection issues with: ${failedApiTests.map((t: any) => t.service).join(', ')}`);
      
      const slowApiResponses = failedApiTests.filter((test: any) => test.status === 'warning' && test.responseTime > 500);
      if (slowApiResponses.length > 0) {
        recs.push(`Optimize slow API connections with: ${slowApiResponses.map((t: any) => t.service).join(', ')}`);
      }
      
      const authIssues = failedApiTests.filter((test: any) => test.authStatus === 'invalid' || test.authStatus === 'expired');
      if (authIssues.length > 0) {
        recs.push(`Refresh authentication credentials for: ${authIssues.map((t: any) => t.service).join(', ')}`);
      }
    }
    
    const failedRoleTests = report.roleSimulationTests.filter((test: any) => test.status === 'error' || test.status === 'warning');
    if (failedRoleTests.length > 0) {
      recs.push(`Fix role access issues for: ${[...new Set(failedRoleTests.map((t: any) => t.role))].join(', ')}`);
      
      const incorrectAccess = failedRoleTests.filter((test: any) => 
        (test.expectedAccess && test.accessStatus !== 'granted') || 
        (!test.expectedAccess && test.accessStatus === 'granted')
      );
      
      if (incorrectAccess.length > 0) {
        recs.push(`Review permission policies for modules: ${[...new Set(incorrectAccess.map((t: any) => t.module))].join(', ')}`);
      }
    }
    
    // New: Performance test recommendations
    if (report.performanceTests) {
      const slowResponses = report.performanceTests.filter((test: any) => test.responseTime > 1000);
      if (slowResponses.length > 0) {
        recs.push(`Optimize slow page loads: ${slowResponses.map((t: any) => t.name).join(', ')} (${slowResponses.map((t: any) => `${t.responseTime}ms`).join(', ')})`);
      }
      
      const highCpuUsage = report.performanceTests.filter((test: any) => test.cpuUsage > 70);
      if (highCpuUsage.length > 0) {
        recs.push(`Reduce CPU usage in: ${highCpuUsage.map((t: any) => t.name).join(', ')} (${highCpuUsage.map((t: any) => `${t.cpuUsage}%`).join(', ')})`);
      }
      
      const highMemoryUsage = report.performanceTests.filter((test: any) => test.memoryUsage > 100);
      if (highMemoryUsage.length > 0) {
        recs.push(`Investigate potential memory leaks in: ${highMemoryUsage.map((t: any) => t.name).join(', ')}`);
      }
      
      const concurrencyIssues = report.performanceTests.filter((test: any) => 
        test.concurrentUsers > 30 && (test.status === 'error' || test.status === 'warning')
      );
      if (concurrencyIssues.length > 0) {
        recs.push(`Improve handling of concurrent users in: ${concurrencyIssues.map((t: any) => t.name).join(', ')}`);
      }
    }
    
    recs.push("Consider implementing periodic automated health checks to monitor system performance.");
    
    return recs;
  };

  return (
    <ThreeColumnLayout title="System Diagnostics">
      <div className="space-y-6 p-4 max-w-6xl mx-auto">
        <DiagnosticsHeader 
          isLoading={isLoading} 
          report={report}
          onRunDiagnostics={runSystemCheck}
        />

        {isLoading && !report ? (
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
