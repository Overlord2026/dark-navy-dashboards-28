import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePlatformConnectors, type PlatformConnector } from '@/hooks/usePlatformConnectors';
import { ArrowLeft, Save } from 'lucide-react';

interface ConnectorSetupProps {
  platform: string;
  onComplete: (connector: PlatformConnector) => void;
  onCancel: () => void;
}

export function ConnectorSetup({ platform, onComplete, onCancel }: ConnectorSetupProps) {
  const { createConnector, loading } = usePlatformConnectors();
  const [connectorType, setConnectorType] = useState<'csv' | 'excel' | 'api_oauth'>('csv');
  const [name, setName] = useState(`${platform.charAt(0).toUpperCase() + platform.slice(1)} Connector`);
  const [configuration, setConfiguration] = useState<Record<string, any>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const connector = await createConnector({
        platform_name: platform as any,
        connector_type: connectorType,
        is_active: true,
        configuration,
        field_mappings: {}
      });
      
      onComplete(connector);
    } catch (error) {
      console.error('Failed to create connector:', error);
    }
  };

  const handleConfigChange = (key: string, value: string) => {
    setConfiguration(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Setup {platform.charAt(0).toUpperCase() + platform.slice(1)} Connector</h2>
          <p className="text-muted-foreground">Configure your platform integration</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Connector Configuration</CardTitle>
          <CardDescription>
            Choose how you want to connect to {platform}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Connector Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter connector name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Connection Type</Label>
              <Select value={connectorType} onValueChange={(value: any) => setConnectorType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select connection type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV Import/Export</SelectItem>
                  <SelectItem value="excel">Excel Import/Export</SelectItem>
                  {(platform === 'quickbooks' || platform === 'xero') && (
                    <SelectItem value="api_oauth">API Integration (OAuth)</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {connectorType === 'api_oauth' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <h4 className="font-medium">OAuth Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  API credentials will be configured after creation during the OAuth flow.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="scopes">Data Access Scope</Label>
                  <Select 
                    value={configuration.scope || 'basic'} 
                    onValueChange={(value) => handleConfigChange('scope', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select data scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Read-only)</SelectItem>
                      <SelectItem value="full">Full Access (Read/Write)</SelectItem>
                      <SelectItem value="accounting">Accounting Data Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {(connectorType === 'csv' || connectorType === 'excel') && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <h4 className="font-medium">File Import Settings</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="delimiter">CSV Delimiter (for CSV files)</Label>
                  <Select 
                    value={configuration.delimiter || ','} 
                    onValueChange={(value) => handleConfigChange('delimiter', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delimiter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=",">Comma (,)</SelectItem>
                      <SelectItem value=";">Semicolon (;)</SelectItem>
                      <SelectItem value="\t">Tab</SelectItem>
                      <SelectItem value="|">Pipe (|)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="encoding">File Encoding</Label>
                  <Select 
                    value={configuration.encoding || 'utf-8'} 
                    onValueChange={(value) => handleConfigChange('encoding', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select encoding" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utf-8">UTF-8</SelectItem>
                      <SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
                      <SelectItem value="windows-1252">Windows-1252</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Creating...' : 'Create Connector'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}