
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectedBadge } from "@/components/integration/ConnectedBadge";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";
import { SupabaseRequiredNotice } from "@/components/integration/SupabaseRequiredNotice";
import { toast } from "sonner";

export default function Integration() {
  const [activeTab, setActiveTab] = useState("projects");
  const isConnected = true; // This would typically be determined by an API check

  const handleCopyToken = () => {
    navigator.clipboard.writeText("fmo_api_" + Math.random().toString(36).substring(2, 15));
    toast.success("Integration token copied to clipboard");
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Project Integration</h1>
          <p className="text-muted-foreground">
            Connect your Family Office Marketplace project to other systems
          </p>
        </div>
        <ConnectedBadge className="px-3 py-1" />
      </div>

      <SupabaseRequiredNotice />

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Integration Hub</CardTitle>
              <CardDescription>
                Manage connected projects and integration settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs 
            defaultValue="projects" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="projects">Connected Projects</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="apis">API Integrations</TabsTrigger>
              <TabsTrigger value="plugins">Plugins</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects">
              <ConnectedProjectsTab onCopyToken={handleCopyToken} />
            </TabsContent>
            
            <TabsContent value="architecture">
              <ArchitectureTab />
            </TabsContent>
            
            <TabsContent value="apis">
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
