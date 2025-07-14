import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (documentData: any, file?: File) => Promise<void>;
}

const documentTypes = [
  { value: 'lab_results', label: 'Lab Results' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'insurance_card', label: 'Insurance Card' },
  { value: 'medical_history', label: 'Medical History' },
  { value: 'imaging', label: 'Imaging/X-rays' },
  { value: 'discharge_summary', label: 'Discharge Summary' },
  { value: 'advance_directive', label: 'Advance Directive' },
  { value: 'healthcare_poa', label: 'Healthcare Power of Attorney' },
  { value: 'living_will', label: 'Living Will' },
  { value: 'other', label: 'Other' },
];

const categories = [
  { value: 'medical', label: 'Medical Records' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'lab', label: 'Laboratory' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'legal', label: 'Legal Documents' },
];

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    description: '',
    tags: '',
    is_private: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    if (!formData.name) {
      setFormData(prev => ({ ...prev, name: file.name }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.category) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const documentData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        doc_type: formData.type,
        document_name: formData.name,
      };
      
      await onUpload(documentData, selectedFile || undefined);
      
      // Reset form
      setFormData({
        name: '',
        type: '',
        category: '',
        description: '',
        tags: '',
        is_private: true,
      });
      setSelectedFile(null);
      onClose();
      
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been saved securely.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      category: '',
      description: '',
      tags: '',
      is_private: true,
    });
    setSelectedFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>Upload Healthcare Document</DialogTitle>
          <DialogDescription>
            Add a new document to your healthcare records. All documents are encrypted and secure.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            {selectedFile ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Drop your file here or</p>
                  <Label htmlFor="file-upload" className="text-primary cursor-pointer hover:underline">
                    browse files
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX, JPG, PNG up to 10MB
                </p>
              </div>
            )}
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
          </div>

          {/* Document Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Document Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter document name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Document Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
                required
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  {documentTypes.map((type) => (
                    <SelectItem 
                      key={type.value} 
                      value={type.value}
                      className="hover:bg-muted focus:bg-muted"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              required
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                {categories.map((category) => (
                  <SelectItem 
                    key={category.value} 
                    value={category.value}
                    className="hover:bg-muted focus:bg-muted"
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Optional description or notes"
              rows={3}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas"
              className="bg-background"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};