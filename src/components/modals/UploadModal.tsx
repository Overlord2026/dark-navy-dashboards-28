import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Shield, AlertCircle, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'document' | 'vault' | 'general';
}

const DOCUMENT_TYPES = [
  { key: 'will', label: 'Will & Testament', icon: FileText },
  { key: 'trust', label: 'Trust Documents', icon: Shield },
  { key: 'deed', label: 'Property Deeds', icon: FileText },
  { key: 'insurance', label: 'Insurance Policies', icon: Shield },
  { key: 'financial', label: 'Financial Statements', icon: FileText },
  { key: 'other', label: 'Other Documents', icon: FileText }
];

export function UploadModal({ isOpen, onClose, type }: UploadModalProps) {
  const [selectedType, setSelectedType] = React.useState('');
  const [dragOver, setDragOver] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);

  const handleEscapeKey = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, handleEscapeKey]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const handleUpload = () => {
    // Handle upload logic here
    console.log('Uploading files:', files, 'Type:', selectedType);
    
    // Show success feedback
    alert(`Successfully uploaded ${files.length} files to ${selectedType} category`);
    onClose();
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto"
        aria-describedby="upload-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Documents to Vault
          </DialogTitle>
          <DialogDescription id="upload-description">
            Securely upload important documents to your family vault with end-to-end encryption
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Document Type Selection */}
          <div className="space-y-3">
            <h3 className="font-medium">Document Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {DOCUMENT_TYPES.map((docType) => (
                <Button
                  key={docType.key}
                  variant={selectedType === docType.key ? "default" : "outline"}
                  className={cn(
                    "justify-start h-auto p-3",
                    "min-h-[44px]"
                  )}
                  onClick={() => setSelectedType(docType.key)}
                >
                  <docType.icon className="w-4 h-4 mr-2" />
                  {docType.label}
                </Button>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragOver ? "border-primary bg-primary/5" : "border-muted",
              "hover:border-primary/50"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Drop files here or click to browse</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button variant="outline" className="cursor-pointer min-h-[44px]" asChild>
                <span>
                  <FileText className="w-4 h-4 mr-2" />
                  Choose Files
                </span>
              </Button>
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Selected Files</h3>
              {files.map((file, index) => (
                <Card key={index} className="p-2">
                  <CardContent className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Security Notice */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Bank-Level Security</p>
                  <p className="text-muted-foreground">
                    All documents are encrypted end-to-end and stored with AES-256 encryption. 
                    Only you and authorized family members can access these files.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 min-h-[44px]"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={files.length === 0 || !selectedType}
              className="flex-1 min-h-[44px]"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}