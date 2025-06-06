
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface SocialSecurityMember {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  preferred_retirement_age: number;
  account_linked: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialSecurityEstimate {
  id: string;
  member_id: string;
  age_62_estimate: number;
  age_67_estimate: number;
  age_70_estimate: number;
  created_at: string;
  updated_at: string;
}

export interface MemberWithEstimates extends SocialSecurityMember {
  estimates?: SocialSecurityEstimate;
}

export const useSocialSecurityMembers = () => {
  const [members, setMembers] = useState<MemberWithEstimates[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const fetchMembers = async () => {
    if (!user || !isAuthenticated) {
      console.log('No authenticated user found');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch members with their estimates
      const { data: membersData, error: membersError } = await supabase
        .from('social_security_members')
        .select(`
          *,
          social_security_estimates(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (membersError) {
        console.error('Error fetching members:', membersError);
        throw membersError;
      }

      // Transform the data to match our interface
      const transformedMembers = membersData?.map(member => ({
        ...member,
        estimates: member.social_security_estimates?.[0] || undefined
      })) || [];

      setMembers(transformedMembers);
    } catch (error) {
      console.error('Error fetching social security members:', error);
      toast.error('Failed to load social security members');
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async (memberData: Omit<SocialSecurityMember, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !isAuthenticated) {
      toast.error('You must be logged in to add family members');
      return;
    }

    if (!memberData.name || !memberData.relationship) {
      toast.error('Name and relationship are required');
      return;
    }

    try {
      console.log('Adding member with data:', { ...memberData, user_id: user.id });
      
      const { data, error } = await supabase
        .from('social_security_members')
        .insert([{
          ...memberData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error inserting member:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from insert');
      }

      const newMember: MemberWithEstimates = {
        ...data,
        estimates: undefined
      };

      setMembers(prev => [...prev, newMember]);
      toast.success('Family member added successfully');
      return newMember;
    } catch (error) {
      console.error('Error adding social security member:', error);
      if (error instanceof Error) {
        toast.error(`Failed to add family member: ${error.message}`);
      } else {
        toast.error('Failed to add family member');
      }
      throw error;
    }
  };

  const updateMember = async (id: string, updates: Partial<SocialSecurityMember>) => {
    if (!user || !isAuthenticated) {
      toast.error('You must be logged in to update members');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('social_security_members')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setMembers(prev => prev.map(member => 
        member.id === id ? { ...member, ...data } : member
      ));

      toast.success('Member updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating social security member:', error);
      toast.error('Failed to update member');
      throw error;
    }
  };

  const deleteMember = async (id: string) => {
    if (!user || !isAuthenticated) {
      toast.error('You must be logged in to delete members');
      return;
    }

    try {
      const { error } = await supabase
        .from('social_security_members')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setMembers(prev => prev.filter(member => member.id !== id));
      toast.success('Member removed successfully');
    } catch (error) {
      console.error('Error deleting social security member:', error);
      toast.error('Failed to remove member');
      throw error;
    }
  };

  const linkAccount = async (memberId: string) => {
    if (!user || !isAuthenticated) {
      toast.error('You must be logged in to link accounts');
      return;
    }

    try {
      // First update the member to mark account as linked
      await updateMember(memberId, { account_linked: true });

      // Generate realistic estimates (in a real app, this would come from SSA.gov)
      const baseEstimate = 2000 + Math.floor(Math.random() * 1000);
      const estimates = {
        age_62_estimate: Math.floor(baseEstimate * 0.75),
        age_67_estimate: baseEstimate,
        age_70_estimate: Math.floor(baseEstimate * 1.25)
      };

      // Create or update estimates
      const { data, error } = await supabase
        .from('social_security_estimates')
        .upsert([{
          member_id: memberId,
          ...estimates
        }])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setMembers(prev => prev.map(member => 
        member.id === memberId 
          ? { ...member, account_linked: true, estimates: data }
          : member
      ));

      toast.success('Account linked successfully - benefit estimates updated');
    } catch (error) {
      console.error('Error linking account:', error);
      toast.error('Failed to link account');
      throw error;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMembers();
    } else {
      setMembers([]);
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  return {
    members,
    isLoading,
    addMember,
    updateMember,
    deleteMember,
    linkAccount,
    refreshMembers: fetchMembers
  };
};
