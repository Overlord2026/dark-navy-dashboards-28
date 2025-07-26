import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileText, Image, File } from 'lucide-react';

interface DocumentUploadZoneProps {
  onUpload: (files: File[]) => void;
  onCancel: () => void;
  uploading: boolean;
}

export function DocumentUploadZone({ onUpload, onCancel, uploading }: DocumentUploadZoneProps) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/*': ['.txt', '.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type === 'application/pdf') return FileText;
    return File;
  };

  return (
    <Card className="border-2 border-dashed">
      <CardContent className="p-6">
        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />
          <div className="text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            
            {isDragActive ? (
              <div>
                <h3 className="text-lg font-semibold">Drop files here</h3>
                <p className="text-muted-foreground">Release to upload</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold">Drag & drop files here</h3>
                <p className="text-muted-foreground">
                  or click to browse. Supports PDF, images, documents, and spreadsheets
                </p>
              </div>
            )}

            {/* File previews */}
            {acceptedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Selected Files:</h4>
                <div className="space-y-1">
                  {acceptedFiles.map((file, index) => {
                    const Icon = getFileIcon(file);
                    return (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Icon className="h-4 w-4" />
                        <span className="truncate">{file.name}</span>
                        <span className="text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancel} disabled={uploading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          {acceptedFiles.length > 0 && !uploading && (
            <Button onClick={() => onUpload([...acceptedFiles])}>
              <Upload className="h-4 w-4 mr-2" />
              Upload {acceptedFiles.length} file(s)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}