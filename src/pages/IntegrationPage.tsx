
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArchiveIcon, DatabaseIcon, PlugIcon, Network } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IntegrationPage() {
  const [activeTab, setActiveTab] = useState("connected");
  
  return (
    <ThreeColumnLayout activeMainItem="integration">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Project Integration</h1>
            <p className="text-muted-foreground">Connect and manage project integrations</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-medium">
              Connected
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="connected" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connected">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Projects</CardTitle>
                <CardDescription>Projects connected to this Family Office instance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="bg-secondary/50 border border-border rounded-md p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Network className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">Family Office Marketplace</p>
                        <p className="text-sm text-muted-foreground">Central integration hub</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs bg-green-500/20 text-green-700 px-2 py-1 rounded-full">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="architecture" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Architecture</CardTitle>
                <CardDescription>System architecture and component relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-12 border-2 border-dashed border-secondary rounded-md">
                  <ArchiveIcon className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground ml-2">Architecture diagram will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Integrations</CardTitle>
                <CardDescription>External API connections and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-12 border-2 border-dashed border-secondary rounded-md">
                  <DatabaseIcon className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground ml-2">API integrations will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="plugins" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Plugins</CardTitle>
                <CardDescription>Available and installed platform plugins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-12 border-2 border-dashed border-secondary rounded-md">
                  <PlugIcon className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground ml-2">Plugins will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
