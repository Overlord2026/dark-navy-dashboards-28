import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Loader2,
  X,
  Download,
  Users,
  HeadphonesIcon,
  Calendar,
  Video
} from 'lucide-react';
import { toast } from 'sonner';

interface PlanImportWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanImportWizard({ open, onOpenChange }: PlanImportWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'csv' | 'pdf' | null>(null);
  const [parseLoading, setParseLoading] = useState(false);
  const [migrationData, setMigrationData] = useState<any>(null);

  const steps = [
    { id: 1, title: 'Upload Method', description: 'Choose how to import your plans' },
    { id: 2, title: 'Upload File', description: 'Upload your plan data' },
    { id: 3, title: 'Review & Map', description: 'Verify the imported data' },
    { id: 4, title: 'Assign Clients', description: 'Link plans to your clients' },
    { id: 5, title: 'Complete', description: 'Import successful' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (importType === 'pdf') {
        handlePDFParse(file);
      } else {
        setCurrentStep(3);
      }
    }
  };

  const handlePDFParse = async (file: File) => {
    setParseLoading(true);
    try {
      // Simulate PDF parsing with edge function
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock parsed data
      setMigrationData({
        client_name: 'John Smith',
        current_age: 45,
        retirement_age: 65,
        current_assets: 750000,
        monthly_contribution: 3000,
        risk_tolerance: 'moderate',
        goals: 'Comfortable retirement with travel fund'
      });
      
      setCurrentStep(3);
      toast.success('PDF successfully parsed! Please review the extracted data.');
    } catch (error) {
      toast.error('Error parsing PDF. Please try CSV import or contact support.');
    } finally {
      setParseLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const csvContent = `client_name,current_age,retirement_age,current_assets,monthly_contribution,risk_tolerance,goals
John Smith,45,65,750000,3000,moderate,Comfortable retirement
Jane Doe,52,62,1200000,4500,conservative,Early retirement
`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'retirement-plan-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded! Fill in your data and upload.');
  };

  const handleRequestConcierge = () => {
    toast.success('Concierge migration request submitted! We\'ll contact you within 24 hours.');
    onOpenChange(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">How would you like to import your plans?</h3>
              <p className="text-muted-foreground">Choose the method that works best for your data</p>
            </div>
            
            <div className="grid gap-4">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${importType === 'csv' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setImportType('csv')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">CSV/Excel Import</h4>
                      <p className="text-sm text-muted-foreground">
                        Use our template or upload from MoneyGuidePro, eMoney, RightCapital
                      </p>
                    </div>
                    {importType === 'csv' && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${importType === 'pdf' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setImportType('pdf')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">PDF Report Upload</h4>
                      <p className="text-sm text-muted-foreground">
                        AI-powered parsing of plan summaries and reports
                      </p>
                    </div>
                    {importType === 'pdf' && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleRequestConcierge}>
                <HeadphonesIcon className="h-4 w-4 mr-2" />
                Request Concierge Service
              </Button>
              <Button 
                onClick={() => setCurrentStep(2)} 
                disabled={!importType}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Upload Your {importType === 'csv' ? 'CSV/Excel' : 'PDF'} File
              </h3>
              <p className="text-muted-foreground">
                {importType === 'csv' 
                  ? 'Select your exported plan data file'
                  : 'Upload a plan summary or report PDF'
                }
              </p>
            </div>

            {importType === 'csv' && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Need a template?</p>
                        <p className="text-sm text-muted-foreground">Download our CSV template to get started</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                      Download Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-semibold mb-2">
                Drop your {importType === 'csv' ? 'CSV/Excel' : 'PDF'} file here
              </h4>
              <p className="text-muted-foreground mb-4">
                or click to browse your files
              </p>
              <Input 
                type="file" 
                accept={importType === 'csv' ? '.csv,.xlsx,.xls' : '.pdf'}
                onChange={handleFileUpload}
                className="max-w-xs mx-auto"
              />
            </div>

            {uploadedFile && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setUploadedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {parseLoading && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Parsing PDF with AI...</p>
                      <p className="text-sm text-blue-700">
                        Extracting retirement plan data from your document
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep(3)} 
                disabled={!uploadedFile || parseLoading}
              >
                {parseLoading ? 'Processing...' : 'Continue'}
                {!parseLoading && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Review Imported Data</h3>
              <p className="text-muted-foreground">
                Verify the plan details before importing
              </p>
            </div>

            {migrationData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Plan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Client Name</Label>
                      <Input value={migrationData.client_name} onChange={() => {}} />
                    </div>
                    <div>
                      <Label>Current Age</Label>
                      <Input value={migrationData.current_age} onChange={() => {}} />
                    </div>
                    <div>
                      <Label>Retirement Age</Label>
                      <Input value={migrationData.retirement_age} onChange={() => {}} />
                    </div>
                    <div>
                      <Label>Current Assets</Label>
                      <Input value={`$${migrationData.current_assets.toLocaleString()}`} onChange={() => {}} />
                    </div>
                    <div>
                      <Label>Monthly Contribution</Label>
                      <Input value={`$${migrationData.monthly_contribution.toLocaleString()}`} onChange={() => {}} />
                    </div>
                    <div>
                      <Label>Risk Tolerance</Label>
                      <Input value={migrationData.risk_tolerance} onChange={() => {}} />
                    </div>
                  </div>
                  <div>
                    <Label>Goals</Label>
                    <Textarea value={migrationData.goals} onChange={() => {}} />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(4)}>
                Import Plan
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Plan Successfully Imported!</h3>
              <p className="text-muted-foreground">
                Your retirement plan has been imported and is ready for analysis
              </p>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Plan imported for:</span>
                    <Badge variant="secondary">{migrationData?.client_name}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Current assets:</span>
                    <span className="font-semibold">${migrationData?.current_assets?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Retirement timeline:</span>
                    <span className="font-semibold">{migrationData?.retirement_age - migrationData?.current_age} years</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3">
              <Button className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Open Retirement Analyzer
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Assign to Client Record
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
                Import Another Plan
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Existing Plans
          </DialogTitle>
          <DialogDescription>
            Migrate your retirement plans from other platforms in minutes
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.slice(0, 4).map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
              </div>
              {index < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}