
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";
import { Badge } from "@/components/ui/badge";

export default function ProjectIntegrationPage() {
  const [activeTab, setActiveTab] = useState("connected-projects");
  
  return (
    <ThreeColumnLayout activeMainItem="integration">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Project Integration Hub</h1>
            <p className="text-muted-foreground mt-1">
              Manage connections to other services and marketplace integrations
            </p>
          </div>
          
          <Badge className="bg-green-600 hover:bg-green-700">
            Connected
          </Badge>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Integration Dashboard</CardTitle>
            <CardDescription>
              Connect your platform with the Family Office Marketplace and other services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-4 gap-2">
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
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}
