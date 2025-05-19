
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { File, Link } from "lucide-react";
import { FileInfo } from "./types/documentDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentUploadFormProps {
  initialDocumentName?: string;
  onFileChange: (fileInfo: FileInfo | null) => void;
  fileInfo: FileInfo | null;
}

export function DocumentUploadForm({ initialDocumentName, onFileChange, fileInfo }: DocumentUploadFormProps) {
  const [documentName, setDocumentName] = useState(initialDocumentName || "");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [activeTab, setActiveTab] = useState<string>("file-upload");
  
  useEffect(() => {
    if (fileInfo?.file !== selectedFile) {
      setSelectedFile(fileInfo?.file || null);
    }
    if (fileInfo?.name !== documentName && fileInfo?.name) {
      setDocumentName(fileInfo.name);
    }
    if (fileInfo?.description !== description && fileInfo?.description) {
      setDescription(fileInfo.description);
    }
    if (fileInfo?.url !== documentUrl && fileInfo?.url) {
      setDocumentUrl(fileInfo.url);
      setActiveTab("external-link");
    }
  }, [fileInfo]);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setDocumentUrl("");
    if (!documentName) {
      // Set a default document name based on the file name
      const newName = file.name.split('.')[0];
      setDocumentName(newName);
      onFileChange({ file, name: newName, description });
    } else {
      onFileChange({ file, name: documentName, description });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentName(e.target.value);
    if (activeTab === "file-upload" && selectedFile) {
      onFileChange({ file: selectedFile, name: e.target.value, description });
    } else if (activeTab === "external-link" && documentUrl) {
      onFileChange({ url: documentUrl, name: e.target.value, description, isExternalLink: true });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (activeTab === "file-upload" && selectedFile) {
      onFileChange({ file: selectedFile, name: documentName, description: e.target.value });
    } else if (activeTab === "external-link" && documentUrl) {
      onFileChange({ url: documentUrl, name: documentName, description: e.target.value, isExternalLink: true });
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setDocumentUrl(url);
    onFileChange({
      url,
      name: documentName,
      description,
      isExternalLink: true
    });
  };

  const clearFile = () => {
    if (activeTab === "file-upload") {
      setSelectedFile(null);
    } else {
      setDocumentUrl("");
    }
    onFileChange(null);
  };

  const isValidGoogleDriveUrl = (url: string): boolean => {
    return url.includes('drive.google.com');
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
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Add a brief description of this document"
          rows={3}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file-upload" className="flex items-center gap-2">
            <File className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="external-link" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            External Link
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="file-upload" className="space-y-2">
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
        </TabsContent>
        
        <TabsContent value="external-link" className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="document-url">Document URL (Google Drive)</Label>
            <Input
              id="document-url"
              value={documentUrl}
              onChange={handleUrlChange}
              placeholder="https://drive.google.com/file/d/..."
            />
            
            {documentUrl && (
              <div className={`mt-2 text-sm ${isValidGoogleDriveUrl(documentUrl) ? 'text-green-500' : 'text-red-500'}`}>
                {isValidGoogleDriveUrl(documentUrl) 
                  ? 'Valid Google Drive link'
                  : 'Please enter a valid Google Drive link'}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
