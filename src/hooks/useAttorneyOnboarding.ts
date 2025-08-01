import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

export interface AttorneyOnboardingData {
  id?: string;
  user_id: string;
  tenant_id?: string;
  
  // Profile Information
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  office_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  firm_name?: string;
  firm_website?: string;
  attorney_bio?: string;
  
  // Credentials
  bar_number?: string;
  primary_jurisdiction?: string;
  jurisdictions_licensed?: string[];
  admission_dates?: Record<string, string>;
  bar_status?: string;
  
  // CLE History
  cle_hours_completed?: number;
  cle_hours_required?: number;
  cle_expiration_date?: string;
  cle_compliance_status?: string;
  
  // Practice Areas
  primary_practice_area?: string;
  practice_areas?: string[];
  years_experience?: number;
  specializations?: string[];
  
  // Fee Structure
  hourly_rate?: number;
  consultation_fee?: number;
  billing_method?: string;
  retainer_required?: boolean;
  typical_retainer_amount?: number;
  
  // Progress
  current_step?: number;
  steps_completed?: number[];
  onboarding_status?: string;
  progress_percentage?: number;
  
  // Documents
  bar_license_urls?: string[];
  insurance_certificate_url?: string;
  cv_resume_url?: string;
  law_school_diploma_url?: string;
  additional_certifications_urls?: string[];
  
  // Agreements
  nda_signed?: boolean;
  nda_signed_at?: string;
  participation_agreement_signed?: boolean;
  participation_agreement_signed_at?: string;
  terms_accepted?: boolean;
  terms_accepted_at?: string;
  
  // Verification
  bar_verification_status?: string;
  bar_verification_data?: any;
  background_check_status?: string;
  reference_check_status?: string;
  
  // Metadata
  created_at?: string;
  updated_at?: string;
  submitted_at?: string;
  approved_at?: string;
  approved_by?: string;
}

export interface AttorneyDocument {
  id: string;
  onboarding_id: string;
  document_type: string;
  document_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  upload_status: string;
  verification_notes?: string;
  uploaded_at: string;
  verified_at?: string;
  verified_by?: string;
}

export function useAttorneyOnboarding() {
  const { userProfile } = useUser();
  const [onboardingData, setOnboardingData] = useState<AttorneyOnboardingData | null>(null);
  const [documents, setDocuments] = useState<AttorneyDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load existing onboarding data
  const loadOnboarding = async () => {
    if (!userProfile?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('attorney_onboarding')
        .select('*')
        .eq('user_id', userProfile.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setOnboardingData(data);
        await loadDocuments(data.id);
      }
    } catch (error) {
      console.error('Error loading onboarding:', error);
      toast.error('Failed to load onboarding data');
    } finally {
      setLoading(false);
    }
  };

  // Load documents for the onboarding
  const loadDocuments = async (onboardingId: string) => {
    try {
      const { data, error } = await supabase
        .from('attorney_documents')
        .select('*')
        .eq('onboarding_id', onboardingId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  // Save onboarding data
  const saveOnboarding = async (data: Partial<AttorneyOnboardingData>) => {
    if (!userProfile?.id) return null;

    setSaving(true);
    try {
      const saveData = {
        ...data,
        user_id: userProfile.id,
        tenant_id: userProfile.tenant_id,
        updated_at: new Date().toISOString()
      };

      if (onboardingData?.id) {
        // Update existing
        const { data: updated, error } = await supabase
          .from('attorney_onboarding')
          .update(saveData)
          .eq('id', onboardingData.id)
          .select()
          .single();

        if (error) throw error;
        setOnboardingData(updated);
        return updated;
      } else {
        // Create new
        const { data: created, error } = await supabase
          .from('attorney_onboarding')
          .insert([saveData])
          .select()
          .single();

        if (error) throw error;
        setOnboardingData(created);
        return created;
      }
    } catch (error) {
      console.error('Error saving onboarding:', error);
      toast.error('Failed to save onboarding data');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Upload document
  const uploadDocument = async (
    documentType: string,
    file: File,
    onboardingId?: string
  ) => {
    if (!userProfile?.id) return null;
    
    const targetOnboardingId = onboardingId || onboardingData?.id;
    if (!targetOnboardingId) {
      toast.error('Please save your profile first');
      return null;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const fileName = `${userProfile.id}/${documentType}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('attorney-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document record
      const { data: docData, error: docError } = await supabase
        .from('attorney_documents')
        .insert([{
          onboarding_id: targetOnboardingId,
          document_type: documentType,
          document_name: file.name,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type,
          upload_status: 'uploaded'
        }])
        .select()
        .single();

      if (docError) throw docError;

      // Refresh documents
      await loadDocuments(targetOnboardingId);
      toast.success(`${documentType} uploaded successfully`);
      return docData;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(`Failed to upload ${documentType}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Sign agreement
  const signAgreement = async (agreementType: 'nda' | 'participation_agreement') => {
    if (!onboardingData?.id) return false;

    try {
      const updateData = {
        [`${agreementType}_signed`]: true,
        [`${agreementType}_signed_at`]: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('attorney_onboarding')
        .update(updateData)
        .eq('id', onboardingData.id)
        .select()
        .single();

      if (error) throw error;

      setOnboardingData(data);
      toast.success(`${agreementType.replace('_', ' ')} signed successfully`);
      return true;
    } catch (error) {
      console.error('Error signing agreement:', error);
      toast.error('Failed to sign agreement');
      return false;
    }
  };

  // Get document by type
  const getDocumentByType = (documentType: string) => {
    return documents.find(doc => doc.document_type === documentType);
  };

  // Check if onboarding is complete
  const isOnboardingComplete = () => {
    if (!onboardingData) return false;
    
    return (
      onboardingData.progress_percentage === 100 &&
      onboardingData.nda_signed &&
      onboardingData.participation_agreement_signed &&
      onboardingData.terms_accepted
    );
  };

  // Get verification status
  const getVerificationStatus = () => {
    if (!onboardingData) return 'not_started';
    
    if (onboardingData.bar_verification_status === 'verified' && 
        onboardingData.background_check_status === 'passed') {
      return 'verified';
    }
    
    if (onboardingData.onboarding_status === 'completed') {
      return 'pending_verification';
    }
    
    return 'in_progress';
  };

  // Load data on mount
  useEffect(() => {
    if (userProfile?.id) {
      loadOnboarding();
    }
  }, [userProfile?.id]);

  return {
    onboardingData,
    documents,
    loading,
    saving,
    uploading,
    loadOnboarding,
    saveOnboarding,
    uploadDocument,
    signAgreement,
    getDocumentByType,
    isOnboardingComplete,
    getVerificationStatus
  };
}