
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useApiDiagnostics } from '@/hooks/useApiDiagnostics';
import { Activity, Play, Check, AlertTriangle, X, Code, Clipboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ApiEndpointDiagnosticResult } from '@/services/diagnostics/types';

export const ApiDiagnosticRunner = () => {
  const { results, isRunning, lastRun, runApiDiagnostics, getApiDiagnosticsSummary } = useApiDiagnostics();
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointDiagnosticResult | null>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [customMethod, setCustomMethod] = useState('GET');
  
  const summary = getApiDiagnosticsSummary();
  
  const handleRunDiagnostics = async () => {
    await runApiDiagnostics();
  };
  
  const handleViewEndpoint = (endpoint: ApiEndpointDiagnosticResult) => {
    setSelectedEndpoint(endpoint);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'error':
      default:
        return <X className="h-4 w-4 text-red-600" />;
    }
  };
  
  const handleCopyImplementation = () => {
    if (!selectedEndpoint) return;
    
    const implementationCode = generateBackendCodeExample(selectedEndpoint);
    navigator.clipboard.writeText(implementationCode);
    toast.success('Example implementation copied to clipboard');
  };
  
  const generateBackendCodeExample = (endpoint: ApiEndpointDiagnosticResult): string => {
    if (endpoint.method === 'GET') {
      return `// Example Express implementation for ${endpoint.name}
const express = require('express');
const router = express.Router();

router.get('${endpoint.url}', async (req, res) => {
  try {
    // Add your authentication middleware here
    // const user = req.user;
    
    // Your business logic here
    // const data = await yourService.getData();
    
    // Return expected data structure: ${endpoint.expectedDataStructure}
    return res.status(200).json({
      success: true,
      data: {}, // Your data here
      message: 'Data retrieved successfully'
    });
  } catch (error) {
    console.error('Error in ${endpoint.name}:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;`;
    } else {
      return `// Example Express implementation for ${endpoint.name}
const express = require('express');
const router = express.Router();

router.${endpoint.method.toLowerCase()}('${endpoint.url}', async (req, res) => {
  try {
    // Add your authentication middleware here
    // const user = req.user;
    
    // Validate request body
    const { /* required fields */ } = req.body;
    
    // if (!requiredField) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'Missing required field'
    //   });
    // }
    
    // Your business logic here
    // const result = await yourService.processData(req.body);
    
    // Return expected data structure: ${endpoint.expectedDataStructure}
    return res.status(200).json({
      success: true,
      data: {}, // Your response data here
      message: 'Operation completed successfully'
    });
  } catch (error) {
    console.error('Error in ${endpoint.name}:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;`;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-5 w-5" />
              API Diagnostic Runner
            </CardTitle>
            <CardDescription>
              Test API endpoints and generate backend implementation code
            </CardDescription>
          </div>
          <Button
            onClick={handleRunDiagnostics}
            disabled={isRunning}
            variant="outline"
            className="gap-2"
          >
            {isRunning ? (
              <>Running...</>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Diagnostics
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="endpoints" className="flex-1">API Endpoints</TabsTrigger>
            <TabsTrigger value="custom" className="flex-1">Custom Endpoint Test</TabsTrigger>
            <TabsTrigger value="implementation" className="flex-1">Implementation Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="endpoints">
            <div className="mb-4 grid grid-cols-4 gap-3 text-center">
              <div className="p-3 border rounded-md">
                <div className="text-lg font-bold">{summary.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="p-3 border rounded-md bg-green-50 border-green-200">
                <div className="text-lg font-bold text-green-600">{summary.success}</div>
                <div className="text-sm text-green-700">Success</div>
              </div>
              <div className="p-3 border rounded-md bg-amber-50 border-amber-200">
                <div className="text-lg font-bold text-amber-600">{summary.warnings}</div>
                <div className="text-sm text-amber-700">Warnings</div>
              </div>
              <div className="p-3 border rounded-md bg-red-50 border-red-200">
                <div className="text-lg font-bold text-red-600">{summary.errors}</div>
                <div className="text-sm text-red-700">Errors</div>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left">Endpoint</th>
                    <th className="px-4 py-2 text-left">Method</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                        {isRunning ? 'Running diagnostics...' : 'No API diagnostics data. Run diagnostics to test endpoints.'}
                      </td>
                    </tr>
                  ) : (
                    results.map((endpoint, index) => (
                      <tr key={index} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div className="font-medium">{endpoint.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[220px]">
                            {endpoint.url}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={
                            endpoint.method === "GET" ? "bg-blue-50 border-blue-200 text-blue-800" :
                            endpoint.method === "POST" ? "bg-green-50 border-green-200 text-green-800" :
                            endpoint.method === "PUT" ? "bg-amber-50 border-amber-200 text-amber-800" :
                            endpoint.method === "DELETE" ? "bg-red-50 border-red-200 text-red-800" : ""
                          }>
                            {endpoint.method}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(endpoint.status)}
                            <span className={
                              endpoint.status === 'success' ? "text-green-600" :
                              endpoint.status === 'warning' ? "text-amber-600" : "text-red-600"
                            }>
                              {endpoint.status.charAt(0).toUpperCase() + endpoint.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewEndpoint(endpoint)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label htmlFor="customUrl" className="text-sm font-medium block mb-1">API Endpoint URL</label>
                  <Input 
                    id="customUrl"
                    placeholder="/api/your-endpoint"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="customMethod" className="text-sm font-medium block mb-1">Method</label>
                  <select
                    id="customMethod"
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
                    value={customMethod}
                    onChange={(e) => setCustomMethod(e.target.value)}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
              </div>
              
              <Button 
                className="w-full gap-2"
                disabled={!customUrl}
                onClick={() => {
                  toast.info(`Testing custom endpoint: ${customUrl}`, {
                    description: "This is a demonstration. In a real app, this would test your custom endpoint."
                  });
                }}
              >
                <Play className="h-4 w-4" />
                Test Endpoint
              </Button>
              
              <div className="p-4 border rounded-md bg-muted/30">
                <p className="text-sm">
                  Custom endpoint testing allows developers to validate new API endpoints during development.
                  Enter your API route and select the HTTP method to test.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="implementation">
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/30">
                <h3 className="font-medium mb-2">Backend Implementation Guide</h3>
                <p className="text-sm mb-2">
                  This section provides guidance for implementing backend endpoints that match
                  the expected API structure used by the frontend.
                </p>
                <p className="text-sm">
                  Select an endpoint from the list to view implementation details and example code.
                </p>
              </div>
              
              {selectedEndpoint ? (
                <div className="border rounded-md overflow-hidden">
                  <div className="p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{selectedEndpoint.name}</h3>
                      <Badge variant="outline" className={
                        selectedEndpoint.method === "GET" ? "bg-blue-50 border-blue-200 text-blue-800" :
                        selectedEndpoint.method === "POST" ? "bg-green-50 border-green-200 text-green-800" :
                        selectedEndpoint.method === "PUT" ? "bg-amber-50 border-amber-200 text-amber-800" :
                        selectedEndpoint.method === "DELETE" ? "bg-red-50 border-red-200 text-red-800" : ""
                      }>
                        {selectedEndpoint.method}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedEndpoint.url}</p>
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-1">Expected Data Structure</h4>
                      <p className="text-sm bg-muted/20 p-2 rounded">{selectedEndpoint.expectedDataStructure}</p>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium">Example Implementation</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 gap-1"
                          onClick={handleCopyImplementation}
                        >
                          <Clipboard className="h-3.5 w-3.5" />
                          Copy Code
                        </Button>
                      </div>
                      <pre className="text-xs bg-zinc-950 text-zinc-50 p-3 rounded overflow-auto max-h-80">
                        <code>{generateBackendCodeExample(selectedEndpoint)}</code>
                      </pre>
                    </div>
                    
                    {selectedEndpoint.errorMessage && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">Notes</h4>
                        <p className="text-sm text-red-600">{selectedEndpoint.errorMessage}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border rounded-md">
                  <Code className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="font-medium text-lg mb-1">Select an Endpoint</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose an API endpoint from the Endpoints tab to view implementation details
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {lastRun && (
        <CardFooter className="border-t px-6 py-3">
          <p className="text-xs text-muted-foreground">
            Last diagnostic run: {new Date(lastRun).toLocaleString()}
          </p>
        </CardFooter>
      )}
    </Card>
  );
};
