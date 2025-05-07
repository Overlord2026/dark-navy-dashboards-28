
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Link as LinkIcon } from "lucide-react";

export const ConnectedProjectsTab = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Connected Projects</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Connect New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Family Office CRM
              <Badge className="bg-green-500">Active</Badge>
            </CardTitle>
            <CardDescription>Client relationship management system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">Connected on: May 1, 2025</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <LinkIcon className="mr-1 h-3 w-3" /> 
              <span>3 active integrations</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Settings</Button>
            <Button variant="default" size="sm">Manage</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Portfolio Tracker
              <Badge className="bg-green-500">Active</Badge>
            </CardTitle>
            <CardDescription>Investment portfolio analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">Connected on: April 15, 2025</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <LinkIcon className="mr-1 h-3 w-3" /> 
              <span>2 active integrations</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Settings</Button>
            <Button variant="default" size="sm">Manage</Button>
          </CardFooter>
        </Card>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Connect New Project</CardTitle>
            <CardDescription>Add a new project to your ecosystem</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Button variant="outline" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
