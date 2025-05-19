
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Cloud, Link as LinkIcon } from "lucide-react";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { useProfessionals } from "@/hooks/useProfessionals";
import { DocumentDialogProps, FileInfo } from "./types/documentDialog";
import { DocumentUploadForm } from "./DocumentUploadForm";
import { DocumentSharingOptions } from "./DocumentSharingOptions";

export function UploadDocumentDialog({ 
  open, 
  onClose, 
  onOpenChange,
  category = "documents",
  activeCategory,
  documentCategories,
  onFileUpload: externalFileUpload,
  onLinkAdd: externalLinkAdd
}: DocumentDialogProps) {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [shareAfterUpload, setShareAfterUpload] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>("");
  
  const { handleFileUpload, handleLinkAdd } = useDocumentManagement();
  const { professionals } = useProfessionals();
  
  const handleDialogClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    onClose();
  };
  
  const handleSubmit = () => {
    if (!fileInfo) {
      toast.error("Please select a file or enter an external link");
      return;
    }
    
    if (!fileInfo.name.trim()) {
      toast.error("Please provide a document name");
      return;
    }
    
    setIsUploading(true);
    
    setTimeout(() => {
      let uploadedDoc;
      
      // Handle external link
      if (fileInfo.isExternalLink && fileInfo.url) {
        uploadedDoc = externalLinkAdd 
          ? externalLinkAdd(fileInfo.url, fileInfo.name, fileInfo.description, category)
          : handleLinkAdd(fileInfo.url, fileInfo.name, fileInfo.description, category);
        
        toast.success("Link added successfully", {
          description: `"${fileInfo.name}" has been added to your documents.`
        });
      } 
      // Handle file upload
      else if (fileInfo.file) {
        uploadedDoc = externalFileUpload 
          ? externalFileUpload(fileInfo.file, fileInfo.name, category)
          : handleFileUpload(fileInfo.file, fileInfo.name, category);
        
        toast.success("Document uploaded successfully", {
          description: `"${fileInfo.name}" has been added to your documents.`
        });
      }
      
      // Handle sharing if needed
      if (shareAfterUpload && selectedProfessionalId && uploadedDoc) {
        const professional = professionals.find(p => p.id === selectedProfessionalId);
        
        if (professional) {
          // In a real app, this would call the shareDocument function
          toast.success(`Document shared with ${professional.name}`, {
            description: `They now have view access to ${fileInfo.name}`
          });
        }
      }
      
      setIsUploading(false);
      // Reset form
      setFileInfo(null);
      setShareAfterUpload(false);
      setSelectedProfessionalId("");
      handleDialogClose();
    }, 1500);
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            {category === "professional-documents" 
              ? "Upload a document or link to share with your service professionals" 
              : "Add a document or link to your legacy box"}
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
            {fileInfo?.isExternalLink ? (
              <div className="flex items-center">
                <LinkIcon className="mr-1 h-3 w-3" />
                <span>External links may have different security</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Cloud className="mr-1 h-3 w-3" />
                <span>Files are encrypted and secure</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isUploading || !fileInfo || (!fileInfo.file && !fileInfo.url) || !fileInfo.name.trim()}
            >
              {isUploading ? "Processing..." : fileInfo?.isExternalLink ? "Add Link" : "Upload"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadDocumentDialog;
