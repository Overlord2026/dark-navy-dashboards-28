import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  EnhancedProfessional, 
  TeamMember, 
  ProfessionalAssignment,
  ProfessionalReview,
  ProfessionalInvitation
} from '@/types/professionalTeam';

export const useProfessionalTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [allProfessionals, setAllProfessionals] = useState<EnhancedProfessional[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch user's assigned team
  const fetchTeam = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('professional_assignments')
        .select(`
          *,
          professionals:professional_id (
            *
          )
        `)
        .eq('client_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const teamMembers: TeamMember[] = (data || []).map(assignment => ({
        ...assignment.professionals,
        status: assignment.professionals.status as 'active' | 'pending' | 'inactive',
        assignment: {
          ...assignment,
          status: assignment.status as 'active' | 'pending' | 'ended'
        }
      }));

      setTeam(teamMembers);
    } catch (error) {
      console.error('Error fetching team:', error);
      toast({
        title: "Error fetching team",
        description: "Failed to load your professional team",
        variant: "destructive"
      });
    }
  };

  // Fetch all professionals for marketplace
  const fetchAllProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select(`
          *,
          professional_reviews (
            rating,
            comment,
            created_at
          )
        `)
        .eq('status', 'active')
        .order('verified', { ascending: false })
        .order('ratings_average', { ascending: false });

      if (error) throw error;

      const professionals: EnhancedProfessional[] = (data || []).map(prof => ({
        ...prof,
        status: prof.status as 'active' | 'pending' | 'inactive'
      }));
      setAllProfessionals(professionals);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      toast({
        title: "Error fetching professionals",
        description: "Failed to load professional directory",
        variant: "destructive"
      });
    }
  };

  // Assign professional to user's team
  const assignProfessional = async (
    professionalId: string, 
    relationship: string,
    notes?: string
  ) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('professional_assignments')
        .insert({
          professional_id: professionalId,
          client_id: user.id,
          assigned_by: user.id,
          relationship,
          notes,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Professional assigned",
        description: "Professional has been added to your team"
      });

      await fetchTeam();
      return data;
    } catch (error) {
      console.error('Error assigning professional:', error);
      toast({
        title: "Error assigning professional",
        description: "Failed to add professional to your team",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Remove professional from team
  const removeProfessionalFromTeam = async (assignmentId: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('professional_assignments')
        .update({ status: 'ended', end_date: new Date().toISOString().split('T')[0] })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Professional removed",
        description: "Professional has been removed from your team"
      });

      await fetchTeam();
    } catch (error) {
      console.error('Error removing professional:', error);
      toast({
        title: "Error removing professional",
        description: "Failed to remove professional from team",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Add review for professional
  const addReview = async (professionalId: string, rating: number, comment?: string) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('professional_reviews')
        .insert({
          professional_id: professionalId,
          reviewer_id: user.id,
          rating,
          comment
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Review added",
        description: "Your review has been submitted"
      });

      await fetchAllProfessionals();
      return data;
    } catch (error) {
      console.error('Error adding review:', error);
      toast({
        title: "Error adding review",
        description: "Failed to submit review",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Invite professional to platform
  const inviteProfessional = async (email: string, invitedAs: string) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('professional_invitations')
        .insert({
          email,
          invited_by: user.id,
          invited_as: invitedAs,
          status: 'sent'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Invitation sent",
        description: `Invitation has been sent to ${email}`
      });

      return data;
    } catch (error) {
      console.error('Error inviting professional:', error);
      toast({
        title: "Error sending invitation",
        description: "Failed to send invitation",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTeam(), fetchAllProfessionals()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    team,
    allProfessionals,
    loading,
    saving,
    assignProfessional,
    removeProfessionalFromTeam,
    addReview,
    inviteProfessional,
    refreshTeam: fetchTeam,
    refreshProfessionals: fetchAllProfessionals
  };
};