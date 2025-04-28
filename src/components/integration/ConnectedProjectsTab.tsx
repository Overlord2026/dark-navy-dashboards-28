
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, GitMerge, RefreshCcw, ExternalLink, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ConnectedProjectsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Connected Projects</h2>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" /> Refresh Connections
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Connect and manage integrations with other projects in the Family Office Marketplace ecosystem.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connected Project Card */}
        <Card className="p-6 border-2 border-green-600/30">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-green-600/20 p-3 rounded-full">
                <GitMerge className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Portfolio Analytics</h3>
                <p className="text-sm text-muted-foreground">Investment performance reporting</p>
              </div>
            </div>
            <Badge className="bg-green-600">Connected</Badge>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Connection ID:</span>
              <span className="font-mono">conn_0793zxt56j</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="flex items-center gap-1 text-green-600">
                <Shield className="h-3 w-3" /> Data sharing active
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last synced:</span>
              <span>2 hours ago</span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" /> Manage Permissions
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-500 flex items-center gap-1">
              View Dashboard <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </Card>
        
        {/* Disconnected Project Card */}
        <Card className="p-6 border border-border">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-full">
                <Link2 className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Tax Planning Suite</h3>
                <p className="text-sm text-muted-foreground">Advanced tax optimization tools</p>
              </div>
            </div>
            <Badge variant="outline">Available</Badge>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">
              Connect to this project to enable seamless data sharing for tax optimization recommendations.
            </p>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button className="flex items-center gap-2">
              <Link2 className="h-4 w-4" /> Connect Project
            </Button>
          </div>
        </Card>
      </div>
      
      <Button variant="secondary" className="w-full mt-4">Browse More Projects</Button>
    </div>
  );
}
