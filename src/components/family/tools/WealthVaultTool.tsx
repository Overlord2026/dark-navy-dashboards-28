import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Upload, 
  Download, 
  FileText, 
  Lock, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Folder
} from 'lucide-react';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';
import { recordReceipt } from '@/features/receipts/record';

interface VaultDocument {
  id: string;
  name: string;
  type: 'will' | 'trust' | 'insurance' | 'investment' | 'tax' | 'estate';
  category: 'Keep-Safe' | 'Working' | 'Archive';
  uploadedAt: string;
  size: number;
  encrypted: boolean;
  shared: boolean;
}

interface DocumentType {
  id: string;
  name: string;
  description: string;
  category: 'Keep-Safe' | 'Working';
  icon: React.ReactNode;
}

const documentTypes: DocumentType[] = [
  {
    id: 'will',
    name: 'Last Will & Testament',
    description: 'Legal document specifying asset distribution',
    category: 'Keep-Safe',
    icon: <FileText className="h-4 w-4" />
  },
  {
    id: 'trust',
    name: 'Trust Documents',
    description: 'Trust agreements and amendments',
    category: 'Keep-Safe',
    icon: <Shield className="h-4 w-4" />
  },
  {
    id: 'insurance',
    name: 'Insurance Policies',
    description: 'Life, disability, and property insurance',
    category: 'Working',
    icon: <Shield className="h-4 w-4" />
  },
  {
    id: 'investment',
    name: 'Investment Statements',
    description: 'Brokerage and retirement account statements',
    category: 'Working',
    icon: <FileText className="h-4 w-4" />
  },
  {
    id: 'tax',
    name: 'Tax Returns',
    description: 'Annual tax returns and supporting documents',
    category: 'Working',
    icon: <FileText className="h-4 w-4" />
  },
  {
    id: 'estate',
    name: 'Estate Planning',
    description: 'Power of attorney, healthcare directives',
    category: 'Keep-Safe',
    icon: <Lock className="h-4 w-4" />
  }
];

export const WealthVaultTool: React.FC = () => {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'Keep-Safe' | 'Working' | 'Archive'>('Keep-Safe');
  const [uploadType, setUploadType] = useState<string>('will');

  useEffect(() => {
    // Load demo documents
    const demoDocuments: VaultDocument[] = [
      {
        id: '1',
        name: 'Family Trust Agreement 2024.pdf',
        type: 'trust',
        category: 'Keep-Safe',
        uploadedAt: '2024-12-15T09:00:00Z',
        size: 2500000,
        encrypted: true,
        shared: false
      },
      {
        id: '2',
        name: 'Life Insurance Policy - MetLife.pdf', 
        type: 'insurance',
        category: 'Working',
        uploadedAt: '2024-12-10T14:30:00Z',
        size: 1200000,
        encrypted: true,
        shared: true
      },
      {
        id: '3',
        name: 'Investment Statement Q4 2024.pdf',
        type: 'investment',
        category: 'Working',
        uploadedAt: '2024-12-01T10:15:00Z',
        size: 850000,
        encrypted: true,
        shared: false
      }
    ];

    setDocuments(demoDocuments);
  }, []);

  const handleUploadDocument = () => {
    const selectedType = documentTypes.find(t => t.id === uploadType);
    if (!selectedType) return;

    const newDocument: VaultDocument = {
      id: `doc_${Date.now()}`,
      name: `${selectedType.name} - ${new Date().toLocaleDateString()}.pdf`,
      type: uploadType as any,
      category: selectedType.category,
      uploadedAt: new Date().toISOString(),
      size: Math.floor(Math.random() * 3000000) + 500000,
      encrypted: true,
      shared: false
    };

    setDocuments(prev => [...prev, newDocument]);

    // Record vault action receipt
    const receipt = recordReceipt({
      id: `vault_upload_${Date.now()}`,
      type: 'Vault-RDS',
      timestamp: new Date().toISOString(),
      payload: {
        action: 'document_upload',
        document_type: uploadType,
        category: selectedType.category,
        encrypted: true,
        keep_safe: selectedType.category === 'Keep-Safe'
      },
      inputs_hash: `vault_${Date.now()}`,
      policy_version: 'v1.0'
    });

    analytics.track('family.vault.document_uploaded', {
      document_type: uploadType,
      category: selectedType.category,
      keep_safe: selectedType.category === 'Keep-Safe'
    });

    toast.success(`${selectedType.name} uploaded securely to vault`);
  };

  const exportBinder = () => {
    const binderData = {
      export_date: new Date().toISOString(),
      total_documents: documents.length,
      categories: {
        'Keep-Safe': documents.filter(d => d.category === 'Keep-Safe').length,
        'Working': documents.filter(d => d.category === 'Working').length,
        'Archive': documents.filter(d => d.category === 'Archive').length
      },
      document_list: documents.map(doc => ({
        name: doc.name,
        type: doc.type,
        category: doc.category,
        upload_date: doc.uploadedAt,
        encrypted: doc.encrypted
      }))
    };

    // Create ZIP-like export summary
    const csv = [
      'Document Name,Type,Category,Upload Date,Encrypted,Shared',
      ...documents.map(doc => 
        `"${doc.name}",${doc.type},${doc.category},${doc.uploadedAt},${doc.encrypted},${doc.shared}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wealth_vault_binder.csv';
    a.click();

    analytics.track('family.vault.binder_exported', {
      document_count: documents.length,
      format: 'zip'
    });

    toast.success('Wealth vault binder exported successfully');
  };

  const getDocumentsByCategory = (category: string) => {
    return documents.filter(doc => doc.category === category);
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const getTypeIcon = (type: string) => {
    const docType = documentTypes.find(t => t.id === type);
    return docType?.icon || <FileText className="h-4 w-4" />;
  };

  const categoryCounts = {
    'Keep-Safe': getDocumentsByCategory('Keep-Safe').length,
    'Working': getDocumentsByCategory('Working').length,
    'Archive': getDocumentsByCategory('Archive').length
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wealth Vault</h1>
          <p className="text-muted-foreground">Secure document storage and management</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Demo Mode</Badge>
          <Button onClick={exportBinder} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Binder
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <Alert className="border-green-200 bg-green-50">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          All documents are encrypted end-to-end and stored with bank-level security. 
          Keep-Safe documents have additional WORM (Write-Once-Read-Many) protection.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="documentType">Document Type</Label>
              <select
                id="documentType"
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                {documentTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {documentTypes.find(t => t.id === uploadType)?.description}
              </p>
            </div>

            <div className="p-3 border-2 border-dashed border-muted rounded-lg text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Drop files here or click to browse
              </p>
            </div>

            <Button onClick={handleUploadDocument} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload to Vault
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Max file size: 25MB</p>
              <p>• Supported: PDF, DOC, JPG, PNG</p>
              <p>• All uploads are encrypted</p>
            </div>
          </CardContent>
        </Card>

        {/* Document Browser */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Document Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="Keep-Safe">
                    Keep-Safe ({categoryCounts['Keep-Safe']})
                  </TabsTrigger>
                  <TabsTrigger value="Working">
                    Working ({categoryCounts['Working']})
                  </TabsTrigger>
                  <TabsTrigger value="Archive">
                    Archive ({categoryCounts['Archive']})
                  </TabsTrigger>
                </TabsList>

                {['Keep-Safe', 'Working', 'Archive'].map(category => (
                  <TabsContent key={category} value={category} className="mt-4">
                    <div className="space-y-3">
                      {getDocumentsByCategory(category).map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(doc.type)}
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{formatFileSize(doc.size)}</span>
                                <span>•</span>
                                <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                {doc.encrypted && (
                                  <>
                                    <span>•</span>
                                    <Lock className="h-3 w-3" />
                                    <span>Encrypted</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {category === 'Keep-Safe' && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                WORM
                              </Badge>
                            )}
                            {doc.shared && (
                              <Badge variant="outline">Shared</Badge>
                            )}
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {getDocumentsByCategory(category).length === 0 && (
                        <div className="text-center py-8">
                          <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No documents in {category} category
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{documents.length}</p>
            <p className="text-sm text-muted-foreground">Total Documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{documents.filter(d => d.encrypted).length}</p>
            <p className="text-sm text-muted-foreground">Encrypted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{categoryCounts['Keep-Safe']}</p>
            <p className="text-sm text-muted-foreground">Keep-Safe</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {(documents.reduce((sum, doc) => sum + doc.size, 0) / 1024 / 1024).toFixed(0)} MB
            </p>
            <p className="text-sm text-muted-foreground">Storage Used</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};