
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileCode, Key, RefreshCcw, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const ApiIntegrationsTab: React.FC = () => {
  const apiEndpoints = [
    {
      id: "api-1",
      name: "User Management API",
      endpoint: "/api/v1/users",
      status: "active",
      authType: "jwt",
      lastAccessed: "2025-05-07T15:30:00Z"
    },
    {
      id: "api-2",
      name: "Documents API",
      endpoint: "/api/v1/documents",
      status: "active",
      authType: "jwt",
      lastAccessed: "2025-05-07T14:20:00Z"
    },
    {
      id: "api-3",
      name: "Financial Data API",
      endpoint: "/api/v1/financial",
      status: "active",
      authType: "api_key",
      lastAccessed: "2025-05-07T10:45:00Z"
    },
    {
      id: "api-4",
      name: "Reports Generation API",
      endpoint: "/api/v1/reports",
      status: "inactive",
      authType: "jwt",
      lastAccessed: null
    },
    {
      id: "api-5",
      name: "Notifications Webhook",
      endpoint: "/api/v1/webhooks/notifications",
      status: "maintenance",
      authType: "webhook_secret",
      lastAccessed: "2025-05-06T22:15:00Z"
    }
  ];

  const handleToggleApi = (apiId: string) => {
    console.log(`Toggle API ${apiId}`);
    // In a real app, this would update the API status
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-slate-500 border-slate-300">Inactive</Badge>;
      case "maintenance":
        return <Badge className="bg-amber-500">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">API Integrations</h3>
          <p className="text-sm text-muted-foreground">
            Manage API endpoints and integration settings
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New API Endpoint
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>API Name</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Auth Type</TableHead>
            <TableHead>Last Accessed</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiEndpoints.map((api) => (
            <TableRow key={api.id}>
              <TableCell className="font-medium">{api.name}</TableCell>
              <TableCell>
                <code className="bg-muted px-1 py-0.5 rounded text-sm">{api.endpoint}</code>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Key className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <span className="capitalize">{api.authType.replace("_", " ")}</span>
                </div>
              </TableCell>
              <TableCell>
                {api.lastAccessed ? new Date(api.lastAccessed).toLocaleString() : "Never"}
              </TableCell>
              <TableCell>{getStatusBadge(api.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={api.status === "active"}
                    onCheckedChange={() => handleToggleApi(api.id)}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh API Key</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileCode className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Documentation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {api.status === "maintenance" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>API is under maintenance</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
