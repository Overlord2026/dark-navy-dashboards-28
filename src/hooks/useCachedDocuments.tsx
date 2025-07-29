import { useState, useEffect, useCallback, useMemo } from 'react';
import { documentCache, CachedDocument, CacheMetadata } from '@/services/documentCache';
import { useSupabaseDocuments } from './useSupabaseDocuments';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface CachedDocumentsState {
  documents: CachedDocument[];
  loading: boolean;
  refreshing: boolean;
  cacheMetadata: CacheMetadata | null;
  lastRefresh: Date | null;
  cacheHitRate: number;
}

export const useCachedDocuments = () => {
  const [state, setState] = useState<CachedDocumentsState>({
    documents: [],
    loading: true,
    refreshing: false,
    cacheMetadata: null,
    lastRefresh: null,
    cacheHitRate: 0
  });

  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0 });
  const { toast } = useToast();

  const {
    documents: liveDocuments,
    loading: liveLoading,
    refreshDocuments: refreshLive
  } = useSupabaseDocuments();

  // Initialize cache
  useEffect(() => {
    const initCache = async () => {
      try {
        await documentCache.init();
        await loadCachedDocuments();
      } catch (error) {
        console.error('Failed to initialize document cache:', error);
        toast({
          title: "Cache Error",
          description: "Failed to initialize document cache. Using live data only.",
          variant: "destructive"
        });
      }
    };

    initCache();
  }, [toast]);

  // Load cached documents
  const loadCachedDocuments = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const cached = await documentCache.getCachedDocuments(user.id);
      const metadata = await documentCache.getCacheMetadata(user.id);

      setState(prev => ({
        ...prev,
        documents: cached,
        loading: false,
        cacheMetadata: metadata
      }));

      // Track cache hit
      if (cached.length > 0) {
        setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
      }
    } catch (error) {
      console.error('Failed to load cached documents:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Sync with live data
  const syncWithLive = useCallback(async (force = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setState(prev => ({ ...prev, refreshing: true }));

      // Get fresh data from Supabase
      await refreshLive();
      
      if (liveDocuments.length > 0) {
        // Convert to cached format and store
        const cachedDocs: CachedDocument[] = liveDocuments.map(doc => ({
          ...doc,
          cached_at: Date.now(),
          etag: generateDocumentETag(doc)
        }));

        await documentCache.cacheDocuments(cachedDocs, user.id);
        
        // Update state with fresh data
        const metadata = await documentCache.getCacheMetadata(user.id);
        setState(prev => ({
          ...prev,
          documents: cachedDocs,
          refreshing: false,
          cacheMetadata: metadata,
          lastRefresh: new Date()
        }));

        toast({
          title: "Documents Refreshed",
          description: `Updated ${cachedDocs.length} documents from server.`
        });
      } else {
        setState(prev => ({ ...prev, refreshing: false }));
      }

      // Track cache miss
      setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
    } catch (error) {
      console.error('Failed to sync with live data:', error);
      setState(prev => ({ ...prev, refreshing: false }));
      toast({
        title: "Sync Failed",
        description: "Failed to refresh documents from server.",
        variant: "destructive"
      });
    }
  }, [liveDocuments, refreshLive, toast]);

  // Auto-sync on live data changes
  useEffect(() => {
    if (liveDocuments.length > 0 && !liveLoading) {
      syncWithLive();
    }
  }, [liveDocuments, liveLoading, syncWithLive]);

  // Manual refresh function
  const forceRefresh = useCallback(async () => {
    await syncWithLive(true);
  }, [syncWithLive]);

  // Get document by ID (cache-first)
  const getDocument = useCallback(async (documentId: string): Promise<CachedDocument | null> => {
    try {
      // Try cache first
      const cached = await documentCache.getCachedDocument(documentId);
      if (cached) {
        setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
        return cached;
      }

      // Fallback to live data
      setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      await syncWithLive();
      return await documentCache.getCachedDocument(documentId);
    } catch (error) {
      console.error('Failed to get document:', error);
      return null;
    }
  }, [syncWithLive]);

  // Invalidate cache on document changes
  const invalidateDocument = useCallback(async (documentId: string) => {
    try {
      await documentCache.removeCachedDocument(documentId);
      await loadCachedDocuments();
    } catch (error) {
      console.error('Failed to invalidate document cache:', error);
    }
  }, [loadCachedDocuments]);

  const invalidateCategory = useCallback(async (category: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await documentCache.invalidateByCategory(user.id, category);
      await loadCachedDocuments();
    } catch (error) {
      console.error('Failed to invalidate category cache:', error);
    }
  }, [loadCachedDocuments]);

  const clearCache = useCallback(async () => {
    try {
      await documentCache.clearAllCache();
      setState(prev => ({
        ...prev,
        documents: [],
        cacheMetadata: null,
        lastRefresh: null
      }));
      setCacheStats({ hits: 0, misses: 0 });
      toast({
        title: "Cache Cleared",
        description: "All cached documents have been removed."
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }, [toast]);

  // Calculate cache hit rate
  const hitRate = useMemo(() => {
    const total = cacheStats.hits + cacheStats.misses;
    return total > 0 ? (cacheStats.hits / total) * 100 : 0;
  }, [cacheStats]);

  // Cache management functions
  const getCacheSize = useCallback(async () => {
    return await documentCache.getStorageInfo();
  }, []);

  const optimizeCache = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, refreshing: true }));
      await documentCache.clearExpiredCache();
      await loadCachedDocuments();
      setState(prev => ({ ...prev, refreshing: false }));
      
      toast({
        title: "Cache Optimized",
        description: "Removed expired documents and optimized storage."
      });
    } catch (error) {
      console.error('Failed to optimize cache:', error);
      setState(prev => ({ ...prev, refreshing: false }));
    }
  }, [loadCachedDocuments, toast]);

  // Utility function to generate ETags
  const generateDocumentETag = (doc: any): string => {
    const content = `${doc.id}-${doc.updated_at}-${doc.size || 0}`;
    return btoa(content).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  };

  return {
    // State
    documents: state.documents,
    loading: state.loading,
    refreshing: state.refreshing,
    cacheMetadata: state.cacheMetadata,
    lastRefresh: state.lastRefresh,
    cacheHitRate: hitRate,

    // Actions
    forceRefresh,
    getDocument,
    invalidateDocument,
    invalidateCategory,
    clearCache,
    optimizeCache,
    getCacheSize,

    // Cache stats
    cacheStats,
    
    // Utilities
    isDocumentCached: (documentId: string) => 
      state.documents.some(doc => doc.id === documentId),
    getDocumentAge: (documentId: string) => {
      const doc = state.documents.find(d => d.id === documentId);
      return doc ? Date.now() - doc.cached_at : null;
    }
  };
};