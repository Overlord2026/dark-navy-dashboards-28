import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';
import { recordReceipt } from '@/features/receipts/record';

interface TaxStage {
  id: 'intake' | 'mapping' | 'export';
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

interface TaxDocument {
  id: string;
  name: string;
  type: string;
  status: 'uploaded' | 'processing' | 'mapped' | 'error';
  uploadedAt: string;
}

export const TaxHubDIYTool: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<'intake' | 'mapping' | 'export'>('intake');
  const [documents, setDocuments] = useState<TaxDocument[]>([]);
  const [taxYear, setTaxYear] = useState(2024);
  const [filingStatus, setFilingStatus] = useState('married_filing_jointly');

  const stages: TaxStage[] = [
    {
      id: 'intake',
      title: 'Document Intake',
      description: 'Upload and organize tax documents',
      status: currentStage === 'intake' ? 'current' : documents.length > 0 ? 'completed' : 'pending'
    },
    {
      id: 'mapping',
      title: 'Data Mapping', 
      description: 'Map documents to tax forms',
      status: currentStage === 'mapping' ? 'current' : currentStage === 'export' ? 'completed' : 'pending'
    },
    {
      id: 'export',
      title: 'Export & Review',
      description: 'Generate tax forms and supporting documents',
      status: currentStage === 'export' ? 'current' : 'pending'
    }
  ];

  useEffect(() => {
    // Load demo data
    const demoDocuments: TaxDocument[] = [
      {
        id: '1',
        name: 'Form W-2 - Primary Employer',
        type: 'W-2',
        status: 'mapped',
        uploadedAt: '2024-12-15T10:00:00Z'
      },
      {
        id: '2', 
        name: 'Form 1099-DIV - Investment Account',
        type: '1099-DIV',
        status: 'mapped',
        uploadedAt: '2024-12-15T10:05:00Z'
      },
      {
        id: '3',
        name: 'Form 1099-INT - Savings Account',
        type: '1099-INT',
        status: 'processing',
        uploadedAt: '2024-12-15T10:10:00Z'
      }
    ];
    
    setDocuments(demoDocuments);
  }, []);

  const handleStageComplete = (stage: 'intake' | 'mapping' | 'export') => {
    let receiptType = '';
    let action = '';

    switch (stage) {
      case 'intake':
        receiptType = 'INTAKE_OK';
        action = 'tax_intake_completed';
        setCurrentStage('mapping');
        break;
      case 'mapping':
        receiptType = 'MAP_OK';
        action = 'tax_mapping_completed';
        setCurrentStage('export');
        break;
      case 'export':
        receiptType = 'EXPORT_OK';
        action = 'tax_export_completed';
        break;
    }

    // Record staged proof
    const receipt = recordReceipt({
      id: `tax_${stage}_${Date.now()}`,
      type: 'Decision-RDS',
      timestamp: new Date().toISOString(),
      payload: {
        action,
        stage,
        receipt_type: receiptType,
        tax_year: taxYear,
        filing_status: filingStatus,
        document_count: documents.length
      },
      inputs_hash: `tax_${stage}_${Date.now()}`,
      policy_version: 'v1.0'
    });

    analytics.track('family.tax.stage_completed', {
      stage,
      receipt_type: receiptType,
      tax_year: taxYear
    });

    toast.success(`${stages.find(s => s.id === stage)?.title} completed!`);
  };

  const handleUploadDocument = () => {
    const newDoc: TaxDocument = {
      id: `doc_${Date.now()}`,
      name: 'Form 1099-R - Retirement Distribution',
      type: '1099-R',
      status: 'uploaded',
      uploadedAt: new Date().toISOString()
    };

    setDocuments(prev => [...prev, newDoc]);
    toast.success('Document uploaded successfully');
  };

  const exportTaxPackage = () => {
    const exportData = {
      tax_year: taxYear,
      filing_status: filingStatus,
      documents: documents,
      generated_at: new Date().toISOString(),
      forms: [
        'Form 1040 - U.S. Individual Income Tax Return',
        'Schedule A - Itemized Deductions',
        'Schedule B - Interest and Ordinary Dividends',
        'Form 8606 - Nondeductible IRAs'
      ]
    };

    // Create CSV export
    const csv = [
      'Document Type,Status,Upload Date',
      ...documents.map(doc => `${doc.type},${doc.status},${doc.uploadedAt}`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax_package_${taxYear}.csv`;
    a.click();

    handleStageComplete('export');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'current': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default: return null;
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'mapped': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'uploaded': return <Upload className="h-4 w-4 text-blue-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const completedStages = stages.filter(s => s.status === 'completed').length;
  const progressPercent = (completedStages / stages.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tax Hub DIY</h1>
          <p className="text-muted-foreground">Self-service tax preparation and planning</p>
        </div>
        <Badge variant="secondary">Demo Mode</Badge>
      </div>

      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Preparation Progress</CardTitle>
          <div className="space-y-2">
            <Progress value={progressPercent} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {completedStages} of {stages.length} stages completed
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stages.map((stage) => (
              <div 
                key={stage.id}
                className={`p-4 rounded-lg border ${
                  stage.status === 'current' ? 'border-blue-500 bg-blue-50' :
                  stage.status === 'completed' ? 'border-green-500 bg-green-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(stage.status)}
                  <h3 className="font-medium">{stage.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={currentStage} onValueChange={(value) => setCurrentStage(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="intake" disabled={stages[0].status === 'pending'}>
            Document Intake
          </TabsTrigger>
          <TabsTrigger value="mapping" disabled={stages[1].status === 'pending'}>
            Data Mapping
          </TabsTrigger>
          <TabsTrigger value="export" disabled={stages[2].status === 'pending'}>
            Export & Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="intake" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Document Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxYear">Tax Year</Label>
                  <Input
                    id="taxYear"
                    type="number"
                    value={taxYear}
                    onChange={(e) => setTaxYear(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="filingStatus">Filing Status</Label>
                  <select 
                    id="filingStatus"
                    value={filingStatus}
                    onChange={(e) => setFilingStatus(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="single">Single</option>
                    <option value="married_filing_jointly">Married Filing Jointly</option>
                    <option value="married_filing_separately">Married Filing Separately</option>
                    <option value="head_of_household">Head of Household</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Uploaded Documents</h4>
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getDocumentStatusIcon(doc.status)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.type}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {doc.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUploadDocument} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
                <Button onClick={() => handleStageComplete('intake')}>
                  Complete Intake
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Data Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Review and map your uploaded documents to the appropriate tax forms.
              </p>

              <div className="space-y-3">
                {documents.filter(doc => doc.status === 'mapped').map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-green-700">Mapped to Form 1040</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Mapped</Badge>
                  </div>
                ))}
              </div>

              <Button onClick={() => handleStageComplete('mapping')}>
                Complete Mapping
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export & Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Generate your tax forms and supporting documentation.
              </p>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Generated Forms:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Form 1040 - U.S. Individual Income Tax Return</li>
                  <li>• Schedule A - Itemized Deductions</li>
                  <li>• Schedule B - Interest and Ordinary Dividends</li>
                  <li>• Form 8606 - Nondeductible IRAs</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button onClick={exportTaxPackage}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Tax Package
                </Button>
                <Button variant="outline">
                  Preview Forms
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};