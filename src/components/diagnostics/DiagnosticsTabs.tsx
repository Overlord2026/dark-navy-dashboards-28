
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
import { LogViewer } from "./LogViewer";
import { LoggingConfiguration } from "./LoggingConfiguration";
import { SecurityTests } from "./SecurityTests";
import { AuditLogViewer } from "./AuditLogViewer";

interface DiagnosticsTabsProps {
  report: any;
  recommendations: string[];
  isLoading: boolean;
}

export const DiagnosticsTabs = ({ report, recommendations, isLoading }: DiagnosticsTabsProps) => {
  if (!report) return null;

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 w-full">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <CoreServicesSummary 
          navigation={report.navigation}
          forms={report.forms}
          database={report.database}
          api={report.api}
          authentication={report.authentication}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NavigationTests tests={report.navigationTests} />
          <ApiIntegrationTests tests={report.apiIntegrationTests} />
        </div>
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IconTests tests={report.iconTests} />
          <FormValidationTests tests={report.formValidationTests} />
        </div>
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <SecurityTests tests={report.securityTests || []} />
          <PermissionTests tests={report.permissionsTests} />
          <RoleSimulationTests tests={report.roleSimulationTests} />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <AuditLogViewer />
        </div>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <PerformanceTests tests={report.performanceTests} />
      </TabsContent>

      <TabsContent value="logs" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <LogViewer />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <LoggingConfiguration />
        </div>
      </TabsContent>

      <TabsContent value="recommendations">
        <RecommendationsList recommendations={recommendations} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
};
