
import { useState } from "react";
import { DocumentItem, DocumentType } from "@/types/document";
import { useToast } from "@/hooks/use-toast";

export const useDocumentManagement = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateFolder = (folderName: string) => {
    if (!folderName.trim()) {
      toast({
        title: "Please enter a folder name",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Folder created",
      description: `Created folder: ${folderName}`
    });
  };

  const handleFileUpload = (file: File, customName: string) => {
    // Determine file type based on mime type
    let documentType: DocumentType = "document";
    if (file.type.includes("pdf")) {
      documentType = "pdf";
    } else if (file.type.includes("image")) {
      documentType = "image";
    } else if (file.type.includes("spreadsheet") || file.type.includes("excel") || file.type.includes("csv")) {
      documentType = "spreadsheet";
    }
    
    // Make sure we have an active category before uploading
    if (!activeCategory) {
      toast({
        title: "Please select a category",
        variant: "destructive"
      });
      return;
    }
    
    const newDocument: DocumentItem = {
      id: `doc-${Math.random().toString(36).substring(2, 9)}`,
      name: customName || file.name,
      created: new Date().toLocaleDateString(),
      type: documentType,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      category: activeCategory
    };
    
    setDocuments([...documents, newDocument]);
    setIsUploadDialogOpen(false);
    
    toast({
      title: "File uploaded",
      description: `${newDocument.name} has been uploaded successfully to BFO Legacy Vault`
    });
  };

  return {
    documents,
    activeCategory,
    isUploadDialogOpen,
    setActiveCategory,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleFileUpload,
    filteredDocuments: documents.filter(doc => doc.category === activeCategory)
  };
};
