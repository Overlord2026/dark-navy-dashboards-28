
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";
import { ConnectedBadge } from "@/components/integration/ConnectedBadge";

export default function ProjectIntegration() {
  return (
    <ThreeColumnLayout activeMainItem="integration">
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Project Integration
              <ConnectedBadge />
            </h1>
            <p className="text-muted-foreground">
              Connect and manage your project integrations with the Family Office Marketplace
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="connected" className="space-y-4">
          <TabsList>
            <TabsTrigger value="connected">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected" className="space-y-4">
            <ConnectedProjectsTab />
          </TabsContent>
          
          <TabsContent value="architecture" className="space-y-4">
            <ArchitectureTab />
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <ApiIntegrationsTab />
          </TabsContent>
          
          <TabsContent value="plugins" className="space-y-4">
            <PluginsTab />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
