
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define types to match our database schema
export interface AttorneyOnboarding {
  id: string;
  attorney_user_id: string;
  client_user_id: string;
  onboarding_stage: string;
  engagement_letter_signed: boolean;
  welcome_email_sent: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  documents_required: number;
  documents_uploaded: number;
  progress_percentage: number;
  intake_form_completed: boolean;
  client_preferences: any;
}

export interface AttorneyDocument {
  id: string;
  onboarding_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  upload_status: string;
  uploaded_at: string;
  uploaded_by: string;
  is_required: boolean;
  is_client_visible: boolean;
  client_comments: string | null;
  attorney_notes: string | null;
}

export const useAttorneyOnboarding = () => {
  const [onboardings, setOnboardings] = useState<AttorneyOnboarding[]>([]);
  const [documents, setDocuments] = useState<AttorneyDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch onboardings for current attorney
  const fetchOnboardings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Use raw SQL query to work around type issues
      const { data, error } = await supabase.rpc('get_attorney_onboardings', {
        attorney_id: user.id
      });

      if (error) throw error;
      setOnboardings(data || []);
    } catch (err: any) {
      console.error('Error fetching onboardings:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch onboardings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new onboarding
  const createOnboarding = async (clientData: {
    client_email: string;
    client_name: string;
    engagement_type: string;
    documents_required: number;
  }) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('create_attorney_onboarding', {
        attorney_id: user.id,
        client_email: clientData.client_email,
        client_name: clientData.client_name,
        engagement_type: clientData.engagement_type,
        documents_required: clientData.documents_required
      });

      if (error) throw error;

      // Refresh the onboardings list
      await fetchOnboardings();
      
      toast({
        title: "Success",
        description: "Onboarding created successfully",
      });

      return { data };
    } catch (err: any) {
      console.error('Error creating onboarding:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to create onboarding",
        variant: "destructive",
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents for an onboarding
  const fetchDocuments = async (onboardingId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('get_onboarding_documents', {
        onboarding_id: onboardingId
      });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update onboarding status
  const updateOnboardingStatus = async (onboardingId: string, status: string, notes?: string) => {
    try {
      setLoading(true);

      const { error } = await supabase.rpc('update_onboarding_status', {
        onboarding_id: onboardingId,
        new_status: status,
        notes: notes || ''
      });

      if (error) throw error;

      // Refresh the onboardings list
      await fetchOnboardings();

      toast({
        title: "Success",
        description: "Onboarding status updated",
      });
    } catch (err: any) {
      console.error('Error updating onboarding:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to update onboarding status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Send reminder email
  const sendReminder = async (onboardingId: string, reminderType: string) => {
    try {
      setLoading(true);

      const { error } = await supabase.rpc('send_onboarding_reminder', {
        onboarding_id: onboardingId,
        reminder_type: reminderType
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reminder sent successfully",
      });
    } catch (err: any) {
      console.error('Error sending reminder:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Upload document
  const uploadDocument = async (
    onboardingId: string,
    file: File,
    documentType: string,
    isRequired: boolean = false,
    isClientVisible: boolean = true
  ) => {
    try {
      setLoading(true);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `attorney-documents/${onboardingId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('attorney-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: docError } = await supabase.rpc('create_attorney_document', {
        onboarding_id: onboardingId,
        document_type: documentType,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        is_required: isRequired,
        is_client_visible: isClientVisible
      });

      if (docError) throw docError;

      // Refresh documents
      await fetchDocuments(onboardingId);

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (err: any) {
      console.error('Error uploading document:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const deleteDocument = async (documentId: string, filePath: string) => {
    try {
      setLoading(true);

      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('attorney-files')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete document record
      const { error } = await supabase.rpc('delete_attorney_document', {
        document_id: documentId
      });

      if (error) throw error;

      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (err: any) {
      console.error('Error deleting document:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Complete onboarding
  const completeOnboarding = async (onboardingId: string) => {
    try {
      setLoading(true);

      const { error } = await supabase.rpc('complete_attorney_onboarding', {
        onboarding_id: onboardingId
      });

      if (error) throw error;

      // Refresh the onboardings list
      await fetchOnboardings();

      toast({
        title: "Success",
        description: "Onboarding completed successfully",
      });
    } catch (err: any) {
      console.error('Error completing onboarding:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to complete onboarding",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnboardings();
  }, []);

  return {
    onboardings,
    documents,
    loading,
    error,
    createOnboarding,
    fetchOnboardings,
    fetchDocuments,
    updateOnboardingStatus,
    sendReminder,
    uploadDocument,
    deleteDocument,
    completeOnboarding,
  };
};
