
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { DocumentItem, DocumentPermission } from '@/types/document';
import { toast } from 'sonner';

export interface SupabaseDocument {
  id: string;
  user_id: string;
  name: string;
  type: string;
  category: string;
  size: number | null;
  file_path: string | null;
  content_type: string | null;
  description: string | null;
  tags: string[] | null;
  is_folder: boolean;
  is_private: boolean;
  encrypted: boolean;
  uploaded_by: string | null;
  shared: boolean;
  created_at: string;
  updated_at: string;
  modified: string | null;
}

export const useSupabaseDocuments = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Convert Supabase document to DocumentItem
  const convertToDocumentItem = (doc: SupabaseDocument): DocumentItem => ({
    id: doc.id,
    name: doc.name,
    type: doc.type as any,
    category: doc.category,
    size: doc.size || 0,
    created: new Date(doc.created_at).toLocaleDateString(),
    modified: doc.modified ? new Date(doc.modified).toLocaleDateString() : undefined,
    uploadedBy: doc.uploaded_by || undefined,
    tags: doc.tags || undefined,
    encrypted: doc.encrypted,
    isPrivate: doc.is_private,
    shared: doc.shared,
    isFolder: doc.is_folder
  });

  // Fetch documents for the current user
  const fetchDocuments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const convertedDocs = data.map(convertToDocumentItem);
      setDocuments(convertedDocs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Upload file to storage and create document record
  const uploadDocument = async (file: File, customName: string, category: string): Promise<DocumentItem | null> => {
    if (!user) {
      toast.error('User not authenticated');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create document record
      const documentData = {
        user_id: user.id,
        name: customName || file.name,
        type: getDocumentType(file.type),
        category,
        size: file.size,
        file_path: fileName,
        content_type: file.type,
        uploaded_by: user.email || 'Unknown',
        is_folder: false
      };

      const { data, error } = await supabase
        .from('documents')
        .insert([documentData])
        .select()
        .single();

      if (error) throw error;

      const newDocument = convertToDocumentItem(data);
      setDocuments(prev => [newDocument, ...prev]);
      
      toast.success(`Document "${customName}" uploaded successfully`);
      return newDocument;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload document';
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    }
  };

  // Create folder
  const createFolder = async (folderName: string, category: string): Promise<DocumentItem | null> => {
    if (!user) {
      toast.error('User not authenticated');
      return null;
    }

    try {
      const folderData = {
        user_id: user.id,
        name: folderName,
        type: 'folder',
        category,
        is_folder: true,
        uploaded_by: user.email || 'Unknown'
      };

      const { data, error } = await supabase
        .from('documents')
        .insert([folderData])
        .select()
        .single();

      if (error) throw error;

      const newFolder = convertToDocumentItem(data);
      setDocuments(prev => [newFolder, ...prev]);
      
      toast.success(`Folder "${folderName}" created successfully`);
      return newFolder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create folder';
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    }
  };

  // Delete document
  const deleteDocument = async (documentId: string): Promise<boolean> => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      // Get document details first
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_path, name')
        .eq('id', documentId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      // Delete file from storage if it exists
      if (document.file_path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);

        if (storageError) console.warn('Failed to delete file from storage:', storageError);
      }

      // Delete document record
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success(`Document "${document.name}" deleted successfully`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    }
  };

  // Update document
  const updateDocument = async (documentId: string, updates: Partial<SupabaseDocument>): Promise<boolean> => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', documentId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh documents
      await fetchDocuments();
      toast.success('Document updated successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update document';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    }
  };

  // Download document
  const downloadDocument = async (documentId: string): Promise<void> => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_path, name')
        .eq('id', documentId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      if (!document.file_path) {
        toast.error('File not found');
        return;
      }

      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded "${document.name}"`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download document';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  // Get document type from MIME type
  const getDocumentType = (mimeType: string): string => {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) return 'spreadsheet';
    return 'document';
  };

  // Filter documents by category
  const getDocumentsByCategory = (category: string | null) => {
    if (!category || category === 'all') return documents;
    return documents.filter(doc => doc.category === category);
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setLoading(false);
    }
  }, [user]);

  return {
    documents,
    loading,
    error,
    uploadDocument,
    createFolder,
    deleteDocument,
    updateDocument,
    downloadDocument,
    getDocumentsByCategory,
    refetch: fetchDocuments
  };
};
