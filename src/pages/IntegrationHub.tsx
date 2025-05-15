
import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConnectedProjectsTab } from '@/components/integration/ConnectedProjectsTab';
import { ArchitectureTab } from '@/components/integration/ArchitectureTab';
import { ApiIntegrationsTab } from '@/components/integration/ApiIntegrationsTab';
import { PluginsTab } from '@/components/integration/PluginsTab';
import { getSidebarNavItems } from '@/data/navigationData';
import { ConnectedBadge } from '@/components/integration/ConnectedBadge';

const IntegrationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("connected-projects");
  const integrationNavItems = getSidebarNavItems('integration');

  return (
    <ThreeColumnLayout 
      activeMainItem="integration" 
      title="Project Integration" 
      sidebarItems={integrationNavItems}
    >
      <div className="mx-auto w-full max-w-6xl space-y-6 p-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Project Integration Hub</h1>
          <p className="text-muted-foreground">
            Manage connections with other projects and external systems
          </p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="connected-projects">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api-integrations">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>

          <TabsContent value="connected-projects" className="mt-6">
            <ConnectedProjectsTab />
          </TabsContent>
          
          <TabsContent value="architecture" className="mt-6">
            <ArchitectureTab />
          </TabsContent>
          
          <TabsContent value="api-integrations" className="mt-6">
            <ApiIntegrationsTab />
          </TabsContent>
          
          <TabsContent value="plugins" className="mt-6">
            <PluginsTab />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add the connected badge to the right side bar */}
      <div className="sidebar-right">
        <ConnectedBadge />
      </div>
    </ThreeColumnLayout>
  );
};

export default IntegrationHub;
