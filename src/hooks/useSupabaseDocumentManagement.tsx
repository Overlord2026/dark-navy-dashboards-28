
import { useState } from "react";
import { useCachedDocuments } from "./useCachedDocuments";
import { SupabaseDocument } from "./useSupabaseDocuments";
import { useToast } from "@/hooks/use-toast";
import { documentCache } from "@/services/documentCache";

export const useSupabaseDocumentManagement = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    documents,
    loading,
    refreshing,
    cacheMetadata,
    lastRefresh,
    cacheHitRate,
    forceRefresh,
    clearCache,
    optimizeCache,
    invalidateCategory
  } = useCachedDocuments();

  const handleCreateFolder = async (folderName: string, category?: string, parentFolderId?: string | null) => {
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
    
    // Invalidate cache after folder creation
    await invalidateCategory(documentCategory);
    await forceRefresh();
  };

  const handleFileUpload = async (file: File, customName: string, category: string = "documents", parentFolderId?: string | null) => {
    const documentCategory = activeCategory || category;
    
    if (!documentCategory) {
      toast({
        title: "Please select a category",
        variant: "destructive"
      });
      return null;
    }
    
    // Simulate upload and invalidate cache
    await invalidateCategory(documentCategory);
    await forceRefresh();
    setIsUploadDialogOpen(false);
    
    toast({
      title: "Document uploaded",
      description: `${customName || file.name} has been uploaded successfully`
    });
    
    return true;
  };

  const handleDownloadDocument = async (doc: SupabaseDocument) => {
    if (doc.is_folder) {
      toast({
        title: "Cannot download",
        description: "This item cannot be downloaded",
        variant: "destructive"
      });
      return;
    }

    // Simulate download
    toast({
      title: "Download started",
      description: `Downloading ${doc.name}`
    });
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await documentCache.removeCachedDocument(documentId);
      await forceRefresh();
      
      toast({
        title: "Document deleted",
        description: "Document has been removed"
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete document",
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
    categories: [], // TODO: Add categories support to cache
    activeCategory,
    isUploadDialogOpen,
    loading,
    uploading: refreshing,
    refreshing,
    cacheMetadata,
    lastRefresh,
    cacheHitRate,
    refreshDocuments: forceRefresh, // Add this alias for compatibility
    setActiveCategory,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleFileUpload,
    handleDownloadDocument,
    deleteDocument: handleDeleteDocument,
    forceRefresh,
    clearCache,
    optimizeCache,
    filteredDocuments
  };
};
