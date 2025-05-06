
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  LinkIcon, 
  LayoutGrid, 
  FileCode2, 
  Plug, 
  Settings2,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

import ConnectedProjects from "./integration/ConnectedProjects";
import Architecture from "./integration/Architecture";
import ApiIntegrations from "./integration/ApiIntegrations";
import Plugins from "./integration/Plugins";

export default function ProjectIntegration() {
  const [activeTab, setActiveTab] = useState("connected");
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL based on tab
    switch(value) {
      case "connected":
        navigate("/integration/connected-projects");
        break;
      case "architecture":
        navigate("/integration/architecture");
        break;
      case "api":
        navigate("/integration/api");
        break;
      case "plugins":
        navigate("/integration/plugins");
        break;
      default:
        navigate("/integration");
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Project Integration Hub</h2>
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
            Connected
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Manage integrations, connected projects, and API interactions for your Family Office Marketplace
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <LinkIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Connected Projects</p>
                <p className="text-xs text-muted-foreground">4 Active</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FileCode2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">APIs</p>
                <p className="text-xs text-muted-foreground">8 Endpoints</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <Plug className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Plugins</p>
                <p className="text-xs text-muted-foreground">3 Installed</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-amber-50 rounded-lg">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Security</p>
                <p className="text-xs text-muted-foreground">SOC-2 Compliant</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="connected" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Connected Projects
          </TabsTrigger>
          <TabsTrigger value="architecture" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Architecture
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4" />
            API Integrations
          </TabsTrigger>
          <TabsTrigger value="plugins" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Plugins
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connected">
          <ConnectedProjects />
        </TabsContent>
        
        <TabsContent value="architecture">
          <Architecture />
        </TabsContent>
        
        <TabsContent value="api">
          <ApiIntegrations />
        </TabsContent>
        
        <TabsContent value="plugins">
          <Plugins />
        </TabsContent>
      </Tabs>
    </div>
  );
}
