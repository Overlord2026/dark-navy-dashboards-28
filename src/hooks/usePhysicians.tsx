
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Physician {
  id: string;
  user_id: string;
  name: string;
  specialty?: string;
  facility?: string;
  phone?: string;
  email?: string;
  last_visit?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PhysicianData {
  name: string;
  specialty?: string;
  facility?: string;
  phone?: string;
  email?: string;
  last_visit?: string;
  notes?: string;
}

export const usePhysicians = () => {
  const [physicians, setPhysicians] = useState<Physician[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch all physicians for the current user
  const fetchPhysicians = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      const { data, error } = await supabase
        .from('physicians')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching physicians:', error);
        toast.error('Failed to fetch physicians');
        return;
      }

      setPhysicians(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add a new physician
  const addPhysician = async (physicianData: PhysicianData): Promise<Physician | null> => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add physicians');
        return null;
      }

      const { data, error } = await supabase
        .from('physicians')
        .insert({
          ...physicianData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding physician:', error);
        toast.error('Failed to add physician');
        return null;
      }

      setPhysicians(prev => [data, ...prev]);
      toast.success('Physician added successfully');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Update an existing physician
  const updatePhysician = async (id: string, updates: Partial<PhysicianData>): Promise<Physician | null> => {
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('physicians')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating physician:', error);
        toast.error('Failed to update physician');
        return null;
      }

      setPhysicians(prev => 
        prev.map(physician => physician.id === id ? data : physician)
      );
      toast.success('Physician updated successfully');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Delete a physician
  const deletePhysician = async (id: string): Promise<void> => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('physicians')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting physician:', error);
        toast.error('Failed to delete physician');
        return;
      }

      setPhysicians(prev => prev.filter(physician => physician.id !== id));
      toast.success('Physician deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchPhysicians();
  }, []);

  return {
    physicians,
    loading,
    saving,
    addPhysician,
    updatePhysician,
    deletePhysician,
    refreshPhysicians: fetchPhysicians,
  };
};
