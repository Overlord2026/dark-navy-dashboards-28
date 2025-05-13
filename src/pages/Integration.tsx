
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";
import { ConnectedBadge } from "@/components/integration/ConnectedBadge";
import { usePagePerformance } from "@/hooks/usePagePerformance";

export default function Integration() {
  // Track page performance metrics
  usePagePerformance('/integration');
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Integration Hub</h1>
          <p className="text-muted-foreground mt-1">
            Connect, extend and manage your integration with other systems
          </p>
        </div>
        <ConnectedBadge />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Family Office Marketplace Integration</CardTitle>
          <CardDescription>
            Configure how this application integrates with the Family Office Marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
