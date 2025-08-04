import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReservedProfile, CreateReservedProfileRequest, ClaimProfileRequest } from '@/types/reservedProfiles';
import { useToast } from '@/hooks/use-toast';

export const useReservedProfiles = () => {
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<ReservedProfile[]>([]);
  const { toast } = useToast();

  const fetchReservedProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reserved_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles((data || []) as ReservedProfile[]);
    } catch (error) {
      console.error('Error fetching reserved profiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reserved profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createReservedProfile = useCallback(async (profile: CreateReservedProfileRequest) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reserved_profiles')
        .insert([{
          ...profile,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      setProfiles(prev => [data as ReservedProfile, ...prev]);
      toast({
        title: "Success",
        description: `Reserved profile created for ${profile.name}`,
      });
      return data;
    } catch (error) {
      console.error('Error creating reserved profile:', error);
      toast({
        title: "Error",
        description: "Failed to create reserved profile",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const claimProfile = useCallback(async (request: ClaimProfileRequest) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reserved_profiles')
        .update({
          claimed_at: new Date().toISOString(),
          claimed_by: request.user_id
        })
        .eq('invitation_token', request.token)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "🎉 Profile Claimed!",
        description: `Welcome to the Family Office Marketplace™!`,
      });

      // Trigger confetti
      if (typeof window !== 'undefined' && (window as any).triggerProfessionalWelcome) {
        (window as any).triggerProfessionalWelcome(data.name);
      }

      return data;
    } catch (error) {
      console.error('Error claiming profile:', error);
      toast({
        title: "Error",
        description: "Failed to claim profile. Please check your link.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getProfileByToken = useCallback(async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('reserved_profiles')
        .select('*')
        .eq('invitation_token', token)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile by token:', error);
      return null;
    }
  }, []);

  const sendInvitation = useCallback(async (profileId: string, method: 'email' | 'sms' | 'linkedin' | 'heygen') => {
    setLoading(true);
    try {
      // Update invitation sent timestamp
      const { error: updateError } = await supabase
        .from('reserved_profiles')
        .update({
          invitation_sent_at: new Date().toISOString(),
          invitation_method: method
        })
        .eq('id', profileId);

      if (updateError) throw updateError;

      // Log invitation
      const { error: logError } = await supabase
        .from('reserved_profile_invitations')
        .insert([{
          reserved_profile_id: profileId,
          invitation_method: method,
          sent_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (logError) throw logError;

      toast({
        title: "Invitation Sent",
        description: `${method.toUpperCase()} invitation sent successfully`,
      });
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getAnalytics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reserved_profile_analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return [];
    }
  }, []);

  return {
    loading,
    profiles,
    fetchReservedProfiles,
    createReservedProfile,
    claimProfile,
    getProfileByToken,
    sendInvitation,
    getAnalytics
  };
};