
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface EstateInterest {
  service_type: string;
  message?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
}

interface EstateConsultation {
  consultation_type: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
}

interface EstateDocument {
  id: string;
  user_id: string;
  document_type: string;
  document_name: string;
  description?: string;
  status: 'not_started' | 'completed';
  file_path?: string;
  content_type?: string;
  file_size?: number;
  shared_with?: string[];
  created_at: string;
  updated_at: string;
}

interface CreateDocumentData {
  document_type: string;
  document_name: string;
  description?: string;
  status: 'not_started' | 'completed';
  file_path?: string;
  content_type?: string;
  file_size?: number;
}

interface UpdateDocumentData {
  document_name?: string;
  description?: string;
  status?: 'not_started' | 'completed';
  file_path?: string;
  content_type?: string;
  file_size?: number;
  shared_with?: string[];
}

export const useEstatePlanning = () => {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<EstateDocument[]>([]);

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('estate_planning_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      setDocuments((data || []) as any);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const createInterest = async (data: EstateInterest) => {
    setLoading(true);
    try {
      console.log('Submitting estate planning interest:', data);
      toast.success('Thank you for your interest! We will contact you soon.');
    } catch (error) {
      console.error('Error submitting interest:', error);
      toast.error('Failed to submit interest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createConsultation = async (data: EstateConsultation) => {
    setLoading(true);
    try {
      console.log('Scheduling estate planning consultation:', data);
      toast.success('Consultation request submitted! We will contact you to schedule.');
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      toast.error('Failed to schedule consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (data: CreateDocumentData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: newDocument, error } = await supabase
        .from('estate_planning_documents')
        .insert({
          user_id: user.id,
          ...data
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating document:', error);
        throw error;
      }

      setDocuments(prev => [newDocument as any, ...prev]);
      toast.success('Document created successfully');
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (id: string, data: UpdateDocumentData) => {
    setLoading(true);
    try {
      const { data: updatedDocument, error } = await supabase
        .from('estate_planning_documents')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating document:', error);
        throw error;
      }

      setDocuments(prev => 
        prev.map(doc => doc.id === id ? updatedDocument as any : doc)
      );
      toast.success('Document updated successfully');
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('estate_planning_documents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting document:', error);
        throw error;
      }

      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestAttorneyReview = async (estateData: any, message?: string) => {
    // This will be handled by the professional collaboration system
    console.log('Estate attorney review requested:', { estateData, message });
    // The actual implementation will use the ProfessionalRequestModal
  };

  return {
    createInterest,
    createConsultation,
    documents,
    loading,
    createDocument,
    updateDocument,
    deleteDocument,
    fetchDocuments,
    requestAttorneyReview
  };
};
