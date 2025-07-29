import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDocumentSearch } from '@/hooks/useDocumentSearch';
import { cn } from '@/lib/utils';

interface DocumentSearchInputProps {
  onSearch: (query: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
  className?: string;
  showStats?: boolean;
  autoFocus?: boolean;
}

export const DocumentSearchInput: React.FC<DocumentSearchInputProps> = ({
  onSearch,
  onFilterClick,
  placeholder = "Search documents...",
  className,
  showStats = true,
  autoFocus = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    query,
    isSearching,
    suggestions,
    searchHistory,
    searchStats,
    totalResults,
    searchTime,
    getSuggestions,
    clearSearch,
    isServerSearchEnabled
  } = useDocumentSearch();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (value.length >= 2) {
      getSuggestions(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setInputValue(searchQuery);
    setShowSuggestions(false);
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setInputValue('');
    setShowSuggestions(false);
    clearSearch();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(inputValue);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.length >= 2) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-20 h-11"
          disabled={isSearching}
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          
          {onFilterClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFilterClick}
              className="h-6 w-6 p-0"
            >
              <Filter className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Search Stats */}
      {showStats && query && (
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>
            {totalResults} results in {searchTime.toFixed(1)}ms
          </span>
          <div className="flex items-center gap-2">
            {isServerSearchEnabled && (
              <Badge variant="outline" className="text-xs">
                Server Search
              </Badge>
            )}
            <span>
              {searchStats.totalDocuments} docs indexed
            </span>
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg max-h-96 overflow-hidden">
          <Command>
            <CommandList>
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSearch(suggestion)}
                      className="cursor-pointer"
                    >
                      <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Search History */}
              {searchHistory.length > 0 && (
                <CommandGroup heading="Recent Searches">
                  {searchHistory.slice(0, 5).map((historyItem, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSearch(historyItem)}
                      className="cursor-pointer"
                    >
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {historyItem}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* No suggestions */}
              {suggestions.length === 0 && searchHistory.length === 0 && (
                <CommandEmpty>
                  No suggestions available
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}

      {/* Click outside handler */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};