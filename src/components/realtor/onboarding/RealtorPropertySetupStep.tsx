import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload,
  Building2,
  FileSpreadsheet,
  Plus,
  ArrowRight
} from 'lucide-react';

interface RealtorPropertySetupStepProps {
  onNext: () => void;
}

export const RealtorPropertySetupStep: React.FC<RealtorPropertySetupStepProps> = ({ onNext }) => {
  const [uploadMethod, setUploadMethod] = useState<'csv' | 'manual' | 'skip'>('csv');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [manualProperties, setManualProperties] = useState([
    { address: '', type: '', status: '', price: '' }
  ]);

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const addManualProperty = () => {
    setManualProperties([...manualProperties, { address: '', type: '', status: '', price: '' }]);
  };

  const updateManualProperty = (index: number, field: string, value: string) => {
    const updated = [...manualProperties];
    updated[index] = { ...updated[index], [field]: value };
    setManualProperties(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Upload Your Property List</h1>
        <p className="text-lg text-muted-foreground">
          Import your current properties to get started quickly
        </p>
      </div>

      <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as 'csv' | 'manual' | 'skip')} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="csv">CSV Import</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="skip">Skip for Now</TabsTrigger>
        </TabsList>

        <TabsContent value="csv" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                CSV Import
              </CardTitle>
              <CardDescription>
                Upload a CSV file with your property data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Required CSV Columns:</h4>
                <p className="text-sm text-muted-foreground">
                  address, property_type, status, price, square_feet (optional), bedrooms (optional), bathrooms (optional)
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
                    Supports .csv files up to 10MB
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

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Manual Property Entry
              </CardTitle>
              <CardDescription>
                Add your properties one by one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {manualProperties.map((property, index) => (
                <div key={index} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor={`address-${index}`}>Property Address</Label>
                    <Input
                      id={`address-${index}`}
                      value={property.address}
                      onChange={(e) => updateManualProperty(index, 'address', e.target.value)}
                      placeholder="123 Main St, City, State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`type-${index}`}>Property Type</Label>
                    <Input
                      id={`type-${index}`}
                      value={property.type}
                      onChange={(e) => updateManualProperty(index, 'type', e.target.value)}
                      placeholder="Residential, Commercial, Land"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`status-${index}`}>Status</Label>
                    <Input
                      id={`status-${index}`}
                      value={property.status}
                      onChange={(e) => updateManualProperty(index, 'status', e.target.value)}
                      placeholder="Active, Pending, Sold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`price-${index}`}>Price</Label>
                    <Input
                      id={`price-${index}`}
                      value={property.price}
                      onChange={(e) => updateManualProperty(index, 'price', e.target.value)}
                      placeholder="$450,000"
                    />
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addManualProperty} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Property
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skip" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Skip Property Import</CardTitle>
              <CardDescription>
                You can add properties later from your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-muted/50 rounded-lg p-6">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No problem! You can easily add and manage properties from your dashboard once your account is set up.
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
          Complete Setup
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};