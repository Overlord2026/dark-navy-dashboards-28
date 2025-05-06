
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode2, Copy, ExternalLink, PlayCircle } from "lucide-react";

export default function ApiIntegrations() {
  const apiEndpoints = [
    {
      id: "api-1",
      name: "Account Information",
      endpoint: "/api/accounts",
      method: "GET",
      status: "active",
      auth: "OAuth 2.0",
      rateLimit: "100/min",
      category: "Financial Data"
    },
    {
      id: "api-2",
      name: "Transaction History",
      endpoint: "/api/transactions",
      method: "GET",
      status: "active",
      auth: "OAuth 2.0",
      rateLimit: "120/min",
      category: "Financial Data"
    },
    {
      id: "api-3",
      name: "Investment Portfolio",
      endpoint: "/api/investments",
      method: "GET",
      status: "active",
      auth: "OAuth 2.0",
      rateLimit: "60/min",
      category: "Investments"
    },
    {
      id: "api-4",
      name: "Create Transfer",
      endpoint: "/api/transfers",
      method: "POST",
      status: "active",
      auth: "OAuth 2.0 + MFA",
      rateLimit: "30/min",
      category: "Transactions"
    },
    {
      id: "api-5",
      name: "Document Retrieval",
      endpoint: "/api/documents/{id}",
      method: "GET",
      status: "active",
      auth: "OAuth 2.0",
      rateLimit: "200/min",
      category: "Documents"
    },
    {
      id: "api-6",
      name: "Document Upload",
      endpoint: "/api/documents",
      method: "POST",
      status: "active",
      auth: "OAuth 2.0",
      rateLimit: "50/min",
      category: "Documents"
    },
    {
      id: "api-7",
      name: "Tax Document Analysis",
      endpoint: "/api/tax/analysis",
      method: "POST",
      status: "active",
      auth: "OAuth 2.0",
      rateLimit: "30/min",
      category: "Tax"
    },
    {
      id: "api-8",
      name: "Estate Plan Summary",
      endpoint: "/api/estate/summary",
      method: "GET",
      status: "active",
      auth: "OAuth 2.0",
      rateLimit: "60/min",
      category: "Estate Planning"
    }
  ];

  const exampleCode = `
// Example: Fetch Account Information
const fetchAccounts = async () => {
  try {
    const response = await fetch('https://api.familyoffice.example/api/accounts', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log('Accounts data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
}
  `;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">API Integrations</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">API Keys</Button>
          <Button variant="outline" size="sm">Documentation</Button>
        </div>
      </div>

      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="endpoints" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Available API Endpoints</CardTitle>
              <CardDescription>Secure API endpoints for accessing Family Office Marketplace data</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Authentication</TableHead>
                    <TableHead>Rate Limit</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiEndpoints.map((api) => (
                    <TableRow key={api.id}>
                      <TableCell className="font-medium">{api.name}</TableCell>
                      <TableCell className="font-mono text-sm">{api.endpoint}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            api.method === "GET" ? "bg-blue-100 text-blue-800 border-blue-200" : 
                            api.method === "POST" ? "bg-green-100 text-green-800 border-green-200" : 
                            api.method === "PUT" ? "bg-amber-100 text-amber-800 border-amber-200" : 
                            "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {api.method}
                        </Badge>
                      </TableCell>
                      <TableCell>{api.category}</TableCell>
                      <TableCell>{api.auth}</TableCell>
                      <TableCell>{api.rateLimit}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {api.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Integration guides and code examples</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border">
                  <div className="flex items-center justify-between bg-muted p-3 border-b">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="h-4 w-4" />
                      <span className="font-medium">Example: Fetching Account Information</span>
                    </div>
                    <Button size="sm" variant="ghost" className="gap-1 h-8">
                      <Copy className="h-3 w-3" />
                      Copy Code
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/50 overflow-auto">
                    <pre className="text-sm font-mono">{exampleCode}</pre>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <h4 className="text-lg font-medium">Documentation Resources</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="bg-blue-100 p-2 rounded">
                        <FileCode2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">API Overview</h5>
                        <p className="text-sm text-muted-foreground">Introduction to the API architecture and capabilities</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="bg-green-100 p-2 rounded">
                        <FileCode2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">Authentication Guide</h5>
                        <p className="text-sm text-muted-foreground">OAuth 2.0 implementation and security measures</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="bg-purple-100 p-2 rounded">
                        <FileCode2 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">Financial Data APIs</h5>
                        <p className="text-sm text-muted-foreground">Endpoints for accounts, transactions, and investments</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="bg-amber-100 p-2 rounded">
                        <FileCode2 className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">Document API Reference</h5>
                        <p className="text-sm text-muted-foreground">Document storage, retrieval, and metadata APIs</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Usage & Analytics</CardTitle>
              <CardDescription>Monitor API activity and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">API usage chart would display here</p>
                  <Button className="mt-4 gap-2">
                    <PlayCircle className="h-4 w-4" />
                    View Live Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
