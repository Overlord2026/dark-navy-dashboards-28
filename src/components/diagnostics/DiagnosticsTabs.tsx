
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
  
  return (
    <Tabs 
      defaultValue="overview" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-1">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="navigation">Navigation</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="forms">Forms</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        {isAdmin && (
          <>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="audit-logs">Security Audit</TabsTrigger>
            <TabsTrigger value="diagnostics-logs">Diagnostics Audit</TabsTrigger>
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
