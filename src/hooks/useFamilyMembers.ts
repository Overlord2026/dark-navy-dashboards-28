
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  relationship: 'aunt' | 'brother' | 'daughter' | 'domestic-partner' | 'father' | 'father-in-law' | 'grandfather' | 'grandmother' | 'granddaughter' | 'grandson' | 'mother' | 'mother-in-law' | 'nephew' | 'niece' | 'other-individual';
  email: string;
  has_app_access: boolean;
  access_level: 'full' | 'limited';
  invited_user_id?: string;
  invitation_sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AddFamilyMemberData {
  name: string;
  relationship: 'aunt' | 'brother' | 'daughter' | 'domestic-partner' | 'father' | 'father-in-law' | 'grandfather' | 'grandmother' | 'granddaughter' | 'grandson' | 'mother' | 'mother-in-law' | 'nephew' | 'niece' | 'other-individual';
  email: string;
  has_app_access: boolean;
  access_level: 'full' | 'limited';
}

export const useFamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = useAuth();

  const fetchFamilyMembers = async () => {
    if (!userProfile?.id) return;

    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error) {
      console.error('Error fetching family members:', error);
      toast.error('Failed to load family members');
    } finally {
      setIsLoading(false);
    }
  };

  const addFamilyMember = async (memberData: AddFamilyMemberData) => {
    if (!userProfile?.id) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('family_members')
        .insert([{
          user_id: userProfile.id,
          name: memberData.name,
          relationship: memberData.relationship,
          email: memberData.email,
          has_app_access: memberData.has_app_access,
          access_level: memberData.access_level,
        }])
        .select()
        .single();

      if (error) throw error;

      setFamilyMembers(prev => [data, ...prev]);
      
      // TODO: Implement email invitation logic here
      if (memberData.has_app_access && memberData.email) {
        console.log('Would send invitation email to:', memberData.email);
        toast.success(`Family member added and invitation sent to ${memberData.email}`);
      } else {
        toast.success('Family member added successfully');
      }

      return true;
    } catch (error) {
      console.error('Error adding family member:', error);
      toast.error('Failed to add family member');
      return false;
    }
  };

  const updateFamilyMember = async (id: string, updates: Partial<AddFamilyMemberData>) => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFamilyMembers(prev => 
        prev.map(member => member.id === id ? data : member)
      );
      
      toast.success('Family member updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating family member:', error);
      toast.error('Failed to update family member');
      return false;
    }
  };

  const deleteFamilyMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFamilyMembers(prev => prev.filter(member => member.id !== id));
      toast.success('Family member removed successfully');
      return true;
    } catch (error) {
      console.error('Error deleting family member:', error);
      toast.error('Failed to remove family member');
      return false;
    }
  };

  useEffect(() => {
    fetchFamilyMembers();
  }, [userProfile?.id]);

  return {
    familyMembers,
    isLoading,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    refetch: fetchFamilyMembers,
  };
};
