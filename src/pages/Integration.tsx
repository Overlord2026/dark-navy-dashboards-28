
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";
import { SupabaseRequiredNotice } from "@/components/integration/SupabaseRequiredNotice";

export default function Integration() {
  return (
    <ThreeColumnLayout activeMainItem="integration" title="Project Integration">
      <div className="container mx-auto py-8">
        <SupabaseRequiredNotice />
        
        <h1 className="text-3xl font-bold mb-6">Project Integration Hub</h1>
        
        <Tabs defaultValue="connected-projects" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="connected-projects">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api-integrations">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected-projects">
            <ConnectedProjectsTab />
          </TabsContent>
          
          <TabsContent value="architecture">
            <ArchitectureTab />
          </TabsContent>
          
          <TabsContent value="api-integrations">
            <ApiIntegrationsTab />
          </TabsContent>
          
          <TabsContent value="plugins">
            <PluginsTab />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
