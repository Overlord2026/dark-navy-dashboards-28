import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  ExternalLink, 
  Settings, 
  Webhook,
  Zap,
  GitMerge,
  CheckCircle,
  AlertCircle,
  Code,
  Play,
  Book
} from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

export function WebhookIntegrationsManager() {
  const [testPayload, setTestPayload] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const webhookUrl = `${window.location.origin.replace('localhost:8080', 'xcmqjkvyvuhoslbzmlgi.supabase.co')}/functions/v1/webhook-lead-intake`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const testWebhook = async () => {
    if (!testPayload.trim()) {
      toast.error('Please enter a test payload');
      return;
    }

    setTesting(true);
    try {
      const payload = JSON.parse(testPayload);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      setTestResult({
        status: response.status,
        success: response.ok,
        data: result
      });

      if (response.ok) {
        toast.success('Webhook test successful!');
      } else {
        toast.error('Webhook test failed');
      }
    } catch (error) {
      console.error('Test error:', error);
      setTestResult({
        status: 0,
        success: false,
        data: { error: error.message }
      });
      toast.error('Invalid JSON or network error');
    } finally {
      setTesting(false);
    }
  };

  const samplePayloads = {
    zapier: `{
  "first_name": "John",
  "last_name": "Doe", 
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "company": "Acme Corp",
  "location": "New York, NY",
  "source": "Contact Form",
  "campaign_source": "Spring 2024 Campaign",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "financial_planning"
}`,
    make: `{
  "lead": {
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "phone": "555-987-6543",
    "company": "Smith Enterprises",
    "location": "Los Angeles, CA",
    "source": "LinkedIn Ad",
    "campaign_source": "Q2 Lead Gen",
    "lead_score": 85,
    "tags": ["high-priority", "enterprise"]
  },
  "routing_preferences": {
    "priority": "high",
    "assignment_method": "capacity_based"
  }
}`,
    generic: `{
  "email": "prospect@company.com",
  "name": "Alex Johnson",
  "phone": "555-444-3333",
  "source": "Webinar Registration",
  "custom_fields": {
    "webinar_topic": "Tax Planning Strategies",
    "company_size": "50-100 employees",
    "interest_level": "very_interested"
  }
}`
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Webhook Integrations</h2>
        <p className="text-muted-foreground">
          Connect your CRM, forms, and automation tools to automatically import leads
        </p>
      </div>

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="zapier">Zapier</TabsTrigger>
          <TabsTrigger value="make">Make.com</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Endpoint
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Webhook URL</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={webhookUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(webhookUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Use this URL in your automation tools to send leads to your system
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Automatic Routing</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Leads are automatically assigned to advisors based on your routing rules
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Duplicate Prevention</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    System checks for existing leads by email to prevent duplicates
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Rich Data Support</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Supports UTM parameters, custom fields, and campaign tracking
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Required</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                      <code>email</code> - Valid email address
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                      <code>first_name</code> or <code>last_name</code> - Contact name
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Optional</h4>
                  <ul className="space-y-1 text-sm">
                    <li><code>phone</code> - Phone number</li>
                    <li><code>company</code> - Company name</li>
                    <li><code>location</code> - Geographic location</li>
                    <li><code>source</code> - Lead source</li>
                    <li><code>campaign_source</code> - Campaign identifier</li>
                    <li><code>lead_score</code> - Numeric score (0-100)</li>
                    <li><code>tags</code> - Array of tags</li>
                    <li><code>utm_*</code> - UTM parameters</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zapier" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                Zapier Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Setup Steps:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Create a new Zap in your Zapier account</li>
                  <li>Choose your trigger app (CRM, form tool, etc.)</li>
                  <li>Add a "Webhooks by Zapier" action</li>
                  <li>Choose "POST" method</li>
                  <li>Enter the webhook URL above</li>
                  <li>Map your lead fields to the required format</li>
                  <li>Test and activate your Zap</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2">Zapier Payload Format:</h4>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                  <code>{samplePayloads.zapier}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => copyToClipboard(samplePayloads.zapier)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Sample
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href="https://zapier.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Zapier
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://help.zapier.com/hc/en-us/articles/2326-getting-started-guide" target="_blank" rel="noopener noreferrer">
                    <Book className="h-4 w-4 mr-2" />
                    Zapier Help
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="make" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitMerge className="h-5 w-5 text-blue-500" />
                Make.com Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Setup Steps:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Create a new scenario in Make.com</li>
                  <li>Add your trigger module (CRM, form, etc.)</li>
                  <li>Add an "HTTP" &gt; "Make a request" module</li>
                  <li>Set method to "POST"</li>
                  <li>Enter the webhook URL above</li>
                  <li>Set Content-Type to "application/json"</li>
                  <li>Map your data in the request body</li>
                  <li>Test and activate your scenario</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2">Make.com Payload Format:</h4>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                  <code>{samplePayloads.make}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => copyToClipboard(samplePayloads.make)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Sample
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href="https://make.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Make.com
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://www.make.com/en/help" target="_blank" rel="noopener noreferrer">
                    <Book className="h-4 w-4 mr-2" />
                    Make.com Help
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Test Webhook
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Test Payload</label>
                <Textarea
                  placeholder="Enter JSON payload to test..."
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={testWebhook} disabled={testing}>
                  {testing ? 'Testing...' : 'Test Webhook'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTestPayload(samplePayloads.zapier)}
                >
                  Load Zapier Sample
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTestPayload(samplePayloads.make)}
                >
                  Load Make.com Sample
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTestPayload(samplePayloads.generic)}
                >
                  Load Generic Sample
                </Button>
              </div>

              {testResult && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {testResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">
                      Status: {testResult.status}
                    </span>
                    <Badge variant={testResult.success ? 'default' : 'destructive'}>
                      {testResult.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                  <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                    <code>{JSON.stringify(testResult.data, null, 2)}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}