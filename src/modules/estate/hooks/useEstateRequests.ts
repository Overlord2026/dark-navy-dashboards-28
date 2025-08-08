import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEdgeFunction } from '@/hooks/useEdgeFunction';
import { toast } from 'sonner';

export interface EstateRequest {
  id: string;
  user_id: string;
  household_id?: string;
  advisor_id?: string;
  attorney_id?: string;
  state_code: string;
  matter_type: string;
  status: string;
  priority: string;
  intake: any;
  docs: any[];
  compliance: any;
  created_at: string;
  updated_at: string;
}

export interface CreateEstateRequestData {
  state_code: string;
  matter_type: string;
  priority?: string;
  intake?: any;
  advisor_id?: string;
  attorney_id?: string;
}

export const useEstateRequests = () => {
  const [requests, setRequests] = useState<EstateRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const notaryFunction = useEdgeFunction('estate-notary');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('estate_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching estate requests:', error);
        toast.error('Failed to fetch estate requests');
        return;
      }

      setRequests((data || []).map(item => ({
        ...item,
        docs: Array.isArray(item.docs) ? item.docs : [],
        intake: typeof item.intake === 'object' ? item.intake : {},
        compliance: typeof item.compliance === 'object' ? item.compliance : {}
      })));
    } catch (error) {
      console.error('Error fetching estate requests:', error);
      toast.error('Failed to fetch estate requests');
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (data: CreateEstateRequestData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: newRequest, error } = await supabase
        .from('estate_requests')
        .insert({
          user_id: user.id,
          ...data
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating estate request:', error);
        throw error;
      }

      setRequests(prev => [{
        ...newRequest,
        docs: Array.isArray(newRequest.docs) ? newRequest.docs : [],
        intake: typeof newRequest.intake === 'object' ? newRequest.intake : {},
        compliance: typeof newRequest.compliance === 'object' ? newRequest.compliance : {}
      }, ...prev]);
      toast.success('Estate planning request created successfully');
      return newRequest;
    } catch (error) {
      console.error('Error creating estate request:', error);
      toast.error('Failed to create estate request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (id: string, updates: Partial<EstateRequest>) => {
    setLoading(true);
    try {
      const { data: updatedRequest, error } = await supabase
        .from('estate_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating estate request:', error);
        throw error;
      }

      setRequests(prev => 
        prev.map(req => req.id === id ? {
          ...updatedRequest,
          docs: Array.isArray(updatedRequest.docs) ? updatedRequest.docs : [],
          intake: typeof updatedRequest.intake === 'object' ? updatedRequest.intake : {},
          compliance: typeof updatedRequest.compliance === 'object' ? updatedRequest.compliance : {}
        } : req)
      );
      toast.success('Estate request updated successfully');
      return updatedRequest;
    } catch (error) {
      console.error('Error updating estate request:', error);
      toast.error('Failed to update estate request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createNotarySession = async (requestId: string, sessionType: 'notary' | 'witness', scheduledAt?: string) => {
    try {
      const response = await notaryFunction.invoke({
        action: 'create-notary-session',
        requestId,
        sessionType,
        scheduledAt
      });

      if (response.success) {
        toast.success(`${sessionType} session created successfully`);
        return response.data;
      } else {
        throw new Error(response.error?.userMessage || 'Failed to create session');
      }
    } catch (error) {
      console.error('Error creating notary session:', error);
      toast.error('Failed to create session');
      throw error;
    }
  };

  const inviteWitnesses = async (requestId: string, witnesses: Array<{ fullName: string; email: string; phone?: string }>) => {
    try {
      const response = await notaryFunction.invoke({
        action: 'invite-witness',
        requestId,
        witnesses
      });

      if (response.success) {
        toast.success(`Invited ${witnesses.length} witness(es) successfully`);
        return response.data;
      } else {
        throw new Error(response.error?.userMessage || 'Failed to invite witnesses');
      }
    } catch (error) {
      console.error('Error inviting witnesses:', error);
      toast.error('Failed to invite witnesses');
      throw error;
    }
  };

  const submitStateFiling = async (requestId: string, filingData: any) => {
    try {
      const response = await notaryFunction.invoke({
        action: 'state-file',
        requestId,
        ...filingData
      });

      if (response.success) {
        toast.success('State filing submitted successfully');
        return response.data;
      } else {
        throw new Error(response.error?.userMessage || 'Failed to submit filing');
      }
    } catch (error) {
      console.error('Error submitting state filing:', error);
      toast.error('Failed to submit state filing');
      throw error;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    createRequest,
    updateRequest,
    createNotarySession,
    inviteWitnesses,
    submitStateFiling,
    fetchRequests
  };
};