import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  Settings,
  Database,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImportSource {
  id: string;
  name: string;
  type: 'tax' | 'bookkeeping' | 'banking';
  icon: string;
  supported: boolean;
  description: string;
}

interface FieldMapping {
  source: string;
  target: string;
  required: boolean;
  mapped: boolean;
}

const importSources: ImportSource[] = [
  {
    id: 'drake',
    name: 'Drake Tax',
    type: 'tax',
    icon: '🔥',
    supported: true,
    description: 'Import client data and prior year returns from Drake Tax software'
  },
  {
    id: 'cch',
    name: 'CCH ProSystem fx',
    type: 'tax',
    icon: '📊',
    supported: true,
    description: 'Import tax return data from CCH ProSystem fx'
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    type: 'bookkeeping',
    icon: '📚',
    supported: true,
    description: 'Import financial data from QuickBooks Online and Desktop'
  },
  {
    id: 'xero',
    name: 'Xero',
    type: 'bookkeeping',
    icon: '💼',
    supported: true,
    description: 'Import accounting data from Xero cloud accounting'
  },
  {
    id: 'lacerte',
    name: 'Lacerte Tax',
    type: 'tax',
    icon: '📋',
    supported: false,
    description: 'Coming soon - Import from Lacerte Tax software'
  },
  {
    id: 'ultratax',
    name: 'UltraTax CS',
    type: 'tax',
    icon: '⚡',
    supported: false,
    description: 'Coming soon - Import from UltraTax CS'
  }
];

const defaultMappings: FieldMapping[] = [
  { source: 'FirstName', target: 'first_name', required: true, mapped: false },
  { source: 'LastName', target: 'last_name', required: true, mapped: false },
  { source: 'Email', target: 'email', required: true, mapped: false },
  { source: 'Phone', target: 'phone', required: false, mapped: false },
  { source: 'Address', target: 'address', required: false, mapped: false },
  { source: 'SSN', target: 'ssn', required: true, mapped: false },
  { source: 'FilingStatus', target: 'filing_status', required: true, mapped: false }
];

export function DataImportMapperEnhanced() {
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>(defaultMappings);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<any>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} ready for import`,
      });
    }
  };

  const updateFieldMapping = (index: number, target: string) => {
    setFieldMappings(prev => prev.map((mapping, i) => 
      i === index ? { ...mapping, target, mapped: true } : mapping
    ));
  };

  const handleImport = async () => {
    if (!selectedSource || !uploadedFile) {
      toast({
        title: "Missing requirements",
        description: "Please select a source system and upload a file",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    setImportProgress(0);

    try {
      // Simulate import progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Simulate API call to import data
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setImportProgress(100);

      const mockResults = {
        totalRecords: 156,
        successfulImports: 142,
        failedImports: 14,
        duplicates: 8,
        newClients: 134
      };

      setImportResults(mockResults);

      toast({
        title: "Import completed",
        description: `Successfully imported ${mockResults.successfulImports} records`,
      });
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const sourcesByType = importSources.reduce((acc, source) => {
    if (!acc[source.type]) acc[source.type] = [];
    acc[source.type].push(source);
    return acc;
  }, {} as Record<string, ImportSource[]>);

  const mappedFields = fieldMappings.filter(m => m.mapped).length;
  const requiredMapped = fieldMappings.filter(m => m.required && m.mapped).length;
  const requiredTotal = fieldMappings.filter(m => m.required).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Database className="w-5 h-5" />
            Tax & Bookkeeping Data Importer
          </h3>
          <p className="text-muted-foreground">
            Import client data from various tax and accounting software systems
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {Object.values(sourcesByType).flat().filter(s => s.supported).length} Sources Supported
        </Badge>
      </div>

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sources">Select Source</TabsTrigger>
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
          <TabsTrigger value="import">Import & Results</TabsTrigger>
        </TabsList>

        {/* Source Selection */}
        <TabsContent value="sources" className="space-y-6">
          {Object.entries(sourcesByType).map(([type, sources]) => (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="capitalize">
                  {type === 'tax' ? 'Tax Software' : type === 'bookkeeping' ? 'Accounting Software' : 'Banking Systems'}
                </CardTitle>
                <CardDescription>
                  Import client data from {type} systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sources.map((source) => (
                    <Card
                      key={source.id}
                      className={`cursor-pointer transition-all ${
                        selectedSource === source.id 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'hover:border-primary/50'
                      } ${!source.supported ? 'opacity-50' : ''}`}
                      onClick={() => source.supported && setSelectedSource(source.id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <span className="text-2xl">{source.icon}</span>
                          {source.name}
                          {!source.supported && (
                            <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          {source.description}
                        </p>
                        {selectedSource === source.id && (
                          <Badge className="mt-2 text-xs">Selected</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* File Upload */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Data File
              </CardTitle>
              <CardDescription>
                Upload your exported data file from {importSources.find(s => s.id === selectedSource)?.name || 'selected source'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedSource ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Please select a source system first</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <div className="space-y-2">
                      <h4 className="font-medium">Upload your data file</h4>
                      <p className="text-sm text-muted-foreground">
                        Supported formats: CSV, XLS, XLSX, TXT
                      </p>
                      <Input
                        type="file"
                        accept=".csv,.xls,.xlsx,.txt"
                        onChange={handleFileUpload}
                        className="max-w-sm mx-auto"
                      />
                    </div>
                  </div>

                  {uploadedFile && (
                    <Card className="border-green-500 bg-green-50">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-700">{uploadedFile.name}</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {Math.round(uploadedFile.size / 1024)} KB
                          </Badge>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          File ready for mapping and import
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      {importSources.find(s => s.id === selectedSource)?.name} Export Instructions:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Export client list with contact information</li>
                      <li>• Include basic taxpayer data (SSN, filing status)</li>
                      <li>• Ensure all required fields are populated</li>
                      <li>• Save as CSV format for best compatibility</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Field Mapping */}
        <TabsContent value="mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Field Mapping Configuration
              </CardTitle>
              <CardDescription>
                Map fields from your source file to the platform's data structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Mapping Progress</span>
                <span>{mappedFields}/{fieldMappings.length} fields mapped</span>
              </div>
              <Progress value={(mappedFields / fieldMappings.length) * 100} className="h-2" />
              
              <div className="space-y-3">
                {fieldMappings.map((mapping, index) => (
                  <div key={mapping.source} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{mapping.source}</div>
                      <div className="text-xs text-muted-foreground">Source field</div>
                    </div>
                    <div className="text-muted-foreground">→</div>
                    <div className="flex-1">
                      <select
                        value={mapping.target}
                        onChange={(e) => updateFieldMapping(index, e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-md"
                      >
                        <option value="">Select target field...</option>
                        <option value="first_name">First Name</option>
                        <option value="last_name">Last Name</option>
                        <option value="email">Email Address</option>
                        <option value="phone">Phone Number</option>
                        <option value="address">Address</option>
                        <option value="ssn">SSN</option>
                        <option value="filing_status">Filing Status</option>
                        <option value="spouse_name">Spouse Name</option>
                        <option value="spouse_ssn">Spouse SSN</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      {mapping.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                      {mapping.mapped && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Mapping Status</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  {requiredMapped}/{requiredTotal} required fields mapped. 
                  {requiredMapped < requiredTotal ? ' Please map all required fields before importing.' : ' Ready to import!'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import & Results */}
        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Import Data
              </CardTitle>
              <CardDescription>
                Review settings and start the import process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!importing && !importResults && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Import Summary:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• Source: {importSources.find(s => s.id === selectedSource)?.name}</p>
                      <p>• File: {uploadedFile?.name}</p>
                      <p>• Mapped fields: {mappedFields}/{fieldMappings.length}</p>
                      <p>• Required fields: {requiredMapped}/{requiredTotal}</p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleImport}
                    disabled={!uploadedFile || requiredMapped < requiredTotal}
                    className="w-full"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Start Import Process
                  </Button>
                </div>
              )}

              {importing && (
                <div className="space-y-4">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <h4 className="font-medium">Importing Data...</h4>
                    <p className="text-sm text-muted-foreground">
                      Processing {uploadedFile?.name}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Import Progress</span>
                      <span>{Math.round(importProgress)}%</span>
                    </div>
                    <Progress value={importProgress} className="h-2" />
                  </div>
                </div>
              )}

              {importResults && (
                <div className="space-y-4">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h4 className="font-medium text-green-700">Import Completed</h4>
                    <p className="text-sm text-muted-foreground">
                      Data import finished successfully
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {importResults.totalRecords}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Records</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {importResults.successfulImports}
                        </div>
                        <div className="text-xs text-muted-foreground">Successful</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {importResults.failedImports}
                        </div>
                        <div className="text-xs text-muted-foreground">Failed</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {importResults.newClients}
                        </div>
                        <div className="text-xs text-muted-foreground">New Clients</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                    <Button 
                      onClick={() => {
                        setImportResults(null);
                        setUploadedFile(null);
                        setSelectedSource('');
                        setFieldMappings(defaultMappings);
                      }}
                      className="flex-1"
                    >
                      Import More Data
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}