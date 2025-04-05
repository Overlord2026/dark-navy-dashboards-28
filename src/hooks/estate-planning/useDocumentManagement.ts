
import { useState } from "react";
import { toast } from "sonner";

export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  status: "notStarted" | "inProgress" | "completed";
  url?: string;
  date?: Date;
  uploadedBy?: string;
  sharedWith?: string[];
}

export const useDocumentManagement = (initialDocuments: DocumentItem[] = []) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleUploadDocument = (documentType: string) => {
    setSelectedDocument(documents.find(doc => doc.id === documentType) || null);
    setUploadDialogOpen(true);
  };

  const handleShareDocument = (documentId: string) => {
    const document = documents.find((doc) => doc.id === documentId);
    setSelectedDocument(document || null);
    setShareDialogOpen(true);
  };

  const handleViewDocument = (documentId: string) => {
    const document = documents.find((doc) => doc.id === documentId);
    setSelectedDocument(document || null);
    setViewDialogOpen(true);
  };

  const handleDocumentUpload = (documentType: string, data: any) => {
    // In a real app, this would send the data to an API
    const newDocument = {
      id: documentType,
      name: data.documentName,
      description: data.description,
      status: "completed" as const,
      url: "#",
      date: new Date(),
      uploadedBy: "John Smith",
    };

    // Update documents list - either add new or replace existing
    const existingIndex = documents.findIndex((doc) => doc.id === documentType);
    
    if (existingIndex >= 0) {
      const updatedDocuments = [...documents];
      updatedDocuments[existingIndex] = newDocument;
      setDocuments(updatedDocuments);
      toast.success("Document updated successfully");
    } else {
      setDocuments([...documents, newDocument]);
      toast.success("Document uploaded successfully");
    }
  };

  const handleDocumentShare = (documentId: string, sharedWith: string[]) => {
    // In a real app, this would send the sharing info to an API
    const updatedDocuments = documents.map((doc) => {
      if (doc.id === documentId) {
        // Convert IDs to names (simplified example)
        const sharedWithNames = sharedWith.map((id) => {
          // This is a simplified example - in a real app you would lookup the name from the ID
          const lookup: Record<string, string> = {
            "1": "James Wilson (Estate Attorney)",
            "2": "Sarah Johnson (Financial Advisor)",
            "3": "Michael Brown (CPA)",
            "4": "Jennifer Davis (Insurance Agent)",
            "101": "Robert Smith (Spouse)",
            "102": "Emma Smith (Child)",
            "103": "Daniel Smith (Child)",
            "104": "Margaret Johnson (Parent)",
          };
          return lookup[id] || id;
        });
        
        return {
          ...doc,
          sharedWith: sharedWithNames,
        };
      }
      return doc;
    });
    
    setDocuments(updatedDocuments);
    toast.success("Document shared successfully");
  };

  // Calculate completion metrics
  const totalDocuments = 9; // Total number of checklist items
  const completedDocuments = documents.length;
  
  // Filter for shared documents
  const sharedDocuments = documents
    .filter(doc => doc.sharedWith && doc.sharedWith.length > 0)
    .map(doc => ({
      id: doc.id,
      name: doc.name,
      sharedWith: doc.sharedWith || [],
      date: doc.date,
      status: "active" as const
    }));

  return {
    documents,
    sharedDocuments,
    selectedDocument,
    completedDocuments,
    totalDocuments,
    uploadDialogOpen,
    shareDialogOpen,
    viewDialogOpen,
    handleUploadDocument,
    handleShareDocument,
    handleViewDocument,
    handleDocumentUpload,
    handleDocumentShare,
    setUploadDialogOpen,
    setShareDialogOpen,
    setViewDialogOpen,
    setSelectedDocument
  };
};
