import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface RealEstateProperty {
  id: string;
  user_id: string;
  name: string;
  address: string;
  property_type: 'residence' | 'rental' | 'vacation' | 'business' | 'other';
  current_market_value: number;
  created_at: string;
  updated_at: string;
}

export interface RealEstatePropertyData {
  name: string;
  address: string;
  property_type: 'residence' | 'rental' | 'vacation' | 'business' | 'other';
  current_market_value: number;
}

export const useRealEstate = () => {
  const [properties, setProperties] = useState<RealEstateProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch all real estate properties for the current user
  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      const { data, error } = await supabase
        .from('real_estate_properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching real estate properties:', error);
        toast.error('Failed to fetch real estate properties');
        return;
      }

      setProperties(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add a new real estate property
  const addProperty = async (propertyData: RealEstatePropertyData): Promise<RealEstateProperty | null> => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add real estate properties');
        return null;
      }

      const { data, error } = await supabase
        .from('real_estate_properties')
        .insert({
          ...propertyData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding real estate property:', error);
        toast.error('Failed to add real estate property');
        return null;
      }

      setProperties(prev => [data, ...prev]);
      toast.success('Real estate property added successfully');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Delete a real estate property
  const deleteProperty = async (id: string): Promise<boolean> => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('real_estate_properties')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting real estate property:', error);
        toast.error('Failed to delete real estate property');
        return false;
      }

      setProperties(prev => prev.filter(property => property.id !== id));
      toast.success('Real estate property deleted successfully');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Get total value of all properties
  const getTotalValue = () => {
    return properties.reduce((total, property) => total + property.current_market_value, 0);
  };

  // Get formatted total value
  const getFormattedTotalValue = () => {
    const total = getTotalValue();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(total);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    saving,
    addProperty,
    deleteProperty,
    getTotalValue,
    getFormattedTotalValue,
    refreshProperties: fetchProperties,
  };
};