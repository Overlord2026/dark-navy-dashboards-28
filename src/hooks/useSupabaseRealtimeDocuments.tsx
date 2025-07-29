import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseDocuments, SupabaseDocument } from './useSupabaseDocuments';
import { documentCache } from '@/services/documentCache';

interface RealtimeDocumentsState {
  documents: SupabaseDocument[];
  categories: any[];
  loading: boolean;
  uploading: boolean;
  syncStatus: 'idle' | 'syncing' | 'error';
  lastSyncTime: Date | null;
}

export const useSupabaseRealtimeDocuments = () => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { toast } = useToast();
  
  const {
    documents,
    categories,
    loading,
    uploading,
    uploadDocument,
    createFolder,
    deleteDocument,
    getDocumentUrl,
    refreshDocuments
  } = useSupabaseDocuments();

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
      description: "Failed to sync documents. Please refresh manually.",
      variant: "destructive"
    });
  }, [toast]);

  useEffect(() => {
    const initializeRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      handleSyncStart();

      // Set up real-time subscription for documents
      const channel = supabase
      .channel('documents_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          handleSyncStart();
          refreshDocuments().then(async () => {
            // Invalidate cache for real-time updates
            const { data: { user } } = await supabase.auth.getUser();
            if (user && payload.new?.id) {
              await documentCache.removeCachedDocument(payload.new.id);
            }
            handleSyncComplete();
            toast({
              title: "Document Added",
              description: `New document "${payload.new.name}" has been added.`,
            });
          }).catch(handleSyncError);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          handleSyncStart();
          refreshDocuments().then(async () => {
            // Invalidate cache for updates
            const { data: { user } } = await supabase.auth.getUser();
            if (user && payload.new?.id) {
              await documentCache.removeCachedDocument(payload.new.id);
            }
            handleSyncComplete();
            toast({
              title: "Document Updated",
              description: `Document "${payload.new.name}" has been updated.`,
            });
          }).catch(handleSyncError);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          handleSyncStart();
          refreshDocuments().then(async () => {
            // Remove from cache on delete
            if (payload.old?.id) {
              await documentCache.removeCachedDocument(payload.old.id);
            }
            handleSyncComplete();
            toast({
              title: "Document Deleted",
              description: `Document has been removed.`,
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
  }, [refreshDocuments, handleSyncStart, handleSyncComplete, handleSyncError, toast]);

  return {
    documents,
    categories,
    loading,
    uploading,
    syncStatus,
    lastSyncTime,
    uploadDocument,
    createFolder,
    deleteDocument,
    getDocumentUrl,
    refreshDocuments
  };
};