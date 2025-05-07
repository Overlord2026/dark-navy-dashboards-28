
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export const ConnectedProjectsTab = () => {
  const projects = [
    {
      id: 1,
      name: "Family Office Client Portal",
      status: "Connected",
      lastSync: "Today at 2:15 PM",
      description: "Main client interface for portfolio management and reporting."
    },
    {
      id: 2,
      name: "Advisor Dashboard",
      status: "Connected",
      lastSync: "Today at 1:30 PM",
      description: "Financial advisor management interface with client portfolios."
    },
    {
      id: 3,
      name: "Financial Planning Module",
      status: "Pending",
      lastSync: "Never",
      description: "Advanced financial planning and scenario analysis tools."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Connected Projects</h2>
        <Button className="bg-black hover:bg-black/80 text-[#D4AF37]">
          <Plus className="h-4 w-4 mr-2" /> Connect New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="border-[#333] bg-[#1F1F2E]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-[#D4AF37]">{project.name}</CardTitle>
                <Badge variant={project.status === "Connected" ? "outline" : "secondary"} 
                  className={project.status === "Connected" ? "bg-green-900/30 text-green-300 border-green-500/50" : ""}>
                  {project.status}
                </Badge>
              </div>
              <CardDescription>Last synced: {project.lastSync}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-[#D4AF37] border-[#D4AF37]">View Details</Button>
              <Button className="bg-black hover:bg-black/80 text-[#D4AF37]">Manage</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
