import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge-extended";
import { 
  ArrowUpRight, 
  Code2, 
  GitMerge, 
  GitPullRequest, 
  Network, 
  Package, 
  PuzzleIcon,
  ExternalLink
} from 'lucide-react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export default function IntegrationHub() {
  const { profile } = useSupabaseAuth();

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Project Integration</h1>
          <p className="text-muted-foreground">
            Connect and manage external projects and services
          </p>
        </div>
        <div>
          <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
            Connected
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="connected" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="connected">Connected Projects</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="api">API Integrations</TabsTrigger>
          <TabsTrigger value="plugins">Plugins</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connected" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <Network size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Family Office Core</h3>
                    <p className="text-sm text-muted-foreground">Primary platform</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Connection status</span>
                  <span className="font-medium text-green-600">Connected</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Last synced</span>
                  <span className="font-medium">2 minutes ago</span>
                </div>
              </div>
              <div className="flex justify-end">
                <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Manage 
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </Card>
            
            <Card className="p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <GitMerge size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Wealth Management System</h3>
                    <p className="text-sm text-muted-foreground">Data provider</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Connection status</span>
                  <span className="font-medium text-green-600">Connected</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Last synced</span>
                  <span className="font-medium">5 minutes ago</span>
                </div>
              </div>
              <div className="flex justify-end">
                <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Manage 
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </Card>
          </div>

          <Card className="p-6 border border-dashed border-gray-300 bg-gray-50">
            <div className="flex justify-center items-center flex-col text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                <Network size={24} />
              </div>
              <h3 className="font-medium text-lg mb-2">Connect a new project</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Expand your ecosystem by connecting additional projects and services
              </p>
              <a href="#" className="text-blue-600 hover:underline flex items-center gap-1 font-medium">
                Add connection
                <ArrowUpRight size={16} />
              </a>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="architecture">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">System Architecture</h3>
            <div className="border border-gray-200 rounded-md p-6 bg-gray-50 mb-6">
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <Code2 size={64} className="text-gray-400 mb-4" />
                <p className="text-muted-foreground text-center max-w-md">
                  The architecture diagram shows how your Family Office Marketplace 
                  connects with other systems and services in your ecosystem.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <GitPullRequest size={16} /> 
                  API Gateway
                </h4>
                <p className="text-sm text-muted-foreground">Central entry point for all API requests</p>
              </div>
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Package size={16} />
                  Microservices
                </h4>
                <p className="text-sm text-muted-foreground">Modular services for specific functionality</p>
              </div>
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Network size={16} />
                  Data Layer
                </h4>
                <p className="text-sm text-muted-foreground">Shared data repositories and storage</p>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">API Integrations</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Portfolio Management API</h4>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Access to portfolio data and investment analytics</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">v2.3</Badge>
                  <Badge variant="secondary">REST</Badge>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Document Management API</h4>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Secure document storage and retrieval</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">v1.8</Badge>
                  <Badge variant="secondary">GraphQL</Badge>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Financial Planning API</h4>
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Setup Required</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Financial planning tools and projections</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">v3.0</Badge>
                  <Badge variant="secondary">REST</Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="plugins">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Integration Plugins</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                    <PuzzleIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Data Synchronization</h4>
                    <p className="text-sm text-muted-foreground mb-2">Keeps data in sync across all connected platforms</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Installed</Badge>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded bg-purple-100 flex items-center justify-center text-purple-600">
                    <PuzzleIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Single Sign-On</h4>
                    <p className="text-sm text-muted-foreground mb-2">Unified authentication across all platforms</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Installed</Badge>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded bg-amber-100 flex items-center justify-center text-amber-600">
                    <PuzzleIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">API Gateway</h4>
                    <p className="text-sm text-muted-foreground mb-2">Centralized API management and security</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Installed</Badge>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-600">
                    <PuzzleIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Reporting Engine</h4>
                    <p className="text-sm text-muted-foreground mb-2">Cross-platform consolidated reporting</p>
                    <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-100">Available</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
