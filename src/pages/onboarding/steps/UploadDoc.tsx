import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useNavigate } from 'react-router-dom';
import { goToPricingForFeature } from '@/lib/upgrade';

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

interface UploadDocData {
  documents: UploadedDocument[];
  vaultEnabled: boolean;
}

interface UploadDocProps {
  onComplete: (data: UploadDocData) => void;
  persona: string;
  segment: string;
  initialData?: Partial<UploadDocData>;
}

export const UploadDoc: React.FC<UploadDocProps> = ({
  onComplete,
  persona,
  segment,
  initialData
}) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<UploadedDocument[]>(
    initialData?.documents || []
  );
  const [isUploading, setIsUploading] = useState(false);

  // Check if document vault requires premium
  const requiresVault = segment === 'hnw' || segment === 'uhnw';

  const documentTypes = [
    { type: 'tax_return', label: 'Tax Returns', required: false },
    { type: 'bank_statement', label: 'Bank Statements', required: false },
    { type: 'investment_statement', label: 'Investment Statements', required: false },
    { type: 'estate_plan', label: 'Estate Planning Documents', required: requiresVault },
    { type: 'insurance_policy', label: 'Insurance Policies', required: false }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (requiresVault && !documents.some(d => d.type === 'vault_document')) {
      analytics.trackEvent('onboarding.upgrade_intent', {
        step: 'upload_doc',
        persona,
        segment,
        feature: 'document_vault'
      });
      
      goToPricingForFeature(navigate, 'document_vault', {
        planHint: 'premium',
        source: 'onboarding'
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newDocuments: UploadedDocument[] = Array.from(files).map(file => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'document',
        size: file.size,
        uploadedAt: new Date()
      }));

      setDocuments(prev => [...prev, ...newDocuments]);

      analytics.trackEvent('onboarding.documents_uploaded', {
        step: 'upload_doc',
        persona,
        segment,
        document_count: newDocuments.length,
        total_size: newDocuments.reduce((sum, doc) => sum + doc.size, 0)
      });

    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleComplete = () => {
    const data: UploadDocData = {
      documents,
      vaultEnabled: requiresVault && documents.length > 0
    };

    analytics.trackEvent('onboarding.step_completed', {
      step: 'upload_doc',
      persona,
      segment,
      documents_uploaded: documents.length,
      vault_used: data.vaultEnabled
    });

    onComplete(data);
  };

  const handleSkip = () => {
    analytics.trackEvent('onboarding.step_completed', {
      step: 'upload_doc',
      persona,
      segment,
      skipped: true
    });
    
    onComplete({
      documents: [],
      vaultEnabled: false
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>
          {requiresVault 
            ? "Securely store your important financial documents in your private vault"
            : "Upload key financial documents to personalize your experience"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {requiresVault && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Document vault with bank-level encryption is available for {segment} families.
            </AlertDescription>
          </Alert>
        )}

        {/* Document Types */}
        <div className="space-y-3">
          <h3 className="font-medium">Recommended Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documentTypes.map((docType) => (
              <Card key={docType.type} className="p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{docType.label}</span>
                  {docType.required && (
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Drop files here or click to browse</p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, DOC, DOCX files up to 10MB each
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
              aria-label="Upload documents"
            />
            {isUploading && (
              <div className="mt-4">
                <div className="animate-pulse text-sm text-muted-foreground">
                  Uploading...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Uploaded Documents */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Uploaded Documents ({documents.length})
            </h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <Card key={doc.id} className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(doc.size)} • {doc.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            All documents are encrypted and stored securely. Only you and authorized professionals can access them.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button 
            onClick={handleComplete} 
            className="flex-1"
            disabled={isUploading}
          >
            {documents.length > 0 ? 'Continue' : 'Continue Without Documents'}
          </Button>
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};