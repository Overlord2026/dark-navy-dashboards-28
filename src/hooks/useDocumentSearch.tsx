import { useState, useEffect, useCallback, useMemo } from 'react';
import { documentSearchIndex, SearchResult } from '@/services/searchIndex';
import { useCachedDocuments } from './useCachedDocuments';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  hasMore: boolean;
  page: number;
  totalResults: number;
  searchTime: number;
  suggestions: string[];
}

interface SearchFilters {
  category?: string;
  type?: string;
  dateRange?: { start: Date; end: Date };
  sizeRange?: { min: number; max: number };
}

const BATCH_SIZE = 20;
const DEBOUNCE_MS = 250;
const SERVER_SEARCH_THRESHOLD = 500;

export const useDocumentSearch = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    isSearching: false,
    hasMore: false,
    page: 0,
    totalResults: 0,
    searchTime: 0,
    suggestions: []
  });

  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { documents, loading } = useCachedDocuments();
  const { toast } = useToast();

  // Build search index when documents change
  useEffect(() => {
    if (!loading && documents.length > 0) {
      const startTime = performance.now();
      documentSearchIndex.buildIndex(documents).then(() => {
        const indexTime = performance.now() - startTime;
        console.log(`Search index rebuilt in ${indexTime.toFixed(2)}ms`);
      });
    }
  }, [documents, loading]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string, filters: SearchFilters, page: number = 0) => {
      if (!query.trim()) {
        setSearchState(prev => ({
          ...prev,
          results: [],
          hasMore: false,
          totalResults: 0,
          isSearching: false
        }));
        return;
      }

      setSearchState(prev => ({ ...prev, isSearching: true }));

      try {
        const startTime = performance.now();
        let results: SearchResult[] = [];

        // Use server-side search for large document sets
        if (documents.length > SERVER_SEARCH_THRESHOLD) {
          results = await performServerSearch(query, filters, page, BATCH_SIZE);
        } else {
          // Use local fuzzy search
          const offset = page * BATCH_SIZE;
          
          if (filters.category) {
            results = documentSearchIndex.searchByCategory(query, filters.category, BATCH_SIZE);
          } else if (filters.type) {
            results = documentSearchIndex.searchByType(query, filters.type, BATCH_SIZE);
          } else {
            results = documentSearchIndex.search(query, BATCH_SIZE, offset);
          }

          // Apply additional filters
          results = applyFilters(results, filters);
        }

        const searchTime = performance.now() - startTime;

        setSearchState(prev => ({
          ...prev,
          results: page === 0 ? results : [...prev.results, ...results],
          hasMore: results.length === BATCH_SIZE,
          page,
          totalResults: page === 0 ? results.length : prev.totalResults + results.length,
          searchTime,
          isSearching: false
        }));

        // Add to search history
        if (page === 0 && query.trim()) {
          setSearchHistory(prev => {
            const newHistory = [query, ...prev.filter(h => h !== query)];
            return newHistory.slice(0, 10); // Keep last 10 searches
          });
        }

      } catch (error) {
        console.error('Search error:', error);
        setSearchState(prev => ({ ...prev, isSearching: false }));
        toast({
          title: "Search Error",
          description: "Failed to search documents. Please try again.",
          variant: "destructive"
        });
      }
    }, DEBOUNCE_MS),
    [documents, toast]
  );

  // Search function
  const search = useCallback((query: string, newFilters: SearchFilters = {}) => {
    setSearchState(prev => ({ ...prev, query, page: 0 }));
    setFilters(newFilters);
    debouncedSearch(query, newFilters, 0);
  }, [debouncedSearch]);

  // Load more results (infinite scroll)
  const loadMore = useCallback(() => {
    if (searchState.hasMore && !searchState.isSearching) {
      const nextPage = searchState.page + 1;
      setSearchState(prev => ({ ...prev, page: nextPage }));
      debouncedSearch(searchState.query, filters, nextPage);
    }
  }, [searchState.hasMore, searchState.isSearching, searchState.page, searchState.query, filters, debouncedSearch]);

  // Get search suggestions
  const getSuggestions = useCallback((query: string) => {
    const suggestions = documentSearchIndex.getSuggestions(query);
    setSearchState(prev => ({ ...prev, suggestions }));
    return suggestions;
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchState({
      query: '',
      results: [],
      isSearching: false,
      hasMore: false,
      page: 0,
      totalResults: 0,
      searchTime: 0,
      suggestions: []
    });
  }, []);

  // Search stats
  const searchStats = useMemo(() => {
    return documentSearchIndex.getSearchStats();
  }, [documents]);

  return {
    // State
    query: searchState.query,
    results: searchState.results,
    isSearching: searchState.isSearching,
    hasMore: searchState.hasMore,
    totalResults: searchState.totalResults,
    searchTime: searchState.searchTime,
    suggestions: searchState.suggestions,
    filters,
    searchHistory,
    searchStats,

    // Actions
    search,
    loadMore,
    getSuggestions,
    clearSearch,
    setFilters,

    // Utilities
    isServerSearchEnabled: documents.length > SERVER_SEARCH_THRESHOLD
  };
};

// Server-side search for large document sets
async function performServerSearch(
  query: string, 
  filters: SearchFilters, 
  page: number, 
  limit: number
): Promise<SearchResult[]> {
  const offset = page * limit;
  
  let supabaseQuery = supabase
    .from('documents')
    .select('*')
    .textSearch('name', query, { type: 'websearch' })
    .range(offset, offset + limit - 1);

  // Apply filters
  if (filters.category) {
    supabaseQuery = supabaseQuery.eq('category', filters.category);
  }
  if (filters.type) {
    supabaseQuery = supabaseQuery.eq('type', filters.type);
  }
  if (filters.dateRange) {
    supabaseQuery = supabaseQuery
      .gte('created_at', filters.dateRange.start.toISOString())
      .lte('created_at', filters.dateRange.end.toISOString());
  }

  const { data, error } = await supabaseQuery;
  
  if (error) {
    throw error;
  }

  // Transform to SearchResult format
  return (data || []).map(doc => ({
    document: {
      id: doc.id,
      name: doc.name,
      description: doc.description,
      tags: doc.tags,
      category: doc.category,
      type: doc.type,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      size: doc.size
    },
    score: 0, // Server search doesn't provide scores
    matches: [],
    highlights: { name: highlightQuery(doc.name, query) }
  }));
}

// Apply client-side filters
function applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
  return results.filter(result => {
    const doc = result.document;
    
    if (filters.dateRange) {
      const docDate = new Date(doc.created_at);
      if (docDate < filters.dateRange.start || docDate > filters.dateRange.end) {
        return false;
      }
    }
    
    if (filters.sizeRange && doc.size) {
      if (doc.size < filters.sizeRange.min || doc.size > filters.sizeRange.max) {
        return false;
      }
    }
    
    return true;
  });
}

// Simple query highlighting for server results
function highlightQuery(text: string, query: string): string {
  const terms = query.toLowerCase().split(/\s+/);
  let highlighted = text;
  
  terms.forEach(term => {
    if (term.length > 1) {
      const regex = new RegExp(`(${term})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
  });
  
  return highlighted;
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}