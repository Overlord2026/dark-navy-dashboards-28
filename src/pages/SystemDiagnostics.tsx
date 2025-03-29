import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { runDiagnostics } from "@/services/diagnosticsService";
import { 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Link, 
  Lock, 
  Eye,
  FileText,
  Globe,
  UserCog
} from "lucide-react";
import { ActivityIcon } from "@/components/icons/ActivityIcon";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const getAccessStatusIcon = (status: string, expected: boolean) => {
    if ((status === 'granted' && expected) || (status === 'denied' && !expected)) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
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

  const getAuthStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">Valid</span>;
      case 'expired':
        return <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">Expired</span>;
      case 'invalid':
        return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">Invalid</span>;
      default:
        return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200">Not Tested</span>;
    }
  };

  const getResponseTimeBadge = (time: number) => {
    if (time === 0) {
      return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">Timeout</span>;
    } else if (time < 300) {
      return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">{time}ms</span>;
    } else if (time < 600) {
      return <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">{time}ms</span>;
    } else {
      return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">{time}ms</span>;
    }
  };

  const getAccessStatusBadge = (status: string) => {
    switch (status) {
      case 'granted':
        return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">Access Granted</span>;
      case 'denied':
        return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">Access Denied</span>;
      case 'error':
        return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">Test Error</span>;
      default:
        return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200">Not Tested</span>;
    }
  };

  return (
    <ThreeColumnLayout title="System Diagnostics">
      <div className="space-y-6 p-4 max-w-6xl mx-auto">
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
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid grid-cols-7 mb-4">
                <TabsTrigger value="summary">Core Services</TabsTrigger>
                <TabsTrigger value="navigation">Navigation</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="icons">Icons</TabsTrigger>
                <TabsTrigger value="forms">Form Validation</TabsTrigger>
                <TabsTrigger value="api">API Integrations</TabsTrigger>
                <TabsTrigger value="roles">Role Simulation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(report)
                    .filter(([key]) => 
                      key !== 'overall' && 
                      key !== 'timestamp' && 
                      key !== 'navigationTests' && 
                      key !== 'permissionsTests' && 
                      key !== 'iconTests' &&
                      key !== 'formValidationTests' &&
                      key !== 'roleSimulationTests')
                    .map(([key, value]: [string, any]) => (
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
              </TabsContent>
              
              <TabsContent value="navigation">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      Navigation Route Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {report.navigationTests.map((test: any, index: number) => (
                        <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(test.status)}
                              <span className="font-medium">{test.route}</span>
                            </div>
                            <span className="text-sm px-2 py-1 rounded-full bg-muted">
                              {test.status}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{test.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="permissions">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Permission Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {report.permissionsTests.map((test: any, index: number) => (
                        <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2">
                              {getStatusIcon(test.status)}
                              <div>
                                <span className="font-medium">Role: {test.role}</span>
                                <p className="text-sm">Permission: {test.permission}</p>
                              </div>
                            </div>
                            <span className="text-sm px-2 py-1 rounded-full bg-muted">
                              {test.status}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{test.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="icons">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Icon Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {report.iconTests.map((test: any, index: number) => (
                        <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2">
                              {getStatusIcon(test.status)}
                              <div>
                                <span className="font-medium">{test.icon}</span>
                                <p className="text-sm">Location: {test.location}</p>
                              </div>
                            </div>
                            <span className="text-sm px-2 py-1 rounded-full bg-muted">
                              {test.status}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{test.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="forms">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Form Validation Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {report.formValidationTests.map((test: any, index: number) => (
                        <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2">
                              {getStatusIcon(test.status)}
                              <div>
                                <span className="font-medium">{test.formName}</span>
                                <p className="text-sm">Page: {test.location}</p>
                              </div>
                            </div>
                            <span className="text-sm px-2 py-1 rounded-full bg-muted">
                              {test.status}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{test.message}</p>
                          
                          {test.fields && test.fields.length > 0 && (
                            <div className="mt-2 pl-8 space-y-2">
                              <p className="text-sm font-medium">Field Tests:</p>
                              {test.fields.map((field: any, fieldIndex: number) => (
                                <div key={fieldIndex} className={`p-2 rounded-md border ${getStatusColor(field.status)}`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(field.status)}
                                      <div>
                                        <span className="font-medium">{field.fieldName}</span>
                                        <p className="text-xs text-muted-foreground">Type: {field.fieldType}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-xs mt-1">{field.message}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="api">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      API Integration Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {report.apiIntegrationTests.map((test: any, index: number) => (
                        <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2">
                              {getStatusIcon(test.status)}
                              <div>
                                <span className="font-medium">{test.service}</span>
                                <p className="text-sm">Endpoint: {test.endpoint}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-sm px-2 py-1 rounded-full bg-muted">
                                {test.status}
                              </span>
                              <div className="flex items-center gap-2">
                                {getResponseTimeBadge(test.responseTime)}
                                {getAuthStatusBadge(test.authStatus)}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm mt-1">{test.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="roles">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCog className="h-5 w-5" />
                      User Role Simulation Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">Role Access Testing</h3>
                      <p className="text-sm text-muted-foreground">
                        These tests simulate different user roles accessing various system modules to ensure proper authorization boundaries.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      {['client', 'advisor', 'admin', 'accountant', 'attorney'].map(role => (
                        <div key={role} className="space-y-3">
                          <h4 className="text-md font-semibold capitalize border-b pb-1">
                            {role} Role Access
                          </h4>
                          {report.roleSimulationTests
                            .filter((test: any) => test.role === role)
                            .map((test: any, index: number) => (
                              <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-start gap-2">
                                    {getAccessStatusIcon(test.accessStatus, test.expectedAccess)}
                                    <div>
                                      <span className="font-medium">Module: {test.module}</span>
                                      <p className="text-xs mt-1">
                                        Expected: {test.expectedAccess ? "Access Allowed" : "Access Denied"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    {getAccessStatusBadge(test.accessStatus)}
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                      {test.status}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm mt-2">{test.message}</p>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

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
