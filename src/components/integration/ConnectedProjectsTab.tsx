
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, PlusCircle, ExternalLink } from "lucide-react";

export const ConnectedProjectsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Connected Projects</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Connect New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Connected Project Cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Link2 className="h-5 w-5 text-primary" />
              <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs font-medium">Active</span>
            </div>
            <CardTitle className="mt-2">Investment Platform</CardTitle>
            <CardDescription>Investment management module for client portfolios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Integration Type:</span>
                <span>API + Data Sync</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Synced:</span>
                <span>2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-500">Healthy</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">Configure</Button>
            <Button variant="ghost" size="sm">
              View <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Link2 className="h-5 w-5 text-primary" />
              <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs font-medium">Active</span>
            </div>
            <CardTitle className="mt-2">Tax Planning Tool</CardTitle>
            <CardDescription>Advanced tax optimization and scenario planning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Integration Type:</span>
                <span>Data Import</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Synced:</span>
                <span>1 day ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-500">Healthy</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">Configure</Button>
            <Button variant="ghost" size="sm">
              View <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Empty State Card */}
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center h-full py-10">
            <PlusCircle className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-center text-muted-foreground">Connect another project to expand your family office capabilities</p>
            <Button variant="outline" className="mt-4">Add Integration</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
