import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface DigitalAsset {
  id: string;
  user_id: string;
  asset_type: string;
  custom_asset_type?: string;
  quantity: number;
  price_per_unit: number;
  total_value: number;
  created_at: string;
  updated_at: string;
}

export function useDigitalAssets() {
  const [digitalAssets, setDigitalAssets] = useState<DigitalAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch digital assets
  const fetchDigitalAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('digital_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching digital assets:', error);
        toast({
          title: "Error",
          description: "Failed to fetch digital assets",
          variant: "destructive"
        });
      } else {
        setDigitalAssets(data || []);
      }
    } catch (error) {
      console.error('Error fetching digital assets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new digital asset
  const addDigitalAsset = async (assetData: {
    asset_type: string;
    custom_asset_type?: string;
    quantity: number;
    price_per_unit: number;
    total_value: number;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add digital assets",
          variant: "destructive"
        });
        return false;
      }

      const { data, error } = await supabase
        .from('digital_assets')
        .insert([
          {
            user_id: user.id,
            ...assetData
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding digital asset:', error);
        toast({
          title: "Error",
          description: "Failed to add digital asset",
          variant: "destructive"
        });
        return false;
      }

      setDigitalAssets(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Digital asset added successfully"
      });
      return true;
    } catch (error) {
      console.error('Error adding digital asset:', error);
      toast({
        title: "Error",
        description: "Failed to add digital asset",
        variant: "destructive"
      });
      return false;
    }
  };

  // Delete digital asset
  const deleteDigitalAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('digital_assets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting digital asset:', error);
        toast({
          title: "Error",
          description: "Failed to delete digital asset",
          variant: "destructive"
        });
        return false;
      }

      setDigitalAssets(prev => prev.filter(asset => asset.id !== id));
      toast({
        title: "Success",
        description: "Digital asset deleted successfully"
      });
      return true;
    } catch (error) {
      console.error('Error deleting digital asset:', error);
      toast({
        title: "Error",
        description: "Failed to delete digital asset",
        variant: "destructive"
      });
      return false;
    }
  };

  // Calculate total value
  const getTotalValue = () => {
    return digitalAssets.reduce((total, asset) => total + asset.total_value, 0);
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
    fetchDigitalAssets();
  }, []);

  return {
    digitalAssets,
    loading,
    addDigitalAsset,
    deleteDigitalAsset,
    getTotalValue,
    getFormattedTotalValue,
    refetch: fetchDigitalAssets
  };
}
