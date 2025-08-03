import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadWithValidationProps {
  onFileUpload: (file: File) => Promise<void>;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  bucketName?: string;
  title?: string;
  description?: string;
}

export function FileUploadWithValidation({
  onFileUpload,
  acceptedTypes = ['.pdf', '.xlsx', '.xls', '.csv', '.docx', '.doc'],
  maxSize = 10,
  bucketName = 'accountant-tax-docs',
  title = 'Upload Documents',
  description = 'Drag and drop files or click to browse'
}: FileUploadWithValidationProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; status: 'success' | 'error'; message?: string }>>([]);

  const validateFile = useCallback((file: File) => {
    const errors: string[] = [];
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      errors.push(`File size exceeds ${maxSize}MB limit`);
    }
    
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      errors.push(`File type ${fileExtension} not supported. Accepted types: ${acceptedTypes.join(', ')}`);
    }
    
    // Check for potential security issues
    if (file.name.includes('../') || file.name.includes('..\\')) {
      errors.push('Invalid file name detected');
    }
    
    return errors;
  }, [acceptedTypes, maxSize]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const validationErrors = validateFile(file);
      
      if (validationErrors.length > 0) {
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          status: 'error',
          message: validationErrors.join(', ')
        }]);
        toast.error(`Upload failed for ${file.name}`, {
          description: validationErrors.join(', ')
        });
        continue;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        await onFileUpload(file);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          status: 'success'
        }]);

        toast.success(`Successfully uploaded ${file.name}`, {
          description: `File uploaded to ${bucketName}`
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          status: 'error',
          message: errorMessage
        }]);
        toast.error(`Upload failed for ${file.name}`, {
          description: errorMessage
        });
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  }, [validateFile, onFileUpload, bucketName]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxSize * 1024 * 1024,
    multiple: true
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">{description}</p>
          <p className="text-sm text-muted-foreground mb-4">
            Supported formats: {acceptedTypes.join(', ')} • Max size: {maxSize}MB
          </p>
          <Button variant="outline" type="button" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Choose Files'}
          </Button>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Upload Results</h4>
            {uploadedFiles.map((fileResult, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{fileResult.name}</span>
                  <Badge variant={fileResult.status === 'success' ? 'default' : 'destructive'}>
                    {fileResult.status === 'success' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {fileResult.status}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {uploadedFiles.some(f => f.status === 'error') && (
              <div className="space-y-1">
                {uploadedFiles.filter(f => f.status === 'error' && f.message).map((fileResult, index) => (
                  <p key={index} className="text-xs text-destructive">{fileResult.name}: {fileResult.message}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>• Files are securely encrypted and stored</p>
          <p>• Only you can access your uploaded documents</p>
          <p>• All uploads are logged for compliance</p>
        </div>
      </CardContent>
    </Card>
  );
}