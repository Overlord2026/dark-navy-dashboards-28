
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Link, PlayCircle, Plus, RefreshCw } from "lucide-react";

export function ApiIntegrationsTab() {
  return (
    <div className="space-y-6">
      {/* API Keys Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">API Keys</CardTitle>
          <CardDescription>Manage API access for your Family Office application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 justify-between items-start sm:items-center border-b pb-4">
              <div>
                <h4 className="font-medium">Production API Key</h4>
                <p className="text-sm text-muted-foreground">For live application use</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge>Active</Badge>
                <Button size="sm" variant="outline">Rotate Key</Button>
                <Button size="sm" variant="outline">View Key</Button>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 justify-between items-start sm:items-center border-b pb-4">
              <div>
                <h4 className="font-medium">Testing API Key</h4>
                <p className="text-sm text-muted-foreground">For development and testing</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Limited</Badge>
                <Button size="sm" variant="outline">Rotate Key</Button>
                <Button size="sm" variant="outline">View Key</Button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create New API Key
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Endpoint Status Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-lg">API Endpoints</CardTitle>
              <CardDescription>Status of connected service endpoints</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Status
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 border p-3 rounded-md">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Authentication Service</h4>
                  <p className="text-sm text-muted-foreground">OAuth 2.0 and identity verification</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-green-500 bg-green-50">Healthy</Badge>
                    <span className="text-xs text-muted-foreground ml-2">Last check: 5m ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 border p-3 rounded-md">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Document API</h4>
                  <p className="text-sm text-muted-foreground">Secure document storage and retrieval</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-green-500 bg-green-50">Healthy</Badge>
                    <span className="text-xs text-muted-foreground ml-2">Last check: 5m ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 border p-3 rounded-md">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Portfolio Service</h4>
                  <p className="text-sm text-muted-foreground">Investment portfolio management</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-green-500 bg-green-50">Healthy</Badge>
                    <span className="text-xs text-muted-foreground ml-2">Last check: 5m ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 border p-3 rounded-md">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Analytics Engine</h4>
                  <p className="text-sm text-muted-foreground">Data processing and insights</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-yellow-500 bg-yellow-50">Degraded</Badge>
                    <span className="text-xs text-muted-foreground ml-2">Last check: 5m ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Webhooks Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Webhooks</CardTitle>
          <CardDescription>Configure event notifications for your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 border-b pb-4">
              <div className="flex-1">
                <h4 className="font-medium">Document Updates</h4>
                <p className="text-sm text-muted-foreground">Notifies when documents are added or modified</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge>Active</Badge>
                <Button size="sm" variant="outline">
                  <Link className="mr-2 h-4 w-4" />
                  Edit URL
                </Button>
                <Button size="sm" variant="outline">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Test
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <div className="flex-1">
                <h4 className="font-medium">User Events</h4>
                <p className="text-sm text-muted-foreground">Notifies on user authentication and profile changes</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge>Active</Badge>
                <Button size="sm" variant="outline">
                  <Link className="mr-2 h-4 w-4" />
                  Edit URL
                </Button>
                <Button size="sm" variant="outline">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Test
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
