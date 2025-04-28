
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, RefreshCw, Settings, ExternalLink } from "lucide-react";

export function ConnectedProjectsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Connected Projects</h2>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Connections
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Family Office Core Platform */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Family Office Core Platform</CardTitle>
              <Badge variant="outline" className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <CardDescription>Central platform for family office operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Synced:</span>
                <span>Today at 09:45 AM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Integration Type:</span>
                <span>Deep Integration</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button variant="default" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Dashboard
            </Button>
          </CardFooter>
        </Card>
        
        {/* Investment Management Hub */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Investment Management Hub</CardTitle>
              <Badge variant="outline" className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <CardDescription>Portfolio management and reporting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Synced:</span>
                <span>Yesterday at 17:30 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Integration Type:</span>
                <span>API Integration</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button variant="default" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Dashboard
            </Button>
          </CardFooter>
        </Card>

        {/* Add Connection Card */}
        <Card className="border-dashed bg-muted/50">
          <CardHeader>
            <CardTitle>Add New Connection</CardTitle>
            <CardDescription>Connect to another Family Office application</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-4">
              Enhance your platform by integrating with other Family Office applications
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Browse Marketplace</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
