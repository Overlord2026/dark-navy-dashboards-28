import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/ui/file-upload';
import { usePlatformConnectors } from '@/hooks/usePlatformConnectors';
import { ConnectorSetup } from './ConnectorSetup';
import { FieldMappingReview } from './FieldMappingReview';
import { ImportHistory } from './ImportHistory';
import { OAuthSetup } from './OAuthSetup';
import { Plus, Upload, RefreshCw, Database, Settings } from 'lucide-react';

const SUPPORTED_PLATFORMS = [
  { 
    id: 'quickbooks', 
    name: 'QuickBooks', 
    types: ['csv', 'excel', 'api_oauth'],
    description: 'Import/export transactions, chart of accounts, and customer data'
  },
  { 
    id: 'xero', 
    name: 'Xero', 
    types: ['csv', 'excel', 'api_oauth'],
    description: 'Sync accounting data and bank transactions'
  },
  { 
    id: 'cch', 
    name: 'CCH Axcess', 
    types: ['csv', 'excel'],
    description: 'Import tax preparation data and client information'
  },
  { 
    id: 'drake', 
    name: 'Drake Tax', 
    types: ['csv', 'excel'],
    description: 'Import tax returns and client data'
  },
  { 
    id: 'lacerte', 
    name: 'Lacerte Tax', 
    types: ['csv', 'excel'],
    description: 'Import tax preparation documents and data'
  }
];

export function PlatformConnectors() {
  const {
    connectors,
    importHistory,
    loading,
    loadConnectors,
    loadImportHistory,
    createConnector,
    updateConnector,
    processFileImport,
    initiateOAuth,
    syncPlatformData
  } = usePlatformConnectors();

  const [activeTab, setActiveTab] = useState('connectors');
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [setupPlatform, setSetupPlatform] = useState<string>('');

  useEffect(() => {
    loadConnectors();
    loadImportHistory();
  }, [loadConnectors, loadImportHistory]);

  const handleCreateConnector = async (platform: string, type: string) => {
    setSetupPlatform(platform);
    setShowSetup(true);
  };

  const handleFileUpload = async (file: File, connectorId: string, mappings: Record<string, string>) => {
    try {
      await processFileImport(connectorId, file, mappings);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const handleOAuthConnect = async (platform: string, connectorId: string) => {
    const redirectUri = `${window.location.origin}/integrations/oauth-callback`;
    try {
      await initiateOAuth(platform, connectorId, redirectUri);
    } catch (error) {
      console.error('OAuth connection failed:', error);
    }
  };

  const handleSync = async (connectorId: string, dataTypes: string[]) => {
    try {
      await syncPlatformData(connectorId, dataTypes);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  if (showSetup) {
    return (
      <ConnectorSetup
        platform={setupPlatform}
        onComplete={(connector) => {
          setShowSetup(false);
          setSetupPlatform('');
          loadConnectors();
        }}
        onCancel={() => {
          setShowSetup(false);
          setSetupPlatform('');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Connectors</h2>
          <p className="text-muted-foreground">
            Connect with popular accounting and tax platforms
          </p>
        </div>
        <Button onClick={() => setShowSetup(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Connector
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="connectors">
            <Settings className="h-4 w-4 mr-2" />
            Connectors
          </TabsTrigger>
          <TabsTrigger value="import">
            <Upload className="h-4 w-4 mr-2" />
            Import/Export
          </TabsTrigger>
          <TabsTrigger value="history">
            <Database className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connectors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SUPPORTED_PLATFORMS.map((platform) => {
              const connector = connectors.find(c => c.platform_name === platform.id);
              
              return (
                <Card key={platform.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      {connector && (
                        <Badge variant={connector.is_active ? "default" : "secondary"}>
                          {connector.is_active ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{platform.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {platform.types.map((type) => (
                          <Badge key={type} variant="outline">
                            {type.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                      
                      {connector ? (
                        <div className="space-y-2">
                          {connector.connector_type === 'api_oauth' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleOAuthConnect(platform.id, connector.id)}
                              className="w-full"
                            >
                            <RefreshCw className="h-4 w-4 mr-2" />
                              Sync Data
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedConnector(connector.id)}
                            className="w-full"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleCreateConnector(platform.id, platform.types[0])}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>File Upload</CardTitle>
                <CardDescription>
                  Upload CSV or Excel files from your accounting platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FileUpload
                    onFileChange={(file) => {
                      // Handle file selection and show mapping interface
                      console.log('File selected:', file.name);
                    }}
                    accept=".csv,.xlsx,.xls"
                    maxSize={10 * 1024 * 1024} // 10MB
                  />
                  <p className="text-sm text-muted-foreground">
                    Supported formats: CSV, Excel (.xlsx, .xls). Max size: 10MB
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>OAuth Connections</CardTitle>
                <CardDescription>
                  Connect directly to supported platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {connectors
                    .filter(c => c.connector_type === 'api_oauth')
                    .map((connector) => (
                      <div key={connector.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{connector.platform_name}</p>
                          <p className="text-sm text-muted-foreground">
                            OAuth connection
                          </p>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleSync(connector.id, ['transactions', 'accounts'])}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync
                        </Button>
                      </div>
                    ))}
                  
                  {connectors.filter(c => c.connector_type === 'api_oauth').length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No OAuth connections configured
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <ImportHistory 
            history={importHistory}
            loading={loading}
            onRefresh={loadImportHistory}
          />
        </TabsContent>
      </Tabs>

      {selectedConnector && (
        <FieldMappingReview
          connectorId={selectedConnector}
          onClose={() => setSelectedConnector(null)}
        />
      )}
    </div>
  );
}