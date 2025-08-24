import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  lead_source: string;
  lead_status?: string;
  lead_value?: number;
  acquisition_cost?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  advisor_id: string;
  campaign_id?: string;
  agency_id?: string;
  enrichment_data?: any;
  catchlight_confidence?: number;
  budget_score?: number;
  verified_net_worth?: number;
  // Computed fields
  full_name?: string;
}

export interface LeadsFilters {
  status?: string;
  utm_source?: string;
  search?: string;
}

export function useLeads(filters: LeadsFilters = {}) {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('lead_status', filters.status);
      }

      if (filters.utm_source) {
        query = query.eq('lead_source', filters.utm_source);
      }

      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Lead[];
    }
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Lead updated",
        description: "Lead information has been updated successfully."
      });
    },
    onError: (error) => {
      console.error('Error updating lead:', error);
      toast({
        title: "Error",
        description: "Failed to update lead. Please try again.",
        variant: "destructive"
      });
    }
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Lead deleted",
        description: "Lead has been removed successfully."
      });
    },
    onError: (error) => {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive"
      });
    }
  });
}