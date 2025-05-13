
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/integration';
import { toast } from 'sonner';

export const ConnectedProjectsTab = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('integration_projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Convert the raw data to match our Project type
        if (data) {
          setProjects(data as Project[]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load connected projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Connected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'disconnected':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Disconnected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Error</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{status}</Badge>;
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Connected Projects</h3>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {projects.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground">No projects connected yet</p>
              <Button className="mt-4">Connect a Project</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{project.name}</CardTitle>
                      {getStatusBadge(project.status)}
                    </div>
                    <CardDescription>{project.project_type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {project.description || 'No description available'}
                    </p>
                    {project.last_sync && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last sync: {new Date(project.last_sync).toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="pt-1 flex justify-end">
                    <Button variant="outline" size="sm">Manage</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
