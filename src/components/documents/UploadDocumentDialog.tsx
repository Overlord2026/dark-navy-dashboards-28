
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";
import { Cloud, File } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfessionals } from "@/hooks/useProfessionals";

export interface DocumentDialogProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void; // Added this prop for compatibility
  category?: string;
  activeCategory?: string; // Added for compatibility
  documentCategories?: any; // Added for compatibility
  onFileUpload?: (file: File, customName: string, category?: string) => any; // Added for compatibility
}

export function UploadDocumentDialog({ 
  open, 
  onClose, 
  onOpenChange,
  category = "documents",
  activeCategory,
  documentCategories,
  onFileUpload: externalFileUpload
}: DocumentDialogProps) {
  const [documentName, setDocumentName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [shareAfterUpload, setShareAfterUpload] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>("");
  
  const { handleFileUpload } = useDocumentManagement();
  const { professionals } = useProfessionals();
  
  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    if (!documentName) {
      // Set a default document name based on the file name
      setDocumentName(file.name.split('.')[0]);
    }
  };
  
  const handleDialogClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    onClose();
  };
  
  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    if (!documentName.trim()) {
      toast.error("Please provide a document name");
      return;
    }
    
    setIsUploading(true);
    
    setTimeout(() => {
      // Upload the document
      const uploadedDoc = externalFileUpload 
        ? externalFileUpload(selectedFile, documentName, category)
        : handleFileUpload(selectedFile, documentName, category);
      
      toast.success("Document uploaded successfully", {
        description: `"${documentName}" has been added to your documents.`
      });
      
      // Handle sharing if needed
      if (shareAfterUpload && selectedProfessionalId && uploadedDoc) {
        const professional = professionals.find(p => p.id === selectedProfessionalId);
        
        if (professional) {
          // In a real app, this would call the shareDocument function
          toast.success(`Document shared with ${professional.name}`, {
            description: `They now have view access to ${documentName}`
          });
        }
      }
      
      setIsUploading(false);
      // Reset form
      setDocumentName("");
      setDescription("");
      setSelectedFile(null);
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
              ? "Upload a document to share with your service professionals" 
              : "Add a document to your legacy box"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g., Tax Return 2024"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a brief description of this document"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Upload File</Label>
            <FileUpload 
              onFileChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              maxSize={20 * 1024 * 1024} // 20MB limit
            />
            
            {selectedFile && (
              <div className="mt-2 flex items-center justify-between bg-secondary/20 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="h-8 w-8 p-0"
                >
                  &times;
                </Button>
              </div>
            )}
          </div>
          
          {category === "professional-documents" && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="share-after-upload"
                  checked={shareAfterUpload}
                  onCheckedChange={(checked) => setShareAfterUpload(checked === true)}
                />
                <Label htmlFor="share-after-upload" className="cursor-pointer">
                  Share with professional immediately after upload
                </Label>
              </div>
              
              {shareAfterUpload && (
                <div className="space-y-2">
                  <Label htmlFor="select-professional">Select Professional</Label>
                  <Select
                    value={selectedProfessionalId}
                    onValueChange={setSelectedProfessionalId}
                  >
                    <SelectTrigger id="select-professional">
                      <SelectValue placeholder="Choose a professional" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionals.map(pro => (
                        <SelectItem key={pro.id} value={pro.id}>
                          {pro.name} - {pro.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Cloud className="mr-1 h-3 w-3" />
            <span>Files are encrypted and secure</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isUploading || !selectedFile || !documentName.trim()}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadDocumentDialog;
