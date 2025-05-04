
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, ExternalLink, Plus, ChevronRight } from "lucide-react";

export function ConnectedProjectsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Connected Project Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Family Office Core</CardTitle>
                <CardDescription>Main operation platform</CardDescription>
              </div>
              <Badge className="bg-green-600 hover:bg-green-700">Connected</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-sm space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Status</span>
                <span className="font-medium text-green-500">Online</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>API Version</span>
                <span className="font-medium">v2.3</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Last Sync</span>
                <span className="font-medium">5 minutes ago</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Connection Details
            </Button>
          </CardFooter>
        </Card>
        
        {/* Another Connected Project */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Investment Analytics</CardTitle>
                <CardDescription>Portfolio performance analysis</CardDescription>
              </div>
              <Badge className="bg-green-600 hover:bg-green-700">Connected</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-sm space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Status</span>
                <span className="font-medium text-green-500">Online</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>API Version</span>
                <span className="font-medium">v1.8</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Last Sync</span>
                <span className="font-medium">1 hour ago</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Connection Details
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Available Projects to Connect */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Available Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-dashed border-muted-foreground/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tax Document Management</CardTitle>
              <CardDescription>Secure storage and processing of tax documents</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Connect
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border border-dashed border-muted-foreground/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Compliance Monitor</CardTitle>
              <CardDescription>Regulatory compliance and reporting</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Connect
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="link" size="sm" asChild>
          <a href="/marketplace">
            Browse Marketplace
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
