import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Settings, 
  Play, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Zap,
  Link,
  Database,
  Globe,
  Clock,
  ExternalLink,
  Star,
  Download
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Mock data for demo purposes
const mockIntegrations = [
  {
    id: '1',
    name: 'Slack Notifications',
    type: 'webhook',
    provider: 'Slack',
    status: 'active',
    health_status: 'healthy',
    last_sync: '2024-01-20T10:30:00Z'
  },
  {
    id: '2', 
    name: 'GitHub Projects',
    type: 'rest',
    provider: 'GitHub',
    status: 'active',
    health_status: 'healthy',
    last_sync: '2024-01-20T09:15:00Z'
  },
  {
    id: '3',
    name: 'Jira Sync',
    type: 'rest', 
    provider: 'Jira',
    status: 'inactive',
    health_status: 'unknown',
    last_sync: null
  }
];

const mockConnectors = [
  {
    id: '1',
    tool_name: 'Asana',
    tool_type: 'project_management',
    connection_status: 'connected',
    sync_projects: true,
    sync_tasks: true,
    last_sync: '2024-01-20T08:00:00Z'
  },
  {
    id: '2',
    tool_name: 'Microsoft Teams',
    tool_type: 'communication',
    connection_status: 'disconnected',
    sync_projects: false,
    sync_tasks: false,
    last_sync: null
  }
];

const mockSyncJobs = [
  {
    id: '1',
    entity_type: 'projects',
    status: 'completed',
    progress: 100,
    records_processed: 25,
    started_at: '2024-01-20T10:00:00Z',
    completed_at: '2024-01-20T10:05:00Z'
  },
  {
    id: '2',
    entity_type: 'tasks', 
    status: 'running',
    progress: 60,
    records_processed: 150,
    started_at: '2024-01-20T10:30:00Z',
    completed_at: null
  }
];

const mockTemplates = [
  {
    id: '1',
    name: 'Slack Integration',
    description: 'Send project notifications to Slack channels',
    category: 'communication',
    provider: 'Slack',
    is_featured: true,
    rating: 4.8,
    install_count: 1250
  },
  {
    id: '2',
    name: 'GitHub Projects',
    description: 'Sync projects and issues with GitHub repositories',
    category: 'development',
    provider: 'GitHub',
    is_featured: true,
    rating: 4.6,
    install_count: 890
  },
  {
    id: '3',
    name: 'Jira Connector',
    description: 'Bidirectional sync with Jira projects and tickets',
    category: 'project_management',
    provider: 'Atlassian',
    is_featured: false,
    rating: 4.4,
    install_count: 650
  }
];

export function IntegrationsDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showNewIntegration, setShowNewIntegration] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'completed':
        return 'text-green-600';
      case 'inactive':
      case 'disconnected':
      case 'pending':
        return 'text-yellow-600';
      case 'error':
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
      case 'running':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleInstallTemplate = (template: any) => {
    toast({
      title: "Template Installed",
      description: `${template.name} has been added to your integrations.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cross-Platform Integrations</h1>
          <p className="text-muted-foreground">
            Connect your workflow to external tools, APIs, and services
          </p>
        </div>
        <Dialog open={showNewIntegration} onOpenChange={setShowNewIntegration}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Integration
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Integration</DialogTitle>
              <DialogDescription>
                Set up a new API integration or tool connector.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Integration Name</Label>
                <Input id="name" placeholder="My Custom Integration" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select integration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rest">REST API</SelectItem>
                    <SelectItem value="graphql">GraphQL</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Base URL</Label>
                <Input id="url" placeholder="https://api.example.com" />
              </div>
              <Button className="w-full" onClick={() => setShowNewIntegration(false)}>
                Create Integration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockIntegrations.filter(i => i.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              of {mockIntegrations.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Tools</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockConnectors.filter(c => c.connection_status === 'connected').length}</div>
            <p className="text-xs text-muted-foreground">
              {mockConnectors.length - mockConnectors.filter(c => c.connection_status === 'connected').length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Jobs Running</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSyncJobs.filter(j => j.status === 'running').length}</div>
            <p className="text-xs text-muted-foreground">
              {mockSyncJobs.length} total jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Templates</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTemplates.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockTemplates.filter(t => t.is_featured).length} featured
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="integrations">API Integrations</TabsTrigger>
          <TabsTrigger value="tools">Tool Connectors</TabsTrigger>
          <TabsTrigger value="sync">Data Sync</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sync Jobs</CardTitle>
                <CardDescription>Latest data synchronization activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSyncJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={getStatusColor(job.status)}>
                          {getStatusIcon(job.status)}
                        </div>
                        <div>
                          <p className="font-medium">{job.entity_type} sync</p>
                          <p className="text-sm text-muted-foreground">
                            {job.records_processed} records processed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{job.status}</Badge>
                        {job.status === 'running' && (
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Integration Health */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Health</CardTitle>
                <CardDescription>Status of your active integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockIntegrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={getStatusColor(integration.health_status)}>
                          {getStatusIcon(integration.health_status)}
                        </div>
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-sm text-muted-foreground">{integration.provider}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={integration.status === 'active' ? 'default' : 'secondary'}
                        >
                          {integration.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
              <CardDescription>
                Manage your custom API integrations and connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockIntegrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                        <Badge 
                          variant={integration.status === 'active' ? 'default' : 'secondary'}
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      <CardDescription>{integration.provider}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Type: {integration.type}</span>
                        <span className={getStatusColor(integration.health_status)}>
                          {getStatusIcon(integration.health_status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tool Connectors</CardTitle>
              <CardDescription>
                Connect to popular project management and collaboration tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockConnectors.map((connector) => (
                  <Card key={connector.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{connector.tool_name}</CardTitle>
                        <Badge 
                          variant={connector.connection_status === 'connected' ? 'default' : 'secondary'}
                        >
                          {connector.connection_status}
                        </Badge>
                      </div>
                      <CardDescription>{connector.tool_type.replace('_', ' ')}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Projects:</span>
                          <span>{connector.sync_projects ? 'Enabled' : 'Disabled'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tasks:</span>
                          <span>{connector.sync_tasks ? 'Enabled' : 'Disabled'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Synchronization</CardTitle>
              <CardDescription>
                Monitor and manage data sync jobs across all integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSyncJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={getStatusColor(job.status)}>
                        {getStatusIcon(job.status)}
                      </div>
                      <div>
                        <p className="font-medium">{job.entity_type} Synchronization</p>
                        <p className="text-sm text-muted-foreground">
                          Started: {new Date(job.started_at).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Records processed: {job.records_processed}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{job.status}</Badge>
                      {job.status === 'running' && (
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Marketplace</CardTitle>
              <CardDescription>
                Discover and install pre-built integrations for popular tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        {template.is_featured && (
                          <Badge variant="default">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span>⭐ {template.rating}</span>
                        <span>{template.install_count} installs</span>
                      </div>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleInstallTemplate(template)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Install
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}