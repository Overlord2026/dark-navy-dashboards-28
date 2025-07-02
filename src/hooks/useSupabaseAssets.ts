
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface OtherAsset {
  id: string;
  user_id: string;
  name: string;
  type: string;
  owner: string;
  value: number;
  created_at: string;
  updated_at: string;
}

export interface OtherAssetData {
  name: string;
  type: string;
  owner: string;
  value: number;
}

export const useSupabaseAssets = () => {
  const [assets, setAssets] = useState<OtherAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch all assets for the current user
  const fetchAssets = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      const { data, error } = await supabase
        .from('other_assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching assets:', error);
        toast.error('Failed to fetch assets');
        return;
      }

      setAssets(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add a new asset
  const addAsset = async (assetData: OtherAssetData): Promise<OtherAsset | null> => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add assets');
        return null;
      }

      const { data, error } = await supabase
        .from('other_assets')
        .insert({
          ...assetData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding asset:', error);
        toast.error('Failed to add asset');
        return null;
      }

      setAssets(prev => [data, ...prev]);
      toast.success('Asset added successfully');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Delete an asset
  const deleteAsset = async (id: string): Promise<void> => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('other_assets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting asset:', error);
        toast.error('Failed to delete asset');
        return;
      }

      setAssets(prev => prev.filter(asset => asset.id !== id));
      toast.success('Asset deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  // Get total value of all assets
  const getTotalValue = () => {
    return assets.reduce((total, asset) => total + asset.value, 0);
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
    fetchAssets();
  }, []);

  return {
    assets,
    loading,
    saving,
    addAsset,
    deleteAsset,
    getTotalValue,
    getFormattedTotalValue,
    refreshAssets: fetchAssets,
  };
};
