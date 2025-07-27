import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, Check, Lock, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { analytics } from "@/lib/analytics";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
}

const acceptedFileTypes = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls']
};

const documentCategories = [
  { id: 'w2_1099', label: 'W-2s & 1099s', required: true },
  { id: 'receipts', label: 'Receipts & Expenses', required: false },
  { id: 'tax_documents', label: 'Prior Year Tax Returns', required: false },
  { id: 'investment_statements', label: 'Investment Statements', required: false },
  { id: 'business_records', label: 'Business Records', required: false },
  { id: 'other', label: 'Other Documents', required: false }
];

export function TaxDocumentUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('w2_1099');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    
    analytics.track('tax_document_upload_started', {
      file_count: acceptedFiles.length,
      category: selectedCategory
    });

    for (const file of acceptedFiles) {
      const fileId = Math.random().toString(36).substring(7);
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === fileId && f.uploadProgress < 100) {
            const newProgress = Math.min(f.uploadProgress + 10, 100);
            return { ...f, uploadProgress: newProgress };
          }
          return f;
        }));
      }, 200);

      // Complete upload after 2 seconds
      setTimeout(() => {
        clearInterval(uploadInterval);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, uploadProgress: 100, status: 'completed' }
            : f
        ));
        
        analytics.track('tax_document_upload_completed', {
          file_name: file.name,
          file_size: file.size,
          category: selectedCategory
        });
      }, 2000);
    }

    setIsUploading(false);
  }, [selectedCategory]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    analytics.track('tax_document_removed', { file_id: fileId });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryFiles = (categoryId: string) => {
    // In production, files would be categorized in backend
    return uploadedFiles.filter(f => f.status === 'completed');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Secure Tax Document Upload
          </CardTitle>
          <CardDescription>
            Upload your tax documents securely. All files are encrypted and only accessible by you and your designated tax professional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Bank-Level Security</p>
                <p className="text-blue-700">
                  Your documents are encrypted with 256-bit AES encryption and stored securely. 
                  Only you and authorized professionals can access your files.
                </p>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Document Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {documentCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.label}</span>
                    {category.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse • PDF, JPG, PNG, Excel files up to 10MB
              </p>
              <Button variant="outline" size="sm" disabled={isUploading}>
                Choose Files
              </Button>
            </div>
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Uploaded Files</h4>
              {uploadedFiles.map(file => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        {file.status === 'completed' && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {file.status === 'error' && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {file.status === 'uploading' && (
                      <Progress value={file.uploadProgress} className="mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Document Checklist */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Document Checklist</h4>
            <div className="grid gap-2">
              {documentCategories.map(category => {
                const categoryFileCount = getCategoryFiles(category.id).length;
                const hasFiles = categoryFileCount > 0;
                
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      {hasFiles ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 border rounded border-muted-foreground/50" />
                      )}
                      <span className="text-sm">{category.label}</span>
                      {category.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                    {hasFiles && (
                      <span className="text-sm text-muted-foreground">
                        {categoryFileCount} file{categoryFileCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}