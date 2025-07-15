import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileUploadService, FileUploadOptions, UploadResult } from '@/services/healthcare/fileUpload';
import { toast } from 'sonner';

interface FileUploadDropzoneProps {
  options: FileUploadOptions;
  onUploadComplete?: (result: UploadResult) => void;
  className?: string;
  multiple?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  options,
  onUploadComplete,
  className = '',
  multiple = false
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    
    setFiles(multiple ? [...files, ...newFiles] : newFiles);
  }, [files, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: options.allowedTypes?.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>)
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview!);
    }
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const result = await FileUploadService.uploadFile(file, options);
        setUploadProgress(((index + 1) / files.length) * 100);
        return result;
      });

      const results = await Promise.all(uploadPromises);
      
      const successfulUploads = results.filter(r => r.success);
      const failedUploads = results.filter(r => !r.success);

      if (successfulUploads.length > 0) {
        toast.success(`${successfulUploads.length} file(s) uploaded successfully`);
        
        // Call onUploadComplete for each successful upload
        successfulUploads.forEach(result => {
          onUploadComplete?.(result);
        });
      }

      if (failedUploads.length > 0) {
        toast.error(`${failedUploads.length} file(s) failed to upload`);
      }

      // Clear files after upload
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      setFiles([]);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed unexpectedly');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Max size: {options.maxSizeInMB || 10}MB
            </p>
            {options.allowedTypes && (
              <p className="text-xs text-gray-400 mt-1">
                Supported: {options.allowedTypes.join(', ')}
              </p>
            )}
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Selected Files:</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                {!uploading && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Uploading...</span>
                <span className="text-sm">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {!uploading && (
            <Button onClick={uploadFiles} className="mt-4 w-full">
              Upload {files.length} File{files.length > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};