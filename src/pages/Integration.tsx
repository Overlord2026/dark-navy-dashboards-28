
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";
import { RoleBasedAccess } from "@/components/auth/RoleBasedAccess";
import { useLocation } from "react-router-dom";
import { Network } from "lucide-react";

export default function Integration() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('segment') || 'projects';
  
  return (
    <RoleBasedAccess allowedRoles={['admin', 'advisor']}>
      <div className="container mx-auto py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-green-100 p-2">
            <Network className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Project Integration</h1>
            <p className="text-muted-foreground">
              Connect and manage services within the Family Office ecosystem
            </p>
          </div>
        </div>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="mb-4">
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
    </RoleBasedAccess>
  );
}
