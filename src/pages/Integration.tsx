
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CirclePlus, Link as LinkIcon, Plug, Settings, BarChart } from "lucide-react";

const Integration = () => {
  const [activeTab, setActiveTab] = useState("connected-projects");
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Project Integration</h1>
          <p className="text-muted-foreground mt-1">
            Connect your project with other systems and services
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5">
          <Plug className="h-3.5 w-3.5" />
          Connected
        </Badge>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="connected-projects">Connected Projects</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="api-integrations">API Integrations</TabsTrigger>
          <TabsTrigger value="plugins">Plugins</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connected-projects">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Family Office Portal</CardTitle>
                <CardDescription>Main client-facing application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Primary</Badge>
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Last sync: 2 hours ago</p>
                  <p>Status: Active</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Advisor Dashboard</CardTitle>
                <CardDescription>Financial advisor tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Connected</Badge>
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Last sync: 1 day ago</p>
                  <p>Status: Active</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-muted-foreground">Connect New Project</CardTitle>
                <CardDescription>Add another project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-24">
                  <CirclePlus className="h-10 w-10 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="architecture">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
              <CardDescription>How your projects are connected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                <div className="text-center">
                  <Settings className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">Architecture diagram will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-integrations">
          <Card>
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
              <CardDescription>Connected APIs and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                <div className="text-center">
                  <Plug className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">API integration details will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plugins">
          <Card>
            <CardHeader>
              <CardTitle>Plugins & Extensions</CardTitle>
              <CardDescription>Add functionality with plugins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                <div className="text-center">
                  <BarChart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">Plugin marketplace will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Integration;
