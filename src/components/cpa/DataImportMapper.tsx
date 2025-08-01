import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/ui/file-upload';
import { Upload, Database, Users, AlertTriangle, CheckCircle, FileText, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImportSource {
  id: string;
  name: string;
  type: 'csv' | 'api';
  description: string;
  fields: string[];
  icon: React.ReactNode;
}

interface ClientMatch {
  id: string;
  importedName: string;
  existingClient?: {
    id: string;
    name: string;
    email: string;
  };
  confidence: number;
  status: 'new' | 'match' | 'duplicate' | 'conflict';
  documents: string[];
}

const importSources: ImportSource[] = [
  {
    id: 'lacerte',
    name: 'Lacerte',
    type: 'api',
    description: 'Import client data and tax documents from Lacerte',
    fields: ['client_name', 'ssn', 'address', 'phone', 'email', 'tax_year'],
    icon: <Database className="w-4 h-4" />
  },
  {
    id: 'drake',
    name: 'Drake Tax',
    type: 'api',
    description: 'Connect to Drake Tax for client and document import',
    fields: ['name', 'tin', 'contact_info', 'return_type', 'status'],
    icon: <Database className="w-4 h-4" />
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    type: 'api',
    description: 'Import client and financial data from QuickBooks',
    fields: ['company_name', 'contact_name', 'email', 'phone', 'address'],
    icon: <Database className="w-4 h-4" />
  },
  {
    id: 'xero',
    name: 'Xero',
    type: 'api',
    description: 'Connect to Xero for client and accounting data',
    fields: ['organization_name', 'contact_person', 'email', 'phone'],
    icon: <Database className="w-4 h-4" />
  },
  {
    id: 'canopy',
    name: 'Canopy',
    type: 'api',
    description: 'Import practice management data from Canopy',
    fields: ['client_name', 'contact_info', 'services', 'status'],
    icon: <Database className="w-4 h-4" />
  },
  {
    id: 'csv',
    name: 'CSV Upload',
    type: 'csv',
    description: 'Upload client data via CSV file',
    fields: ['name', 'email', 'phone', 'address', 'notes'],
    icon: <Upload className="w-4 h-4" />
  }
];

const mockMatches: ClientMatch[] = [
  {
    id: '1',
    importedName: 'Johnson & Associates LLC',
    existingClient: {
      id: 'c1',
      name: 'Johnson Associates',
      email: 'info@johnsonassoc.com'
    },
    confidence: 85,
    status: 'match',
    documents: ['Form 1120', 'Financial Statements']
  },
  {
    id: '2',
    importedName: 'Smith Family Trust',
    confidence: 0,
    status: 'new',
    documents: ['Form 1041', 'Trust Agreement']
  },
  {
    id: '3',
    importedName: 'Williams, John & Mary',
    existingClient: {
      id: 'c2',
      name: 'John Williams',
      email: 'john@williams.com'
    },
    confidence: 75,
    status: 'duplicate',
    documents: ['Form 1040', 'Schedule C']
  }
];

export function DataImportMapper() {
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [importStep, setImportStep] = useState<'source' | 'mapping' | 'review'>('source');
  const [matches, setMatches] = useState<ClientMatch[]>(mockMatches);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSource(sourceId);
    if (sourceId === 'csv') {
      setImportStep('mapping');
    }
  };

  const handleFileUpload = (file: File) => {
    setProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setProcessing(false);
      setImportStep('review');
      toast({
        title: "File processed",
        description: `Imported ${matches.length} client records for review`,
      });
    }, 2000);
  };

  const handleApiConnect = () => {
    const source = importSources.find(s => s.id === selectedSource);
    toast({
      title: "API Connection",
      description: `Connecting to ${source?.name}...`,
    });
    // Simulate API connection
    setTimeout(() => {
      setImportStep('review');
      toast({
        title: "Connected successfully",
        description: `Found ${matches.length} client records to import`,
      });
    }, 1500);
  };

  const updateMatchStatus = (matchId: string, status: ClientMatch['status']) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId ? { ...match, status } : match
    ));
  };

  const getStatusBadge = (status: ClientMatch['status']) => {
    const variants = {
      new: { color: 'bg-blue-500', text: 'New Client' },
      match: { color: 'bg-green-500', text: 'Match Found' },
      duplicate: { color: 'bg-yellow-500', text: 'Potential Duplicate' },
      conflict: { color: 'bg-red-500', text: 'Conflict' }
    };
    
    const variant = variants[status];
    return (
      <Badge className={`${variant.color} text-white`}>
        {variant.text}
      </Badge>
    );
  };

  if (importStep === 'source') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Import Source</h3>
          <p className="text-muted-foreground mb-4">
            Choose your accounting software or upload a CSV file to import client data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {importSources.map((source) => (
            <Card 
              key={source.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedSource === source.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSourceSelect(source.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  {source.icon}
                  {source.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {source.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {source.fields.slice(0, 3).map((field) => (
                    <Badge key={field} variant="secondary" className="text-xs">
                      {field.replace('_', ' ')}
                    </Badge>
                  ))}
                  {source.fields.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{source.fields.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedSource && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Import Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSource === 'csv' ? (
                <div>
                  <Label htmlFor="csv-upload">Upload CSV File</Label>
                  <FileUpload
                    onFileChange={handleFileUpload}
                    accept=".csv"
                    maxSize={10 * 1024 * 1024} // 10MB
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Supported formats: CSV with headers. Max file size: 10MB
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key">API Key / Connection String</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Enter your API credentials"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="server">Server / Environment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="sandbox">Sandbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleApiConnect} className="w-full">
                    Connect & Import
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (importStep === 'review') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Review Import Results</h3>
            <p className="text-muted-foreground">
              {matches.length} records found. Review matches and resolve conflicts before importing.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setImportStep('source')}>
              Back
            </Button>
            <Button>
              Import Selected ({matches.filter(m => m.status !== 'conflict').length})
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-600">New Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {matches.filter(m => m.status === 'new').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-600">Matches Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {matches.filter(m => m.status === 'match').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-yellow-600">Duplicates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {matches.filter(m => m.status === 'duplicate').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-600">Conflicts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {matches.filter(m => m.status === 'conflict').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {matches.map((match) => (
            <Card key={match.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{match.importedName}</h4>
                      {getStatusBadge(match.status)}
                      {match.confidence > 0 && (
                        <Badge variant="outline">
                          {match.confidence}% match
                        </Badge>
                      )}
                    </div>
                    
                    {match.existingClient && (
                      <div className="text-sm text-muted-foreground mb-2">
                        Matches existing: {match.existingClient.name} ({match.existingClient.email})
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      Documents: {match.documents.join(', ')}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select
                      value={match.status}
                      onValueChange={(value) => updateMatchStatus(match.id, value as ClientMatch['status'])}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Create New</SelectItem>
                        <SelectItem value="match">Use Match</SelectItem>
                        <SelectItem value="duplicate">Mark Duplicate</SelectItem>
                        <SelectItem value="conflict">Skip (Conflict)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
}