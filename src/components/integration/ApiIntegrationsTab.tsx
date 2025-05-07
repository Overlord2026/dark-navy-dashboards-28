
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Key, RefreshCw, Shield } from "lucide-react";

export const ApiIntegrationsTab = () => {
  const [copied, setCopied] = React.useState(false);
  
  const copyApiKey = () => {
    navigator.clipboard.writeText("api_key_1a2b3c4d5e6f7g8h9i0j");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">API Integrations</h2>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Status
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>Manage your API keys and access credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted p-4 rounded-md">
              <div className="flex items-center space-x-4">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Primary API Key</p>
                  <p className="text-sm text-muted-foreground">Created on May 1, 2025</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={copyApiKey}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" /> Copy Key
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">API Rate Limits</h4>
                <p className="text-sm text-muted-foreground">Premium tier: 10,000 requests per day</p>
              </div>
              <Button variant="link" size="sm">Upgrade Plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="endpoints" className="mt-8">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="endpoints" className="mt-4">
          <div className="space-y-4">
            <div className="bg-muted/20 p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <div className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded">GET /api/v1/accounts</div>
                <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs">Healthy</span>
              </div>
              <p className="text-sm text-muted-foreground">Retrieve all connected financial accounts</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <div className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded">POST /api/v1/documents</div>
                <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs">Healthy</span>
              </div>
              <p className="text-sm text-muted-foreground">Create or upload new documents</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <div className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded">GET /api/v1/investments</div>
                <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs">Healthy</span>
              </div>
              <p className="text-sm text-muted-foreground">Retrieve investment portfolio data</p>
            </div>
            
            <Button variant="outline" className="mt-2">View Full API Documentation</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="webhooks" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/20 p-4 rounded-lg border">
              <div>
                <h4 className="font-medium">Document Updates</h4>
                <p className="text-sm text-muted-foreground">Notifies when documents are added or modified</p>
              </div>
              <div className="flex items-center">
                <span className="mr-3 bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs">Active</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-muted/20 p-4 rounded-lg border">
              <div>
                <h4 className="font-medium">Account Activity</h4>
                <p className="text-sm text-muted-foreground">Notifies on financial account transactions</p>
              </div>
              <div className="flex items-center">
                <span className="mr-3 bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full text-xs">Paused</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
            
            <Button>Add New Webhook</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">API Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure security for your API connections</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h4 className="font-medium">IP Restrictions</h4>
                    <p className="text-sm text-muted-foreground">Restrict API access to specific IP addresses</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h4 className="font-medium">Authentication Methods</h4>
                    <p className="text-sm text-muted-foreground">OAuth 2.0, API Keys, JWT</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h4 className="font-medium">Access Logs</h4>
                    <p className="text-sm text-muted-foreground">Review API access and usage logs</p>
                  </div>
                  <Button variant="outline">View Logs</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Compliance Settings</h4>
                    <p className="text-sm text-muted-foreground">GDPR, CCPA, and financial regulations</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
