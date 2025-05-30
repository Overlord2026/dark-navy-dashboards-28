
import { useState } from "react";
import { useSupabaseDocuments, SupabaseDocument } from "./useSupabaseDocuments";
import { useToast } from "@/hooks/use-toast";

export const useSupabaseDocumentManagement = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    documents,
    categories,
    loading,
    uploading,
    uploadDocument,
    createFolder,
    deleteDocument,
    getDocumentUrl,
    refreshDocuments
  } = useSupabaseDocuments();

  const handleCreateFolder = async (folderName: string, category?: string) => {
    if (!folderName.trim()) {
      toast({
        title: "Please enter a folder name",
        variant: "destructive"
      });
      return;
    }
    
    const documentCategory = category || activeCategory;
    
    if (!documentCategory) {
      toast({
        title: "Please select a category",
        variant: "destructive"
      });
      return;
    }
    
    await createFolder(folderName, documentCategory);
  };

  const handleFileUpload = async (file: File, customName: string, category: string = "documents") => {
    const documentCategory = activeCategory || category;
    
    if (!documentCategory) {
      toast({
        title: "Please select a category",
        variant: "destructive"
      });
      return null;
    }
    
    const result = await uploadDocument(file, customName || file.name, documentCategory);
    if (result) {
      setIsUploadDialogOpen(false);
    }
    return result;
  };

  const handleDownloadDocument = async (document: SupabaseDocument) => {
    if (!document.file_path || document.is_folder) {
      toast({
        title: "Cannot download",
        description: "This item cannot be downloaded",
        variant: "destructive"
      });
      return;
    }

    const url = await getDocumentUrl(document.file_path);
    if (url) {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${document.name}`
      });
    } else {
      toast({
        title: "Download failed",
        description: "Could not generate download link",
        variant: "destructive"
      });
    }
  };

  // Get filtered documents based on active category
  const filteredDocuments = activeCategory 
    ? documents.filter(doc => doc.category === activeCategory)
    : documents;

  return {
    documents: filteredDocuments,
    allDocuments: documents,
    categories,
    activeCategory,
    isUploadDialogOpen,
    loading,
    uploading,
    setActiveCategory,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleFileUpload,
    handleDownloadDocument,
    deleteDocument,
    refreshDocuments,
    filteredDocuments
  };
};
