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
  X
} from 'lucide-react';
import { useVaultUpload } from '@/hooks/useVaultUpload';
import { Capacitor } from '@capacitor/core';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface SecureFileUploadProps {
  vaultId: string;
  userRole: string;
  masterKey: CryptoKey;
  onUploadComplete?: (fileId: string) => void;
  onClose?: () => void;
  onSuccess?: () => void;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  showMobileCapture?: boolean;
}

export function SecureFileUpload({ 
  vaultId,
  userRole,
  masterKey,
  onUploadComplete,
  onClose,
  onSuccess,
  maxSize = 50 * 1024 * 1024, // 50MB default
  acceptedTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf', '.doc,.docx'],
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
    if (!selectedFiles.length) return;
    
    try {
      for (const file of selectedFiles) {
        const fileId = await uploadFile(vaultId, file);
        if (fileId && onUploadComplete) {
          onUploadComplete(fileId);
        }
      }
      setSelectedFiles([]);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const capturePhoto = async () => {
    try {
      if (!Capacitor.isNativePlatform()) {
        // Fallback for web
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        
        input.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files) {
            setSelectedFiles(prev => [...prev, ...Array.from(files)]);
          }
        };
        
        input.click();
        return;
      }

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
        const file = new window.File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto bg-background border-primary/20 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
              Secure File Upload
            </h2>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="space-y-6">
            {/* Enhanced Mobile-First Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 touch-target-large cursor-pointer ${
                isDragActive 
                  ? 'border-gold bg-gold/10 shadow-lg shadow-gold/25' 
                  : 'border-muted-foreground/25 hover:border-gold/50 hover:bg-gold/5'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gold to-emerald rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gold">
                {isDragActive ? 'Drop files here' : 'Upload Family Files'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Tap to browse or drag & drop files
              </p>
              <p className="text-xs text-muted-foreground">
                Max size: {formatFileSize(maxSize)} • All file types supported
              </p>
            </div>

            {/* Enhanced Mobile Capture Options */}
            {showMobileCapture && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={capturePhoto}
                  size="lg"
                  className="flex items-center gap-3 p-6 h-auto touch-target-large border-emerald/30 hover:bg-emerald/10 hover:border-emerald/50"
                >
                  <div className="w-10 h-10 bg-emerald/20 rounded-full flex items-center justify-center">
                    <Camera className="h-5 w-5 text-emerald" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-emerald">Take Photo</div>
                    <div className="text-sm text-muted-foreground">Capture with camera</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  onClick={captureVideo}
                  size="lg"
                  className="flex items-center gap-3 p-6 h-auto touch-target-large border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-primary">Record Video</div>
                    <div className="text-sm text-muted-foreground">Capture moment</div>
                  </div>
                </Button>
              </div>
            )}

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Selected Files ({selectedFiles.length})</h4>
                  <Button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    variant="gold"
                    size="lg"
                    className="gap-2 touch-target-large"
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
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-card/50">
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
            )}

            {/* Security Info */}
            <Card className="border-emerald/20 bg-emerald/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-emerald mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="font-medium text-emerald">Secure Upload</h5>
                    <p className="text-sm text-muted-foreground">
                      All files are encrypted with AES-256 before upload and stored securely in your family vault. 
                      Large files are automatically chunked for reliable transmission.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}