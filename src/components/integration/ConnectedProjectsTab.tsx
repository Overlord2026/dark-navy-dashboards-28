
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CheckCircle, Users, Briefcase, Diamond } from "lucide-react";

export function ConnectedProjectsTab() {
  const projects = [
    {
      id: "aspiring",
      name: "Aspiring Wealthy Portal",
      description: "Growth-focused portal for building and securing wealth",
      status: "connected",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-500/10 border-blue-500/30",
      url: "https://lovable.dev/projects/13afeb41-40dc-4128-a1e4-84b3b531647f"
    },
    {
      id: "retirees",
      name: "Retirees Portal",
      description: "Optimized portal for retirement planning and wealth preservation",
      status: "connected",
      icon: <Briefcase className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-500/10 border-amber-500/30",
      url: "https://lovable.dev/projects/824ab698-b76c-4745-ae63-67479651e785"
    },
    {
      id: "uhnw",
      name: "UHNW Family Office",
      description: "Comprehensive wealth management for ultra-high net worth families",
      status: "active",
      icon: <Diamond className="h-5 w-5 text-indigo-500" />,
      color: "bg-indigo-500/10 border-indigo-500/30",
      url: "#"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id} className={`border ${project.color} transition-all hover:shadow-md`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-full bg-background">{project.icon}</div>
                <Badge variant={project.status === "connected" ? "outline" : "secondary"} className="flex gap-1 items-center">
                  {project.status === "connected" ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Connected
                    </>
                  ) : "Active"}
                </Badge>
              </div>
              <CardTitle className="mt-2">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" className="w-full flex items-center justify-between" asChild>
                <Link to={project.url} target="_blank">
                  View Project <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>All projects are successfully connected to the Family Office Architecture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="font-medium">Data Synchronization</span>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="font-medium">Authentication</span>
                <Badge className="bg-green-500">Integrated</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Services Communication</span>
                <Badge className="bg-green-500">Online</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Test Integration Connections
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
