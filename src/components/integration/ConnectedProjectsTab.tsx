
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, ExternalLink, Check, X } from "lucide-react";

interface ConnectedProjectsTabProps {
  onCopyToken: () => void;
}

export const ConnectedProjectsTab: React.FC<ConnectedProjectsTabProps> = ({ onCopyToken }) => {
  const connectedProjects = [
    {
      id: "project-1",
      name: "BFO Portal",
      description: "Main Family Office Portal",
      status: "active",
      lastSync: "2025-05-07T14:30:00Z",
      type: "parent"
    },
    {
      id: "project-2",
      name: "Family Trust Management",
      description: "Trust management system",
      status: "active",
      lastSync: "2025-05-07T10:15:00Z",
      type: "child"
    },
    {
      id: "project-3",
      name: "Asset Tracking System",
      description: "Asset and investment tracking",
      status: "pending",
      lastSync: null,
      type: "child"
    }
  ];

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
          <Button variant="outline" onClick={onCopyToken}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Token
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Connect Project
          </Button>
        </div>
      </div>

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
                  <span className="font-medium capitalize">{project.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Synced:</span>
                  <span>
                    {project.lastSync 
                      ? new Date(project.lastSync).toLocaleString() 
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
    </div>
  );
};
