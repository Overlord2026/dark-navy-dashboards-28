import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface DigitalAssetsContextType {
  digitalAssets: DigitalAsset[];
  loading: boolean;
  addDigitalAsset: (assetData: {
    asset_type: string;
    custom_asset_type?: string;
    quantity: number;
    price_per_unit: number;
    total_value: number;
  }) => Promise<boolean>;
  deleteDigitalAsset: (id: string) => Promise<boolean>;
  getTotalValue: () => number;
  getFormattedTotalValue: () => string;
  refetch: () => Promise<void>;
}

const DigitalAssetsContext = createContext<DigitalAssetsContextType | undefined>(undefined);

export function DigitalAssetsProvider({ children }: { children: React.ReactNode }) {
  const [digitalAssets, setDigitalAssets] = useState<DigitalAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch digital assets
  const fetchDigitalAssets = async () => {
    try {
      setLoading(true);
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
    const checkAuthAndInit = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('DigitalAssetsContext: User authenticated, fetching assets...');
        await fetchDigitalAssets();
      } else {
        console.log('DigitalAssetsContext: No authenticated user, skipping fetch');
        setLoading(false);
      }
    };

    checkAuthAndInit();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('DigitalAssetsContext: Auth state changed:', event, !!session?.user);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('DigitalAssetsContext: User signed in, fetching assets...');
        await fetchDigitalAssets();
      } else if (event === 'SIGNED_OUT') {
        console.log('DigitalAssetsContext: User signed out, clearing assets');
        setDigitalAssets([]);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <DigitalAssetsContext.Provider
      value={{
        digitalAssets,
        loading,
        addDigitalAsset,
        deleteDigitalAsset,
        getTotalValue,
        getFormattedTotalValue,
        refetch: fetchDigitalAssets
      }}
    >
      {children}
    </DigitalAssetsContext.Provider>
  );
}

export function useDigitalAssets() {
  const context = useContext(DigitalAssetsContext);
  if (context === undefined) {
    throw new Error('useDigitalAssets must be used within a DigitalAssetsProvider');
  }
  return context;
}