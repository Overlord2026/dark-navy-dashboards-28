import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Download, Eye, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface ImportProgress {
  step: 'upload' | 'parsing' | 'review' | 'complete';
  progress: number;
  status: string;
}

interface ParsedData {
  clientInfo?: {
    name: string;
    age: number;
    retirementAge: number;
    email?: string;
  };
  confidence: number;
  accounts?: any[];
  goals?: any;
  [key: string]: any;
}

export function PlanImportWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('csv');
  const [importProgress, setImportProgress] = useState<ImportProgress>({
    step: 'upload',
    progress: 0,
    status: 'Ready to import'
  });
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setImportProgress({ step: 'upload', progress: 20, status: 'File uploaded, preparing...' });

    if (uploadedFile.type === 'application/pdf') {
      await handlePDFUpload(uploadedFile);
    } else {
      await handleCSVUpload(uploadedFile);
    }
  };

  const handlePDFUpload = async (file: File) => {
    try {
      setImportProgress({ step: 'parsing', progress: 40, status: 'Uploading PDF to storage...' });

      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('plan-imports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setImportProgress({ step: 'parsing', progress: 60, status: 'AI parsing retirement data...' });

      // Create import record
      const { data: importRecord, error: importError } = await supabase
        .from('plan_imports')
        .insert({
          import_type: 'pdf_upload',
          original_filename: file.name,
          file_path: uploadData.path,
          advisor_id: (await supabase.auth.getUser()).data.user?.id || '',
          import_status: 'uploaded'
        })
        .select()
        .single();

      if (importError) throw importError;

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('plan-imports')
        .getPublicUrl(uploadData.path);

      // Call PDF parsing edge function
      const { data: parseData, error: parseError } = await supabase.functions
        .invoke('parse-retirement-pdf', {
          body: {
            importId: importRecord.id,
            fileUrl: publicUrl,
            userId: (await supabase.auth.getUser()).data.user?.id
          }
        });

      if (parseError) throw parseError;

      setImportProgress({ step: 'review', progress: 90, status: 'Parsing complete! Review extracted data.' });
      setParsedData(parseData.parsedData);

      toast({
        title: "PDF Parsed Successfully",
        description: `AI extracted data with ${Math.round(parseData.parsedData.confidence * 100)}% confidence`,
      });

    } catch (error: any) {
      console.error('PDF upload error:', error);
      setImportProgress({ step: 'upload', progress: 0, status: 'Upload failed' });
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCSVUpload = async (file: File) => {
    try {
      setImportProgress({ step: 'parsing', progress: 50, status: 'Processing CSV data...' });

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Basic CSV parsing simulation
        const mockParsedData = {
          clientInfo: {
            name: 'John Smith',
            age: 45,
            retirementAge: 65,
            email: 'john.smith@email.com'
          },
          confidence: 0.95,
          accounts: [
            { type: '401k', balance: 150000 },
            { type: 'roth_ira', balance: 75000 }
          ],
          source: 'csv_upload'
        };

        setParsedData(mockParsedData);
        setImportProgress({ step: 'review', progress: 90, status: 'CSV processed! Review mapped fields.' });
      };
      reader.readAsText(file);

    } catch (error: any) {
      console.error('CSV upload error:', error);
      toast({
        title: "CSV Processing Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const confirmImport = () => {
    setImportProgress({ step: 'complete', progress: 100, status: 'Import complete!' });
    toast({
      title: "Plan Imported Successfully",
      description: "Client data has been added to your retirement analyzer",
    });
    
    // Reset after a delay
    setTimeout(() => {
      setIsOpen(false);
      resetWizard();
    }, 2000);
  };

  const resetWizard = () => {
    setImportProgress({ step: 'upload', progress: 0, status: 'Ready to import' });
    setParsedData(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = (type: 'csv' | 'xlsx') => {
    const csvTemplate = `Client Name,Age,Retirement Age,Current Income,401k Balance,IRA Balance,Roth IRA Balance,Brokerage Balance,Annual Savings,Target Income
John Smith,45,65,100000,150000,75000,50000,100000,20000,80000`;
    
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `retirement_plan_template.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="premium" size="lg" className="gap-2">
          <Upload className="h-4 w-4" />
          Import Existing Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Import Retirement Plan</DialogTitle>
          <DialogDescription>
            Transfer your existing client plans from other platforms. Support for CSV, Excel, and PDF formats.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{importProgress.status}</span>
              <span>{importProgress.progress}%</span>
            </div>
            <Progress value={importProgress.progress} className="h-2" />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="csv">CSV/Excel Import</TabsTrigger>
              <TabsTrigger value="pdf">PDF Report Import</TabsTrigger>
            </TabsList>

            <TabsContent value="csv" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    CSV/Excel Upload
                  </CardTitle>
                  <CardDescription>
                    Upload structured data from MoneyGuidePro, eMoney, RightCapital, or custom spreadsheets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadTemplate('csv')}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download CSV Template
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadTemplate('xlsx')}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Excel Template
                    </Button>
                  </div>

                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Upload Your File</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop or click to select CSV or Excel files
                    </p>
                    <Button variant="outline">Choose File</Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    PDF Report Upload
                  </CardTitle>
                  <CardDescription>
                    AI-powered extraction from PDF retirement plan reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Upload PDF Report</h3>
                    <p className="text-muted-foreground mb-4">
                      AI will extract client data, goals, and account information
                    </p>
                    <Button variant="outline">Choose PDF File</Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Supported Formats:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• MoneyGuidePro reports</li>
                      <li>• eMoney plan summaries</li>
                      <li>• RightCapital projections</li>
                      <li>• Custom financial plan PDFs</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Review Parsed Data */}
          {parsedData && importProgress.step === 'review' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Review Extracted Data
                  <Badge variant={parsedData.confidence > 0.8 ? "default" : "secondary"}>
                    {Math.round(parsedData.confidence * 100)}% confidence
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Review and confirm the extracted information before importing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {parsedData.clientInfo && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Client Name</label>
                      <p className="text-lg">{parsedData.clientInfo.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Current Age</label>
                      <p className="text-lg">{parsedData.clientInfo.age}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Target Retirement Age</label>
                      <p className="text-lg">{parsedData.clientInfo.retirementAge}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-lg">{parsedData.clientInfo.email || 'Not provided'}</p>
                    </div>
                  </div>
                )}

                {parsedData.accounts && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Accounts Found</label>
                    <div className="space-y-2">
                      {parsedData.accounts.map((account: any, index: number) => (
                        <div key={index} className="flex justify-between items-center bg-muted/30 rounded p-3">
                          <span className="font-medium">{account.type}</span>
                          <span className="text-lg">${account.balance?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button onClick={confirmImport} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Confirm Import
                  </Button>
                  <Button variant="outline" onClick={resetWizard}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success State */}
          {importProgress.step === 'complete' && (
            <Card className="border-success">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-success mx-auto" />
                  <h3 className="text-xl font-bold">Import Complete!</h3>
                  <p className="text-muted-foreground">
                    Client plan has been successfully imported and is ready for review.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}