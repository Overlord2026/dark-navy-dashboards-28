import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { Firm, ProfessionalUser, SeatAssignment, Subscription, ClientAssignment } from '@/types/firm';

export function useFirmManagement() {
  const { user } = useAuth();
  const [firm, setFirm] = useState<Firm | null>(null);
  const [professionals, setProfessionals] = useState<ProfessionalUser[]>([]);
  const [seatAssignments, setSeatAssignments] = useState<SeatAssignment[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [clientAssignments, setClientAssignments] = useState<ClientAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFirmData();
    }
  }, [user]);

  const fetchFirmData = async () => {
    try {
      setLoading(true);
      
      // Get current user's firm
      const { data: professionalUser } = await supabase
        .from('professional_users')
        .select('firm_id')
        .eq('user_id', user?.id)
        .single();

      if (!professionalUser?.firm_id) {
        setLoading(false);
        return;
      }

      // Fetch firm details
      const { data: firmData } = await supabase
        .from('firms')
        .select('*')
        .eq('id', professionalUser.firm_id)
        .single();

      if (firmData) setFirm(firmData as Firm);

      // Fetch all professionals in the firm
      const { data: professionalsData } = await supabase
        .from('professional_users')
        .select('*')
        .eq('firm_id', professionalUser.firm_id)
        .order('created_at', { ascending: true });

      if (professionalsData) setProfessionals(professionalsData as ProfessionalUser[]);

      // Fetch seat assignments
      const { data: seatsData } = await supabase
        .from('seat_assignments')
        .select('*')
        .eq('firm_id', professionalUser.firm_id);

      if (seatsData) setSeatAssignments(seatsData as SeatAssignment[]);

      // Fetch subscription
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('firm_id', professionalUser.firm_id)
        .eq('status', 'active')
        .single();

      if (subscriptionData) setSubscription(subscriptionData as Subscription);

      // Fetch client assignments
      const { data: clientAssignmentsData } = await supabase
        .from('client_assignments')
        .select('*')
        .eq('firm_id', professionalUser.firm_id)
        .eq('is_active', true);

      if (clientAssignmentsData) setClientAssignments(clientAssignmentsData as ClientAssignment[]);

    } catch (error: any) {
      console.error('Error fetching firm data:', error);
      toast.error('Failed to load firm data');
    } finally {
      setLoading(false);
    }
  };

  const inviteProfessional = async (data: {
    name: string;
    email: string;
    role: string;
    specialties?: string[];
  }) => {
    if (!firm) return;

    try {
      const { error } = await supabase
        .from('professional_users')
        .insert({
          firm_id: firm.id,
          name: data.name,
          email: data.email,
          role: data.role,
          specialties: data.specialties || [],
          status: 'invited'
        });

      if (error) throw error;

      // Update seats in use
      await supabase
        .from('firms')
        .update({ 
          seats_in_use: firm.seats_in_use + 1 
        })
        .eq('id', firm.id);

      toast.success('Professional invited successfully');
      fetchFirmData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to invite professional');
    }
  };

  const updateProfessionalStatus = async (professionalId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('professional_users')
        .update({ status })
        .eq('id', professionalId);

      if (error) throw error;

      toast.success('Professional status updated');
      fetchFirmData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const assignClientToProfessional = async (
    professionalId: string, 
    clientId: string, 
    relationshipType: string
  ) => {
    if (!firm) return;

    try {
      const { error } = await supabase
        .from('client_assignments')
        .insert({
          firm_id: firm.id,
          professional_user_id: professionalId,
          client_user_id: clientId,
          relationship_type: relationshipType,
          is_active: true
        });

      if (error) throw error;

      toast.success('Client assigned successfully');
      fetchFirmData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign client');
    }
  };

  const updateFirmSettings = async (updates: Partial<Firm>) => {
    if (!firm) return;

    try {
      const { error } = await supabase
        .from('firms')
        .update(updates)
        .eq('id', firm.id);

      if (error) throw error;

      toast.success('Firm settings updated');
      fetchFirmData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update settings');
    }
  };

  const upgradePlan = async (newSeats: number, planName: string) => {
    if (!firm || !subscription) return;

    try {
      // Update subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .update({
          seats: newSeats,
          plan_name: planName
        })
        .eq('id', subscription.id);

      if (subError) throw subError;

      // Update firm seats
      const { error: firmError } = await supabase
        .from('firms')
        .update({ seats_purchased: newSeats })
        .eq('id', firm.id);

      if (firmError) throw firmError;

      toast.success('Plan upgraded successfully');
      fetchFirmData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upgrade plan');
    }
  };

  const removeProfessional = async (professionalId: string) => {
    if (!firm) return;

    try {
      // Deactivate all client assignments
      await supabase
        .from('client_assignments')
        .update({ is_active: false })
        .eq('professional_user_id', professionalId);

      // Remove seat assignment
      await supabase
        .from('seat_assignments')
        .delete()
        .eq('professional_user_id', professionalId);

      // Update professional status
      await supabase
        .from('professional_users')
        .update({ status: 'suspended' })
        .eq('id', professionalId);

      // Update seats in use
      await supabase
        .from('firms')
        .update({ 
          seats_in_use: Math.max(0, firm.seats_in_use - 1) 
        })
        .eq('id', firm.id);

      toast.success('Professional removed successfully');
      fetchFirmData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove professional');
    }
  };

  return {
    firm,
    professionals,
    seatAssignments,
    subscription,
    clientAssignments,
    loading,
    inviteProfessional,
    updateProfessionalStatus,
    assignClientToProfessional,
    updateFirmSettings,
    upgradePlan,
    removeProfessional,
    refetch: fetchFirmData
  };
}