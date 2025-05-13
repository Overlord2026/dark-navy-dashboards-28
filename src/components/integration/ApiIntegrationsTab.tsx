
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code, Lock, Upload, Download, Copy, Check, CloudOff } from "lucide-react";
import { toast } from "sonner";

export function ApiIntegrationsTab() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: "key_1",
      name: "Production API Key",
      key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U",
      created: "2023-10-15",
      expires: "2024-10-15",
      status: "active",
    },
    {
      id: "key_2",
      name: "Development API Key",
      key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXZrZXkifQ.mDOJgwH7sKT55V2sEEgPvQdIjOvP5xFcLjESb_KEz9g",
      created: "2023-11-01",
      expires: "2024-11-01",
      status: "active",
    },
  ]);

  const [webhooks, setWebhooks] = useState([
    {
      id: "wh_1",
      name: "New Account Notification",
      url: "https://example.com/webhooks/accounts",
      eventType: "account.created",
      status: "active",
      lastTriggered: "2023-12-01T15:30:00Z"
    },
    {
      id: "wh_2",
      name: "Document Updates",
      url: "https://example.com/webhooks/documents",
      eventType: "document.updated",
      status: "inactive",
      lastTriggered: null
    },
  ]);

  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    toast.success("API key copied to clipboard");
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedKeyId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="api-keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">API Keys</h3>
              <Button>
                <Lock className="mr-2 h-4 w-4" />
                Generate New API Key
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Available API Keys</CardTitle>
                <CardDescription>
                  Use these keys to authenticate your API requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                        <TableCell>{apiKey.created}</TableCell>
                        <TableCell>{apiKey.expires}</TableCell>
                        <TableCell>
                          {apiKey.status === "active" ? (
                            <Badge className="bg-green-600">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                            >
                              {copiedKeyId === apiKey.id ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                              <span className="ml-2">
                                {copiedKeyId === apiKey.id ? "Copied" : "Copy"}
                              </span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                            >
                              Revoke
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>API Authentication</CardTitle>
                <CardDescription>
                  How to authenticate your API requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="font-mono text-sm font-semibold mb-2">HTTP Header Authentication</h4>
                    <code className="text-sm text-muted-foreground font-mono">
                      Authorization: Bearer {"{your_api_key}"}
                    </code>
                  </div>
                  
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="font-mono text-sm font-semibold mb-2">Example Request (curl)</h4>
                    <code className="text-sm text-muted-foreground font-mono">
                      curl -X GET https://api.familyoffice.com/v1/accounts \<br />
                      &nbsp;&nbsp;-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="webhooks">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Webhooks</h3>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Create Webhook
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Registered Webhooks</CardTitle>
                <CardDescription>
                  Receive event notifications at your specified endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                {webhooks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Event Type</TableHead>
                        <TableHead>Endpoint URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Triggered</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webhooks.map((webhook) => (
                        <TableRow key={webhook.id}>
                          <TableCell className="font-medium">{webhook.name}</TableCell>
                          <TableCell>{webhook.eventType}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{webhook.url}</TableCell>
                          <TableCell>
                            {webhook.status === "active" ? (
                              <Badge className="bg-green-600">Active</Badge>
                            ) : (
                              <Badge variant="outline">
                                <CloudOff className="h-3 w-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {webhook.lastTriggered 
                              ? new Date(webhook.lastTriggered).toLocaleString() 
                              : "Never"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                Test
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Download className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">No Webhooks Configured</h3>
                    <p className="text-muted-foreground mb-4">
                      Create webhooks to receive notifications when events occur in your Family Office platform.
                    </p>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Create Webhook
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  API Documentation
                </div>
              </CardTitle>
              <CardDescription>
                Complete documentation for the Family Office Marketplace API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium mb-2">REST API</h3>
                    <p className="text-muted-foreground mb-4">Access all Family Office resources using our RESTful API.</p>
                    <Button variant="outline">View Documentation</Button>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium mb-2">GraphQL API</h3>
                    <p className="text-muted-foreground mb-4">Flexible queries and mutations for complex data requirements.</p>
                    <Button variant="outline">View Documentation</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">API Endpoints</h3>
                  
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Resource</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Base URL</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Accounts</TableCell>
                          <TableCell>Manage financial accounts</TableCell>
                          <TableCell className="font-mono text-sm">/v1/accounts</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Documents</TableCell>
                          <TableCell>Document management</TableCell>
                          <TableCell className="font-mono text-sm">/v1/documents</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Assets</TableCell>
                          <TableCell>Asset tracking and management</TableCell>
                          <TableCell className="font-mono text-sm">/v1/assets</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Users</TableCell>
                          <TableCell>User management</TableCell>
                          <TableCell className="font-mono text-sm">/v1/users</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div className="rounded-md bg-muted p-4">
                  <h4 className="font-mono text-sm font-semibold mb-2">Example Request</h4>
                  <code className="text-sm text-muted-foreground font-mono">
                    GET /v1/accounts?limit=10&status=active<br />
                    Authorization: Bearer {"{your_api_key}"}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
