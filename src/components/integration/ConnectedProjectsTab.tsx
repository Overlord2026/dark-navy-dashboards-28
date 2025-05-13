
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, ExternalLink, Check, X, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export const ConnectedProjectsTab: React.FC = () => {
  const [connectedProjects, setConnectedProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchConnectedProjects();
    }
  }, [isAuthenticated]);

  const fetchConnectedProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('integration_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setConnectedProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error.message);
      toast.error("Failed to load connected projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToken = () => {
    const token = "fmo_api_" + Math.random().toString(36).substring(2, 15);
    navigator.clipboard.writeText(token);
    toast.success("Integration token copied to clipboard");
  };

  const handleConnectProject = async () => {
    try {
      const projectName = prompt("Enter project name:");
      if (!projectName) return;
      
      const projectType = prompt("Enter project type (parent/child):", "child");
      if (!projectType) return;
      
      const apiToken = "fmo_api_" + Math.random().toString(36).substring(2, 15);
      
      const { data, error } = await supabase
        .from('integration_projects')
        .insert({
          name: projectName,
          description: `Integration with ${projectName}`,
          project_type: projectType,
          api_token: apiToken,
          status: 'pending'
        })
        .select();
      
      if (error) throw error;
      
      toast.success("Project connection initiated");
      fetchConnectedProjects();
    } catch (error: any) {
      console.error("Error connecting project:", error.message);
      toast.error("Failed to connect project");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Connected Projects</h3>
          <p className="text-sm text-muted-foreground">
            Manage projects that share data with this instance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyToken}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Token
          </Button>
          <Button onClick={handleConnectProject}>
            <Plus className="h-4 w-4 mr-2" />
            Connect Project
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : connectedProjects.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No connected projects found</p>
            <Button onClick={handleConnectProject}>
              <Plus className="h-4 w-4 mr-2" />
              Connect Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-md font-semibold">{project.name}</CardTitle>
                  <Badge 
                    variant={project.status === "active" ? "default" : "outline"}
                    className={
                      project.status === "active" 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "border-orange-500 text-orange-500"
                    }
                  >
                    {project.status === "active" ? "Active" : "Pending"}
                  </Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project Type:</span>
                    <span className="font-medium capitalize">{project.project_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Synced:</span>
                    <span>
                      {project.last_sync 
                        ? new Date(project.last_sync).toLocaleString() 
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Sharing:</span>
                    <span className="flex items-center">
                      {project.status === "active" 
                        ? <Check className="h-4 w-4 text-green-500 mr-1" /> 
                        : <X className="h-4 w-4 text-orange-500 mr-1" />}
                      {project.status === "active" ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 pt-2 pb-2 flex justify-end">
                <Button size="sm" variant="ghost">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
