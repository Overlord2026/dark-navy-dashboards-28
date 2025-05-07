
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";

export default function Integration() {
  const [activeTab, setActiveTab] = useState("connected-projects");
  
  return (
    <ThreeColumnLayout 
      title="Project Integration"
      activeMainItem="integration"
    >
      <div className="container py-6">
        <DashboardHeader 
          heading="Project Integration" 
          text="Connect and integrate your project with the Family Office Marketplace"
        />

        <Tabs
          defaultValue="connected-projects"
          className="w-full mt-6"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid grid-cols-4 mb-8">
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
