import React, { useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download, Eye, Share2, Loader2 } from 'lucide-react';
import { SearchResult } from '@/services/searchIndex';
import { cn } from '@/lib/utils';

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
  const observerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

    return (
      <span
        dangerouslySetInnerHTML={{ __html: highlights }}
        className="search-highlighted-text"
      />
    );
  };

  if (results.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No documents found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Results */}
      {results.map((result, index) => (
        <Card
          key={`${result.document.id}-${index}`}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onDocumentClick?.(result.document.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getTypeIcon(result.document.type)}</span>
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
                  <span>{formatFileSize(result.document.size)}</span>
                  <span>{formatDate(result.document.created_at)}</span>
                  <span className="capitalize">{result.document.category}</span>
                </div>

                {result.document.tags && result.document.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {result.document.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {renderHighlightedText(tag, result.highlights.tags)}
                      </Badge>
                    ))}
                    {result.document.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{result.document.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDocumentClick?.(result.document.id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload?.(result.document.id);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare?.(result.document.id);
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
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
        </div>
      )}

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more results...
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={onLoadMore}
              className="w-full max-w-xs"
            >
              Load More Results
            </Button>
          )}
        </div>
      )}

      {/* End of Results */}
      {!hasMore && results.length > 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          End of search results
        </div>
      )}
    </div>
  );
};