
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Loader2, CheckCircle, ArrowRight, Network } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";

export default function Integration() {
  const { userProfile } = useUser();
  const [activeTab, setActiveTab] = useState("connected-projects");
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";
  
  const handleConnect = () => {
    toast.success("Connection successful!");
  };

  if (!isAdmin) {
    return (
      <ThreeColumnLayout title="Integration Hub">
        <div className="max-w-4xl mx-auto w-full p-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Restricted</CardTitle>
              <CardDescription>
                You need administrator privileges to access the Integration Hub.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Please contact your system administrator for access.</p>
            </CardContent>
          </Card>
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout title="Integration Hub" activeMainItem="integration">
      <div className="max-w-6xl mx-auto w-full p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Share2 className="h-8 w-8 text-primary" />
              Family Office Marketplace
            </h1>
            <p className="text-muted-foreground mt-1">
              Connect and manage your projects across the Family Office architecture
            </p>
          </div>
          
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1 px-3 py-1">
            <CheckCircle className="h-3.5 w-3.5" />
            Connected
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="connected-projects">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api-integrations">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected-projects">
            <ConnectedProjectsTab />
          </TabsContent>
          
          <TabsContent value="architecture">
            <ArchitectureTab />
          </TabsContent>
          
          <TabsContent value="api-integrations">
            <ApiIntegrationsTab />
          </TabsContent>
          
          <TabsContent value="plugins">
            <PluginsTab />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
