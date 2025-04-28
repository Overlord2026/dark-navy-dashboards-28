
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, Trash2, Settings, ArrowRight, Cloud, Key, RefreshCw, Shield, FileCode } from "lucide-react";
import { toast } from "sonner";

export function ApiIntegrationsTab() {
  const connectedApis = [
    {
      id: "supabase",
      name: "Supabase",
      description: "Database, Authentication and Storage",
      status: "connected",
      icon: <FileCode className="h-5 w-5 text-green-500" />,
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Payment processing for premium features",
      status: "connected",
      icon: <Cloud className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "auth",
      name: "Authentication API",
      description: "Unified authentication across segments",
      status: "connected", 
      icon: <Shield className="h-5 w-5 text-amber-500" />,
    }
  ];
  
  const availableApis = [
    {
      id: "openai",
      name: "OpenAI",
      description: "AI-powered insights and recommendations",
      icon: <Cloud className="h-5 w-5 text-purple-500" />,
    },
    {
      id: "plaid",
      name: "Plaid",
      description: "Financial account connections",
      icon: <Key className="h-5 w-5 text-indigo-500" />,
    }
  ];

  const handleConnect = (apiId: string) => {
    toast.success(`Connected to ${apiId} API successfully`);
  };
  
  const handleDisconnect = (apiId: string) => {
    toast.info(`Disconnected from ${apiId} API`);
  };
  
  const handleRefresh = (apiId: string) => {
    toast.success(`Refreshed ${apiId} API credentials`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Connected APIs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {connectedApis.map(api => (
          <Card key={api.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="p-2 rounded-full bg-background">{api.icon}</div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/30 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </Badge>
              </div>
              <CardTitle className="mt-2">{api.name}</CardTitle>
              <CardDescription>{api.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleRefresh(api.id)}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-100/10"
                onClick={() => handleDisconnect(api.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <h2 className="text-lg font-medium pt-6">Available Integrations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {availableApis.map(api => (
          <Card key={api.id} className="border-dashed">
            <CardHeader className="pb-2">
              <div className="p-2 rounded-full bg-background w-fit">{api.icon}</div>
              <CardTitle className="mt-2">{api.name}</CardTitle>
              <CardDescription>{api.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => handleConnect(api.id)}>
                <Plus className="h-4 w-4 mr-1" />
                Connect {api.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
