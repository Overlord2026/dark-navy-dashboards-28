
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Code, Database, Puzzle, GitBranch, CheckCircle, AlertCircle } from "lucide-react";

export default function Integration() {
  const [activeTab, setActiveTab] = useState("connected-projects");
  
  return (
    <ThreeColumnLayout activeMainItem="integration">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Project Integration</h1>
            <p className="text-muted-foreground">Connect with other systems and extend functionality</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Connected
          </Badge>
        </div>
        
        <Tabs 
          defaultValue="connected-projects" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="connected-projects">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api-integrations">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected-projects">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-blue-600" />
                    Financial Marketplace
                  </CardTitle>
                  <CardDescription>Financial product marketplace integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Integration Type:</span>
                      <span className="font-medium">API + UI</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="font-medium">Today at 10:45 AM</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">Manage Connection</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-purple-600" />
                    Data Exchange Hub
                  </CardTitle>
                  <CardDescription>Centralized data sharing platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Integration Type:</span>
                      <span className="font-medium">Real-time API</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="font-medium">Today at 11:30 AM</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">Manage Connection</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="architecture">
            <Card>
              <CardHeader>
                <CardTitle>System Architecture</CardTitle>
                <CardDescription>Overview of the connected systems architecture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded p-4 bg-muted/20 text-center">
                  <p className="text-muted-foreground">Architecture diagram visualization</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api-integrations">
            <Card>
              <CardHeader>
                <CardTitle>API Integrations</CardTitle>
                <CardDescription>Manage your external API connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Code className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">Portfolio Management API</h3>
                        <p className="text-sm text-muted-foreground">Real-time portfolio data</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Connected</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Code className="h-5 w-5 text-purple-600" />
                      <div>
                        <h3 className="font-medium">Document Management API</h3>
                        <p className="text-sm text-muted-foreground">Secure document storage</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Connected</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="plugins">
            <Card>
              <CardHeader>
                <CardTitle>Plugins</CardTitle>
                <CardDescription>Extend functionality with plugins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Puzzle className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">Tax Optimization Engine</h3>
                        <p className="text-sm text-muted-foreground">Advanced tax planning calculations</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Puzzle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h3 className="font-medium">Estate Planning Analyzer</h3>
                        <p className="text-sm text-muted-foreground">Estate plan simulation tool</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Available</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">Browse Plugin Marketplace</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
