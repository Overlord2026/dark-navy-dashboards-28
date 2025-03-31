
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploadField } from "@/components/documents/FileUploadField";
import { DocumentCategory } from "@/types/document";

export interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: (file: File, customName: string) => void;
  activeCategory?: string | null;
  documentCategories?: DocumentCategory[];
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  onFileUpload,
  activeCategory,
  documentCategories,
}: UploadDocumentDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customName, setCustomName] = useState("");

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    // Set default custom name based on file name if a file is selected
    if (file) {
      setCustomName(file.name.replace(/\.[^/.]+$/, ""));
    } else {
      setCustomName("");
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      // Call the actual upload handler
      onFileUpload(selectedFile, customName.trim() ? customName : selectedFile.name);
      handleReset();
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCustomName("");
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      handleReset();
    }
    onOpenChange(open);
  };

  const activeCategoryName = documentCategories?.find(cat => cat.id === activeCategory)?.name;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
          <DialogDescription>
            {activeCategory 
              ? `Upload a document to ${activeCategoryName}.`
              : 'Please select a category before uploading documents.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <FileUploadField
              onFileSelect={handleFileChange}
              accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.txt"
              label="Document File"
              description="Choose a file or drag & drop it here"
              showPreview={true}
            />
          </div>
          {selectedFile && (
            <div className="grid gap-2">
              <Label htmlFor="name">Document Name</Label>
              <Input
                id="name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter a custom name for this document"
              />
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => handleDialogChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedFile || !activeCategory}
            className="bg-[#1B1B32] hover:bg-[#2D2D4A] text-white"
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
