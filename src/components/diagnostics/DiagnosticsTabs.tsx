
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationTests } from './NavigationTests';
import { PermissionTests } from './PermissionTests';
import { IconTests } from './IconTests';
import { FormValidationTests } from './FormValidationTests';
import { ApiIntegrationTests } from './ApiIntegrationTests';
import { RoleSimulationTests } from './RoleSimulationTests';
import { PerformanceTests } from './PerformanceTests';
import { SecurityTests } from './SecurityTests';
import { ApiEndpointDiagnostics } from './ApiEndpointDiagnostics';

export const DiagnosticsTabs = ({ results }: { results: any }) => {
  return (
    <Tabs defaultValue="navigation" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
        <TabsTrigger value="navigation">Navigation</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="icons">Icons</TabsTrigger>
        <TabsTrigger value="forms">Forms</TabsTrigger>
        <TabsTrigger value="api-integrations">API Integrations</TabsTrigger>
        <TabsTrigger value="api-endpoints">API Endpoints</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      
      <TabsContent value="navigation" className="mt-4">
        <NavigationTests tests={results.navigationTests || []} />
      </TabsContent>
      
      <TabsContent value="permissions" className="mt-4">
        <PermissionTests tests={results.permissionsTests || []} />
      </TabsContent>
      
      <TabsContent value="icons" className="mt-4">
        <IconTests tests={results.iconTests || []} />
      </TabsContent>
      
      <TabsContent value="forms" className="mt-4">
        <FormValidationTests tests={results.formValidationTests || []} />
      </TabsContent>
      
      <TabsContent value="api-integrations" className="mt-4">
        <ApiIntegrationTests tests={results.apiIntegrationTests || []} />
      </TabsContent>
      
      <TabsContent value="api-endpoints" className="mt-4">
        <ApiEndpointDiagnostics />
      </TabsContent>
      
      <TabsContent value="roles" className="mt-4">
        <RoleSimulationTests tests={results.roleSimulationTests || []} />
      </TabsContent>
      
      <TabsContent value="performance" className="mt-4">
        <PerformanceTests tests={results.performanceTests || []} />
      </TabsContent>
      
      <TabsContent value="security" className="mt-4">
        <SecurityTests tests={results.securityTests || []} />
      </TabsContent>
    </Tabs>
  );
};
