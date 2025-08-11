import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download, Eye, Share2, Loader2 } from 'lucide-react';
import { SearchResult } from '@/services/searchIndex';
import { cn } from '@/lib/utils';
import { renderSafeHighlight } from '@/lib/sanitize';

interface SearchResultsProps {
  results: SearchResult[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onDocumentClick?: (documentId: string) => void;
  onDownload?: (documentId: string) => void;
  onShare?: (documentId: string) => void;
  className?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading = false,
  hasMore = false,
  onLoadMore,
  onDocumentClick,
  onDownload,
  onShare,
  className
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const observerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading && onLoadMore) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'image':
        return '🖼️';
      case 'spreadsheet':
        return '📊';
      case 'folder':
        return '📁';
      default:
        return '📝';
    }
  };

  const renderHighlightedText = (text: string, highlights?: string) => {
    if (!highlights || highlights === text) {
      return <span>{text}</span>;
    }

    // Use safe text rendering instead of dangerouslySetInnerHTML
    return <span className="search-highlighted-text">{text}</span>;
  };

  // Keyboard navigation for results
  const handleResultKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onDocumentClick?.(results[index].document.id);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = index < results.length - 1 ? index + 1 : 0;
      resultRefs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = index > 0 ? index - 1 : results.length - 1;
      resultRefs.current[prevIndex]?.focus();
      setFocusedIndex(prevIndex);
    }
  };

  if (results.length === 0 && !loading) {
    return (
      <div 
        className="text-center py-12"
        role="status"
        aria-live="polite"
      >
        <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" aria-hidden="true" />
        <h3 className="mt-4 text-lg font-medium">No documents found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Skip to content link for keyboard navigation */}
      <a 
        href="#search-results-end" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 bg-primary text-primary-foreground px-4 py-2 rounded"
      >
        Skip to end of search results
      </a>

      {/* Search Results */}
      <ul 
        role="list" 
        aria-label={`Search results: ${results.length} documents found`}
        className="space-y-4"
      >
        {results.map((result, index) => (
          <li key={`${result.document.id}-${index}`} role="listitem">
            <Card
              ref={(el) => (resultRefs.current[index] = el)}
              className={cn(
                "hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                focusedIndex === index && "ring-2 ring-primary ring-offset-2"
              )}
              onClick={() => onDocumentClick?.(result.document.id)}
              onKeyDown={(e) => handleResultKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              tabIndex={0}
              role="button"
              aria-label={`Document: ${result.document.name}. ${result.document.description || 'No description'}. Type: ${result.document.type}. Size: ${formatFileSize(result.document.size)}. Press Enter to open.`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="text-lg" 
                        aria-label={`File type: ${result.document.type}`}
                        role="img"
                      >
                        {getTypeIcon(result.document.type)}
                      </span>
                      <h3 className="font-medium truncate">
                        {renderHighlightedText(
                          result.document.name,
                          result.highlights.name
                        )}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {result.document.type}
                      </Badge>
                      {result.score > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {Math.round((1 - result.score) * 100)}% match
                        </Badge>
                      )}
                    </div>

                    {result.document.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {renderHighlightedText(
                          result.document.description,
                          result.highlights.description
                        )}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span aria-label={`File size: ${formatFileSize(result.document.size)}`}>
                        {formatFileSize(result.document.size)}
                      </span>
                      <span aria-label={`Created on: ${formatDate(result.document.created_at)}`}>
                        {formatDate(result.document.created_at)}
                      </span>
                      <span className="capitalize" aria-label={`Category: ${result.document.category}`}>
                        {result.document.category}
                      </span>
                    </div>

                    {result.document.tags && result.document.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1" role="list" aria-label="Document tags">
                        {result.document.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs" role="listitem">
                            {renderHighlightedText(tag, result.highlights.tags)}
                          </Badge>
                        ))}
                        {result.document.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs" role="listitem">
                            +{result.document.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 ml-4" role="group" aria-label="Document actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDocumentClick?.(result.document.id);
                      }}
                      aria-label={`View ${result.document.name}`}
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload?.(result.document.id);
                      }}
                      aria-label={`Download ${result.document.name}`}
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare?.(result.document.id);
                      }}
                      aria-label={`Share ${result.document.name}`}
                    >
                      <Share2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-4" role="status" aria-label="Loading search results">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} aria-hidden="true">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded" />
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-4 w-full max-w-md" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <span className="sr-only">Loading more search results...</span>
        </div>
      )}

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loading ? (
            <div 
              className="flex items-center gap-2 text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading more results...
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={onLoadMore}
              className="w-full max-w-xs"
              aria-label="Load more search results"
            >
              Load More Results
            </Button>
          )}
        </div>
      )}

      {/* End of Results */}
      {!hasMore && results.length > 0 && (
        <div 
          id="search-results-end"
          className="text-center py-4 text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          End of search results ({results.length} total)
        </div>
      )}
    </div>
  );
};