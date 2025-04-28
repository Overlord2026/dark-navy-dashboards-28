
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Code, Key, RefreshCw } from "lucide-react";

export function ApiIntegrationsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">API Integrations</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Key className="h-4 w-4 mr-2" />
            Manage API Keys
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Health Overview</CardTitle>
          <CardDescription>Current status of all API integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Healthy</span>
              <span className="text-4xl font-bold text-green-600 my-2">12</span>
              <span className="text-xs text-muted-foreground">API endpoints</span>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Degraded</span>
              <span className="text-4xl font-bold text-yellow-600 my-2">2</span>
              <span className="text-xs text-muted-foreground">API endpoints</span>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Down</span>
              <span className="text-4xl font-bold text-red-600 my-2">0</span>
              <span className="text-xs text-muted-foreground">API endpoints</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Total Requests</span>
              <span className="text-4xl font-bold text-blue-600 my-2">14.3k</span>
              <span className="text-xs text-muted-foreground">Last 24 hours</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Active API Connections</h3>
          <Button variant="secondary" size="sm">
            <Code className="h-4 w-4 mr-2" />
            View Documentation
          </Button>
        </div>
        
        <div className="space-y-4">
          {/* API Integration 1 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle>Portfolio Data API</CardTitle>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <CardDescription>Provides real-time portfolio performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Endpoint:</p>
                  <p className="font-mono">/api/v1/portfolio</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status:</p>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                    <span>Operational (99.98% uptime)</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Check:</p>
                  <p>5 minutes ago</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">View Details</Button>
            </CardFooter>
          </Card>
          
          {/* API Integration 2 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle>Document Management API</CardTitle>
                <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
              </div>
              <CardDescription>Manages document storage and retrieval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Endpoint:</p>
                  <p className="font-mono">/api/v1/documents</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status:</p>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>Partial Outage (94.2% uptime)</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Check:</p>
                  <p>10 minutes ago</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">View Details</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
