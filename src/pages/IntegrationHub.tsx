
import { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, PlusCircle, ArrowUpRight, Code2, Puzzle, Grid3X3, BookOpen } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from "@/context/UserContext";

interface Project {
  id: string;
  name: string;
  description: string | null;
  project_type: string;
  status: string;
  last_sync: string | null;
}

export default function IntegrationHub() {
  const { userProfile } = useUser();
  const [activeTab, setActiveTab] = useState("connected");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects from Supabase
  useEffect(() => {
    const loadProjects = async () => {
      if (!userProfile?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('integration_projects')
          .select('*')
          .eq('user_id', userProfile.id);
          
        if (error) {
          console.error("Error loading projects:", error);
          setError("Failed to load connected projects");
          return;
        }
        
        setProjects(data || []);
      } catch (err) {
        console.error("Error in loadProjects:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, [userProfile?.id]);

  return (
    <ThreeColumnLayout activeMainItem="integration" title="Project Integration">
      <div className="flex items-center justify-between mb-6 px-4 pt-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-[24px] font-semibold text-white">Integration Hub</h1>
            <Badge className="ml-3 bg-green-600/20 text-green-400 hover:bg-green-600/20 border border-green-500/30">
              <span className="flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Connected
              </span>
            </Badge>
          </div>
          <p className="text-muted-foreground">Connect and manage your external projects and integrations</p>
        </div>
        
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          New Integration
        </Button>
      </div>
      
      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="connected">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected">
            {error ? (
              <div className="bg-destructive/15 p-4 rounded-md flex items-start mb-6">
                <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <span className="ml-3">Loading projects...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <Card key={project.id} className="bg-[#0F1E3A] border-[#2A3E5C]">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-white">{project.name}</CardTitle>
                          <Badge variant={project.status === 'active' ? 'default' : 'outline'}>
                            {project.status === 'active' ? 'Active' : 'Pending'}
                          </Badge>
                        </div>
                        <CardDescription>
                          {project.description || `A ${project.project_type} integration project`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex justify-between mb-2">
                            <span>Type:</span>
                            <span className="font-medium text-white">{project.project_type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Sync:</span>
                            <span className="font-medium text-white">
                              {project.last_sync 
                                ? new Date(project.last_sync).toLocaleDateString() 
                                : 'Never'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">Configure</Button>
                        <Button size="sm">
                          Open
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-primary/10 p-6 mb-4">
                      <Puzzle className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No projects connected yet</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Connect your first project to start integrating with the Family Office platform.
                    </p>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Connect a Project
                    </Button>
                  </div>
                )}
                
                {projects.length > 0 && (
                  <Card className="bg-primary/10 border-dashed border-primary/30 flex flex-col items-center justify-center p-6">
                    <PlusCircle className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-medium text-white mb-2">Connect New Project</h3>
                    <p className="text-sm text-center text-muted-foreground mb-4">
                      Add another project to your integration hub
                    </p>
                    <Button>Connect Project</Button>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="architecture">
            <div className="bg-[#0F1E3A] rounded-lg border border-[#2A3E5C] p-6">
              <div className="flex items-start mb-6">
                <div className="rounded-full bg-blue-500/20 p-2 mr-4">
                  <Code2 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">System Architecture</h2>
                  <p className="text-muted-foreground">
                    Design and overview of your integrated systems architecture
                  </p>
                </div>
              </div>
              
              <div className="border border-[#2A3E5C] rounded-lg p-6 mb-6 bg-[#0A1429]">
                <h3 className="text-lg font-medium text-white mb-4">Architecture Diagram</h3>
                <div className="aspect-video bg-[#0F1E3A] rounded-md flex items-center justify-center border border-[#2A3E5C]">
                  <Grid3X3 className="h-24 w-24 text-[#2A3E5C]" />
                  <p className="ml-4 text-muted-foreground">
                    Architecture diagram will render here
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Connected Systems</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-md border border-[#2A3E5C] bg-[#0A1429] flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="rounded-full bg-green-500/20 p-2 mr-3">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Family Office Core</h4>
                        <p className="text-sm text-muted-foreground">Primary system</p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  
                  <div className="p-4 rounded-md border border-[#2A3E5C] bg-[#0A1429] flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="rounded-full bg-orange-500/20 p-2 mr-3">
                        <BookOpen className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">CRM System</h4>
                        <p className="text-sm text-muted-foreground">External integration</p>
                      </div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api">
            <div className="bg-[#0F1E3A] rounded-lg border border-[#2A3E5C] p-6">
              <h2 className="text-xl font-semibold text-white mb-6">API Integrations</h2>
              
              <div className="space-y-6">
                <div className="border border-[#2A3E5C] rounded-lg p-4 bg-[#0A1429]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-white">REST API</h3>
                      <p className="text-sm text-muted-foreground">Access core functionality via REST endpoints</p>
                    </div>
                    <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/20">Active</Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Endpoints:</span>
                      <span className="text-white">36 available</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Authentication:</span>
                      <span className="text-white">OAuth 2.0, API Keys</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate Limit:</span>
                      <span className="text-white">100 req/min</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">View Documentation</Button>
                  </div>
                </div>
                
                <div className="border border-[#2A3E5C] rounded-lg p-4 bg-[#0A1429]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-white">GraphQL API</h3>
                      <p className="text-sm text-muted-foreground">Access data with flexible queries</p>
                    </div>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-white">In Development</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Release Date:</span>
                      <span className="text-white">Q1 2024</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" disabled>Join Waitlist</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="plugins">
            <div className="bg-[#0F1E3A] rounded-lg border border-[#2A3E5C] p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Plugin Marketplace</h2>
                <Button size="sm" variant="outline">Browse All</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-[#2A3E5C] rounded-lg p-4 bg-[#0A1429]">
                  <h3 className="font-medium text-white mb-1">Data Connector</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect to external data sources and APIs
                  </p>
                  <div className="flex justify-between">
                    <Badge variant="outline">Free</Badge>
                    <Button size="sm">Install</Button>
                  </div>
                </div>
                
                <div className="border border-[#2A3E5C] rounded-lg p-4 bg-[#0A1429]">
                  <h3 className="font-medium text-white mb-1">Report Generator</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Custom financial report generation
                  </p>
                  <div className="flex justify-between">
                    <Badge variant="secondary">Premium</Badge>
                    <Button size="sm">Details</Button>
                  </div>
                </div>
                
                <div className="border border-[#2A3E5C] rounded-lg p-4 bg-[#0A1429]">
                  <h3 className="font-medium text-white mb-1">Calendar Sync</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sync events with Google Calendar
                  </p>
                  <div className="flex justify-between">
                    <Badge variant="outline">Free</Badge>
                    <Button size="sm">Install</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
