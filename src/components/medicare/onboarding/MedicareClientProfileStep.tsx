import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Users, UserPlus, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export const MedicareClientProfileStep = () => {
  const [importMethod, setImportMethod] = useState('manual');
  const [csvData, setCsvData] = useState('');
  const [manualClient, setManualClient] = useState({
    name: '',
    email: '',
    phone: '',
    planType: ''
  });
  const [inviteClients, setInviteClients] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-100 to-emerald-100 p-3 rounded-full">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Client Profile Options</h2>
        <p className="text-lg text-muted-foreground">
          Import your existing clients or start fresh with manual entry
        </p>
      </div>

      <Tabs value={importMethod} onValueChange={setImportMethod} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="csv">Import via CSV</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="csv" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileSpreadsheet className="h-5 w-5" />
                <span>CSV Import</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                      Choose CSV File
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Required CSV Columns:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Name (required)</li>
                    <li>• Email (required)</li>
                    <li>• Phone (required)</li>
                    <li>• Plan Type (Medicare Supplement, Medicare Advantage, etc.)</li>
                    <li>• Notes (optional)</li>
                  </ul>
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
                      Showing first 500 characters...
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>Add Client Manually</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  <Label htmlFor="plan-type">Plan Type</Label>
                  <Input
                    id="plan-type"
                    placeholder="Medicare Supplement, Advantage, etc."
                    value={manualClient.planType}
                    onChange={(e) => setManualClient(prev => ({ ...prev, planType: e.target.value }))}
                  />
                </div>
              </div>
              <Button className="w-full mt-4">
                Add Client
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Client Portal Invitation */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Client Portal Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input 
                type="checkbox"
                id="invite-clients"
                checked={inviteClients}
                onChange={(e) => setInviteClients(e.target.checked)}
                className="mt-1"
              />
              <div>
                <label htmlFor="invite-clients" className="font-medium cursor-pointer">
                  Invite clients to join their own BFO portal (Optional)
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  Your clients will get access to educational resources, secure document sharing, 
                  and the ability to communicate with you through the platform.
                </p>
              </div>
            </div>

            {inviteClients && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Client Portal Benefits:</span>
                </div>
                <ul className="text-sm text-green-700 space-y-1 ml-6">
                  <li>• Access to Medicare education resources</li>
                  <li>• Secure document upload and sharing</li>
                  <li>• Direct communication with you</li>
                  <li>• Plan comparison tools</li>
                  <li>• Renewal reminders and notifications</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to proceed?</h3>
            <p className="text-sm text-muted-foreground">
              You can always add more clients later through your dashboard. 
              Let's set up your marketing preferences next.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};