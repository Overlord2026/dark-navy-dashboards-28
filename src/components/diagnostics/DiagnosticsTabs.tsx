
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoreServicesSummary } from "./CoreServicesSummary";
import { NavigationTests } from "./NavigationTests";
import { PermissionTests } from "./PermissionTests";
import { IconTests } from "./IconTests";
import { FormValidationTests } from "./FormValidationTests";
import { ApiIntegrationTests } from "./ApiIntegrationTests";
import { RoleSimulationTests } from "./RoleSimulationTests";
import { PerformanceTests } from "./PerformanceTests";
import { RecommendationsList } from "./RecommendationsList";
import { LoggingConfiguration } from "./LoggingConfiguration";
import { LogViewer } from "./LogViewer";

interface DiagnosticsTabsProps {
  report: any;
  recommendations: string[];
  isLoading?: boolean;
}

export const DiagnosticsTabs = ({ report, recommendations, isLoading = false }: DiagnosticsTabsProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-10 mb-4">
          <TabsTrigger value="summary">Core Services</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="icons">Icons</TabsTrigger>
          <TabsTrigger value="forms">Form Validation</TabsTrigger>
          <TabsTrigger value="api">API Integrations</TabsTrigger>
          <TabsTrigger value="roles">Role Simulation</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="logging-config">Log Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <CoreServicesSummary report={report} />
        </TabsContent>
        
        <TabsContent value="navigation">
          <NavigationTests tests={report.navigationTests} />
        </TabsContent>
        
        <TabsContent value="permissions">
          <PermissionTests tests={report.permissionsTests} />
        </TabsContent>
        
        <TabsContent value="icons">
          <IconTests tests={report.iconTests} />
        </TabsContent>
        
        <TabsContent value="forms">
          <FormValidationTests tests={report.formValidationTests} />
        </TabsContent>
        
        <TabsContent value="api">
          <ApiIntegrationTests tests={report.apiIntegrationTests} />
        </TabsContent>
        
        <TabsContent value="roles">
          <RoleSimulationTests tests={report.roleSimulationTests} />
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformanceTests tests={report.performanceTests} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="logs">
          <LogViewer />
        </TabsContent>
        
        <TabsContent value="logging-config">
          <LoggingConfiguration />
        </TabsContent>
      </Tabs>

      <RecommendationsList 
        recommendations={recommendations} 
        timestamp={report?.timestamp}
      />
    </div>
  );
};
