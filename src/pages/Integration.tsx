
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectedBadge } from "@/components/integration/ConnectedBadge";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";
import { SupabaseRequiredNotice } from "@/components/integration/SupabaseRequiredNotice";

export default function Integration() {
  const [activeTab, setActiveTab] = useState("connected-projects");
  
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Integration</h1>
          <p className="text-muted-foreground">
            Connect and manage external project integrations
          </p>
        </div>
        <ConnectedBadge />
      </div>
      
      <SupabaseRequiredNotice />
      
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle>Integration Hub</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="connected-projects" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-4 md:w-[600px]">
              <TabsTrigger value="connected-projects">Connected Projects</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="api-integrations">API Integrations</TabsTrigger>
              <TabsTrigger value="plugins">Plugins</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connected-projects" className="space-y-4">
              <ConnectedProjectsTab />
            </TabsContent>
            
            <TabsContent value="architecture" className="space-y-4">
              <ArchitectureTab />
            </TabsContent>
            
            <TabsContent value="api-integrations" className="space-y-4">
              <ApiIntegrationsTab />
            </TabsContent>
            
            <TabsContent value="plugins" className="space-y-4">
              <PluginsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
