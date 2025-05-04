
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, LucideGitPullRequest, LucidePlugZap, LucideServer } from "lucide-react";

const ProjectIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState("connected-projects");

  return (
    <ThreeColumnLayout 
      title="Project Integration" 
      activeMainItem="integration"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Project Integration Hub</h1>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
            Connected
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="connected-projects">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api-integrations">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>

          <TabsContent value="connected-projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucideGitPullRequest className="h-5 w-5" />
                  Connected Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Family Office Portal</CardTitle>
                        <Badge>Primary</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Core financial management dashboard and client portal</p>
                      <div className="flex gap-2">
                        <Badge variant="outline">Connected</Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Wealth Analytics Engine</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Advanced portfolio analytics and reporting</p>
                      <div className="flex gap-2">
                        <Badge variant="outline">Connected</Badge>
                        <Badge variant="outline">Read-only</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucideServer className="h-5 w-5" />
                  System Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-2">Family Office Marketplace Architecture</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    This application is part of a larger ecosystem of financial management tools
                    designed to work together through secure APIs and data synchronization.
                  </p>

                  <div className="p-4 border border-dashed rounded-md my-4">
                    <h4 className="font-medium mb-2">Integration Layers</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>API Gateway Layer - Secure access point for all services</li>
                      <li>Data Synchronization Layer - Real-time data consistency</li>
                      <li>Authentication & Authorization Layer - Unified security model</li>
                      <li>Event Messaging Layer - Inter-service communication</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  API Integrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Investment Data API</h3>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Real-time investment data synchronization between marketplace applications
                    </p>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-muted rounded">GET</span>
                      <span className="px-2 py-1 bg-muted rounded">POST</span>
                      <span className="px-2 py-1 bg-muted rounded">PUT</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Document Exchange API</h3>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Secure document sharing across family office applications
                    </p>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-muted rounded">GET</span>
                      <span className="px-2 py-1 bg-muted rounded">POST</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plugins" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucidePlugZap className="h-5 w-5" />
                  Marketplace Plugins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Tax Optimization Engine</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-4">Advanced tax strategies and optimization</p>
                      <Badge variant="outline">Enabled</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Estate Planning Tools</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-4">Family wealth transfer planning tools</p>
                      <Badge variant="outline">Enabled</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Risk Analysis Module</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-4">Portfolio risk assessment tools</p>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Available</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Alternative Investment Tracker</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-4">Private equity and alternative asset tracking</p>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Available</Badge>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default ProjectIntegration;
