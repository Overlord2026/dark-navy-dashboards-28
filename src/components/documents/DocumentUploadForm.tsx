
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { File } from "lucide-react";
import { FileInfo } from "./types/documentDialog";

interface DocumentUploadFormProps {
  initialDocumentName?: string;
  onFileChange: (fileInfo: FileInfo | null) => void;
  fileInfo: FileInfo | null;
}

export function DocumentUploadForm({ initialDocumentName, onFileChange, fileInfo }: DocumentUploadFormProps) {
  const [documentName, setDocumentName] = useState(initialDocumentName || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  useEffect(() => {
    if (fileInfo?.file !== selectedFile) {
      setSelectedFile(fileInfo?.file || null);
    }
    if (fileInfo?.name !== documentName && fileInfo?.name) {
      setDocumentName(fileInfo.name);
    }
  }, [fileInfo]);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    if (!documentName) {
      // Set a default document name based on the file name
      const newName = file.name.split('.')[0];
      setDocumentName(newName);
      onFileChange({ file, name: newName, description: "" });
    } else {
      onFileChange({ file, name: documentName, description: "" });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentName(e.target.value);
    if (selectedFile) {
      onFileChange({ file: selectedFile, name: e.target.value, description: "" });
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    onFileChange(null);
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="document-name">Document Name</Label>
        <Input
          id="document-name"
          value={documentName}
          onChange={handleNameChange}
          placeholder="e.g., Tax Return 2024"
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
              onClick={clearFile}
              className="h-8 w-8 p-0"
            >
              &times;
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
