import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

export interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  relationship: 'spouse' | 'parent' | 'child' | 'sibling' | 'other';
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
  relationship: 'spouse' | 'parent' | 'child' | 'sibling' | 'other';
  email: string;
  has_app_access: boolean;
  access_level: 'full' | 'limited';
}

// EmailJS configuration - You'll need to replace these with your actual EmailJS values
const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_service_id', // Replace with your EmailJS service ID
  TEMPLATE_ID: 'your_template_id', // Replace with your EmailJS template ID
  PUBLIC_KEY: 'your_public_key', // Replace with your EmailJS public key
};

export const useFamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = useUser();

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

  const sendInvitationEmail = async (memberData: AddFamilyMemberData, inviterName: string) => {
    try {
      // Initialize EmailJS (this only needs to be done once)
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

      const templateParams = {
        to_name: memberData.name,
        to_email: memberData.email,
        from_name: inviterName,
        relationship: memberData.relationship,
        access_level: memberData.access_level,
        app_url: window.location.origin,
        message: `You have been invited to join the family financial management app with ${memberData.access_level} access.`,
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      return true;
    } catch (error) {
      console.error('Error sending invitation email:', error);
      return false;
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
      
      // Send invitation email if app access is granted
      if (memberData.has_app_access && memberData.email) {
        const inviterName = userProfile.display_name || userProfile.first_name || 'Family Member';
        const emailSent = await sendInvitationEmail(memberData, inviterName);
        
        if (emailSent) {
          toast.success(`Family member added and invitation sent to ${memberData.email}`);
        } else {
          toast.success('Family member added successfully');
          toast.error('Failed to send invitation email. Please contact them manually.');
        }
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
