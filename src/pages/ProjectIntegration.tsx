
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Badge } from "@/components/ui/badge";
import { Network, Boxes, Users, Code } from "lucide-react";

export default function ProjectIntegration() {
  const [activeTab, setActiveTab] = useState("connected-projects");

  return (
    <ThreeColumnLayout 
      title="Project Integration Hub" 
      activeMainItem="integration"
    >
      <div className="container p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Project Integration Hub</h1>
          <p className="text-muted-foreground mb-6">
            Connect and manage integrations with other systems in the Family Office Marketplace
          </p>
        </div>

        <Tabs defaultValue="connected-projects" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="connected-projects" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Connected Projects</span>
            </TabsTrigger>
            <TabsTrigger value="architecture" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Architecture</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Boxes className="h-4 w-4" />
              <span className="hidden sm:inline">API Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="plugins" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Plugins</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected-projects" className="space-y-4 bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Connected Projects</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 border rounded-lg flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded">
                    <Network className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Project {i}</h3>
                      <Badge variant="outline" className="text-xs">Connected</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Integration enabled with secure data exchange
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="architecture" className="space-y-4 bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">System Architecture</h2>
            <div className="p-6 border rounded-lg">
              <p className="text-muted-foreground mb-4">Visualize how your system integrates with the Family Office ecosystem</p>
              <div className="h-64 bg-muted/40 rounded flex items-center justify-center">
                <p className="text-muted">Architecture diagram will be displayed here</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4 bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">API Integrations</h2>
            <div className="p-6 border rounded-lg">
              <p className="text-muted-foreground mb-4">Manage API connections and data flows</p>
              <div className="grid gap-4">
                {["Data Exchange", "Reporting", "Client Management"].map((api) => (
                  <div key={api} className="p-3 bg-background border rounded-md flex justify-between items-center">
                    <span>{api} API</span>
                    <Badge>Active</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="plugins" className="space-y-4 bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Marketplace Plugins</h2>
            <div className="p-6 border rounded-lg">
              <p className="text-muted-foreground mb-4">Discover and manage plugins from the Family Office Marketplace</p>
              <div className="grid gap-4">
                {["Portfolio Analysis", "Document Management", "Tax Planning"].map((plugin) => (
                  <div key={plugin} className="p-3 bg-background border rounded-md flex justify-between items-center">
                    <span>{plugin}</span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
