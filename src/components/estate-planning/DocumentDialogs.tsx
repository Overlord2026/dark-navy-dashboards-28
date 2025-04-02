
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";
import { Cloud, File } from "lucide-react";

export interface DocumentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function TaxReturnUploadDialog({ open, onClose }: DocumentDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (file: File) => {
    setFiles(prev => [...prev, file]);
  };

  const handleUpload = () => {
    if (files.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      toast.success(`Successfully uploaded ${files.length} file(s)`, {
        description: "Your tax documents have been securely uploaded."
      });
      setIsUploading(false);
      setFiles([]);
      onClose();
    }, 1500);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Tax Returns</DialogTitle>
          <DialogDescription>
            Securely upload your tax returns for professional review and optimization recommendations
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <FileUpload 
            onFileChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            maxSize={10 * 1024 * 1024} // 10MB limit
          />
          
          {files.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium">Selected Files:</p>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-secondary/20 p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0"
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Cloud className="mr-1 h-3 w-3" />
            <span>Files are encrypted and secure</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
