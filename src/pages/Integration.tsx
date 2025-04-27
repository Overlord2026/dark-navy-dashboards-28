
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, FileCode, GitBranch, Plug, Network, Settings, Plus, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Integration() {
  const [activeTab, setActiveTab] = useState("projects");
  const { toast } = useToast();
  
  const handleAddProject = () => {
    toast({
      title: "Add Project",
      description: "Project connection dialog would open here. Supabase integration needed.",
    });
  };

  const handleManageProject = () => {
    toast({
      title: "Manage Project",
      description: "Project management options would appear here. Supabase integration needed.",
    });
  };

  const handleConfigureApi = () => {
    toast({
      title: "Configure APIs",
      description: "API configuration options would appear here. Supabase integration needed.",
    });
  };

  const handlePlanArchitecture = () => {
    toast({
      title: "Architecture Planning",
      description: "Planning tools would open here. Supabase integration needed.",
    });
  };

  const handlePluginAction = (pluginName: string) => {
    toast({
      title: `${pluginName} Selected`,
      description: `${pluginName} configuration would open here. Supabase integration needed.`,
    });
  };
  
  return (
    <ThreeColumnLayout title="Project Integration" activeMainItem="integration">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Project Integration Hub</h1>
            <p className="text-muted-foreground mt-2">
              Connect and manage your Family Office projects and prepare for the broader architecture
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
            <Button>
              <Share2 className="mr-2 h-4 w-4" />
              Connect Project
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-[600px]">
            <TabsTrigger value="projects">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Family Office Architecture</TabsTrigger>
            <TabsTrigger value="api">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Integration Plugins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Example project card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Wealth Management</CardTitle>
                    <div className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full">Connected</div>
                  </div>
                  <CardDescription>Main family office platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span>Last synced 2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-muted-foreground" />
                      <span>23 shared components</span>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" onClick={handleManageProject}>Manage</Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Add project card */}
              <Card className="border-dashed bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center h-[200px]">
                  <Plus className="h-8 w-8 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Connect another project</p>
                  <Button onClick={handleAddProject}>Add Project</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="architecture" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Family Office Architecture</CardTitle>
                <CardDescription>
                  Design and prepare the structure for your comprehensive family office system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <Network className="h-16 w-16 text-muted-foreground" />
                  <h3 className="text-xl font-medium">Architecture Planning</h3>
                  <p className="text-muted-foreground max-w-md">
                    Define how all your projects connect together as part of the broader Family Office Vision.
                  </p>
                  <Button className="mt-4" onClick={handlePlanArchitecture}>Start Planning</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Integration Hub</CardTitle>
                <CardDescription>
                  Configure API endpoints and manage cross-project data flows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <Plug className="h-16 w-16 text-muted-foreground" />
                  <h3 className="text-xl font-medium">API Configuration</h3>
                  <p className="text-muted-foreground max-w-md">
                    Set up secure API connections between projects and external systems.
                  </p>
                  <Button className="mt-4" onClick={handleConfigureApi}>Configure APIs</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="plugins" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Plugins</CardTitle>
                <CardDescription>
                  Install and configure plugins for extended functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <Button variant="outline" className="h-24 flex flex-col" onClick={() => handlePluginAction("Data Sync")}>
                      <span className="text-lg mb-2">Data Sync</span>
                      <span className="text-xs text-muted-foreground">Cross-project data synchronization</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col" onClick={() => handlePluginAction("Auth Bridge")}>
                      <span className="text-lg mb-2">Auth Bridge</span>
                      <span className="text-xs text-muted-foreground">Unified authentication</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col" onClick={() => handlePluginAction("File Bridge")}>
                      <span className="text-lg mb-2">File Bridge</span>
                      <span className="text-xs text-muted-foreground">Document sharing</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col" onClick={() => handlePluginAction("Plugin Directory")}>
                      <span className="text-lg mb-2">More...</span>
                      <span className="text-xs text-muted-foreground">Browse plugin directory</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
