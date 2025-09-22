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
  ExternalLink,
  RefreshCw,
  Code,
  Zap,
  Activity,
  Globe
} from "lucide-react";
import { useProjectIntegrations } from "@/hooks/useProjectIntegrations";

const ProjectIntegration: React.FC = () => {
  const { 
    connections, 
    apiIntegrations, 
    loading,
    connectProject,
    testApiIntegration,
    refresh
  } = useProjectIntegrations();

  if (loading) {
    return (
      <ThreeColumnLayout title="Project Integration">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ThreeColumnLayout>
    );
  }

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
                  {connections.map((connection) => (
                    <Card key={connection.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Link className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{connection.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {connection.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={
                                connection.status === 'active' 
                                  ? "text-green-600 border-green-600" 
                                  : connection.status === 'connecting'
                                  ? "text-yellow-600 border-yellow-600"
                                  : "text-red-600 border-red-600"
                              }
                            >
                              {connection.status === 'active' ? 'Active' : 
                               connection.status === 'connecting' ? 'Connecting' : 'Error'}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                        {connection.lastSync && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Last sync: {connection.lastSync.toLocaleString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Add New Connection Card */}
                  <Card className="border-dashed">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <h4 className="font-medium mb-2">Add New Connection</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connect another project or platform to your ecosystem
                        </p>
                        <Button onClick={() => connectProject('new')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Connect Project
                        </Button>
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
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Active API Integrations</span>
                        <Button size="sm" onClick={refresh}>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Refresh
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {apiIntegrations.map((integration) => (
                          <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded ${
                                integration.status === 'healthy' ? 'bg-green-50' :
                                integration.status === 'degraded' ? 'bg-yellow-50' : 'bg-red-50'
                              }`}>
                                {integration.status === 'healthy' ? 
                                  <CheckCircle className="h-5 w-5 text-green-500" /> :
                                integration.status === 'degraded' ? 
                                  <AlertCircle className="h-5 w-5 text-yellow-500" /> :
                                  <AlertCircle className="h-5 w-5 text-red-500" />
                                }
                              </div>
                              <div>
                                <span className="font-medium">{integration.name}</span>
                                <p className="text-sm text-muted-foreground">{integration.endpoint}</p>
                                {integration.usage && (
                                  <p className="text-xs text-muted-foreground">
                                    {integration.usage.requests} requests {integration.usage.period}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="outline" 
                                className={
                                  integration.status === 'healthy' 
                                    ? "text-green-600 border-green-600" 
                                    : integration.status === 'degraded'
                                    ? "text-yellow-600 border-yellow-600"
                                    : "text-red-600 border-red-600"
                                }
                              >
                                {integration.status}
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => testApiIntegration(integration.id)}
                              >
                                <Activity className="h-4 w-4 mr-1" />
                                Test
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add New Integration */}
                        <div className="flex items-center justify-between p-3 border-dashed border-2 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Plus className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <span className="font-medium">Add New Integration</span>
                              <p className="text-sm text-muted-foreground">Connect to external APIs</p>
                            </div>
                          </div>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Integration
                          </Button>
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