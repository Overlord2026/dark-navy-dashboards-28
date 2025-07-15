import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface HealthDoc {
  id: string;
  family_id?: string;
  member_id?: string;
  user_id: string;
  doc_type: string;
  file_path?: string;
  storage_bucket: string;
  document_name: string;
  file_size?: number;
  content_type?: string;
  signer_name?: string;
  signed_date?: string;
  expires_on?: string;
  witness_names?: string[];
  agent_name?: string;
  agent_phone?: string;
  agent_relationship?: string;
  lawyer_contact?: string;
  plan_name?: string;
  subscriber_id?: string;
  group_number?: string;
  document_status: string;
  is_emergency_accessible: boolean;
  is_placeholder: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentStats {
  totalDocuments: number;
  expiringDocuments: number;
  sharedDocuments: number;
  emergencyAccessible: number;
}

export const useHealthDocs = () => {
  const [documents, setDocuments] = useState<HealthDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DocumentStats>({
    totalDocuments: 0,
    expiringDocuments: 0,
    sharedDocuments: 0,
    emergencyAccessible: 0
  });
  const [retryCount, setRetryCount] = useState(0);

  const clearError = useCallback(() => setError(null), []);

  const calculateStats = useCallback((docs: HealthDoc[]): DocumentStats => {
    const currentDate = new Date();
    const thirtyDaysFromNow = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return {
      totalDocuments: docs.length,
      expiringDocuments: docs.filter(doc => 
        doc.expires_on && new Date(doc.expires_on) <= thirtyDaysFromNow
      ).length,
      sharedDocuments: docs.filter(doc => doc.id).length,
      emergencyAccessible: docs.filter(doc => doc.is_emergency_accessible).length
    };
  }, []);

  const fetchDocuments = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('health_docs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const docs = data || [];
      setDocuments(docs);
      setStats(calculateStats(docs));
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents';
      setError(errorMessage);
      
      // Auto-retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchDocuments(false);
        }, Math.pow(2, retryCount) * 1000);
      } else {
        toast({
          title: "Error fetching documents",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [calculateStats, retryCount]);

  const createDocument = useCallback(async (docData: Partial<HealthDoc> & { file?: File }) => {
    try {
      clearError();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Optimistic update for immediate UI feedback
      const tempId = `temp-${Date.now()}`;
      const optimisticDoc = {
        ...docData,
        id: tempId,
        user_id: user.user.id,
        storage_bucket: 'healthcare-documents',
        document_status: 'current',
        is_emergency_accessible: docData.is_emergency_accessible ?? false,
        is_placeholder: docData.is_placeholder ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as HealthDoc;
      
      setDocuments(prev => [optimisticDoc, ...prev]);

      // Create document record
      const { data, error } = await supabase
        .from('health_docs')
        .insert({
          ...docData,
          user_id: user.user.id,
          doc_type: docData.doc_type!,
          document_name: docData.document_name!,
          storage_bucket: 'healthcare-documents',
          document_status: 'current',
          is_emergency_accessible: docData.is_emergency_accessible ?? false,
          is_placeholder: docData.is_placeholder ?? false
        })
        .select()
        .single();

      if (error) throw error;

      // Handle file upload if provided
      if (docData.file) {
        const fileExt = docData.file.name.split('.').pop();
        const fileName = `${data.id}.${fileExt}`;
        const filePath = `docs/${data.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('healthcare-documents')
          .upload(filePath, docData.file);

        if (uploadError) throw uploadError;

        // Update document with file info
        const { error: updateError } = await supabase
          .from('health_docs')
          .update({ 
            file_path: filePath,
            file_size: docData.file.size,
            content_type: docData.file.type
          })
          .eq('id', data.id);

        if (updateError) throw updateError;

        data.file_path = filePath;
        data.file_size = docData.file.size;
        data.content_type = docData.file.type;
      }

      // Replace optimistic update with real data
      setDocuments(prev => prev.map(doc => doc.id === tempId ? data : doc));
      setStats(prev => ({ ...prev, totalDocuments: prev.totalDocuments }));
      
      toast({
        title: "Success",
        description: "Document created successfully",
      });

      return data;
    } catch (err) {
      // Revert optimistic update
      setDocuments(prev => prev.filter(doc => !doc.id.startsWith('temp-')));
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to create document';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [clearError]);

  const updateDocument = useCallback(async (id: string, updates: Partial<HealthDoc>) => {
    try {
      clearError();
      
      // Optimistic update
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, ...updates } : doc
      ));

      const { data, error } = await supabase
        .from('health_docs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update with real data
      setDocuments(prev => prev.map(doc => doc.id === id ? data : doc));
      
      toast({
        title: "Success",
        description: "Document updated successfully",
      });

      return data;
    } catch (err) {
      // Revert optimistic update
      await fetchDocuments(false);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to update document';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [clearError, fetchDocuments]);

  const deleteDocument = useCallback(async (id: string) => {
    // Store original document for potential rollback
    const originalDoc = documents.find(doc => doc.id === id);
    
    try {
      clearError();
      
      // Optimistic update
      setDocuments(prev => prev.filter(doc => doc.id !== id));

      // Delete file from storage if it exists
      const docToDelete = originalDoc;
      if (docToDelete?.file_path) {
        const { error: storageError } = await supabase.storage
          .from('healthcare-documents')
          .remove([docToDelete.file_path]);
        
        if (storageError) console.warn('Failed to delete file from storage:', storageError);
      }

      // Delete document record
      const { error } = await supabase
        .from('health_docs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update stats
      setStats(prev => ({ 
        ...prev, 
        totalDocuments: Math.max(0, prev.totalDocuments - 1) 
      }));
      
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (err) {
      // Revert optimistic update
      if (originalDoc) {
        setDocuments(prev => [originalDoc, ...prev].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [clearError, documents]);

  const downloadDocument = useCallback(async (doc: HealthDoc) => {
    try {
      if (!doc.file_path) {
        throw new Error('No file path available');
      }

      const { data, error } = await supabase.storage
        .from('healthcare-documents')
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.document_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download document';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, []);

  const getDocumentStatus = useCallback((doc: HealthDoc): 'current' | 'expiring_soon' | 'expired' | 'needs_review' => {
    const currentDate = new Date();
    
    if (doc.expires_on && new Date(doc.expires_on) < currentDate) {
      return 'expired';
    }
    
    if (doc.expires_on && new Date(doc.expires_on) <= new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)) {
      return 'expiring_soon';
    }
    
    if (doc.signed_date && ['advance_directive', 'healthcare_poa', 'living_will'].includes(doc.doc_type)) {
      const oneYearAgo = new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000);
      if (new Date(doc.signed_date) <= oneYearAgo) {
        return 'needs_review';
      }
    }
    
    return 'current';
  }, []);

  const refetch = useCallback(() => {
    setRetryCount(0);
    return fetchDocuments(true);
  }, [fetchDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    stats,
    isLoading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    downloadDocument,
    getDocumentStatus,
    refetch,
    clearError,
  };
};