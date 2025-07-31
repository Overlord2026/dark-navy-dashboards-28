
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface HealthcareDocument {
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
  parent_folder_id?: string | null;
  created_at: string;
  updated_at: string;
  modified?: string;
}

export interface Prescription {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  next_refill: string;
  doctor?: string;
  pharmacy?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthcareDocumentPermission {
  id: string;
  document_id: string;
  user_id: string;
  granted_by_user_id: string;
  access_level: 'view' | 'edit' | 'full';
  user_name?: string;
  user_email?: string;
  user_role?: string;
  granted_at: string;
  created_at: string;
}

export interface HealthcareSharedDocument {
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
}

export const useHealthcare = () => {
  const [documents, setDocuments] = useState<HealthcareDocument[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<HealthcareSharedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Fetch all healthcare data
  const fetchHealthcareData = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      // Fetch healthcare documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('healthcare_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (documentsError) {
        console.error('Error fetching healthcare documents:', documentsError);
        toast({
          title: "Error fetching documents",
          description: documentsError.message,
          variant: "destructive"
        });
      } else {
        setDocuments((documentsData as any) || []);
      }

      // Fetch prescriptions
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('next_refill', { ascending: true });

      if (prescriptionsError) {
        console.error('Error fetching prescriptions:', prescriptionsError);
        toast({
          title: "Error fetching prescriptions",
          description: prescriptionsError.message,
          variant: "destructive"
        });
      } else {
        setPrescriptions(prescriptionsData || []);
      }

      // Fetch shared documents with professional and document details
      const { data: sharedData, error: sharedError } = await supabase
        .from('healthcare_shared_documents')
        .select(`
          *,
          professionals:professional_id (
            name,
            email
          ),
          healthcare_documents:document_id (
            name,
            type
          )
        `)
        .eq('user_id', user.id)
        .order('shared_at', { ascending: false });

      if (sharedError) {
        console.error('Error fetching shared documents:', sharedError);
        toast({
          title: "Error fetching shared documents",
          description: sharedError.message,
          variant: "destructive"
        });
      } else {
        const formattedSharedDocs = (sharedData || []).map(item => ({
          ...item,
          professional_name: item.professionals?.name,
          professional_email: item.professionals?.email,
          document_name: item.healthcare_documents?.name,
          document_type: item.healthcare_documents?.type,
        }));
        setSharedDocuments(formattedSharedDocs as any);
      }

    } catch (error) {
      console.error('Error fetching healthcare data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch healthcare data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Upload healthcare document
  const uploadDocument = async (
    file: File, 
    name: string, 
    description?: string,
    parentFolderId?: string | null
  ): Promise<HealthcareDocument | null> => {
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
        .from('healthcare-documents')
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
        .from('healthcare_documents')
        .insert({
          user_id: user.id,
          name,
          type: docType,
          category: 'healthcare',
          file_path: filePath,
          content_type: file.type,
          description,
          size: file.size,
          is_folder: false,
          parent_folder_id: parentFolderId,
          uploaded_by: user.email || 'Unknown'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Clean up uploaded file
        await supabase.storage.from('healthcare-documents').remove([filePath]);
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
      fetchHealthcareData();
      return documentData as any;

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

  // Create prescription
  const createPrescription = async (prescriptionData: Omit<Prescription, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add prescriptions",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('prescriptions')
        .insert({
          ...prescriptionData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating prescription:', error);
        toast({
          title: "Error creating prescription",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Prescription added",
        description: `${prescriptionData.name} has been added to your prescriptions`
      });

      fetchHealthcareData();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to add prescription",
        variant: "destructive"
      });
      return null;
    }
  };

  // Update prescription
  const updatePrescription = async (id: string, updates: Partial<Prescription>) => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating prescription:', error);
        toast({
          title: "Error updating prescription",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Prescription updated",
        description: "Prescription has been updated successfully"
      });

      fetchHealthcareData();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update prescription",
        variant: "destructive"
      });
      return null;
    }
  };

  // Delete prescription
  const deletePrescription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting prescription:', error);
        toast({
          title: "Error deleting prescription",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Prescription deleted",
        description: "Prescription has been deleted successfully"
      });

      fetchHealthcareData();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to delete prescription",
        variant: "destructive"
      });
    }
  };

  // Delete healthcare document
  const deleteDocument = async (documentId: string) => {
    try {
      const document = documents.find(d => d.id === documentId);
      if (!document) return;

      // Delete from database
      const { error: dbError } = await supabase
        .from('healthcare_documents')
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
          .from('healthcare-documents')
          .remove([document.file_path]);

        if (storageError) {
          console.error('Storage delete error:', storageError);
        }
      }

      toast({
        title: "Document deleted",
        description: `${document.name} has been deleted`
      });

      fetchHealthcareData();
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
        .from('healthcare-documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      return data?.signedUrl;
    } catch (error) {
      console.error('Error getting document URL:', error);
      return null;
    }
  };

  // Share document with professional
  const shareDocumentWithProfessional = async (
    documentId: string,
    professionalId: string,
    permissionLevel: 'view' | 'download' | 'edit' = 'view',
    expiresAt?: string
  ) => {
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
        .from('healthcare_shared_documents')
        .insert({
          user_id: user.id,
          document_id: documentId,
          professional_id: professionalId,
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

      fetchHealthcareData();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to share document",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchHealthcareData();
  }, []);

  return {
    documents,
    prescriptions,
    sharedDocuments,
    loading,
    uploading,
    uploadDocument,
    createPrescription,
    updatePrescription,
    deletePrescription,
    deleteDocument,
    getDocumentUrl,
    shareDocumentWithProfessional,
    refreshData: fetchHealthcareData,
  };
};
