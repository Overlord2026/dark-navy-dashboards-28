import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Image, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  Trash2,
  Loader2,
  Camera,
  Scan
} from 'lucide-react';
import { OnboardingStepData } from '@/types/onboarding';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadStepProps {
  data: OnboardingStepData;
  onComplete: (stepData: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadProgress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  extractedData?: any;
}

const REQUIRED_DOCUMENTS = [
  {
    type: 'government_id',
    title: 'Government-Issued ID',
    description: 'Driver\'s license, passport, or state ID',
    required: true
  },
  {
    type: 'investment_statements',
    title: 'Investment Statements',
    description: 'Recent statements from current custodian',
    required: true
  },
  {
    type: 'bank_statements',
    title: 'Bank Statements',
    description: 'Recent bank statements (last 3 months)',
    required: false
  },
  {
    type: 'tax_returns',
    title: 'Tax Returns',
    description: 'Most recent tax return (optional)',
    required: false
  },
  {
    type: 'legal_documents',
    title: 'Legal Documents',
    description: 'Trust documents, POA, etc. (if applicable)',
    required: false
  }
];

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  isLoading
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>(
    data.documents?.uploaded?.map(doc => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      url: doc.url,
      size: 0,
      uploadProgress: 100,
      status: 'completed' as const,
      extractedData: doc.extractedData
    })) || []
  );
  
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB. Please compress or use a smaller file.`,
          variant: "destructive"
        });
        continue;
      }

      const documentId = Math.random().toString(36).substr(2, 9);
      const newDocument: UploadedDocument = {
        id: documentId,
        name: file.name,
        type: detectDocumentType(file.name),
        url: '',
        size: file.size,
        uploadProgress: 0,
        status: 'uploading'
      };

      setUploadedDocuments(prev => [...prev, newDocument]);

      // Simulate upload progress
      await simulateUpload(documentId, file);
    }
  };

  const detectDocumentType = (filename: string): string => {
    const name = filename.toLowerCase();
    if (name.includes('statement') || name.includes('portfolio')) {
      return 'investment_statements';
    }
    if (name.includes('bank') || name.includes('checking') || name.includes('savings')) {
      return 'bank_statements';
    }
    if (name.includes('tax') || name.includes('1040') || name.includes('return')) {
      return 'tax_returns';
    }
    if (name.includes('license') || name.includes('passport') || name.includes('id')) {
      return 'government_id';
    }
    if (name.includes('trust') || name.includes('poa') || name.includes('will')) {
      return 'legal_documents';
    }
    return 'other';
  };

  const simulateUpload = async (documentId: string, file: File) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, uploadProgress: progress }
            : doc
        )
      );
    }

    // Simulate processing
    setUploadedDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'processing' }
          : doc
      )
    );

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Complete processing with OCR results
    const extractedData = await simulateOCR(file);
    
    setUploadedDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              status: 'completed',
              url: URL.createObjectURL(file),
              extractedData
            }
          : doc
      )
    );

    toast({
      title: "Document uploaded successfully",
      description: `${file.name} has been processed and verified.`
    });
  };

  const simulateOCR = async (file: File) => {
    // Simulate OCR extraction
    const type = detectDocumentType(file.name);
    
    switch (type) {
      case 'government_id':
        return {
          documentType: 'Driver License',
          name: 'John Smith',
          address: '123 Main St, Anytown, CA 90210',
          licenseNumber: 'D1234567',
          expirationDate: '2025-12-31'
        };
      case 'investment_statements':
        return {
          institution: 'Vanguard',
          accountNumber: '****1234',
          totalValue: 250000,
          asOfDate: '2024-01-31'
        };
      case 'bank_statements':
        return {
          bankName: 'Chase Bank',
          accountNumber: '****5678',
          balance: 50000,
          statementDate: '2024-01-31'
        };
      default:
        return {
          documentType: 'Document',
          extractedText: 'Document processed successfully'
        };
    }
  };

  const removeDocument = (documentId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const getDocumentTypeTitle = (type: string) => {
    const docType = REQUIRED_DOCUMENTS.find(doc => doc.type === type);
    return docType?.title || 'Other Document';
  };

  const getUploadedByType = (type: string) => {
    return uploadedDocuments.filter(doc => doc.type === type);
  };

  const validateForm = () => {
    const requiredTypes = REQUIRED_DOCUMENTS.filter(doc => doc.required).map(doc => doc.type);
    return requiredTypes.every(type => getUploadedByType(type).length > 0);
  };

  const handleSave = () => {
    const documentsData = {
      documents: {
        uploaded: uploadedDocuments.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          url: doc.url,
          extractedData: doc.extractedData
        })),
        required: REQUIRED_DOCUMENTS.filter(doc => doc.required).map(doc => doc.type)
      }
    };

    onComplete(documentsData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Document Upload
        </h2>
        <p className="text-muted-foreground">
          Upload your documents securely. Our AI will automatically extract key information.
        </p>
      </div>

      {/* Upload Area */}
      <Card 
        className={`premium-card border-2 border-dashed transition-colors cursor-pointer ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                Drop files here or click to upload
              </p>
              <p className="text-muted-foreground">
                Supports PDF, JPG, PNG up to 10MB each
              </p>
            </div>
            <div className="flex justify-center gap-2">
              <Badge variant="outline">
                <Camera className="h-3 w-3 mr-1" />
                Mobile Camera
              </Badge>
              <Badge variant="outline">
                <Scan className="h-3 w-3 mr-1" />
                OCR Enabled
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Document Categories */}
      <div className="space-y-6">
        {REQUIRED_DOCUMENTS.map(docType => {
          const docs = getUploadedByType(docType.type);
          const hasRequiredDocs = docs.length > 0;
          
          return (
            <Card key={docType.type} className="premium-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    hasRequiredDocs ? 'bg-success text-success-foreground' : 'bg-muted'
                  }`}>
                    {hasRequiredDocs ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {docType.title}
                      {docType.required && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {docType.description}
                    </p>
                  </div>
                </div>
                <Badge variant={hasRequiredDocs ? "default" : "outline"}>
                  {docs.length} uploaded
                </Badge>
              </CardHeader>
              
              {docs.length > 0 && (
                <CardContent className="space-y-3">
                  {docs.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <div className="flex-shrink-0">
                        {doc.name.toLowerCase().includes('.pdf') ? (
                          <FileText className="h-8 w-8 text-red-500" />
                        ) : (
                          <Image className="h-8 w-8 text-blue-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground truncate">
                            {doc.name}
                          </p>
                          <div className="flex items-center gap-2">
                            {doc.status === 'uploading' && (
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            )}
                            {doc.status === 'processing' && (
                              <Badge variant="secondary" className="text-xs">
                                Processing...
                              </Badge>
                            )}
                            {doc.status === 'completed' && (
                              <Badge variant="default" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{formatFileSize(doc.size)}</span>
                          {doc.extractedData && (
                            <span className="text-success">Data extracted</span>
                          )}
                        </div>
                        
                        {doc.uploadProgress < 100 && (
                          <Progress value={doc.uploadProgress} className="h-1 mt-2" />
                        )}
                        
                        {doc.extractedData && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs">
                            <strong>Extracted:</strong> {Object.keys(doc.extractedData).join(', ')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {doc.url && (
                          <Button variant="ghost" size="sm" onClick={() => window.open(doc.url)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeDocument(doc.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Security Notice */}
      <Card className="premium-card bg-emerald/5 border-emerald/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">Secure Document Processing</h4>
              <p className="text-sm text-muted-foreground">
                Your documents are encrypted in transit and at rest. Our AI extracts only necessary information 
                to pre-fill your applications, saving you time while maintaining the highest security standards.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!validateForm() || isLoading}
          className="btn-primary-gold"
        >
          {isLoading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
};