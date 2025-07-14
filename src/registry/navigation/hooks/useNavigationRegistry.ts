import { useState, useEffect, useCallback, useMemo } from 'react';
import { NavigationRegistry, NavigationNode, NavigationCategory } from '../NavigationRegistry';
import { initializeWealthManagementRegistry } from '../WealthManagementRegistry';

/**
 * Navigation Registry Hook
 * Provides reactive access to navigation registry with caching and search
 */

export interface UseNavigationRegistryReturn {
  // Core data
  categories: NavigationCategory[];
  nodes: NavigationNode[];
  
  // Navigation tree
  navigationTree: NavigationNode[];
  
  // Actions
  getNode: (id: string) => NavigationNode | undefined;
  getCategory: (id: string) => NavigationCategory | undefined;
  getNodesByCategory: (categoryId: string) => NavigationNode[];
  searchNodes: (query: string, options?: {
    category?: string;
    includeDisabled?: boolean;
    includeComingSoon?: boolean;
  }) => NavigationNode[];
  getBreadcrumb: (nodeId: string) => NavigationNode[];
  
  // State
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Cache control
  refresh: () => void;
  clearCache: () => void;
}

interface UseNavigationRegistryOptions {
  autoInitialize?: boolean;
  enableCaching?: boolean;
  category?: string;
}

export function useNavigationRegistry(
  options: UseNavigationRegistryOptions = {}
): UseNavigationRegistryReturn {
  const {
    autoInitialize = true,
    enableCaching = true,
    category
  } = options;

  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Cache
  const [cache] = useState(new Map<string, any>());

  // Initialize registry
  const initialize = useCallback(async () => {
    if (isInitialized && autoInitialize) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize wealth management registry
      initializeWealthManagementRegistry();
      
      // TODO: Initialize other registries (healthcare, education, etc.)
      
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize navigation registry');
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, autoInitialize]);

  // Auto-initialize on mount
  useEffect(() => {
    if (autoInitialize) {
      initialize();
    }
  }, [initialize, autoInitialize]);

  // Memoized data
  const categories = useMemo(() => {
    const cacheKey = `categories-${refreshKey}`;
    if (enableCaching && cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    const result = NavigationRegistry.getCategories();
    if (enableCaching) {
      cache.set(cacheKey, result);
    }
    
    return result;
  }, [refreshKey, enableCaching, cache]);

  const nodes = useMemo(() => {
    const cacheKey = `nodes-${category || 'all'}-${refreshKey}`;
    if (enableCaching && cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    const result = category 
      ? NavigationRegistry.getNodesByCategory(category)
      : Array.from(NavigationRegistry['nodes'].values());
    
    if (enableCaching) {
      cache.set(cacheKey, result);
    }
    
    return result;
  }, [category, refreshKey, enableCaching, cache]);

  const navigationTree = useMemo(() => {
    const cacheKey = `tree-${category || 'all'}-${refreshKey}`;
    if (enableCaching && cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    const result = NavigationRegistry.buildNavigationTree(category);
    if (enableCaching) {
      cache.set(cacheKey, result);
    }
    
    return result;
  }, [category, refreshKey, enableCaching, cache]);

  // Actions
  const getNode = useCallback((id: string) => {
    return NavigationRegistry.getNode(id);
  }, []);

  const getCategory = useCallback((id: string) => {
    return NavigationRegistry.getCategory(id);
  }, []);

  const getNodesByCategory = useCallback((categoryId: string) => {
    const cacheKey = `category-${categoryId}-${refreshKey}`;
    if (enableCaching && cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    const result = NavigationRegistry.getNodesByCategory(categoryId);
    if (enableCaching) {
      cache.set(cacheKey, result);
    }
    
    return result;
  }, [refreshKey, enableCaching, cache]);

  const searchNodes = useCallback((
    query: string, 
    searchOptions?: {
      category?: string;
      includeDisabled?: boolean;
      includeComingSoon?: boolean;
    }
  ) => {
    const cacheKey = `search-${query}-${JSON.stringify(searchOptions)}-${refreshKey}`;
    if (enableCaching && cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    const result = NavigationRegistry.searchNodes(query, searchOptions);
    if (enableCaching) {
      cache.set(cacheKey, result);
    }
    
    return result;
  }, [refreshKey, enableCaching, cache]);

  const getBreadcrumb = useCallback((nodeId: string) => {
    return NavigationRegistry.getBreadcrumbPath(nodeId);
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    if (enableCaching) {
      cache.clear();
    }
  }, [cache, enableCaching]);

  const clearCache = useCallback(() => {
    cache.clear();
    setRefreshKey(prev => prev + 1);
  }, [cache]);

  return {
    // Core data
    categories,
    nodes,
    navigationTree,
    
    // Actions
    getNode,
    getCategory,
    getNodesByCategory,
    searchNodes,
    getBreadcrumb,
    
    // State
    isInitialized,
    isLoading,
    error,
    
    // Cache control
    refresh,
    clearCache
  };
}

export default useNavigationRegistry;