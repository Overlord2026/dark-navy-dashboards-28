
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkIcon, ExternalLink, Settings, AlertCircle } from "lucide-react";

export default function ConnectedProjects() {
  const projects = [
    {
      id: "1",
      name: "Family Office Portal",
      description: "Main family office dashboard and reporting system",
      status: "active",
      lastSync: "2023-11-10T08:30:00Z",
      apiAccess: true,
      dataSharing: ["Financial Data", "Investment Reports", "Transaction History"],
      version: "v2.5.1"
    },
    {
      id: "2",
      name: "Wealth Management Platform",
      description: "Investment tracking and portfolio analysis",
      status: "active",
      lastSync: "2023-11-09T14:20:00Z", 
      apiAccess: true,
      dataSharing: ["Portfolio Data", "Investment Performance", "Asset Allocation"],
      version: "v1.8.3"
    },
    {
      id: "3",
      name: "Estate Planning System",
      description: "Estate management and succession planning",
      status: "active",
      lastSync: "2023-11-07T11:45:00Z",
      apiAccess: true,
      dataSharing: ["Legal Documents", "Succession Plans"],
      version: "v3.0.2"
    },
    {
      id: "4",
      name: "Tax Optimization Engine",
      description: "Tax planning and optimization tools",
      status: "warning",
      lastSync: "2023-10-30T09:15:00Z",
      apiAccess: true,
      dataSharing: ["Tax Documents", "Tax Calculations"],
      version: "v2.1.4"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Connected Projects</h3>
        <Button variant="outline" className="gap-2">
          <LinkIcon className="h-4 w-4" />
          Connect New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className={project.status === "warning" ? "border-yellow-300" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{project.name}</CardTitle>
                <Badge variant={project.status === "active" ? "default" : "outline"} 
                  className={project.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-300" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300"}>
                  {project.status === "active" ? "Active" : "Sync Warning"}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Data Sharing:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.dataSharing.map((item, i) => (
                      <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Last Synced:</span>
                    <p>{new Date(project.lastSync).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Version:</span>
                    <p>{project.version}</p>
                  </div>
                </div>
                
                {project.status === "warning" && (
                  <div className="flex items-center p-2 bg-yellow-50 rounded border border-yellow-200 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                    <span>Sync issues detected. Last successful sync was more than 7 days ago.</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="h-4 w-4" />
                Open Project
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
