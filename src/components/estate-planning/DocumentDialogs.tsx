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

export interface DocumentDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface ShareDocumentDialogProps extends DocumentDialogProps {
  documentId: string;
  onShare?: (documentId: string, sharedWith: string[]) => void;
}

export interface UploadDocumentDialogProps extends DocumentDialogProps {
  documentType: string;
  onUpload?: (documentType: string, data: any) => void;
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

export function UploadDocumentDialog({ open, onClose, documentType, onUpload }: UploadDocumentDialogProps) {
  const [documentName, setDocumentName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    if (!documentName) {
      setDocumentName(file.name.split('.')[0]);
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    if (!documentName.trim()) {
      toast.error("Please provide a document name");
      return;
    }
    
    setIsUploading(true);
    
    try {
      if (onUpload) {
        await onUpload(documentType, {
          documentName,
          description,
          file: selectedFile,
        });
      }
      
      // Reset form
      setDocumentName("");
      setDescription("");
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a document to your legacy box
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g., Last Will and Testament"
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isUploading || !selectedFile || !documentName.trim()}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ShareDocumentDialog({ open, onClose, documentId, onShare }: ShareDocumentDialogProps) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  
  // Sample contacts data
  const contactOptions = [
    { id: "1", name: "James Wilson", role: "Estate Attorney" },
    { id: "2", name: "Sarah Johnson", role: "Financial Advisor" },
    { id: "3", name: "Michael Brown", role: "CPA" },
    { id: "4", name: "Jennifer Davis", role: "Insurance Agent" },
    { id: "101", name: "Robert Smith", role: "Spouse" },
    { id: "102", name: "Emma Smith", role: "Child" },
    { id: "103", name: "Daniel Smith", role: "Child" },
    { id: "104", name: "Margaret Johnson", role: "Parent" },
  ];
  
  const handleToggleContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId) 
        : [...prev, contactId]
    );
  };
  
  const handleShare = async () => {
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact to share with");
      return;
    }
    
    setIsSharing(true);
    
    try {
      const contactNames = selectedContacts.map(id => 
        contactOptions.find(c => c.id === id)?.name + " (" + contactOptions.find(c => c.id === id)?.role + ")"
      ).filter(Boolean);
      
      if (onShare) {
        await onShare(documentId, contactNames);
      }
      
      setSelectedContacts([]);
      onClose();
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Select people to share this document with
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Professionals</h4>
            <div className="space-y-2">
              {contactOptions.filter(c => parseInt(c.id) < 100).map(contact => (
                <div key={contact.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`contact-${contact.id}`}
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => handleToggleContact(contact.id)}
                  />
                  <Label 
                    htmlFor={`contact-${contact.id}`}
                    className="flex-1 flex justify-between text-sm"
                  >
                    <span>{contact.name}</span>
                    <span className="text-muted-foreground">{contact.role}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Family Members</h4>
            <div className="space-y-2">
              {contactOptions.filter(c => parseInt(c.id) >= 100).map(contact => (
                <div key={contact.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`contact-${contact.id}`}
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => handleToggleContact(contact.id)}
                  />
                  <Label 
                    htmlFor={`contact-${contact.id}`}
                    className="flex-1 flex justify-between text-sm"
                  >
                    <span>{contact.name}</span>
                    <span className="text-muted-foreground">{contact.role}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={isSharing || selectedContacts.length === 0}
          >
            {isSharing ? "Sharing..." : "Share Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
