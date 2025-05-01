
import React from 'react';
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";

export default function Integration() {
  return (
    <ThreeColumnLayout activeMainItem="integration">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Project Integration</h1>
          <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm font-medium">
            Connected
          </div>
        </div>

        <p className="text-muted-foreground mb-6">
          Manage integrations for your family office marketplace connections and APIs.
        </p>

        <Tabs defaultValue="connected-projects" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="connected-projects">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api-integrations">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>
          <TabsContent value="connected-projects" className="pt-4">
            <ConnectedProjectsTab />
          </TabsContent>
          <TabsContent value="architecture" className="pt-4">
            <ArchitectureTab />
          </TabsContent>
          <TabsContent value="api-integrations" className="pt-4">
            <ApiIntegrationsTab />
          </TabsContent>
          <TabsContent value="plugins" className="pt-4">
            <PluginsTab />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
