import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface OtherAssetsContextType {
  assets: OtherAsset[];
  loading: boolean;
  saving: boolean;
  addAsset: (assetData: OtherAssetData) => Promise<OtherAsset | null>;
  updateAsset: (id: string, updates: Partial<OtherAssetData>) => Promise<OtherAsset | null>;
  deleteAsset: (id: string) => Promise<boolean>;
  getTotalValue: () => number;
  getFormattedTotalValue: () => string;
  getAssetsByType: (type: string) => OtherAsset[];
  getAssetsByCategory: (category: string) => OtherAsset[];
  refreshAssets: () => Promise<void>;
}

const OtherAssetsContext = createContext<OtherAssetsContextType | undefined>(undefined);

export function OtherAssetsProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<OtherAsset[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Update an asset
  const updateAsset = async (id: string, updates: Partial<OtherAssetData>): Promise<OtherAsset | null> => {
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('other_assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating asset:', error);
        toast.error('Failed to update asset');
        return null;
      }

      setAssets(prev => prev.map(asset => asset.id === id ? data : asset));
      toast.success('Asset updated successfully');
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
  const deleteAsset = async (id: string): Promise<boolean> => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('other_assets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting asset:', error);
        toast.error('Failed to delete asset');
        return false;
      }

      setAssets(prev => prev.filter(asset => asset.id !== id));
      toast.success('Asset deleted successfully');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return false;
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

  // Get assets by type
  const getAssetsByType = (type: string) => {
    return assets.filter(asset => asset.type === type);
  };

  // Get assets by category (alias for type for compatibility)
  const getAssetsByCategory = (category: string) => {
    return getAssetsByType(category);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <OtherAssetsContext.Provider
      value={{
        assets,
        loading,
        saving,
        addAsset,
        updateAsset,
        deleteAsset,
        getTotalValue,
        getFormattedTotalValue,
        getAssetsByType,
        getAssetsByCategory,
        refreshAssets: fetchAssets,
      }}
    >
      {children}
    </OtherAssetsContext.Provider>
  );
}

export function useOtherAssets() {
  const context = useContext(OtherAssetsContext);
  if (context === undefined) {
    throw new Error('useOtherAssets must be used within an OtherAssetsProvider');
  }
  return context;
}