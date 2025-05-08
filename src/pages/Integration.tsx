
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";
import { SupabaseRequiredNotice } from "@/components/integration/SupabaseRequiredNotice";

const Integration = () => {
  const [activeTab, setActiveTab] = useState("projects");
  
  return (
    <ThreeColumnLayout title="Project Integration">
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader 
          heading="Project Integration" 
          text="Connect your application to our marketplace and enable powerful integrations."
        />
        
        <SupabaseRequiredNotice />
        
        <Tabs 
          defaultValue="projects" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="projects">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
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
      </div>
    </ThreeColumnLayout>
  );
};

export default Integration;
