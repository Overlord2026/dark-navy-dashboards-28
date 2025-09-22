import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClientInvitation {
  id?: string;
  email: string;
  name: string;
  professional_type: 'advisor' | 'cpa' | 'attorney';
  invited_by: string;
  service_type?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expires_at: string;
  created_at?: string;
}

export const useUnifiedClientInvitation = () => {
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<ClientInvitation[]>([]);
  const { toast } = useToast();

  const sendInvitation = async (invitation: Omit<ClientInvitation, 'id' | 'invited_by' | 'status' | 'created_at'>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Use the existing prospect_invitations table structure
      const { data, error } = await supabase
        .from('prospect_invitations')
        .insert({
          email: invitation.email,
          advisor_id: user.id, // Map to advisor_id field
          persona_group: invitation.professional_type,
          status: 'pending',
          expires_at: invitation.expires_at,
          magic_token: crypto.randomUUID(), // Generate a unique token
          utm_source: 'professional_dashboard'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Invitation sent",
        description: `Client invitation sent successfully to ${invitation.email}`,
      });

      await fetchInvitations();
      return data;
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error sending invitation",
        description: "Failed to send client invitation. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('prospect_invitations')
        .select('*')
        .eq('advisor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData: ClientInvitation[] = (data || []).map(item => ({
        id: item.id,
        email: item.email,
        name: item.email, // Use email as name since we don't have a name field
        professional_type: (item.persona_group as 'advisor' | 'cpa' | 'attorney') || 'advisor',
        invited_by: item.advisor_id,
        status: item.status as 'pending' | 'accepted' | 'rejected' | 'expired',
        expires_at: item.expires_at || '',
        created_at: item.created_at
      }));

      setInvitations(transformedData);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error fetching invitations",
        description: "Failed to load client invitations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resendInvitation = async (invitationId: string) => {
    setLoading(true);
    try {
      // Update the expiration date and reset status
      const newExpirationDate = new Date();
      newExpirationDate.setDate(newExpirationDate.getDate() + 7);

      const { error } = await supabase
        .from('prospect_invitations')
        .update({
          status: 'pending',
          expires_at: newExpirationDate.toISOString()
        })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation resent",
        description: "Client invitation has been resent successfully",
      });

      await fetchInvitations();
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Error resending invitation",
        description: "Failed to resend invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('prospect_invitations')
        .update({ status: 'expired' })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation cancelled",
        description: "Client invitation has been cancelled",
      });

      await fetchInvitations();
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast({
        title: "Error cancelling invitation",
        description: "Failed to cancel invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    invitations,
    sendInvitation,
    fetchInvitations,
    resendInvitation,
    cancelInvitation
  };
};