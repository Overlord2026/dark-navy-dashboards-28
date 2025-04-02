
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { Upload, File, FileTextIcon, FileImage, Table } from "lucide-react";

export interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: (file: File, customName: string) => void;
  activeCategory?: string | null;
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

  // Get appropriate icon based on file type
  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.includes('pdf')) {
      return <FileTextIcon className="h-10 w-10 text-red-500" />;
    } else if (type.includes('image')) {
      return <FileImage className="h-10 w-10 text-blue-500" />;
    } else if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) {
      return <Table className="h-10 w-10 text-green-500" />;
    }
    return <File className="h-10 w-10 text-gray-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload document</DialogTitle>
          <DialogDescription>
            {activeCategory 
              ? `Upload a document to ${activeCategoryName}.`
              : 'Please select a category before uploading documents.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file" className="text-sm font-medium">File</Label>
            <FileUpload
              onFileChange={handleFileChange}
              accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.txt"
              className="w-full"
            />
          </div>
          
          {selectedFile && (
            <>
              <div className="flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
                <div className="flex flex-col items-center gap-2">
                  {getFileIcon(selectedFile)}
                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">Document Name</Label>
                <Input
                  id="name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter a custom name for this document"
                  className="border-gray-300"
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => handleDialogChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedFile || !activeCategory}
            variant="vault"
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
