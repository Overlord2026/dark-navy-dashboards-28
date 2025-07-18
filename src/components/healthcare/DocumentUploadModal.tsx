
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (documentData: any, file?: File) => Promise<void>;
}

const DOCUMENT_TYPES = [
  { value: 'advance_directive', label: 'Advance Directive' },
  { value: 'living_will', label: 'Living Will' },
  { value: 'healthcare_poa', label: 'Healthcare Power of Attorney' },
  { value: 'dnr_order', label: 'Do Not Resuscitate Order' },
  { value: 'medical_records', label: 'Medical Records' },
  { value: 'insurance_card', label: 'Insurance Card' },
  { value: 'prescription_list', label: 'Prescription List' },
  { value: 'allergies_list', label: 'Allergies List' },
  { value: 'emergency_contacts', label: 'Emergency Contacts' },
  { value: 'other', label: 'Other' }
];

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpload 
}) => {
  const [formData, setFormData] = useState({
    document_name: '',
    doc_type: '',
    signer_name: '',
    signed_date: '',
    expires_on: '',
    is_emergency_accessible: false,
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    
    setFormData({
      document_name: '',
      doc_type: '',
      signer_name: '',
      signed_date: '',
      expires_on: '',
      is_emergency_accessible: false,
      description: ''
    });
    setSelectedFile(null);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-populate document name if not already filled
      if (!formData.document_name) {
        const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
        setFormData(prev => ({ ...prev, document_name: fileName }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.document_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Document name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.doc_type) {
      toast({
        title: "Validation Error", 
        description: "Document type is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpload({
        ...formData,
        file: selectedFile
      });
      
      handleClose();
      
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Healthcare Document</DialogTitle>
          <DialogDescription>
            Add a new document to your healthcare records
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="document-name">Document Name *</Label>
            <Input
              id="document-name"
              value={formData.document_name}
              onChange={(e) => setFormData(prev => ({ ...prev, document_name: e.target.value }))}
              placeholder="Enter document name"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-type">Document Type *</Label>
            <Select 
              value={formData.doc_type || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, doc_type: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signer-name">Signer Name</Label>
              <Input
                id="signer-name"
                value={formData.signer_name}
                onChange={(e) => setFormData(prev => ({ ...prev, signer_name: e.target.value }))}
                placeholder="Who signed this document"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signed-date">Date Signed</Label>
              <Input
                id="signed-date"
                type="date"
                value={formData.signed_date}
                onChange={(e) => setFormData(prev => ({ ...prev, signed_date: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires-on">Expiration Date</Label>
            <Input
              id="expires-on"
              type="date"
              value={formData.expires_on}
              onChange={(e) => setFormData(prev => ({ ...prev, expires_on: e.target.value }))}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional notes about this document"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload File</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                className="hidden"
                disabled={isSubmitting}
              />
              <div 
                className="text-center cursor-pointer"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload a file or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="emergency-access"
              type="checkbox"
              checked={formData.is_emergency_accessible}
              onChange={(e) => setFormData(prev => ({ ...prev, is_emergency_accessible: e.target.checked }))}
              className="rounded border-gray-300"
              disabled={isSubmitting}
            />
            <Label htmlFor="emergency-access" className="text-sm">
              Allow emergency access to this document
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !formData.document_name.trim() || !formData.doc_type}>
            {isSubmitting ? 'Uploading...' : 'Upload Document'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
