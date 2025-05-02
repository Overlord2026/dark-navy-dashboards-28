
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  LucideArrowRightLeft, 
  Webhook, 
  PuzzlePiece,
  LucideLayoutTemplate
} from "lucide-react";

const ProjectIntegration = () => {
  return (
    <ThreeColumnLayout title="Project Integration">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Project Integration
              <Badge className="ml-2 bg-green-500 hover:bg-green-600">Connected</Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage integrations with other products in the Family Office Marketplace
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            + Add New Integration
          </Button>
        </div>
        
        <Tabs defaultValue="connected" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="connected">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Family Office Dashboard</h3>
                  <Badge>Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Main operational dashboard for family office</p>
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">Configure</Button>
                  <span className="text-xs text-muted-foreground">Last synced: Today</span>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Estate Planning Tool</h3>
                  <Badge>Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Estate and trust management application</p>
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">Configure</Button>
                  <span className="text-xs text-muted-foreground">Last synced: Yesterday</span>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Investment Tracker</h3>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Portfolio tracking and analysis</p>
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">Finalize</Button>
                  <span className="text-xs text-muted-foreground">Setup required</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="architecture" className="space-y-4">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">System Architecture</h3>
              <div className="flex justify-center mb-6">
                <div className="max-w-3xl w-full bg-muted p-8 rounded-lg flex flex-col items-center">
                  <LucideLayoutTemplate className="h-16 w-16 mb-4 text-primary" />
                  <p className="text-center text-sm">
                    System architecture diagram showing connections between applications in the Family Office Marketplace
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded p-4">
                  <h4 className="font-semibold mb-2">Data Flow</h4>
                  <p className="text-sm text-muted-foreground">
                    Secure data exchange between integrated applications with end-to-end encryption
                  </p>
                </div>
                <div className="border rounded p-4">
                  <h4 className="font-semibold mb-2">Security Model</h4>
                  <p className="text-sm text-muted-foreground">
                    Role-based access controls and multi-factor authentication for all integration points
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">API Connections</h3>
                <Button variant="outline">View Documentation</Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <Webhook className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">REST API</h4>
                      <p className="text-xs text-muted-foreground">Secure data access</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Connected</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <LucideArrowRightLeft className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">GraphQL Endpoint</h4>
                      <p className="text-xs text-muted-foreground">Query optimization</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Network className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Webhooks</h4>
                      <p className="text-xs text-muted-foreground">Event notifications</p>
                    </div>
                  </div>
                  <Badge variant="outline">Setup Required</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="plugins" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <PuzzlePiece className="h-5 w-5" />
                  <h4 className="font-semibold">Data Visualizer</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Enhanced data visualization for portfolio analytics
                </p>
                <Button size="sm" variant="outline">Install</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <PuzzlePiece className="h-5 w-5" />
                  <h4 className="font-semibold">Document Sync</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Automatic document synchronization
                </p>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">Installed</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <PuzzlePiece className="h-5 w-5" />
                  <h4 className="font-semibold">Reporting Engine</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Custom report generation for financial data
                </p>
                <Button size="sm" variant="outline">Install</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default ProjectIntegration;
