import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download } from 'lucide-react';

interface DocumentUploadStepProps {
  onComplete: (data: any) => void;
  isLoading: boolean;
}

interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
}

interface UploadedDocument {
  id: string;
  typeId: string;
  fileName: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
}

const REQUIRED_DOCUMENTS: DocumentType[] = [
  {
    id: 'w9',
    name: 'W-9 Tax Form',
    description: 'Required for tax reporting of NIL payments',
    required: true,
    acceptedFormats: ['PDF', 'JPG', 'PNG']
  },
  {
    id: 'photo_id',
    name: 'Photo ID',
    description: 'Driver\'s license, passport, or state ID',
    required: true,
    acceptedFormats: ['PDF', 'JPG', 'PNG']
  },
  {
    id: 'nil_agreement',
    name: 'School NIL Agreement',
    description: 'Your school\'s NIL policy acknowledgment (if applicable)',
    required: false,
    acceptedFormats: ['PDF', 'DOC', 'DOCX']
  },
  {
    id: 'guardian_consent',
    name: 'Guardian Consent Form',
    description: 'Required if under 18 years old',
    required: false, // Will be dynamically set based on age
    acceptedFormats: ['PDF', 'JPG', 'PNG']
  }
];

export function DocumentUploadStep({ onComplete, isLoading }: DocumentUploadStepProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const simulateUpload = async (file: File, typeId: string): Promise<UploadedDocument> => {
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const document: UploadedDocument = {
      id: documentId,
      typeId,
      fileName: file.name,
      status: 'uploading',
      progress: 0
    };

    setUploadedDocuments(prev => [...prev, document]);

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, progress }
            : doc
        )
      );
    }

    // Simulate final result
    const success = Math.random() > 0.1; // 90% success rate
    const finalDocument: UploadedDocument = {
      ...document,
      status: success ? 'success' : 'error',
      progress: 100,
      url: success ? `https://secure-storage.example.com/${documentId}` : undefined
    };

    setUploadedDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? finalDocument
          : doc
      )
    );

    return finalDocument;
  };

  const handleFileUpload = async (files: FileList | null, typeId: string) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const docType = REQUIRED_DOCUMENTS.find(doc => doc.id === typeId);
    const fileExtension = file.name.split('.').pop()?.toUpperCase();
    
    if (docType && !docType.acceptedFormats.includes(fileExtension || '')) {
      alert(`Please upload a file in one of these formats: ${docType.acceptedFormats.join(', ')}`);
      return;
    }

    // Remove existing document of this type
    setUploadedDocuments(prev => prev.filter(doc => doc.typeId !== typeId));

    try {
      await simulateUpload(file, typeId);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDrop = (e: React.DragEvent, typeId: string) => {
    e.preventDefault();
    setDragOver(null);
    handleFileUpload(e.dataTransfer.files, typeId);
  };

  const handleDragOver = (e: React.DragEvent, typeId: string) => {
    e.preventDefault();
    setDragOver(typeId);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const removeDocument = (documentId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const getDocumentForType = (typeId: string) => {
    return uploadedDocuments.find(doc => doc.typeId === typeId);
  };

  const requiredDocuments = REQUIRED_DOCUMENTS.filter(doc => doc.required);
  const uploadedRequiredDocs = requiredDocuments.filter(doc => {
    const uploaded = getDocumentForType(doc.id);
    return uploaded && uploaded.status === 'success';
  });

  const canContinue = uploadedRequiredDocs.length === requiredDocuments.length;

  const handleComplete = () => {
    const documentData = uploadedDocuments
      .filter(doc => doc.status === 'success')
      .reduce((acc, doc) => {
        acc[doc.typeId] = {
          fileName: doc.fileName,
          url: doc.url,
          uploadedAt: new Date().toISOString()
        };
        return acc;
      }, {} as Record<string, any>);

    onComplete({ documents: documentData });
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Document Upload Progress</span>
            <span className="text-sm text-muted-foreground">
              {uploadedRequiredDocs.length} of {requiredDocuments.length} required documents
            </span>
          </div>
          <Progress value={(uploadedRequiredDocs.length / requiredDocuments.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Document Upload Cards */}
      <div className="space-y-4">
        {REQUIRED_DOCUMENTS.map((docType) => {
          const uploadedDoc = getDocumentForType(docType.id);
          const isDragOver = dragOver === docType.id;

          return (
            <Card key={docType.id} className={`transition-all ${isDragOver ? 'border-primary bg-primary/5' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      {docType.name}
                      {docType.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {docType.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Accepted formats: {docType.acceptedFormats.join(', ')}
                    </p>
                  </div>
                  
                  {uploadedDoc?.status === 'success' && (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {!uploadedDoc ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver 
                        ? 'border-primary bg-primary/10' 
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                    onDrop={(e) => handleDrop(e, docType.id)}
                    onDragOver={(e) => handleDragOver(e, docType.id)}
                    onDragLeave={handleDragLeave}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop your file here, or
                    </p>
                    <label htmlFor={`upload-${docType.id}`} className="cursor-pointer">
                      <Button type="button" variant="outline" className="pointer-events-none">
                        Choose File
                      </Button>
                    </label>
                    <input
                      id={`upload-${docType.id}`}
                      type="file"
                      onChange={(e) => handleFileUpload(e.target.files, docType.id)}
                      accept={docType.acceptedFormats.map(format => `.${format.toLowerCase()}`).join(',')}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <div>
                          <div className="font-medium text-sm">{uploadedDoc.fileName}</div>
                          <div className="text-xs text-muted-foreground">
                            {uploadedDoc.status === 'uploading' && 'Uploading...'}
                            {uploadedDoc.status === 'success' && 'Upload complete'}
                            {uploadedDoc.status === 'error' && 'Upload failed'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {uploadedDoc.status === 'uploading' && (
                          <div className="w-16">
                            <Progress value={uploadedDoc.progress} className="h-1" />
                          </div>
                        )}
                        
                        {uploadedDoc.status === 'success' && uploadedDoc.url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={uploadedDoc.url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        
                        {uploadedDoc.status === 'error' && (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(uploadedDoc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {uploadedDoc.status === 'error' && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Upload failed. Please try again or contact support if the problem persists.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Your documents are secure:</strong> All uploaded documents are encrypted 
          and stored in compliance with privacy regulations. They will only be used for 
          verification and tax reporting purposes.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button 
          onClick={handleComplete}
          disabled={!canContinue || isLoading}
          className="min-w-32"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}