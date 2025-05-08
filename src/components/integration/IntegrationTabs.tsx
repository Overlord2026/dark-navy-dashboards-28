
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectedProjectsTab } from "./ConnectedProjectsTab";
import { ArchitectureTab } from "./ArchitectureTab";
import { ApiIntegrationsTab } from "./ApiIntegrationsTab";
import { PluginsTab } from "./PluginsTab";

export function IntegrationTabs() {
  return (
    <Tabs defaultValue="connected" className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="connected">Connected Projects</TabsTrigger>
        <TabsTrigger value="architecture">Architecture</TabsTrigger>
        <TabsTrigger value="api">API Integrations</TabsTrigger>
        <TabsTrigger value="plugins">Plugins</TabsTrigger>
      </TabsList>
      <TabsContent value="connected">
        <ConnectedProjectsTab />
      </TabsContent>
      <TabsContent value="architecture">
        <ArchitectureTab />
      </TabsContent>
      <TabsContent value="api">
        <ApiIntegrationsTab />
      </TabsContent>
      <TabsContent value="plugins">
        <PluginsTab />
      </TabsContent>
    </Tabs>
  );
}
