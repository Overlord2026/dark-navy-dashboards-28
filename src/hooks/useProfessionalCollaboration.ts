import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProfessionalCollaborationRequest {
  id: string;
  family_user_id: string;
  professional_user_id?: string;
  professional_type: 'advisor' | 'attorney' | 'accountant' | 'insurance_agent';
  request_type: 'estate_review' | 'swag_analysis_review' | 'tax_planning' | 'insurance_review';
  tool_data?: any;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message?: string;
  due_date?: string;
  professional_notes?: string;
  family_feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCollaborationRequest {
  professional_type: 'advisor' | 'attorney' | 'accountant' | 'insurance_agent';
  request_type: 'estate_review' | 'swag_analysis_review' | 'tax_planning' | 'insurance_review';
  tool_data?: any;
  message?: string;
  due_date?: string;
  professional_user_id?: string;
}

export const useProfessionalCollaboration = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ProfessionalCollaborationRequest[]>([]);

  // Fetch collaboration requests
  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_collaboration_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching collaboration requests:', error);
        return;
      }

      setRequests((data || []) as ProfessionalCollaborationRequest[]);
    } catch (error) {
      console.error('Error fetching collaboration requests:', error);
    }
  };

  // Create a new collaboration request (family-initiated)
  const createCollaborationRequest = async (request: CreateCollaborationRequest) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('request_professional_collaboration', {
        p_professional_type: request.professional_type,
        p_request_type: request.request_type,
        p_tool_data: request.tool_data || null,
        p_message: request.message || null,
        p_due_date: request.due_date || null,
        p_professional_user_id: request.professional_user_id || null
      });

      if (error) {
        console.error('Error creating collaboration request:', error);
        toast.error('Failed to create collaboration request');
        throw error;
      }

      toast.success('Professional collaboration request created successfully!');
      await fetchRequests(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error creating collaboration request:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Respond to collaboration request (professional response)
  const respondToRequest = async (
    requestId: string, 
    status: 'accepted' | 'declined' | 'in_progress' | 'completed',
    professionalNotes?: string
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('respond_to_collaboration_request', {
        p_request_id: requestId,
        p_status: status,
        p_professional_notes: professionalNotes || null
      });

      if (error) {
        console.error('Error responding to collaboration request:', error);
        toast.error('Failed to respond to collaboration request');
        throw error;
      }

      toast.success(`Request ${status} successfully!`);
      await fetchRequests(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error responding to collaboration request:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update family feedback
  const updateFamilyFeedback = async (requestId: string, feedback: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('professional_collaboration_requests')
        .update({ family_feedback: feedback, updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating family feedback:', error);
        toast.error('Failed to update feedback');
        throw error;
      }

      toast.success('Feedback updated successfully!');
      await fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating family feedback:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get requests by status
  const getRequestsByStatus = (status: string) => {
    return requests.filter(request => request.status === status);
  };

  // Get requests by professional type
  const getRequestsByProfessionalType = (type: string) => {
    return requests.filter(request => request.professional_type === type);
  };

  // Initialize - fetch requests on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    loading,
    requests,
    createCollaborationRequest,
    respondToRequest,
    updateFamilyFeedback,
    getRequestsByStatus,
    getRequestsByProfessionalType,
    fetchRequests
  };
};