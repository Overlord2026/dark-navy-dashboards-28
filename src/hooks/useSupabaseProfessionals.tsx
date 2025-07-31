
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Professional, ProfessionalType } from '@/types/professional';

export interface SupabaseProfessional {
  id: string;
  user_id: string;
  name: string;
  email: string;
  type: ProfessionalType;
  company?: string;
  phone?: string;
  website?: string;
  address?: string;
  notes?: string;
  rating?: number;
  specialties?: string[];
  certifications?: string[];
  created_at: string;
  updated_at: string;
}

export const useSupabaseProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch professionals from Supabase
  const fetchProfessionals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        setProfessionals([]);
        return;
      }

      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching professionals:', error);
        toast({
          title: "Error fetching professionals",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Transform Supabase data to match frontend interface
      const transformedProfessionals: Professional[] = ((data as any) || []).map((prof: any) => ({
        id: prof.id,
        name: prof.name,
        email: prof.email,
        type: prof.type,
        company: prof.company,
        phone: prof.phone,
        website: prof.website,
        address: prof.address,
        notes: prof.notes,
        rating: prof.rating,
        specialties: prof.specialties,
        certifications: prof.certifications,
        custom_fields: prof.custom_fields || {}
      }));

      setProfessionals(transformedProfessionals);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch professionals",
        variant: "destructive"
      });
    }
  };

  // Add professional
  const addProfessional = async (professional: Omit<Professional, 'id'>) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add professionals",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('professionals')
        .insert({
          user_id: user.id,
          name: professional.name,
          email: professional.email,
          professional_type: professional.type,
          tenant_id: 'default',
          company: professional.company,
          phone: professional.phone,
          website: professional.website,
          address: professional.address,
          notes: professional.notes,
          rating: professional.rating,
          specialties: professional.specialties,
          certifications: professional.certifications,
          custom_fields: professional.custom_fields || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding professional:', error);
        toast({
          title: "Error adding professional",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Professional added",
        description: `${professional.name} has been added successfully`
      });

      // Refresh the list
      fetchProfessionals();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to add professional",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Update professional
  const updateProfessional = async (professional: Professional) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to update professionals",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('professionals')
        .update({
          name: professional.name,
          email: professional.email,
          type: professional.type,
          company: professional.company,
          phone: professional.phone,
          website: professional.website,
          address: professional.address,
          notes: professional.notes,
          rating: professional.rating,
          specialties: professional.specialties,
          certifications: professional.certifications,
          custom_fields: professional.custom_fields || {}
        })
        .eq('id', professional.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating professional:', error);
        toast({
          title: "Error updating professional",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Professional updated",
        description: `${professional.name} has been updated successfully`
      });

      // Refresh the list
      fetchProfessionals();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update professional",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Remove professional
  const removeProfessional = async (id: string) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to remove professionals",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing professional:', error);
        toast({
          title: "Error removing professional",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Professional removed",
        description: "Professional has been removed successfully"
      });

      // Refresh the list
      fetchProfessionals();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to remove professional",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProfessionals();
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    professionals,
    loading,
    saving,
    addProfessional,
    updateProfessional,
    removeProfessional,
    refreshProfessionals: fetchProfessionals
  };
};
