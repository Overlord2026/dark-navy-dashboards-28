
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react";
import { DocumentUploadForm } from "./DocumentUploadForm";
import { DocumentSharingOptions } from "./DocumentSharingOptions";
import { FileInfo } from "./types/documentDialog";

interface SupabaseDocumentUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  category?: string;
  activeCategory: string | null;
  categories: Array<{ id: string; name: string; description?: string }>;
  onFileUpload: (file: File, name: string, category: string) => Promise<any>;
  uploading?: boolean;
}

export function SupabaseDocumentUploadDialog({ 
  open, 
  onClose, 
  onOpenChange,
  category = "documents",
  activeCategory,
  categories,
  onFileUpload,
  uploading = false
}: SupabaseDocumentUploadDialogProps) {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [shareAfterUpload, setShareAfterUpload] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>("");
  
  const handleDialogClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    onClose();
  };
  
  const handleSubmit = async () => {
    if (!fileInfo?.file) {
      return;
    }
    
    if (!fileInfo.name.trim()) {
      return;
    }
    
    try {
      const result = await onFileUpload(fileInfo.file, fileInfo.name, activeCategory || category);
      
      if (result) {
        // Reset form
        setFileInfo(null);
        setShareAfterUpload(false);
        setSelectedProfessionalId("");
        handleDialogClose();
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            {category === "professional-documents" 
              ? "Upload a document to share with your service professionals" 
              : "Add a document to your document vault"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <DocumentUploadForm 
            fileInfo={fileInfo} 
            onFileChange={setFileInfo}
          />
          
          <DocumentSharingOptions
            category={category}
            shareAfterUpload={shareAfterUpload}
            selectedProfessionalId={selectedProfessionalId}
            onShareChange={setShareAfterUpload}
            onProfessionalSelect={setSelectedProfessionalId}
          />
        </div>
        
        <DialogFooter className="sm:justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Cloud className="mr-1 h-3 w-3" />
            <span>Files are encrypted and secure</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDialogClose} disabled={uploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={uploading || !fileInfo?.file || !fileInfo?.name.trim()}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
