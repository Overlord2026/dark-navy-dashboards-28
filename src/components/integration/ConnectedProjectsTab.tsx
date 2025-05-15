
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Clock, Database } from "lucide-react";
import { SupabaseRequiredNotice } from './SupabaseRequiredNotice';

export const ConnectedProjectsTab: React.FC = () => {
  const projects = [
    {
      id: "proj-1",
      name: "Portfolio Analytics",
      description: "Real-time investment performance tracking",
      status: "active",
      lastSync: "2025-05-14T15:30:00Z",
      type: "analysis"
    },
    {
      id: "proj-2",
      name: "Client Reporting",
      description: "Automated client reporting system",
      status: "pending",
      lastSync: null,
      type: "reporting"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Connected Projects</h2>
        <Button>Connect New Project</Button>
      </div>
      
      <SupabaseRequiredNotice />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle>{project.name}</CardTitle>
                <Badge variant={project.status === 'active' ? 'success' : 'default'}>
                  {project.status === 'active' ? 'Active' : 'Pending'}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Database className="h-4 w-4 mr-1" />
                <span className="capitalize">{project.type} Project</span>
              </div>
              {project.lastSync && (
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Last synced: {new Date(project.lastSync).toLocaleString()}</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/50 flex justify-between">
              <Button variant="ghost" size="sm">
                Configure
              </Button>
              <Button size="sm">
                View Details <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
