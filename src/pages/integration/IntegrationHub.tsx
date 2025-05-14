
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge-extended";
import { ConnectedBadge } from "@/components/integration/ConnectedBadge";
import { 
  NetworkIcon, 
  Code, 
  GitBranch, 
  Plug, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  PuzzleIcon,
  Activity
} from "lucide-react";

export default function IntegrationHub() {
  return (
    <ThreeColumnLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              Integration Hub
              <ConnectedBadge className="ml-2" />
            </h1>
            <p className="text-muted-foreground mt-1">Manage connected projects and external integrations</p>
          </div>
          <Button>
            Connect New Project
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="connected" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="connected">
              <NetworkIcon className="h-4 w-4 mr-2" />
              Connected Projects
            </TabsTrigger>
            <TabsTrigger value="architecture">
              <GitBranch className="h-4 w-4 mr-2" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="api">
              <Code className="h-4 w-4 mr-2" />
              API Integrations
            </TabsTrigger>
            <TabsTrigger value="plugins">
              <PuzzleIcon className="h-4 w-4 mr-2" />
              Plugins
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ConnectedProjectCard 
                name="Family Office CRM"
                description="Primary client relationship management system"
                status="active"
                lastSync="2 hours ago"
                type="CRM"
              />
              <ConnectedProjectCard 
                name="Investment Analytics"
                description="Portfolio tracking and analysis platform"
                status="active"
                lastSync="1 day ago"
                type="Analytics"
              />
              <ConnectedProjectCard 
                name="Document Management"
                description="Secure document storage and sharing"
                status="warning"
                lastSync="3 days ago"
                type="Storage"
              />
              <ConnectedProjectCard 
                name="Billing System"
                description="Client invoicing and payment processing"
                status="inactive"
                lastSync="Never"
                type="Finance"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="architecture">
            <Card>
              <CardHeader>
                <CardTitle>System Architecture</CardTitle>
                <CardDescription>Overall integration architecture and data flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 border rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Architecture diagram will display here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ApiIntegrationCard 
                name="CRM API"
                description="Connect to client data"
                status="active"
                endpoints={12}
              />
              <ApiIntegrationCard 
                name="Portfolio API"
                description="Investment data access"
                status="active"
                endpoints={8}
              />
              <ApiIntegrationCard 
                name="Document API"
                description="Document storage and retrieval"
                status="active"
                endpoints={6}
              />
              <ApiIntegrationCard 
                name="Reporting API"
                description="Generate customized reports"
                status="inactive"
                endpoints={0}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="plugins">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PluginCard 
                name="Data Connector"
                description="Sync data between systems"
                status="active"
                version="1.2.3"
              />
              <PluginCard 
                name="Report Builder"
                description="Create custom client reports"
                status="active"
                version="2.1.0"
              />
              <PluginCard 
                name="Task Automator"
                description="Automate routine workflows"
                status="warning"
                version="0.9.5"
              />
              <PluginCard 
                name="AI Assistant"
                description="Intelligent data analysis"
                status="inactive"
                version="0.5.0"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}

function ConnectedProjectCard({ name, description, status, lastSync, type }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle>{name}</CardTitle>
          <StatusBadge status={status} />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Type:</div>
          <div className="font-medium">{type}</div>
          <div className="text-muted-foreground">Last Sync:</div>
          <div className="font-medium">{lastSync}</div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          Manage Connection
        </Button>
      </CardFooter>
    </Card>
  );
}

function ApiIntegrationCard({ name, description, status, endpoints }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle>{name}</CardTitle>
          <StatusBadge status={status} />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <div className="text-muted-foreground mb-1">Active Endpoints</div>
          <div className="text-2xl font-bold">{endpoints}</div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          <Code className="h-4 w-4 mr-2" />
          View Documentation
        </Button>
      </CardFooter>
    </Card>
  );
}

function PluginCard({ name, description, status, version }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle>{name}</CardTitle>
          <StatusBadge status={status} />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Version:</div>
          <div className="font-medium">{version}</div>
          <div className="text-muted-foreground">Updated:</div>
          <div className="font-medium">2 weeks ago</div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          <Plug className="h-4 w-4 mr-2" />
          Configure Plugin
        </Button>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }) {
  if (status === "active") {
    return (
      <Badge variant="success" className="gap-1 px-2 py-1">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    );
  } else if (status === "warning") {
    return (
      <Badge variant="warning" className="gap-1 px-2 py-1">
        <AlertCircle className="h-3 w-3" />
        Warning
      </Badge>
    );
  } else {
    return (
      <Badge variant="destructive" className="gap-1 px-2 py-1">
        <Activity className="h-3 w-3" />
        Inactive
      </Badge>
    );
  }
}
