import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload,
  Users,
  FileSpreadsheet,
  Plus,
  ArrowRight
} from 'lucide-react';

interface CoachClientSetupStepProps {
  onNext: () => void;
}

export const CoachClientSetupStep: React.FC<CoachClientSetupStepProps> = ({ onNext }) => {
  const [setupMethod, setSetupMethod] = useState<'csv' | 'manual' | 'skip'>('manual');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [manualClients, setManualClients] = useState([
    { name: '', email: '', phone: '', businessType: '' }
  ]);

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const addManualClient = () => {
    setManualClients([...manualClients, { name: '', email: '', phone: '', businessType: '' }]);
  };

  const updateManualClient = (index: number, field: string, value: string) => {
    const updated = [...manualClients];
    updated[index] = { ...updated[index], [field]: value };
    setManualClients(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Add Your First Client</h1>
        <p className="text-lg text-muted-foreground">
          Set up your client base to start tracking progress and goals
        </p>
      </div>

      <Tabs value={setupMethod} onValueChange={(value) => setSetupMethod(value as 'csv' | 'manual' | 'skip')} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="csv">CSV Import</TabsTrigger>
          <TabsTrigger value="skip">Skip for Now</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Manual Client Entry
              </CardTitle>
              <CardDescription>
                Add your clients one by one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {manualClients.map((client, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Client Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={client.name}
                      onChange={(e) => updateManualClient(index, 'name', e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`email-${index}`}>Email</Label>
                    <Input
                      id={`email-${index}`}
                      type="email"
                      value={client.email}
                      onChange={(e) => updateManualClient(index, 'email', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`phone-${index}`}>Phone</Label>
                    <Input
                      id={`phone-${index}`}
                      value={client.phone}
                      onChange={(e) => updateManualClient(index, 'phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`businessType-${index}`}>Business Type</Label>
                    <Input
                      id={`businessType-${index}`}
                      value={client.businessType}
                      onChange={(e) => updateManualClient(index, 'businessType', e.target.value)}
                      placeholder="Technology, Retail, etc."
                    />
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addManualClient} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Client
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                CSV Import
              </CardTitle>
              <CardDescription>
                Upload a CSV file with your client data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Required CSV Columns:</h4>
                <p className="text-sm text-muted-foreground">
                  name, email, phone (optional), business_type (optional), goals (optional)
                </p>
              </div>
              
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="csv-upload"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">
                    {csvFile ? csvFile.name : 'Click to upload CSV file'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports .csv files up to 5MB
                  </p>
                </label>
              </div>

              <Button className="w-full" disabled={!csvFile}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Process CSV Import
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skip" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Skip Client Import</CardTitle>
              <CardDescription>
                You can add clients later from your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-muted/50 rounded-lg p-6">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No problem! You can easily add and manage clients from your dashboard once your account is set up.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-8">
        <Button 
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          Continue to Goal Setup
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};