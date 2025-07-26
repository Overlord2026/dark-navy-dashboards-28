import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Professional {
  id: string;
  user_id: string;
  name?: string;
  email?: string;
  phone?: string;
  specialty?: string;
  business_name?: string;
  bio?: string;
  website_url?: string;
  office_address?: string;
  is_verified: boolean;
  years_experience?: number;
  hourly_rate?: number;
  rating?: number;
  total_reviews?: number;
  availability_status: string;
  created_at: string;
}

export interface ProfessionalRelationship {
  id: string;
  client_user_id: string;
  professional_user_id: string;
  professional?: Professional;
  relationship_type: string;
  status: 'pending' | 'active' | 'inactive' | 'terminated';
  invited_by?: string;
  invitation_sent_at?: string;
  accepted_at?: string;
  notes?: string;
  permissions?: any;
  created_at: string;
}

export interface ProfessionalInvitation {
  id: string;
  email: string;
  invited_by_user_id: string;
  professional_type?: string;
  custom_message?: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expires_at?: string;
  created_at: string;
}

export const useProfessionalDirectory = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [myProfessionals, setMyProfessionals] = useState<ProfessionalRelationship[]>([]);
  const [invitations, setInvitations] = useState<ProfessionalInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select(`
          *,
          professional_users!inner(
            user_id,
            profiles!inner(
              first_name,
              last_name,
              email,
              phone
            )
          )
        `)
        .eq('status', 'active');

      if (error) throw error;
      
      const formattedData = data?.map(prof => ({
        id: prof.id,
        user_id: prof.professional_users.user_id,
        name: `${prof.professional_users.profiles.first_name} ${prof.professional_users.profiles.last_name}`,
        email: prof.professional_users.profiles.email,
        phone: prof.professional_users.profiles.phone,
        specialty: prof.specialty,
        business_name: prof.business_name,
        bio: prof.bio,
        website_url: prof.website,
        office_address: prof.office_address,
        is_verified: prof.is_verified,
        years_experience: prof.years_experience,
        hourly_rate: prof.hourly_rate,
        rating: prof.rating,
        total_reviews: prof.review_count,
        availability_status: prof.availability_status || 'available',
        created_at: prof.created_at
      })) || [];
      
      setProfessionals(formattedData);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      toast({
        title: "Error",
        description: "Failed to load professionals directory",
        variant: "destructive",
      });
    }
  };

  const fetchMyProfessionals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('professional_assignments')
        .select(`
          *,
          professionals!inner(
            *,
            professional_users!inner(
              user_id,
              profiles!inner(
                first_name,
                last_name,
                email,
                phone
              )
            )
          )
        `)
        .eq('client_user_id', user.id);

      if (error) throw error;

      const formattedRelationships = data?.map(rel => ({
        id: rel.id,
        client_user_id: rel.client_user_id,
        professional_user_id: rel.professional_user_id,
        professional: {
          id: rel.professionals.id,
          user_id: rel.professionals.professional_users.user_id,
          name: `${rel.professionals.professional_users.profiles.first_name} ${rel.professionals.professional_users.profiles.last_name}`,
          email: rel.professionals.professional_users.profiles.email,
          phone: rel.professionals.professional_users.profiles.phone,
          specialty: rel.professionals.specialty,
          business_name: rel.professionals.business_name,
          bio: rel.professionals.bio,
          website_url: rel.professionals.website,
          office_address: rel.professionals.office_address,
          is_verified: rel.professionals.is_verified,
          years_experience: rel.professionals.years_experience,
          hourly_rate: rel.professionals.hourly_rate,
          rating: rel.professionals.rating,
          total_reviews: rel.professionals.review_count,
          availability_status: rel.professionals.availability_status || 'available',
          created_at: rel.professionals.created_at
        },
        relationship_type: rel.relationship_type || 'primary',
        status: rel.status,
        invited_by: rel.assigned_by,
        accepted_at: rel.created_at,
        notes: rel.notes,
        created_at: rel.created_at
      })) || [];

      setMyProfessionals(formattedRelationships);
    } catch (error) {
      console.error('Error fetching my professionals:', error);
      toast({
        title: "Error", 
        description: "Failed to load your professional team",
        variant: "destructive",
      });
    }
  };

  const fetchInvitations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('professional_invitations')
        .select('*')
        .eq('invited_by_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const inviteProfessional = async (email: string, specialty: string, message?: string) => {
    if (!user) return;

    try {
      const invitation_token = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expires_at = new Date();
      expires_at.setDate(expires_at.getDate() + 7); // 7 days expiry

      const { data, error } = await supabase
        .from('professional_invitations')
        .insert({
          email,
          invited_by_user_id: user.id,
          professional_type: specialty,
          invitation_token,
          custom_message: message,
          expires_at: expires_at.toISOString(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // TODO: Send invitation email via edge function
      
      toast({
        title: "Invitation Sent!",
        description: `Professional invitation sent to ${email}`,
      });

      await fetchInvitations();
      return data;
    } catch (error) {
      console.error('Error inviting professional:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  const assignProfessional = async (professionalUserId: string, relationshipType: 'primary' | 'secondary' | 'consultant' = 'primary') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('professional_assignments')
        .insert({
          client_user_id: user.id,
          professional_user_id: professionalUserId,
          relationship_type: relationshipType,
          status: 'active',
          assigned_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Professional Added!",
        description: "Professional has been added to your team",
      });

      await fetchMyProfessionals();
      return data;
    } catch (error) {
      console.error('Error assigning professional:', error);
      toast({
        title: "Error",
        description: "Failed to add professional to your team",
        variant: "destructive",
      });
    }
  };

  const removeProfessional = async (relationshipId: string) => {
    try {
      const { error } = await supabase
        .from('professional_assignments')
        .update({ status: 'terminated', terminated_at: new Date().toISOString() })
        .eq('id', relationshipId);

      if (error) throw error;

      toast({
        title: "Professional Removed",
        description: "Professional has been removed from your team",
      });

      await fetchMyProfessionals();
    } catch (error) {
      console.error('Error removing professional:', error);
      toast({
        title: "Error",
        description: "Failed to remove professional",
        variant: "destructive",
      });
    }
  };

  const searchProfessionals = (query: string, specialty?: string) => {
    let filtered = professionals;

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(prof => 
        prof.name?.toLowerCase().includes(lowercaseQuery) ||
        prof.business_name?.toLowerCase().includes(lowercaseQuery) ||
        prof.specialty?.toLowerCase().includes(lowercaseQuery) ||
        prof.bio?.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (specialty) {
      filtered = filtered.filter(prof => prof.specialty === specialty);
    }

    return filtered;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProfessionals(),
        fetchMyProfessionals(),
        fetchInvitations()
      ]);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  return {
    professionals,
    myProfessionals,
    invitations,
    loading,
    inviteProfessional,
    assignProfessional,
    removeProfessional,
    searchProfessionals,
    refreshData: () => {
      fetchProfessionals();
      fetchMyProfessionals();
      fetchInvitations();
    }
  };
};