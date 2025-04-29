
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";
import { Badge } from "@/components/ui/badge";
import { Share2 } from "lucide-react";

export function AdminIntegrationDashboard() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Project Integration</h1>
          <Badge className="bg-blue-600 text-white">Connected</Badge>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Manage connections, architecture, and integrations for your Family Office Marketplace
        </p>
      </div>
      
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
  );
}
