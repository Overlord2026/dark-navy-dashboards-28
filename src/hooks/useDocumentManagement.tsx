
import { useState, useCallback } from "react";
import { DocumentItem, DocumentType, DocumentCategory } from "@/types/document";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export const useDocumentManagement = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateFolder = useCallback((folderName: string) => {
    if (!folderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }
    
    if (!activeCategory) {
      toast.error("Please select a category first");
      return;
    }
    
    const newDocument: DocumentItem = {
      id: uuidv4(),
      name: folderName,
      created: new Date().toISOString(),
      type: "folder",
      size: "0 KB",
      category: activeCategory
    };
    
    setDocuments(prev => [...prev, newDocument]);
    setIsNewFolderDialogOpen(false);
    
    toast.success(`Folder "${folderName}" created successfully`);
  }, [activeCategory]);

  const handleFileUpload = useCallback((file: File, customName: string) => {
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
      toast.error("Please select a category first");
      return;
    }
    
    const newDocument: DocumentItem = {
      id: uuidv4(),
      name: customName || file.name,
      created: new Date().toISOString(),
      type: documentType,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      category: activeCategory
    };
    
    setDocuments(prev => [...prev, newDocument]);
    setIsUploadDialogOpen(false);
    
    toast.success(`"${newDocument.name}" has been uploaded successfully to Legacy Vault`);
  }, [activeCategory]);

  const filteredDocuments = useCallback(() => {
    if (!activeCategory) return [];
    
    return documents
      .filter(doc => doc.category === activeCategory)
      .filter(doc => {
        if (!searchQuery) return true;
        return doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
  }, [documents, activeCategory, searchQuery]);

  const deleteDocument = useCallback((documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast.success("Document deleted successfully");
  }, []);

  return {
    documents,
    activeCategory,
    isUploadDialogOpen,
    isNewFolderDialogOpen,
    isLoading,
    searchQuery,
    setActiveCategory,
    setIsUploadDialogOpen,
    setIsNewFolderDialogOpen,
    setIsLoading,
    setSearchQuery,
    handleCreateFolder,
    handleFileUpload,
    filteredDocuments: filteredDocuments(),
    deleteDocument
  };
};
