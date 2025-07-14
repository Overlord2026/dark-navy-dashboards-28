import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DocumentStats>({
    totalDocuments: 0,
    expiringDocuments: 0,
    sharedDocuments: 0,
    emergencyAccessible: 0
  });
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('health_docs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
      
      // Calculate stats
      const docs = data || [];
      const currentDate = new Date();
      const thirtyDaysFromNow = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      setStats({
        totalDocuments: docs.length,
        expiringDocuments: docs.filter(doc => 
          doc.expires_on && new Date(doc.expires_on) <= thirtyDaysFromNow
        ).length,
        sharedDocuments: docs.filter(doc => doc.id).length,
        emergencyAccessible: docs.filter(doc => doc.is_emergency_accessible).length
      });
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (docData: Partial<HealthDoc>) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('health_docs')
        .insert({
          ...docData,
          user_id: user.data.user.id,
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

      setDocuments(prev => [data, ...prev]);
      await fetchDocuments();
      
      toast({
        title: "Success",
        description: "Document created successfully"
      });

      return data;
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive"
      });
      throw error;
    }
  };

  const uploadDocumentFile = async (file: File, docId: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${docId}.${fileExt}`;
      const filePath = `docs/${docId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('healthcare-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Update document record with file path
      const { error: updateError } = await supabase
        .from('health_docs')
        .update({ 
          file_path: filePath,
          file_size: file.size,
          content_type: file.type
        })
        .eq('id', docId);

      if (updateError) throw updateError;

      return filePath;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const downloadDocument = async (doc: HealthDoc) => {
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
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  const getDocumentStatus = (doc: HealthDoc): 'current' | 'expiring_soon' | 'expired' | 'needs_review' => {
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
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    stats,
    fetchDocuments,
    createDocument,
    uploadDocumentFile,
    downloadDocument,
    getDocumentStatus
  };
};