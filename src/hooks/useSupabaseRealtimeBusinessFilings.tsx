import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useBusinessFilings, BusinessFiling } from './useBusinessFilings';

interface RealtimeBusinessFilingsState {
  filings: BusinessFiling[];
  isLoading: boolean;
  syncStatus: 'idle' | 'syncing' | 'error';
  lastSyncTime: Date | null;
}

export const useSupabaseRealtimeBusinessFilings = () => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { toast } = useToast();
  
  const {
    filings,
    isLoading,
    addFiling,
    updateFiling,
    deleteFiling,
    toggleComplete,
    refreshFilings
  } = useBusinessFilings();

  // Handle real-time sync status updates
  const handleSyncStart = useCallback(() => {
    setSyncStatus('syncing');
  }, []);

  const handleSyncComplete = useCallback(() => {
    setSyncStatus('idle');
    setLastSyncTime(new Date());
  }, []);

  const handleSyncError = useCallback(() => {
    setSyncStatus('error');
    toast({
      title: "Sync Error",
      description: "Failed to sync business filings. Please refresh manually.",
      variant: "destructive"
    });
  }, [toast]);

  useEffect(() => {
    const initializeRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      handleSyncStart();

      // Set up real-time subscription for business_filings
      const channel = supabase
        .channel('business_filings_realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'business_filings',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            handleSyncStart();
            refreshFilings().then(() => {
              handleSyncComplete();
              toast({
                title: "Filing Added",
                description: `New business filing "${payload.new.name}" has been added.`,
              });
            }).catch(handleSyncError);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'business_filings',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            handleSyncStart();
            refreshFilings().then(() => {
              handleSyncComplete();
              toast({
                title: "Filing Updated",
                description: `Business filing "${payload.new.name}" has been updated.`,
              });
            }).catch(handleSyncError);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'business_filings',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            handleSyncStart();
            refreshFilings().then(() => {
              handleSyncComplete();
              toast({
                title: "Filing Deleted",
                description: `Business filing has been removed.`,
              });
            }).catch(handleSyncError);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            handleSyncComplete();
          } else if (status === 'CHANNEL_ERROR') {
            handleSyncError();
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    initializeRealtime();
  }, [refreshFilings, handleSyncStart, handleSyncComplete, handleSyncError, toast]);

  return {
    filings,
    isLoading,
    syncStatus,
    lastSyncTime,
    addFiling,
    updateFiling,
    deleteFiling,
    toggleComplete,
    refreshFilings
  };
};