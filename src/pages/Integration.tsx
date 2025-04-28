
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";

const Integration: React.FC = () => {
  const [activeTab, setActiveTab] = useState("connected-projects");

  return (
    <ThreeColumnLayout title="Integration">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Project Integration</h1>
          <p className="text-muted-foreground mt-2">
            Manage integrations and connections between projects in the Family Office Marketplace
          </p>
        </div>

        <Tabs defaultValue="connected-projects" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
};

export default Integration;
