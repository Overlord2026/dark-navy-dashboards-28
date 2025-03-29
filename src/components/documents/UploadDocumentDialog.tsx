
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { auditLog } from "@/services/auditLog/auditLogService";

export interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: (file: File, customName: string) => void;
  activeCategory?: string;
  documentCategories?: any[];
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

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    // Set default custom name based on file name
    setCustomName(file.name.replace(/\.[^/.]+$/, ""));
  };

  const handleSubmit = () => {
    if (selectedFile) {
      // Call the actual upload handler
      onFileUpload(selectedFile, customName.trim() ? customName : selectedFile.name);
      
      // Log the successful file upload to the audit log
      try {
        auditLog.log(
          "current-user", // In a real app, this would be the actual user ID
          "file_upload",
          "success",
          {
            userName: "Current User",
            userRole: "client",
            resourceType: "document",
            details: {
              fileName: customName.trim() ? customName : selectedFile.name,
              fileType: selectedFile.type,
              fileSize: selectedFile.size,
              category: activeCategory,
              uploadTime: new Date().toISOString()
            }
          }
        );
      } catch (error) {
        console.error("Failed to log document upload to audit log", error);
      }
      
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

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
          <DialogDescription>
            Upload a document to your secure vault.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            <FileUpload
              onFileChange={handleFileChange}
              accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.txt"
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
        <DialogFooter>
          <Button variant="outline" onClick={() => handleDialogChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedFile}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
