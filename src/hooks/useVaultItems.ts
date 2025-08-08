import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type VaultItem = Database['public']['Tables']['vault_items']['Row'];

export function useVaultItems() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('vault_items')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch vault items';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createItem = async (item: Omit<VaultItem, 'id' | 'created_at' | 'updated_at' | 'upload_date'>) => {
    try {
      const { data, error } = await supabase
        .from('vault_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;

      // Log the activity - vault_id not available in this table
      // await supabase.rpc('log_vault_activity', {...});

      toast({
        title: "Success",
        description: "Item added to your legacy vault",
      });

      await fetchItems(); // Refresh the list
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create vault item';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<VaultItem>) => {
    try {
      const { data, error } = await supabase
        .from('vault_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log the activity - vault_id not available in this table
      // await supabase.rpc('log_vault_activity', {...});

      toast({
        title: "Success",
        description: "Item updated successfully",
      });

      await fetchItems(); // Refresh the list
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update vault item';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vault_items')
        .update({ status: 'deleted' })
        .eq('id', id);

      if (error) throw error;

      // Log the activity - vault_id not available in this table
      // await supabase.rpc('log_vault_activity', {...});

      toast({
        title: "Success",
        description: "Item removed from vault",
      });

      await fetchItems(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete vault item';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItems
  };
}