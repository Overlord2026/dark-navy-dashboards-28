
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus, RefreshCw, ExternalLink, Trash, Check } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  description?: string;
  project_type: string;
  api_token?: string;
  // Change status to accept string to match what comes from Supabase
  status: string;
  last_sync?: Date | string | null;
}

export function ConnectedProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  // Fetch projects on component mount
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('integration_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to Project type to ensure compatibility
      const typedProjects: Project[] = data?.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        project_type: item.project_type,
        api_token: item.api_token,
        status: item.status,
        last_sync: item.last_sync
      })) || [];
      
      setProjects(typedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToken = (token: string, projectId: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(projectId);
    toast.success('API token copied to clipboard');
    
    // Reset the "Copied" state after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-600">Connected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case 'disconnected':
        return <Badge className="bg-slate-600">Disconnected</Badge>;
      case 'error':
        return <Badge className="bg-red-600">Error</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Connected Projects</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchProjects}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Connection
          </Button>
        </div>
      </div>
      
      {projects.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.project_type}</TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell>
                  {project.last_sync 
                    ? new Date(project.last_sync).toLocaleString() 
                    : 'Never'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {project.api_token && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopyToken(project.api_token!, project.id)}
                      >
                        {copiedId === project.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        <span className="sr-only">Copy API token</span>
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Open</span>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setDeleteProject(project)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="border rounded-md p-8 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin mb-2 text-muted-foreground" />
              <p>Loading projects...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <ExternalLink className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No connected projects</h3>
              <p className="text-muted-foreground mb-4">
                Connect external projects to integrate with your Family Office platform.
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Create New Connection
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Project Confirmation Dialog */}
      <AlertDialog 
        open={deleteProject !== null} 
        onOpenChange={(isOpen) => !isOpen && setDeleteProject(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect and delete the project connection 
              "{deleteProject?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // Here you would implement the actual deletion
                toast.success(`Project "${deleteProject?.name}" has been deleted.`);
                setDeleteProject(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
