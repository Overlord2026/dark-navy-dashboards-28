import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  Music, 
  FileText, 
  Lock,
  Camera,
  Smartphone
} from 'lucide-react';
import { useVaultUpload } from '@/hooks/useVaultUpload';
import { Capacitor } from '@capacitor/core';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface SecureFileUploadProps {
  vaultId: string;
  onUploadComplete?: (fileId: string) => void;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  showMobileCapture?: boolean;
}

export function SecureFileUpload({ 
  vaultId, 
  onUploadComplete,
  maxSize = 100 * 1024 * 1024, // 100MB default
  acceptedTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf', 'text/*'],
  showMobileCapture = true
}: SecureFileUploadProps) {
  const { uploadFile, uploadProgress, isUploading } = useVaultUpload();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const isMobile = Capacitor.isNativePlatform();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Validate file sizes
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} exceeds maximum size`);
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  }, [maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: true
  });

  const handleUpload = async () => {
    for (const file of selectedFiles) {
      const fileId = await uploadFile(vaultId, file);
      if (fileId && onUploadComplete) {
        onUploadComplete(fileId);
      }
    }
    setSelectedFiles([]);
  };

  const capturePhoto = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        // Convert dataUrl to File
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setSelectedFiles(prev => [...prev, file]);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const captureVideo = async () => {
    try {
      // For video, we'll use the media capture API or redirect to camera
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.capture = 'environment';
      
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          setSelectedFiles(prev => [...prev, ...Array.from(files)]);
        }
      };
      
      input.click();
    } catch (error) {
      console.error('Video capture error:', error);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (fileType.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {isDragActive ? 'Drop files here' : 'Upload Files to Your Vault'}
                </h3>
                <p className="text-muted-foreground mt-2">
                  Drag & drop files here, or click to select files
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    AES-256 Encrypted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Capture Options */}
      {showMobileCapture && (
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile Capture
            </h4>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={capturePhoto}
                className="flex-1 gap-2"
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
              <Button 
                variant="outline" 
                onClick={captureVideo}
                className="flex-1 gap-2"
              >
                <Video className="h-4 w-4" />
                Record Video
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Selected Files ({selectedFiles.length})</h4>
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="gap-2"
                >
                  <Lock className="h-4 w-4" />
                  {isUploading ? 'Encrypting & Uploading...' : 'Secure Upload'}
                </Button>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Upload Progress</span>
                    <span>{Math.round(uploadProgress.progress)}%</span>
                  </div>
                  <Progress value={uploadProgress.progress} className="h-2" />
                </div>
              )}

              {/* File List */}
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="p-2 bg-muted rounded">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <Badge variant="outline">{file.type}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                      disabled={isUploading}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Info */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-medium text-green-800">Secure Upload</h5>
              <p className="text-sm text-green-700">
                All files are encrypted with AES-256 before upload and stored securely in your family vault. 
                Large files are automatically chunked for reliable transmission.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}