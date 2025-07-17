import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  Layers, 
  Share2, 
  Plug, 
  ExternalLink, 
  Check, 
  Plus,
  Zap,
  Code,
  RefreshCw
} from 'lucide-react';

export const TenantProjectIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('connected-projects');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Project Integration</h2>
          <p className="text-muted-foreground">Manage connections to other platforms and projects</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border-green-200">
          <Check size={14} />
          <span>Connected</span>
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connected-projects">
            <Network className="mr-2 h-4 w-4" />
            Connected Projects
          </TabsTrigger>
          <TabsTrigger value="architecture">
            <Layers className="mr-2 h-4 w-4" />
            Architecture
          </TabsTrigger>
          <TabsTrigger value="api-integrations">
            <Share2 className="mr-2 h-4 w-4" />
            API Integrations
          </TabsTrigger>
          <TabsTrigger value="plugins">
            <Plug className="mr-2 h-4 w-4" />
            Plugins
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected-projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Connections</CardTitle>
                <CardDescription>Projects currently integrated with your platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                        <Network className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Family Office Project {i}</h4>
                        <p className="text-sm text-muted-foreground">Connected 3 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add New Connection</CardTitle>
                <CardDescription>Integrate with another project or platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Button variant="outline" className="justify-start">
                    <Plus className="mr-2 h-4 w-4" /> Connect to CRM
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Plus className="mr-2 h-4 w-4" /> Connect to Portfolio System
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Plus className="mr-2 h-4 w-4" /> Connect to Document Management
                  </Button>
                </div>
                <div className="pt-2">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add New Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
              <CardDescription>Overview of your platform's architecture and connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-6 bg-slate-50 text-center">
                <Layers className="h-16 w-16 mx-auto mb-4 text-primary/60" />
                <h3 className="text-lg font-medium mb-2">Architecture Diagram</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Visualize how your platform components and integrations work together
                </p>
                <Button>View Full Architecture</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Flow</CardTitle>
                <CardDescription>How data moves between systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg flex items-center">
                    <div className="mr-3 p-2 bg-blue-50 rounded">
                      <Zap className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Client Data Sync</h4>
                      <p className="text-sm text-muted-foreground">CRM ↔ Portfolio Management</p>
                    </div>
                    <Badge className="ml-auto">Active</Badge>
                  </div>
                  <div className="p-3 border rounded-lg flex items-center">
                    <div className="mr-3 p-2 bg-purple-50 rounded">
                      <RefreshCw className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Document Workflow</h4>
                      <p className="text-sm text-muted-foreground">DMS ↔ Client Portal</p>
                    </div>
                    <Badge className="ml-auto">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environment Details</CardTitle>
                <CardDescription>Technical information about your deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Environment</span>
                    <span className="text-sm">Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Version</span>
                    <span className="text-sm">v2.5.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Updated</span>
                    <span className="text-sm">2 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Database</span>
                    <span className="text-sm">PostgreSQL 14</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api-integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Connections</CardTitle>
              <CardDescription>Manage your API integrations and endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-primary/10 rounded mr-3">
                        <Code className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">REST API</h4>
                        <p className="text-sm text-muted-foreground">Primary data access API</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Healthy</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Endpoint</p>
                      <p className="text-muted-foreground">api.example.com/v1</p>
                    </div>
                    <div>
                      <p className="font-medium">Auth Method</p>
                      <p className="text-muted-foreground">OAuth 2.0</p>
                    </div>
                    <div>
                      <p className="font-medium">Rate Limit</p>
                      <p className="text-muted-foreground">10,000 req/day</p>
                    </div>
                    <div>
                      <p className="font-medium">Usage</p>
                      <p className="text-muted-foreground">2,456 req today</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">View Documentation</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-primary/10 rounded mr-3">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Webhook Service</h4>
                        <p className="text-sm text-muted-foreground">Event notifications</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Healthy</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Events</p>
                      <p className="text-muted-foreground">12 active webhooks</p>
                    </div>
                    <div>
                      <p className="font-medium">Delivery Rate</p>
                      <p className="text-muted-foreground">99.8%</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">Manage Webhooks</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plugins" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Data Connector</CardTitle>
                <Badge className="ml-auto">Installed</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect to external data sources and sync information
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">v1.2.3</span>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Document Workflow</CardTitle>
                <Badge className="ml-auto">Installed</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Automate document processing and approvals
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">v2.0.1</span>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Analytics Engine</CardTitle>
                <Badge variant="outline" className="ml-auto">Available</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced reporting and analytics capabilities
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">v3.1.0</span>
                  <Button size="sm">Install</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Plugin Marketplace</CardTitle>
              <CardDescription>Browse and install additional plugins for your platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <Plug className="h-12 w-12 mx-auto mb-4 text-primary/60" />
                <h3 className="text-lg font-medium mb-2">Extend Your Platform</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Access dozens of plugins to add new features and integrations
                </p>
                <Button>Browse Marketplace</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};