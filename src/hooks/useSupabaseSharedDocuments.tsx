
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchSharedDocuments, createSharedDocument, deleteSharedDocument } from '@/services/sharedDocuments/sharedDocumentsService';
import { getCurrentUser, validateUserAuthentication } from '@/services/sharedDocuments/sharedDocumentsAuth';

export interface SharedDocument {
  id: string;
  user_id: string;
  professional_id: string;
  document_id: string;
  permission_level: 'view' | 'download' | 'edit';
  shared_at: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  professional_name?: string;
  professional_email?: string;
  document_name?: string;
  document_type?: string;
  document_size?: number;
}

export const useSupabaseSharedDocuments = () => {
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const { toast } = useToast();

  // Fetch shared documents with professional and document details
  const fetchSharedDocumentsData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        console.log('No authenticated user found');
        setSharedDocuments([]);
        return;
      }

      const documents = await fetchSharedDocuments(user.id);
      setSharedDocuments(documents);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error fetching shared documents",
        description: error instanceof Error ? error.message : "Failed to fetch shared documents",
        variant: "destructive"
      });
    }
  };

  // Share document with professional
  const shareDocument = async (
    professionalId: string,
    documentId: string,
    permissionLevel: 'view' | 'download' | 'edit' = 'view',
    expiresAt?: string
  ) => {
    setSharing(true);
    try {
      const user = await getCurrentUser();
      validateUserAuthentication(user);

      const data = await createSharedDocument(
        user!.id,
        professionalId,
        documentId,
        permissionLevel,
        expiresAt
      );

      toast({
        title: "Document shared",
        description: "Document has been shared successfully"
      });

      // Refresh the list
      fetchSharedDocumentsData();
      return data;
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to share document";
      
      if (errorMessage.includes('Authentication required')) {
        toast({
          title: "Authentication required",
          description: "Please log in to share documents",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error sharing document",
          description: errorMessage,
          variant: "destructive"
        });
      }
      return null;
    } finally {
      setSharing(false);
    }
  };

  // Remove shared document
  const removeSharedDocument = async (id: string) => {
    try {
      const user = await getCurrentUser();
      validateUserAuthentication(user);

      await deleteSharedDocument(id, user!.id);

      toast({
        title: "Document access removed",
        description: "Professional access to document has been removed"
      });

      // Refresh the list
      fetchSharedDocumentsData();
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to remove shared document";
      
      if (errorMessage.includes('Authentication required')) {
        toast({
          title: "Authentication required",
          description: "Please log in to remove shared documents",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error removing shared document",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchSharedDocumentsData();
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    sharedDocuments,
    loading,
    sharing,
    shareDocument,
    removeSharedDocument,
    refreshSharedDocuments: fetchSharedDocumentsData
  };
};
