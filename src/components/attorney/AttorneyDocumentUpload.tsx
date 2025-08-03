import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  Download,
  Share,
  Clock,
  Shield,
  Tag,
  FileType,
  HardDrive
} from 'lucide-react';

interface DocumentClassification {
  id: string;
  classification_name: string;
  description: string;
  required_fields: any;
  validation_rules: any;
  retention_period_years: number;
}

interface AttorneyDocumentUploadProps {
  clientId?: string;
  onUploadComplete?: (documentId: string) => void;
  onClose?: () => void;
}

export function AttorneyDocumentUpload({ 
  clientId, 
  onUploadComplete, 
  onClose 
}: AttorneyDocumentUploadProps) {
  const { userProfile } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [classifications, setClassifications] = useState<DocumentClassification[]>([]);
  const [selectedClassification, setSelectedClassification] = useState<string>('');
  const [formData, setFormData] = useState({
    document_title: '',
    document_description: '',
    security_level: 'confidential',
    tags: '',
    metadata_fields: {} as Record<string, string>
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load document classifications
  React.useEffect(() => {
    loadClassifications();
  }, []);

  const loadClassifications = async () => {
    try {
      const { data, error } = await supabase
        .from('attorney_document_classifications')
        .select('*')
        .eq('is_active', true)
        .order('classification_name');

      if (error) throw error;
      setClassifications(data || []);
    } catch (error) {
      console.error('Error loading classifications:', error);
      toast.error('Failed to load document classifications');
    }
  };

  const validateFile = useCallback((file: File): string[] => {
    const errors: string[] = [];

    if (!selectedClassification) {
      errors.push('Please select a document classification');
      return errors;
    }

    const classification = classifications.find(c => c.id === selectedClassification);
    if (!classification) {
      errors.push('Invalid classification selected');
      return errors;
    }

    const { validation_rules } = classification;

    // Parse validation rules if it's a string
    const rules = typeof validation_rules === 'string' ? 
      JSON.parse(validation_rules) : validation_rules;

    // Check file size
    const maxSizeMB = rules.max_size_mb;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      errors.push(`File size ${fileSizeMB.toFixed(2)}MB exceeds maximum allowed ${maxSizeMB}MB`);
    }

    // Check file extension
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!rules.allowed_extensions.includes(fileExtension)) {
      errors.push(`File type ${fileExtension} not allowed. Allowed types: ${rules.allowed_extensions.join(', ')}`);
    }

    // Check for potentially dangerous files
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js'];
    if (dangerousExtensions.includes(fileExtension)) {
      errors.push('File type not allowed for security reasons');
    }

    return errors;
  }, [selectedClassification, classifications]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // Auto-populate title from filename if not set
      if (!formData.document_title) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
        setFormData(prev => ({ ...prev, document_title: nameWithoutExt }));
      }

      // Validate file
      const errors = validateFile(selectedFile);
      setValidationErrors(errors);
    }
  }, [formData.document_title, validateFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleUpload = async () => {
    if (!file || !userProfile?.id || validationErrors.length > 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create file path
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${userProfile.id}/${timestamp}_${sanitizedFileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('attorney-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Prepare metadata
      const metadataFields = { ...formData.metadata_fields };
      const classification = classifications.find(c => c.id === selectedClassification);
      
      // Add required fields from classification
      const requiredFields = typeof classification?.required_fields === 'string' ? 
        JSON.parse(classification.required_fields) : 
        (classification?.required_fields || []);
      
      if (requiredFields && Array.isArray(requiredFields)) {
        requiredFields.forEach((field: string) => {
          if (metadataFields[field]) {
            metadataFields[field] = metadataFields[field];
          }
        });
      }

      // Create document metadata record
      const { data: documentData, error: metadataError } = await supabase
        .from('attorney_documents_metadata')
        .insert({
          file_path: filePath,
          original_filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          attorney_id: userProfile.id,
          client_id: clientId || null,
          classification_id: selectedClassification,
          document_title: formData.document_title,
          document_description: formData.document_description || null,
          metadata_fields: metadataFields,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
          security_level: formData.security_level,
          uploaded_by: userProfile.id
        })
        .select()
        .single();

      if (metadataError) throw metadataError;

      toast.success('Document uploaded successfully');
      
      if (onUploadComplete) {
        onUploadComplete(documentData.id);
      }

      // Reset form
      setFile(null);
      setFormData({
        document_title: '',
        document_description: '',
        security_level: 'confidential',
        tags: '',
        metadata_fields: {}
      });
      setSelectedClassification('');
      setValidationErrors([]);

    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleMetadataFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      metadata_fields: {
        ...prev.metadata_fields,
        [field]: value
      }
    }));
  };

  const selectedClassificationData = classifications.find(c => c.id === selectedClassification);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Legal Document
          </CardTitle>
          <CardDescription>
            Upload and classify legal documents with automatic validation and security controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Classification Selection */}
          <div className="space-y-2">
            <Label htmlFor="classification">Document Classification *</Label>
            <Select value={selectedClassification} onValueChange={setSelectedClassification}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {classifications.map((classification) => (
                  <SelectItem key={classification.id} value={classification.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{classification.classification_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {classification.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedClassificationData && (
              <div className="text-xs text-muted-foreground">
                Max size: {JSON.parse(selectedClassificationData.validation_rules || '{}').max_size_mb || 25}MB | 
                Allowed: {JSON.parse(selectedClassificationData.validation_rules || '{}').allowed_extensions?.join(', ') || 'PDF, DOC, DOCX'} |
                Retention: {selectedClassificationData.retention_period_years} years
              </div>
            )}
          </div>

          {/* File Upload Area */}
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            {file ? (
              <div className="space-y-2">
                <FileText className="h-8 w-8 mx-auto text-primary" />
                <div className="text-sm font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setValidationErrors([]);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="text-sm">
                  {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Supports PDF, DOC, DOCX, XLS, XLSX
                </div>
              </div>
            )}
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="space-y-2">
              {validationErrors.map((error, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              ))}
            </div>
          )}

          <Separator />

          {/* Document Metadata */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Document Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title *</Label>
                <Input
                  id="title"
                  value={formData.document_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, document_title: e.target.value }))}
                  placeholder="Enter document title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="security">Security Level</Label>
                <Select 
                  value={formData.security_level} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, security_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Public
                      </div>
                    </SelectItem>
                    <SelectItem value="internal">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Internal
                      </div>
                    </SelectItem>
                    <SelectItem value="confidential">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-orange-500" />
                        Confidential
                      </div>
                    </SelectItem>
                    <SelectItem value="restricted">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-500" />
                        Restricted
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.document_description}
                onChange={(e) => setFormData(prev => ({ ...prev, document_description: e.target.value }))}
                placeholder="Brief description of the document"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas"
              />
            </div>

            {/* Required Fields for Selected Classification */}
            {selectedClassificationData && (() => {
              const requiredFields = typeof selectedClassificationData.required_fields === 'string' ? 
                JSON.parse(selectedClassificationData.required_fields) : 
                (selectedClassificationData.required_fields || []);
              
              return Array.isArray(requiredFields) && requiredFields.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Required Fields for {selectedClassificationData.classification_name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requiredFields.map((field: string) => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={field}>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} *</Label>
                        <Input
                          id={field}
                          value={formData.metadata_fields[field] || ''}
                          onChange={(e) => handleMetadataFieldChange(field, e.target.value)}
                          placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button 
              onClick={handleUpload}
              disabled={!file || !formData.document_title || !selectedClassification || validationErrors.length > 0 || uploading}
            >
              {uploading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}