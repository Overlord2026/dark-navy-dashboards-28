
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
  status: 'not_started' | 'completed' | 'in_progress';
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

      if (documentsError) {
        throw documentsError;
      }

      setDocuments(documentsData || []);
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

  // Create interest
  const createInterest = async (interestData: Partial<EstateInterest>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Since we don't have the estate_interests table, we'll simulate this for now
      // In a real implementation, you would create the table and insert the data
      console.log('Creating interest:', interestData);
      toast.success('Interest submitted successfully', {
        description: 'We will contact you soon to discuss your estate planning needs.'
      });
      
      // Simulate adding to interests array
      const mockInterest: EstateInterest = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        service_type: interestData.service_type || 'General Interest',
        message: interestData.message,
        contact_name: interestData.contact_name || '',
        contact_email: interestData.contact_email || '',
        contact_phone: interestData.contact_phone,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setInterests(prev => [mockInterest, ...prev]);
      return mockInterest;
    } catch (error) {
      console.error('Error creating interest:', error);
      toast.error('Failed to submit interest');
      throw error;
    }
  };

  // Create consultation
  const createConsultation = async (consultationData: Partial<EstateConsultation>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Since we don't have the estate_consultations table, we'll simulate this for now
      // In a real implementation, you would create the table and insert the data
      console.log('Creating consultation:', consultationData);
      toast.success('Consultation scheduled successfully', {
        description: 'We will contact you within 24 hours to confirm your appointment.'
      });
      
      // Simulate adding to consultations array
      const mockConsultation: EstateConsultation = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        consultation_type: consultationData.consultation_type || 'Initial Consultation',
        preferred_date: consultationData.preferred_date,
        preferred_time: consultationData.preferred_time,
        status: 'pending',
        notes: consultationData.notes,
        contact_name: consultationData.contact_name || '',
        contact_email: consultationData.contact_email || '',
        contact_phone: consultationData.contact_phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setConsultations(prev => [mockConsultation, ...prev]);
      return mockConsultation;
    } catch (error) {
      console.error('Error creating consultation:', error);
      toast.error('Failed to schedule consultation');
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
    createInterest,
    createConsultation,
    refetch: fetchEstateData,
  };
};
