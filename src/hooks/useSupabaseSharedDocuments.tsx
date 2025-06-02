
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
  const fetchSharedDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        setSharedDocuments([]);
        return;
      }

      // First get shared documents with document details
      const { data: sharedDocsWithDocuments, error: sharedDocsError } = await supabase
        .from('shared_documents')
        .select(`
          *,
          documents!inner(name, type, size)
        `)
        .eq('user_id', user.id)
        .order('shared_at', { ascending: false });

      if (sharedDocsError) {
        console.error('Error fetching shared documents:', sharedDocsError);
        toast({
          title: "Error fetching shared documents",
          description: sharedDocsError.message,
          variant: "destructive"
        });
        return;
      }

      // Then get professional details for non-placeholder professional IDs
      const professionalIds = sharedDocsWithDocuments
        ?.filter(item => item.professional_id !== "00000000-0000-0000-0000-000000000000")
        .map(item => item.professional_id) || [];

      let professionalsData: any[] = [];
      if (professionalIds.length > 0) {
        const { data: professionals, error: profError } = await supabase
          .from('professionals')
          .select('id, name, email')
          .in('id', professionalIds);

        if (profError) {
          console.error('Error fetching professionals:', profError);
        } else {
          professionalsData = professionals || [];
        }
      }

      // Transform the data to flatten the joined fields
      const transformedData: SharedDocument[] = (sharedDocsWithDocuments || []).map(item => {
        const professional = professionalsData.find(p => p.id === item.professional_id);
        
        return {
          id: item.id,
          user_id: item.user_id,
          professional_id: item.professional_id,
          document_id: item.document_id,
          permission_level: item.permission_level,
          shared_at: item.shared_at,
          expires_at: item.expires_at,
          created_at: item.created_at,
          updated_at: item.updated_at,
          professional_name: professional?.name,
          professional_email: professional?.email,
          document_name: item.documents?.name,
          document_type: item.documents?.type,
          document_size: item.documents?.size
        };
      });

      setSharedDocuments(transformedData);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch shared documents",
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to share documents",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          user_id: user.id,
          professional_id: professionalId,
          document_id: documentId,
          permission_level: permissionLevel,
          expires_at: expiresAt
        })
        .select()
        .single();

      if (error) {
        console.error('Error sharing document:', error);
        toast({
          title: "Error sharing document",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Document shared",
        description: "Document has been shared successfully"
      });

      // Refresh the list
      fetchSharedDocuments();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to share document",
        variant: "destructive"
      });
      return null;
    } finally {
      setSharing(false);
    }
  };

  // Remove shared document
  const removeSharedDocument = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to remove shared documents",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('shared_documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing shared document:', error);
        toast({
          title: "Error removing shared document",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Document access removed",
        description: "Professional access to document has been removed"
      });

      // Refresh the list
      fetchSharedDocuments();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to remove shared document",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchSharedDocuments();
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
    refreshSharedDocuments: fetchSharedDocuments
  };
};
