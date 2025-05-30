
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseDocument {
  id: string;
  user_id: string;
  name: string;
  type: 'pdf' | 'document' | 'image' | 'spreadsheet' | 'folder';
  category: string;
  file_path?: string;
  content_type?: string;
  description?: string;
  tags?: string[];
  size?: number;
  is_folder: boolean;
  is_private: boolean;
  encrypted: boolean;
  shared: boolean;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
  modified?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
}

export const useSupabaseDocuments = () => {
  const [documents, setDocuments] = useState<SupabaseDocument[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        setDocuments([]);
        return;
      }

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Error fetching documents",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive"
      });
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('document_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error fetching categories",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      });
    }
  };

  // Upload file and create document record
  const uploadDocument = async (
    file: File, 
    name: string, 
    category: string, 
    description?: string
  ): Promise<SupabaseDocument | null> => {
    setUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload documents",
          variant: "destructive"
        });
        return null;
      }

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Upload failed",
          description: uploadError.message,
          variant: "destructive"
        });
        return null;
      }

      // Determine document type
      let docType: 'pdf' | 'document' | 'image' | 'spreadsheet' | 'folder' = 'document';
      if (file.type.includes('pdf')) docType = 'pdf';
      else if (file.type.includes('image')) docType = 'image';
      else if (file.type.includes('spreadsheet') || file.type.includes('excel')) docType = 'spreadsheet';

      // Create document record
      const { data: documentData, error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name,
          type: docType,
          category,
          file_path: filePath,
          content_type: file.type,
          description,
          size: file.size,
          is_folder: false,
          uploaded_by: user.email || 'Unknown'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Clean up uploaded file
        await supabase.storage.from('documents').remove([filePath]);
        toast({
          title: "Database error",
          description: dbError.message,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Document uploaded",
        description: `${name} has been uploaded successfully`
      });

      // Refresh documents
      fetchDocuments();
      return documentData;

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Create folder
  const createFolder = async (name: string, category: string): Promise<SupabaseDocument | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create folders",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name,
          type: 'folder',
          category,
          is_folder: true,
          size: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating folder:', error);
        toast({
          title: "Error creating folder",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Folder created",
        description: `Folder "${name}" has been created`
      });

      fetchDocuments();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive"
      });
      return null;
    }
  };

  // Delete document
  const deleteDocument = async (documentId: string) => {
    try {
      const document = documents.find(d => d.id === documentId);
      if (!document) return;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) {
        console.error('Database delete error:', dbError);
        toast({
          title: "Error deleting document",
          description: dbError.message,
          variant: "destructive"
        });
        return;
      }

      // Delete file from storage if it exists
      if (document.file_path && !document.is_folder) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);

        if (storageError) {
          console.error('Storage delete error:', storageError);
        }
      }

      toast({
        title: "Document deleted",
        description: `${document.name} has been deleted`
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  // Get document download URL
  const getDocumentUrl = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      return data?.signedUrl;
    } catch (error) {
      console.error('Error getting document URL:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDocuments(), fetchCategories()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    documents,
    categories,
    loading,
    uploading,
    uploadDocument,
    createFolder,
    deleteDocument,
    getDocumentUrl,
    refreshDocuments: fetchDocuments
  };
};
