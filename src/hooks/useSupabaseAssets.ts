
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface SupabaseAsset {
  id: string;
  user_id: string;
  name: string;
  type: string;
  owner: string;
  value: number;
  created_at: string;
  updated_at: string;
}

export const useSupabaseAssets = () => {
  const [assets, setAssets] = useState<SupabaseAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch assets from Supabase
  const fetchAssets = async () => {
    if (!user) {
      setAssets([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching assets:', error);
        toast.error('Failed to load assets');
        return;
      }

      setAssets(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  // Add new asset
  const addAsset = async (assetData: {
    name: string;
    type: string;
    owner: string;
    value: number;
  }) => {
    if (!user) {
      toast.error('You must be logged in to add assets');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_assets')
        .insert({
          user_id: user.id,
          name: assetData.name,
          type: assetData.type,
          owner: assetData.owner,
          value: assetData.value,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding asset:', error);
        toast.error('Failed to add asset');
        return null;
      }

      // Immediately update local state for instant UI feedback
      setAssets(prevAssets => [data, ...prevAssets]);
      
      toast.success('Asset added successfully');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add asset');
      return null;
    }
  };

  // Update asset
  const updateAsset = async (id: string, updates: Partial<SupabaseAsset>) => {
    if (!user) {
      toast.error('You must be logged in to update assets');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating asset:', error);
        toast.error('Failed to update asset');
        return null;
      }

      // Immediately update local state for instant UI feedback
      setAssets(prevAssets => 
        prevAssets.map(asset => asset.id === id ? data : asset)
      );

      toast.success('Asset updated successfully');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update asset');
      return null;
    }
  };

  // Delete asset
  const deleteAsset = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete assets');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_assets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting asset:', error);
        toast.error('Failed to delete asset');
        return false;
      }

      // Immediately update local state for instant UI feedback
      setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));

      toast.success('Asset deleted successfully');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete asset');
      return false;
    }
  };

  // Calculate totals
  const getTotalValue = () => {
    return assets.reduce((total, asset) => total + Number(asset.value), 0);
  };

  const getAssetsByType = (type: string) => {
    return assets.filter(asset => asset.type === type);
  };

  const getAssetsByCategory = (category: string) => {
    if (category === 'vehicles') {
      return assets.filter(asset => ['vehicle', 'boat'].includes(asset.type));
    }
    if (category === 'collectibles') {
      return assets.filter(asset => ['antique', 'collectible', 'jewelry'].includes(asset.type));
    }
    if (category === 'all') {
      return assets;
    }
    return assets.filter(asset => asset.type === category);
  };

  useEffect(() => {
    fetchAssets();

    // Set up real-time subscription for immediate updates
    if (user) {
      const channel = supabase
        .channel('asset-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_assets',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Real-time asset change:', payload);
            
            // Handle different types of real-time events
            if (payload.eventType === 'INSERT') {
              setAssets(prevAssets => {
                // Check if asset already exists to avoid duplicates
                const existingAsset = prevAssets.find(asset => asset.id === payload.new.id);
                if (!existingAsset) {
                  return [payload.new as SupabaseAsset, ...prevAssets];
                }
                return prevAssets;
              });
            } else if (payload.eventType === 'UPDATE') {
              setAssets(prevAssets => 
                prevAssets.map(asset => 
                  asset.id === payload.new.id ? payload.new as SupabaseAsset : asset
                )
              );
            } else if (payload.eventType === 'DELETE') {
              setAssets(prevAssets => 
                prevAssets.filter(asset => asset.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    assets,
    loading,
    addAsset,
    updateAsset,
    deleteAsset,
    getTotalValue,
    getAssetsByType,
    getAssetsByCategory,
    refreshAssets: fetchAssets
  };
};
