import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MultiFirm {
  id: string;
  name: string;
  slug: string;
  contact_email: string;
  parent_tenant_id?: string;
  logo_url?: string;
  seats_purchased: number;
  seats_in_use: number;
  billing_status: 'active' | 'suspended' | 'cancelled';
  status: 'active' | 'suspended' | 'archived';
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface FirmUser {
  id: string;
  firm_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'cpa' | 'bookkeeper' | 'staff';
  permissions: Record<string, any>;
  is_active: boolean;
  created_at: string;
  user?: {
    email: string;
    name?: string;
  };
}

interface FirmHandoff {
  id: string;
  firm_id: string;
  current_owner_id: string;
  new_owner_email: string;
  reason?: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  master_admin_approval: boolean;
  created_at: string;
  firm?: {
    name: string;
  };
}

interface RollupAnalytics {
  id: string;
  parent_tenant_id: string;
  period_start: string;
  period_end: string;
  total_firms: number;
  total_users: number;
  total_clients: number;
  total_revenue: number;
  calculated_at: string;
}

export const useMultiTenantManagement = () => {
  const [firms, setFirms] = useState<MultiFirm[]>([]);
  const [firmUsers, setFirmUsers] = useState<FirmUser[]>([]);
  const [handoffs, setHandoffs] = useState<FirmHandoff[]>([]);
  const [analytics, setAnalytics] = useState<RollupAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchFirms(),
        fetchFirmUsers(),
        fetchHandoffs()
      ]);
    } catch (err) {
      console.error('Error fetching firm data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFirms = async () => {
    const { data, error } = await supabase
      .from('firms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setFirms(data || []);
  };

  const fetchFirmUsers = async () => {
    const { data, error } = await supabase
      .from('firm_users')
      .select(`
        *,
        user:profiles!inner(email, display_name)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setFirmUsers(data || []);
  };

  const fetchHandoffs = async () => {
    const { data, error } = await supabase
      .from('firm_handoffs')
      .select(`
        *,
        firm:firms!inner(name)
      `)
      .in('status', ['pending', 'approved', 'in_progress'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    setHandoffs(data || []);
  };

  const createFirm = async (firmData: {
    name: string;
    contact_email: string;
    parent_tenant_id: string;
    settings?: Record<string, any>;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('firm-management', {
        body: {
          action: 'create_firm',
          ...firmData
        }
      });

      if (error) throw error;

      toast({
        title: "Firm Created",
        description: `${firmData.name} has been successfully created.`
      });

      await fetchFirms();
      return data.firm;
    } catch (err) {
      console.error('Error creating firm:', err);
      toast({
        title: "Error",
        description: "Failed to create firm. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateFirm = async (firmId: string, updates: Partial<MultiFirm>) => {
    try {
      const { data, error } = await supabase.functions.invoke('firm-management', {
        body: {
          action: 'update_firm',
          firm_id: firmId,
          updates
        }
      });

      if (error) throw error;

      toast({
        title: "Firm Updated",
        description: "Firm information has been successfully updated."
      });

      await fetchFirms();
      return data.firm;
    } catch (err) {
      console.error('Error updating firm:', err);
      toast({
        title: "Error",
        description: "Failed to update firm. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const addUserToFirm = async (firmId: string, userEmail: string, role: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('firm-management', {
        body: {
          action: 'add_user_to_firm',
          firm_id: firmId,
          user_email: userEmail,
          role
        }
      });

      if (error) throw error;

      toast({
        title: "User Added",
        description: `${userEmail} has been added to the firm.`
      });

      await Promise.all([fetchFirmUsers(), fetchFirms()]);
      return data.assignment;
    } catch (err) {
      console.error('Error adding user to firm:', err);
      toast({
        title: "Error",
        description: "Failed to add user to firm. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const removeUserFromFirm = async (firmId: string, userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('firm-management', {
        body: {
          action: 'remove_user_from_firm',
          firm_id: firmId,
          user_id: userId
        }
      });

      if (error) throw error;

      toast({
        title: "User Removed",
        description: "User has been removed from the firm."
      });

      await Promise.all([fetchFirmUsers(), fetchFirms()]);
      return data;
    } catch (err) {
      console.error('Error removing user from firm:', err);
      toast({
        title: "Error",
        description: "Failed to remove user from firm. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const initiateHandoff = async (handoffData: {
    firm_id: string;
    new_owner_email: string;
    reason?: string;
    client_notification_template?: string;
    transfer_items?: Record<string, any>;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('firm-management', {
        body: {
          action: 'initiate_handoff',
          ...handoffData
        }
      });

      if (error) throw error;

      toast({
        title: "Handoff Initiated",
        description: "Firm handoff request has been submitted for approval."
      });

      await fetchHandoffs();
      return data.handoff;
    } catch (err) {
      console.error('Error initiating handoff:', err);
      toast({
        title: "Error",
        description: "Failed to initiate handoff. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const approveHandoff = async (handoffId: string, approved: boolean) => {
    try {
      const { data, error } = await supabase.functions.invoke('firm-management', {
        body: {
          action: 'approve_handoff',
          handoff_id: handoffId,
          approved
        }
      });

      if (error) throw error;

      toast({
        title: approved ? "Handoff Approved" : "Handoff Rejected",
        description: `Handoff request has been ${approved ? 'approved' : 'rejected'}.`
      });

      await fetchHandoffs();
      return data.handoff;
    } catch (err) {
      console.error('Error processing handoff:', err);
      toast({
        title: "Error",
        description: "Failed to process handoff. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const calculateRollupAnalytics = async (
    parentTenantId: string,
    periodStart: string,
    periodEnd: string
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('firm-management', {
        body: {
          action: 'calculate_analytics',
          parent_tenant_id: parentTenantId,
          period_start: periodStart,
          period_end: periodEnd
        }
      });

      if (error) throw error;

      setAnalytics(data.analytics);
      return data.analytics;
    } catch (err) {
      console.error('Error calculating analytics:', err);
      toast({
        title: "Error",
        description: "Failed to calculate analytics. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    firms,
    firmUsers,
    handoffs,
    analytics,
    loading,
    error,
    createFirm,
    updateFirm,
    addUserToFirm,
    removeUserFromFirm,
    initiateHandoff,
    approveHandoff,
    calculateRollupAnalytics,
    refetch: fetchData
  };
};