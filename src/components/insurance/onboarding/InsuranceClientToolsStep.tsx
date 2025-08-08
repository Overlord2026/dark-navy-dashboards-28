import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Upload, 
  FileSpreadsheet, 
  Shield, 
  CheckCircle2,
  Mail,
  Lock
} from 'lucide-react';

export const InsuranceClientToolsStep = () => {
  const [importMethod, setImportMethod] = useState('manual');
  const [manualClient, setManualClient] = useState({
    name: '',
    email: '',
    phone: '',
    policyType: '',
    notes: ''
  });
  const [csvData, setCsvData] = useState('');
  const [enablePortal, setEnablePortal] = useState(true);
  const [clientsAdded, setClientsAdded] = useState(0);

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvData(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const addManualClient = () => {
    if (manualClient.name && manualClient.email && manualClient.phone) {
      setClientsAdded(prev => prev + 1);
      setManualClient({
        name: '',
        email: '',
        phone: '',
        policyType: '',
        notes: ''
      });
    }
  };

  const portalFeatures = [
    'Secure access to insurance policy documents',
    'Benefits summary and coverage details',
    'Claims status tracking and history',
    'Direct secure messaging with agent',
    'Educational resources and policy comparisons',
    'Renewal reminders and important updates'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-100 to-emerald-100 p-3 rounded-full">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Client Tools Setup</h2>
        <p className="text-lg text-muted-foreground">
          Add initial clients and assign them a secure portal with access to their insurance documents
        </p>
      </div>

      <div className="space-y-8">
        {/* Client Import/Entry */}
        <Card>
          <CardHeader>
            <CardTitle>Add Your Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={importMethod} onValueChange={setImportMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="csv">CSV Import</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Client Name *</Label>
                      <Input
                        id="client-name"
                        placeholder="Enter client name"
                        value={manualClient.name}
                        onChange={(e) => setManualClient(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-email">Email Address *</Label>
                      <Input
                        id="client-email"
                        type="email"
                        placeholder="client@email.com"
                        value={manualClient.email}
                        onChange={(e) => setManualClient(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="client-phone">Phone Number *</Label>
                      <Input
                        id="client-phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={manualClient.phone}
                        onChange={(e) => setManualClient(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policy-type">Primary Policy Type</Label>
                      <Input
                        id="policy-type"
                        placeholder="Life, Health, Medicare, etc."
                        value={manualClient.policyType}
                        onChange={(e) => setManualClient(prev => ({ ...prev, policyType: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-notes">Notes (Optional)</Label>
                    <Textarea
                      id="client-notes"
                      placeholder="Any additional notes about this client..."
                      value={manualClient.notes}
                      onChange={(e) => setManualClient(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  <Button 
                    onClick={addManualClient}
                    disabled={!manualClient.name || !manualClient.email || !manualClient.phone}
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </div>

                {clientsAdded > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        {clientsAdded} client{clientsAdded > 1 ? 's' : ''} added successfully
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Clients will receive portal invitations after setup is complete.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="csv" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="csv-upload" className="block mb-2">Upload Client Data</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload a CSV file with client information
                      </p>
                      <input
                        id="csv-upload"
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                        className="hidden"
                      />
                      <Button 
                        onClick={() => document.getElementById('csv-upload')?.click()}
                        variant="outline"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Choose CSV File
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Required CSV Columns:</h4>
                    <div className="grid gap-1 md:grid-cols-2 text-sm text-blue-700">
                      <div>• Name (required)</div>
                      <div>• Email (required)</div>
                      <div>• Phone (required)</div>
                      <div>• Policy Type (optional)</div>
                      <div>• Notes (optional)</div>
                      <div>• Policy Number (optional)</div>
                    </div>
                  </div>

                  {csvData && (
                    <div>
                      <Label className="block mb-2">Preview Data:</Label>
                      <Textarea 
                        value={csvData.substring(0, 500)}
                        readOnly
                        className="h-32"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Showing first 500 characters... {csvData.length} total characters
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Client Portal Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Secure Client Portal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <input 
                  type="checkbox"
                  id="enable-portal"
                  checked={enablePortal}
                  onChange={(e) => setEnablePortal(e.target.checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="enable-portal" className="font-medium cursor-pointer">
                    Enable secure client portal access
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Give your clients secure access to their insurance documents, benefits summaries, 
                    and direct communication with you through an encrypted platform.
                  </p>
                </div>
              </div>

              {enablePortal && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-3">
                      Your clients will have access to:
                    </h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      {portalFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Security & Compliance:</h4>
                    <div className="flex items-center space-x-2 text-sm text-green-700">
                      <Lock className="h-4 w-4" />
                      <span>Bank-level encryption, HIPAA compliance, and secure authentication</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Setup Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-6">Client Tools Setup Summary</h3>
              
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {csvData ? '📊' : clientsAdded}
                  </div>
                  <div className="font-medium text-blue-800">Clients</div>
                  <div className="text-sm text-blue-600">
                    {csvData ? 'CSV Ready' : `${clientsAdded} Added`}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {enablePortal ? '✓' : '○'}
                  </div>
                  <div className="font-medium text-green-800">Portal Access</div>
                  <div className="text-sm text-green-600">
                    {enablePortal ? 'Enabled' : 'Disabled'}
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">🚀</div>
                  <div className="font-medium text-purple-800">Ready</div>
                  <div className="text-sm text-purple-600">Setup Marketplace</div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                You can always add more clients and modify portal settings later through your dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};