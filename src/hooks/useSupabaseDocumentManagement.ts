
import { useSupabaseDocuments } from './useSupabaseDocuments';
import { useDocumentPermissions } from './useDocumentPermissions';
import { DocumentItem } from '@/types/document';

// Wrapper hook that combines both document and permission management
export const useSupabaseDocumentManagement = () => {
  const {
    documents,
    loading: documentsLoading,
    error: documentsError,
    uploadDocument,
    createFolder,
    deleteDocument: deleteDoc,
    updateDocument,
    downloadDocument,
    getDocumentsByCategory,
    refetch
  } = useSupabaseDocuments();

  const {
    shareDocument,
    updatePermission,
    removePermission,
    getDocumentPermissions,
    loading: permissionsLoading
  } = useDocumentPermissions();

  const handleFileUpload = async (file: File, customName: string, category: string = "documents"): Promise<DocumentItem | null> => {
    return await uploadDocument(file, customName, category);
  };

  const handleCreateFolder = async (folderName: string, category: string = "documents"): Promise<DocumentItem | null> => {
    return await createFolder(folderName, category);
  };

  const deleteSharedDocument = async (documentId: string): Promise<boolean> => {
    return await deleteDoc(documentId);
  };

  const updateDocumentPermissions = async (documentId: string, userEmail: string, newAccessLevel: string): Promise<boolean> => {
    return await updatePermission(documentId, userEmail, newAccessLevel);
  };

  const filteredDocuments = (activeCategory: string | null) => {
    return getDocumentsByCategory(activeCategory);
  };

  return {
    // Documents
    documents,
    loading: documentsLoading || permissionsLoading,
    error: documentsError,
    handleFileUpload,
    handleCreateFolder,
    deleteDocument: deleteDoc,
    deleteSharedDocument,
    updateDocument,
    downloadDocument,
    filteredDocuments,
    refetch,
    
    // Permissions
    shareDocument,
    updateDocumentPermissions,
    removePermission,
    getDocumentPermissions,
    
    // Compatibility with existing useDocumentManagement interface
    activeCategory: null,
    isUploadDialogOpen: false,
    setActiveCategory: () => {},
    setIsUploadDialogOpen: () => {},
    sharedDocuments: [] // This would need to be implemented if needed
  };
};
