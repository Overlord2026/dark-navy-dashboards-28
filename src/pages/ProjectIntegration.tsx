
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Link, 
  Network, 
  Plug, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Plus,
  ExternalLink
} from "lucide-react";

const ProjectIntegration: React.FC = () => {
  return (
    <ThreeColumnLayout title="Project Integration">
      <div className="space-y-6">
        {/* Connected Status Banner */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">
                    Connected to Family Office Marketplace
                  </h3>
                  <p className="text-green-700">
                    This project is part of a larger ecosystem with shared resources and integrations.
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Integration Hub */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5" />
              <span>Integration Hub</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="projects">Connected Projects</TabsTrigger>
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
                <TabsTrigger value="api">API Integrations</TabsTrigger>
                <TabsTrigger value="plugins">Plugins</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-4">
                <div className="grid gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Link className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Family Office Dashboard</h4>
                            <p className="text-sm text-muted-foreground">
                              Main administrative interface
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Active
                          </Badge>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Network className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Advisory Portal</h4>
                            <p className="text-sm text-muted-foreground">
                              Professional advisor interface
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Active
                          </Badge>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Settings className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Compliance Engine</h4>
                            <p className="text-sm text-muted-foreground">
                              Regulatory compliance monitoring
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Pending
                          </Badge>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="architecture" className="space-y-4">
                <div className="grid gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-3">System Architecture Overview</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>Client Application (Current)</span>
                          <Badge variant="secondary">React + Supabase</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>API Gateway</span>
                          <Badge variant="secondary">REST + GraphQL</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>Data Layer</span>
                          <Badge variant="secondary">Supabase + Redis</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>Integration Layer</span>
                          <Badge variant="secondary">Webhooks + Events</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="api" className="space-y-4">
                <div className="grid gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Active API Integrations</h4>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Integration
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <span className="font-medium">Supabase Auth</span>
                              <p className="text-sm text-muted-foreground">Authentication & user management</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Connected
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <span className="font-medium">Supabase Database</span>
                              <p className="text-sm text-muted-foreground">Data storage & real-time sync</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Connected
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                            <div>
                              <span className="font-medium">Market Data API</span>
                              <p className="text-sm text-muted-foreground">Real-time financial data</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Configuring
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="plugins" className="space-y-4">
                <div className="grid gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Available Plugins</h4>
                        <Button size="sm" variant="outline">
                          Browse Marketplace
                        </Button>
                      </div>
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Plug className="h-5 w-5 text-blue-500" />
                            <div>
                              <span className="font-medium">Document Management</span>
                              <p className="text-sm text-muted-foreground">Enhanced document workflows</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Install
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Plug className="h-5 w-5 text-purple-500" />
                            <div>
                              <span className="font-medium">Tax Optimization</span>
                              <p className="text-sm text-muted-foreground">Advanced tax planning tools</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Install
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Plug className="h-5 w-5 text-green-500" />
                            <div>
                              <span className="font-medium">Portfolio Analytics</span>
                              <p className="text-sm text-muted-foreground">Advanced investment analysis</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Install
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export default ProjectIntegration;
