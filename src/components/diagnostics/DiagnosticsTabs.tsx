
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoreServicesSummary } from "./CoreServicesSummary";
import { NavigationTests } from "./NavigationTests";
import { PermissionTests } from "./PermissionTests";
import { IconTests } from "./IconTests";
import { FormValidationTests } from "./FormValidationTests";
import { ApiIntegrationTests } from "./ApiIntegrationTests";
import { RoleSimulationTests } from "./RoleSimulationTests";
import { PerformanceTests } from "./PerformanceTests";
import { SecurityTests } from "./SecurityTests";
import { RecommendationsList } from "./RecommendationsList";
import { LogViewer } from "./LogViewer";
import { LoggingConfiguration } from "./LoggingConfiguration";
import { AuditLogViewer } from "./AuditLogViewer";
import { useUser } from "@/context/UserContext";
import { DiagnosticsAuditViewer } from "./DiagnosticsAuditViewer";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import { 
  LayoutDashboard, 
  Navigation, 
  ShieldAlert, 
  FileText, 
  Globe, 
  Users, 
  Zap, 
  Lock, 
  Lightbulb,
  FileTerminal,
  Shield,
  ActivitySquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";

type DiagnosticsTabsProps = {
  report: any;
  recommendations: any[];
  isLoading: boolean;
};

export const DiagnosticsTabs = ({ 
  report, 
  recommendations, 
  isLoading 
}: DiagnosticsTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  const diagnostics = useDiagnostics();

  // Helper to count issues for each tab
  const countIssues = (tests: any[] = [], status: DiagnosticTestStatus = "error"): number => {
    return tests.filter(test => test.status === status).length;
  };
  
  // Create status badges for tabs
  const createStatusBadge = (count: number, status: DiagnosticTestStatus = "error") => {
    if (count === 0) return null;
    
    return (
      <Badge
        variant={status === "error" ? "destructive" : status === "warning" ? "warning" : "default"}
        className="ml-1.5"
      >
        {count}
      </Badge>
    );
  };
  
  const navigationIssues = countIssues(report?.navigationTests);
  const permissionsIssues = countIssues(report?.permissionsTests);
  const formsIssues = countIssues(report?.formValidationTests);
  const apiIssues = countIssues(report?.apiIntegrationTests);
  const rolesIssues = countIssues(report?.roleSimulationTests);
  const performanceIssues = countIssues(report?.performanceTests);
  const securityIssues = countIssues(report?.securityTests);
  
  return (
    <Tabs 
      defaultValue="overview" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-1">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden md:inline">Overview</span>
        </TabsTrigger>
        
        <TabsTrigger value="navigation" className="flex items-center gap-1">
          <Navigation className="h-4 w-4" />
          <span className="hidden md:inline">Navigation</span>
          {createStatusBadge(navigationIssues)}
        </TabsTrigger>
        
        <TabsTrigger value="permissions" className="flex items-center gap-1">
          <ShieldAlert className="h-4 w-4" />
          <span className="hidden md:inline">Permissions</span>
          {createStatusBadge(permissionsIssues)}
        </TabsTrigger>
        
        <TabsTrigger value="forms" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span className="hidden md:inline">Forms</span>
          {createStatusBadge(formsIssues)}
        </TabsTrigger>
        
        <TabsTrigger value="api" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">API</span>
          {createStatusBadge(apiIssues)}
        </TabsTrigger>
        
        <TabsTrigger value="roles" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span className="hidden md:inline">Roles</span>
          {createStatusBadge(rolesIssues)}
        </TabsTrigger>
        
        <TabsTrigger value="performance" className="flex items-center gap-1">
          <Zap className="h-4 w-4" />
          <span className="hidden md:inline">Performance</span>
          {createStatusBadge(performanceIssues)}
        </TabsTrigger>
        
        <TabsTrigger value="security" className="flex items-center gap-1">
          <Lock className="h-4 w-4" />
          <span className="hidden md:inline">Security</span>
          {createStatusBadge(securityIssues)}
        </TabsTrigger>
        
        <TabsTrigger value="recommendations" className="flex items-center gap-1">
          <Lightbulb className="h-4 w-4" />
          <span className="hidden md:inline">Recommendations</span>
        </TabsTrigger>
        
        {isAdmin && (
          <>
            <TabsTrigger value="logs" className="flex items-center gap-1">
              <FileTerminal className="h-4 w-4" />
              <span className="hidden md:inline">System Logs</span>
            </TabsTrigger>
            
            <TabsTrigger value="audit-logs" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Security Audit</span>
            </TabsTrigger>
            
            <TabsTrigger value="diagnostics-logs" className="flex items-center gap-1">
              <ActivitySquare className="h-4 w-4" />
              <span className="hidden md:inline">Diagnostics Audit</span>
            </TabsTrigger>
          </>
        )}
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview">
        <CoreServicesSummary report={report} isLoading={isLoading} />
      </TabsContent>

      {/* Navigation Tab */}
      <TabsContent value="navigation">
        <NavigationTests 
          tests={report?.navigationTests || []}
          isLoading={isLoading}
        />
      </TabsContent>

      {/* Permissions Tab */}
      <TabsContent value="permissions">
        <PermissionTests 
          tests={report?.permissionsTests || []}
          isLoading={isLoading}
        />
      </TabsContent>

      {/* Forms Tab */}
      <TabsContent value="forms">
        <FormValidationTests 
          tests={report?.formValidationTests || []}
          isLoading={isLoading}
        />
      </TabsContent>

      {/* API Tab */}
      <TabsContent value="api">
        <ApiIntegrationTests 
          tests={report?.apiIntegrationTests || []}
          isLoading={isLoading}
        />
      </TabsContent>

      {/* Roles Tab */}
      <TabsContent value="roles">
        <RoleSimulationTests 
          tests={report?.roleSimulationTests || []}
          isLoading={isLoading}
        />
      </TabsContent>

      {/* Performance Tab */}
      <TabsContent value="performance">
        <PerformanceTests 
          tests={report?.performanceTests || []}
          isLoading={isLoading}
        />
      </TabsContent>

      {/* Security Tab */}
      <TabsContent value="security">
        <SecurityTests 
          tests={report?.securityTests || []}
          isLoading={isLoading}
        />
      </TabsContent>

      {/* Recommendations Tab */}
      <TabsContent value="recommendations">
        <RecommendationsList 
          recommendations={recommendations}
          isLoading={isLoading}
        />
      </TabsContent>

      {/* Admin-only tabs */}
      {isAdmin && (
        <>
          <TabsContent value="logs">
            <div className="grid grid-cols-1 gap-8">
              <LoggingConfiguration />
              <LogViewer />
            </div>
          </TabsContent>
          
          <TabsContent value="audit-logs">
            <AuditLogViewer />
          </TabsContent>
          
          <TabsContent value="diagnostics-logs">
            <DiagnosticsAuditViewer />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};
