
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Plus } from "lucide-react";

export const ApiIntegrationsTab = () => {
  const integrations = [
    {
      id: 1,
      name: "Portfolio Management API",
      status: "Active",
      lastChecked: "5 minutes ago",
      description: "Real-time portfolio data and performance analytics"
    },
    {
      id: 2,
      name: "Market Data Service",
      status: "Active",
      lastChecked: "15 minutes ago",
      description: "Market indices, stock quotes, and economic indicators"
    },
    {
      id: 3,
      name: "Document Management API",
      status: "Issue",
      lastChecked: "1 hour ago",
      description: "Secure document storage and sharing capabilities"
    },
    {
      id: 4,
      name: "Financial Planning Tools",
      status: "Active",
      lastChecked: "30 minutes ago",
      description: "Retirement modeling and goal-based planning tools"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">API Integrations</h2>
        <Button className="bg-black hover:bg-black/80 text-[#D4AF37]">
          <Plus className="h-4 w-4 mr-2" /> Add Integration
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id} className="border-[#333] bg-[#1F1F2E]">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-[#D4AF37]">{integration.name}</CardTitle>
                <Badge 
                  variant={integration.status === "Active" ? "outline" : "secondary"}
                  className={integration.status === "Active" 
                    ? "bg-green-900/30 text-green-300 border-green-500/50 flex items-center gap-1"
                    : "bg-amber-900/30 text-amber-300 border-amber-500/50 flex items-center gap-1"
                  }
                >
                  {integration.status === "Active" ? (
                    <><CheckCircle className="h-3 w-3" /> {integration.status}</>
                  ) : (
                    <><AlertCircle className="h-3 w-3" /> {integration.status}</>
                  )}
                </Badge>
              </div>
              <CardDescription>Last checked: {integration.lastChecked}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{integration.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-[#D4AF37] border-[#D4AF37]">View Logs</Button>
              <Button className="bg-black hover:bg-black/80 text-[#D4AF37]">Configure</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="border-[#333] bg-[#1F1F2E]">
        <CardHeader>
          <CardTitle className="text-[#D4AF37]">API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Access comprehensive documentation for all available APIs, including endpoints, 
            authentication methods, and example requests.
          </p>
          <Button className="bg-black hover:bg-black/80 text-[#D4AF37]">View Documentation</Button>
        </CardContent>
      </Card>
    </div>
  );
};
