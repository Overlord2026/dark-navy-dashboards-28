import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Eye, Download, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  documentType?: string;
}

interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
  preview?: string;
}

export function DocumentUpload({ open, onOpenChange, onSuccess, documentType = "legal_document" }: DocumentUploadProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/*': ['.txt'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!title.trim() || uploadedFiles.length === 0) {
      toast({
        title: "Missing information",
        description: "Please provide a title and upload at least one file.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      // Upload files to Supabase storage
      const uploadPromises = uploadedFiles.map(async (uploadedFile) => {
        const fileName = `${user.id}/${Date.now()}-${uploadedFile.file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, uploadedFile.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);

        return {
          file_path: fileName,
          file_url: urlData.publicUrl,
          original_filename: uploadedFile.file.name,
          file_size: uploadedFile.file.size,
          mime_type: uploadedFile.file.type
        };
      });

      const uploadResults = await Promise.all(uploadPromises);

      // Save document metadata to database
      for (const result of uploadResults) {
        const { error: dbError } = await supabase
          .from('attorney_documents_metadata')
          .insert({
            file_path: result.file_path,
            original_filename: result.original_filename,
            file_size: result.file_size,
            mime_type: result.mime_type,
            attorney_id: user.id,
            document_title: title,
            document_description: description,
            metadata_fields: {
              category: category,
              document_type: documentType,
              uploaded_via: 'attorney_dashboard'
            },
            uploaded_by: user.id
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Documents uploaded successfully",
        description: `${uploadResults.length} document(s) have been uploaded and are ready to use.`,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setUploadedFiles([]);
      onSuccess();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error uploading documents:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Could not upload documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const previewFile = (file: UploadedFile) => {
    if (file.preview) {
      window.open(file.preview, '_blank');
    } else {
      toast({
        title: "Preview not available",
        description: "Preview is only available for image files.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </DialogTitle>
          <DialogDescription>
            Upload legal documents, contracts, and other files to your secure document library
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Document Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="estate_planning">Estate Planning</SelectItem>
                  <SelectItem value="business_law">Business Law</SelectItem>
                  <SelectItem value="litigation">Litigation</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this document"
              rows={3}
            />
          </div>

          {/* File Upload Area */}
          <Card className="border-dashed border-2">
            <CardContent className="p-6">
              <div
                {...getRootProps()}
                className={`text-center cursor-pointer transition-colors ${
                  isDragActive ? 'bg-primary/5' : 'hover:bg-muted/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  or <span className="text-primary font-medium">browse files</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOC, DOCX, TXT, and image files (max 50MB each)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Uploaded Files ({uploadedFiles.length})</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.preview && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => previewFile(file)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress/Status */}
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Uploading documents...
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || uploadedFiles.length === 0 || !title.trim()}
            >
              {uploading ? 'Uploading...' : `Upload ${uploadedFiles.length} File(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}