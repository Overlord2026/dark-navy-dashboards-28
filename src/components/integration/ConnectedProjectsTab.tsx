
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, ArrowUpRight, Check } from "lucide-react";

export const ConnectedProjectsTab = () => {
  const connectedProjects = [
    {
      id: "1",
      name: "Wealth Management Platform",
      status: "active",
      connectionType: "API",
      lastSync: "2 hours ago"
    },
    {
      id: "2",
      name: "Family Office Dashboard",
      status: "active",
      connectionType: "Plugin",
      lastSync: "1 day ago"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Connected Projects</CardTitle>
          <CardDescription>
            Projects connected to your Family Office Marketplace ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <Link className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant={project.status === "active" ? "success" : "secondary"} className="text-xs">
                        {project.status === "active" ? (
                          <><Check className="h-3 w-3 mr-1" /> Active</>
                        ) : (
                          "Inactive"
                        )}
                      </Badge>
                      <span>• {project.connectionType}</span>
                      <span>• Last sync {project.lastSync}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            ))}

            <Button className="w-full mt-4" variant="outline">
              Connect New Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
