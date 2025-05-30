
import { useState } from "react";
import { DocumentItem, DocumentType, DocumentPermission } from "@/types/document";
import { useToast } from "@/hooks/use-toast";

interface ShareDocumentOptions {
  documentId: string;
  professionalId: string;
  professionalName: string;
  professionalRole: string;
  permission: string;
}

export const useDocumentManagement = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<DocumentItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateFolder = (folderName: string, category?: string) => {
    if (!folderName.trim()) {
      toast({
        title: "Please enter a folder name",
        variant: "destructive"
      });
      return;
    }
    
    // Use the provided category or the active category
    const documentCategory = category || activeCategory;
    
    if (!documentCategory) {
      toast({
        title: "Please select a category",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new folder document item
    const newFolder: DocumentItem = {
      id: `folder-${Math.random().toString(36).substring(2, 9)}`,
      name: folderName,
      type: "folder" as DocumentType,
      created: new Date().toLocaleDateString(),
      category: documentCategory,
      size: "—", // Folders don't have size
      isFolder: true
    };
    
    setDocuments(prevDocs => [...prevDocs, newFolder]);
    
    toast({
      title: "Folder created",
      description: `Created folder: ${folderName}`
    });
  };

  const handleFileUpload = (file: File, customName: string, category: string = "documents") => {
    // Determine file type based on mime type
    let documentType: DocumentType = "document";
    if (file.type.includes("pdf")) {
      documentType = "pdf";
    } else if (file.type.includes("image")) {
      documentType = "image";
    } else if (file.type.includes("spreadsheet") || file.type.includes("excel") || file.type.includes("csv")) {
      documentType = "spreadsheet";
    }
    
    // Make sure we have an active category or use the provided one
    const documentCategory = activeCategory || category;
    
    if (!documentCategory) {
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
      category: documentCategory
    };
    
    setDocuments(prevDocs => [...prevDocs, newDocument]);
    setIsUploadDialogOpen(false);
    
    toast({
      title: "File uploaded",
      description: `${newDocument.name} has been uploaded successfully to BFO Legacy Vault`
    });

    // Return the newly created document
    return newDocument;
  };

  const shareDocument = (options: ShareDocumentOptions) => {
    const { documentId, professionalId, professionalName, professionalRole, permission } = options;
    
    // Find the document to share
    const documentToShare = [...documents, ...getSampleDocuments()].find(doc => doc.id === documentId);
    
    if (!documentToShare) {
      toast({
        title: "Document not found",
        variant: "destructive"
      });
      return;
    }
    
    // Create a shared version of the document
    const newPermission: DocumentPermission = {
      userId: professionalId,
      userName: professionalName,
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
    
    // Update shared documents list
    setSharedDocuments(prevSharedDocs => {
      const existingDocIndex = prevSharedDocs.findIndex(doc => doc.id === documentId);
      
      if (existingDocIndex >= 0) {
        // Update existing shared document
        const updatedDocs = [...prevSharedDocs];
        updatedDocs[existingDocIndex] = sharedDocument;
        return updatedDocs;
      } else {
        // Add new shared document
        return [...prevSharedDocs, sharedDocument];
      }
    });
    
    toast({
      title: "Document shared",
      description: `${documentToShare.name} has been shared with ${professionalName}`
    });
    
    return sharedDocument;
  };

  const deleteSharedDocument = (documentId: string) => {
    setSharedDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
  };

  const updateDocumentPermissions = (documentId: string, permissions: DocumentPermission[]) => {
    setSharedDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === documentId 
          ? { ...doc, permissions } 
          : doc
      )
    );
  };
  
  // Get all documents including sample ones when real documents array is empty
  const getAllDocuments = () => {
    if (documents.length === 0) {
      return getSampleDocuments();
    }
    return [...documents, ...getSampleDocuments()];
  };

  return {
    documents: getAllDocuments(),
    sharedDocuments,
    activeCategory,
    isUploadDialogOpen,
    setActiveCategory,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleFileUpload,
    shareDocument,
    deleteSharedDocument,
    updateDocumentPermissions,
    filteredDocuments: getAllDocuments().filter(doc => !activeCategory || doc.category === activeCategory)
  };
};

// Sample documents for the hook to use when documents array is empty
function getSampleDocuments(): DocumentItem[] {
  return [
    {
      id: "doc-1",
      name: "Tax Return 2024.pdf",
      type: "pdf",
      created: "04/02/2025",
      category: "professional-documents",
      size: "2.4 MB"
    },
    {
      id: "doc-2",
      name: "Estate Plan Draft.docx",
      type: "document",
      created: "03/28/2025",
      category: "professional-documents",
      size: "1.2 MB"
    },
    {
      id: "doc-3",
      name: "Investment Portfolio Analysis.xlsx",
      type: "spreadsheet",
      created: "03/15/2025",
      category: "professional-documents",
      size: "3.7 MB"
    }
  ];
}
