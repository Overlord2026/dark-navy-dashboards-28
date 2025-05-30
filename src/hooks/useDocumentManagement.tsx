
import { useState } from "react";
import { DocumentItem, DocumentType, DocumentPermission } from "@/types/document";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseDocumentManagement } from "./useSupabaseDocumentManagement";
import { useAuth } from "@/context/AuthContext";

interface ShareDocumentOptions {
  documentId: string;
  professionalId: string;
  professionalName: string;
  professionalRole: string;
  permission: string;
}

export const useDocumentManagement = (useSupabase: boolean = true) => {
  const { isAuthenticated } = useAuth();
  const supabaseHook = useSupabaseDocumentManagement();
  
  // Fallback state for when not using Supabase
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<DocumentItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  // Use Supabase if authenticated and enabled, otherwise use local state
  const shouldUseSupabase = useSupabase && isAuthenticated;

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

    if (shouldUseSupabase) {
      await supabaseHook.handleCreateFolder(folderName, documentCategory);
    } else {
      // Fallback to local state
      const newFolder: DocumentItem = {
        id: `folder-${Math.random().toString(36).substring(2, 9)}`,
        name: folderName,
        type: "folder" as DocumentType,
        created: new Date().toLocaleDateString(),
        category: documentCategory,
        size: "—",
        isFolder: true
      };
      
      setDocuments(prevDocs => [...prevDocs, newFolder]);
      
      toast({
        title: "Folder created",
        description: `Created folder: ${folderName}`
      });
    }
  };

  const handleFileUpload = async (file: File, customName: string, category: string = "documents") => {
    const documentCategory = activeCategory || category;
    
    if (!documentCategory) {
      toast({
        title: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    if (shouldUseSupabase) {
      return await supabaseHook.handleFileUpload(file, customName, documentCategory);
    } else {
      // Fallback to local state
      let documentType: DocumentType = "document";
      if (file.type.includes("pdf")) {
        documentType = "pdf";
      } else if (file.type.includes("image")) {
        documentType = "image";
      } else if (file.type.includes("spreadsheet") || file.type.includes("excel") || file.type.includes("csv")) {
        documentType = "spreadsheet";
      }
      
      const newDocument: DocumentItem = {
        id: `doc-${Math.random().toString(36).substring(2, 9)}`,
        name: customName || file.name,
        created: new Date().toLocaleDateString(),
        type: documentType,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        category: documentCategory
      };
      
      setDocuments(prevDocs => [...prevDocs, newDocument]);
      
      toast({
        title: "File uploaded",
        description: `${newDocument.name} has been uploaded successfully`
      });

      return newDocument;
    }
  };

  const shareDocument = (options: ShareDocumentOptions) => {
    if (shouldUseSupabase) {
      return supabaseHook.shareDocument(
        options.documentId,
        options.professionalId, // Using as email
        options.professionalName,
        options.professionalRole,
        options.permission
      );
    } else {
      // Fallback implementation
      const { documentId, professionalId, professionalName, professionalRole, permission } = options;
      
      const documentToShare = [...documents, ...getSampleDocuments()].find(doc => doc.id === documentId);
      
      if (!documentToShare) {
        toast({
          title: "Document not found",
          variant: "destructive"
        });
        return;
      }
      
      const newPermission: DocumentPermission = {
        userId: professionalId,
        userName: professionalName,
        userEmail: professionalId,
        userRole: professionalRole,
        accessLevel: permission as any,
        grantedBy: "Owner",
        grantedAt: new Date().toISOString()
      };
      
      const sharedDocument: DocumentItem = {
        ...documentToShare,
        sharedWith: [...(documentToShare.sharedWith || []), professionalId],
        permissions: [...(documentToShare.permissions || []), newPermission]
      };
      
      setSharedDocuments(prevSharedDocs => {
        const existingDocIndex = prevSharedDocs.findIndex(doc => doc.id === documentId);
        
        if (existingDocIndex >= 0) {
          const updatedDocs = [...prevSharedDocs];
          updatedDocs[existingDocIndex] = sharedDocument;
          return updatedDocs;
        } else {
          return [...prevSharedDocs, sharedDocument];
        }
      });
      
      toast({
        title: "Document shared",
        description: `${documentToShare.name} has been shared with ${professionalName}`
      });
      
      return sharedDocument;
    }
  };

  const deleteSharedDocument = (documentId: string) => {
    if (shouldUseSupabase) {
      return supabaseHook.deleteSharedDocument(documentId);
    } else {
      setSharedDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
    }
  };

  const updateDocumentPermissions = (documentId: string, permissions: DocumentPermission[]) => {
    if (shouldUseSupabase) {
      // This would need to be implemented for multiple permissions
      console.log('Update permissions not implemented for Supabase yet');
    } else {
      setSharedDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === documentId 
            ? { ...doc, permissions } 
            : doc
        )
      );
    }
  };
  
  const getAllDocuments = () => {
    if (shouldUseSupabase) {
      return supabaseHook.documents.length > 0 ? supabaseHook.documents : getSampleDocuments();
    } else {
      return documents.length === 0 ? getSampleDocuments() : [...documents, ...getSampleDocuments()];
    }
  };

  const getFilteredDocuments = () => {
    if (shouldUseSupabase) {
      return supabaseHook.filteredDocuments(activeCategory);
    } else {
      return getAllDocuments().filter(doc => !activeCategory || doc.category === activeCategory);
    }
  };

  return {
    documents: getAllDocuments(),
    sharedDocuments: shouldUseSupabase ? [] : sharedDocuments,
    activeCategory,
    isUploadDialogOpen,
    loading: shouldUseSupabase ? supabaseHook.loading : false,
    error: shouldUseSupabase ? supabaseHook.error : null,
    setActiveCategory,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleFileUpload,
    shareDocument,
    deleteSharedDocument,
    updateDocumentPermissions,
    filteredDocuments: getFilteredDocuments(),
    refetch: shouldUseSupabase ? supabaseHook.refetch : () => {}
  };
};

// Sample documents for fallback
function getSampleDocuments(): DocumentItem[] {
  return [
    {
      id: "doc-1",
      name: "Tax Return 2024.pdf",
      type: "pdf",
      created: "04/02/2025",
      category: "taxes",
      size: "2.4 MB"
    },
    {
      id: "doc-2",
      name: "Estate Plan Draft.docx",
      type: "document",
      created: "03/28/2025",
      category: "estate-planning",
      size: "1.2 MB"
    },
    {
      id: "doc-3",
      name: "Investment Portfolio Analysis.xlsx",
      type: "spreadsheet",
      created: "03/15/2025",
      category: "statements",
      size: "3.7 MB"
    }
  ];
}
