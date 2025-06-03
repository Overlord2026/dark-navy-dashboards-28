
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface EstateDocument {
  id: string;
  user_id: string;
  document_type: string;
  document_name: string;
  description?: string;
  file_path?: string;
  file_size?: number;
  content_type?: string;
  status: 'pending' | 'completed' | 'in_progress';
  shared_with?: string[];
  created_at: string;
  updated_at: string;
}

export interface EstateProfessional {
  id: string;
  user_id: string;
  professional_type: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  specialties?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EstateConsultation {
  id: string;
  user_id: string;
  consultation_type: string;
  preferred_date?: string;
  preferred_time?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface EstateInterest {
  id: string;
  user_id: string;
  service_type: string;
  message?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  status: 'pending' | 'contacted' | 'converted';
  created_at: string;
  updated_at: string;
}

export const useEstatePlanning = () => {
  const [documents, setDocuments] = useState<EstateDocument[]>([]);
  const [professionals, setProfessionals] = useState<EstateProfessional[]>([]);
  const [consultations, setConsultations] = useState<EstateConsultation[]>([]);
  const [interests, setInterests] = useState<EstateInterest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all estate planning data
  const fetchEstateData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Fetch documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('estate_planning_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (documentsError) throw documentsError;

      // Fetch professionals
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('estate_planning_professionals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (professionalsError) throw professionalsError;

      // Fetch consultations
      const { data: consultationsData, error: consultationsError } = await supabase
        .from('estate_planning_consultations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (consultationsError) throw consultationsError;

      // Fetch interests
      const { data: interestsData, error: interestsError } = await supabase
        .from('estate_planning_interests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (interestsError) throw interestsError;

      setDocuments(documentsData || []);
      setProfessionals(professionalsData || []);
      setConsultations(consultationsData || []);
      setInterests(interestsData || []);
    } catch (error) {
      console.error('Error fetching estate planning data:', error);
      toast.error('Failed to load estate planning data');
    } finally {
      setLoading(false);
    }
  };

  // Create document
  const createDocument = async (documentData: Partial<EstateDocument>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('estate_planning_documents')
        .insert({
          ...documentData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setDocuments(prev => [data, ...prev]);
      toast.success('Document created successfully');
      return data;
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
      throw error;
    }
  };

  // Update document
  const updateDocument = async (id: string, updates: Partial<EstateDocument>) => {
    try {
      const { data, error } = await supabase
        .from('estate_planning_documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDocuments(prev => prev.map(doc => doc.id === id ? data : doc));
      toast.success('Document updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
      throw error;
    }
  };

  // Delete document
  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('estate_planning_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      throw error;
    }
  };

  // Create consultation request
  const createConsultation = async (consultationData: Partial<EstateConsultation>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('estate_planning_consultations')
        .insert({
          ...consultationData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setConsultations(prev => [data, ...prev]);
      toast.success('Consultation request submitted successfully');
      return data;
    } catch (error) {
      console.error('Error creating consultation:', error);
      toast.error('Failed to submit consultation request');
      throw error;
    }
  };

  // Create interest
  const createInterest = async (interestData: Partial<EstateInterest>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('estate_planning_interests')
        .insert({
          ...interestData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setInterests(prev => [data, ...prev]);
      toast.success('Interest submitted successfully');
      return data;
    } catch (error) {
      console.error('Error creating interest:', error);
      toast.error('Failed to submit interest');
      throw error;
    }
  };

  useEffect(() => {
    fetchEstateData();
  }, []);

  return {
    documents,
    professionals,
    consultations,
    interests,
    loading,
    createDocument,
    updateDocument,
    deleteDocument,
    createConsultation,
    createInterest,
    refetch: fetchEstateData,
  };
};
