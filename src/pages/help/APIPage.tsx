import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Code, Key, Shield, ExternalLink, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function APIPage() {
  const navigate = useNavigate();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const endpoints = [
    {
      method: "GET",
      endpoint: "/api/v1/accounts",
      description: "Retrieve all connected accounts",
      params: "None",
      response: "Array of account objects"
    },
    {
      method: "GET", 
      endpoint: "/api/v1/transactions",
      description: "Get recent transactions",
      params: "limit, account_id (optional)",
      response: "Array of transaction objects"
    },
    {
      method: "POST",
      endpoint: "/api/v1/goals",
      description: "Create a new financial goal",
      params: "goal_type, target_amount, target_date",
      response: "Created goal object"
    },
    {
      method: "GET",
      endpoint: "/api/v1/reports/portfolio",
      description: "Generate portfolio analysis",
      params: "format (json/pdf)",
      response: "Portfolio analysis data"
    }
  ];

  const codeExample = `
// Initialize the client
const client = new FamilyOfficeAPI({
  apiKey: 'your_api_key_here',
  baseURL: 'https://api.familyoffice.com/v1'
});

// Get account balances
const accounts = await client.accounts.list();
console.log(accounts);

// Create a financial goal
const goal = await client.goals.create({
  type: 'retirement',
  targetAmount: 1000000,
  targetDate: '2045-01-01'
});
`.trim();

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
              <Code className="h-10 w-10 text-primary" />
              API Documentation
            </h1>
            <p className="text-xl text-muted-foreground">Build custom integrations with our REST API</p>
          </div>

          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Note:</strong> API access is available for Enterprise subscribers. 
                  Contact your account manager to enable API access.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">1. Get Your API Key</h4>
                <p className="text-sm text-muted-foreground">
                  Generate an API key from your account settings under "Developer Tools"
                </p>
                
                <h4 className="font-semibold">2. Authentication</h4>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <span>Authorization: Bearer your_api_key_here</span>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard('Authorization: Bearer your_api_key_here')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h4 className="font-semibold">3. Base URL</h4>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <span>https://api.familyoffice.com/v1</span>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard('https://api.familyoffice.com/v1')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Example */}
          <Card>
            <CardHeader>
              <CardTitle>Example Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExample}</code>
                </pre>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(codeExample)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>Available Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                        {endpoint.method}
                      </Badge>
                      <code className="font-mono text-sm">{endpoint.endpoint}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-semibold">Parameters:</span> {endpoint.params}
                      </div>
                      <div>
                        <span className="font-semibold">Response:</span> {endpoint.response}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security & Rate Limits */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Encryption</h4>
                  <p className="text-sm text-muted-foreground">All API requests must use HTTPS (TLS 1.2+)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">API Keys</h4>
                  <p className="text-sm text-muted-foreground">Rotate keys regularly and never commit to version control</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Scopes</h4>
                  <p className="text-sm text-muted-foreground">API keys can be scoped to specific operations</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rate Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Standard Tier</h4>
                  <p className="text-sm text-muted-foreground">1,000 requests per hour</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Enterprise Tier</h4>
                  <p className="text-sm text-muted-foreground">10,000 requests per hour</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Headers</h4>
                  <p className="text-sm text-muted-foreground">X-RateLimit-Remaining, X-RateLimit-Reset</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support */}
          <Card className="text-center">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Need Help with the API?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our developer support team can help with integration questions
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Full API Docs
                </Button>
                <Button size="sm">
                  Contact Developer Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}