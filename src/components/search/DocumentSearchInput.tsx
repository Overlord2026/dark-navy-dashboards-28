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
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
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
    setActiveSuggestionIndex(-1);
    
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
    setActiveSuggestionIndex(-1);
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setInputValue('');
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    clearSearch();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allSuggestions = [...suggestions, ...searchHistory.slice(0, 5)];
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && allSuggestions[activeSuggestionIndex]) {
        handleSearch(allSuggestions[activeSuggestionIndex]);
      } else {
        handleSearch(inputValue);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!showSuggestions && inputValue.length >= 2) {
        setShowSuggestions(true);
      }
      const nextIndex = activeSuggestionIndex < allSuggestions.length - 1 ? activeSuggestionIndex + 1 : 0;
      setActiveSuggestionIndex(nextIndex);
      suggestionRefs.current[nextIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = activeSuggestionIndex > 0 ? activeSuggestionIndex - 1 : allSuggestions.length - 1;
      setActiveSuggestionIndex(prevIndex);
      suggestionRefs.current[prevIndex]?.scrollIntoView({ block: 'nearest' });
    }
  };

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        
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
          aria-label="Search documents"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-describedby={showStats && query ? "search-stats" : undefined}
          aria-activedescendant={
            activeSuggestionIndex >= 0 ? `suggestion-${activeSuggestionIndex}` : undefined
          }
          autoComplete="off"
          role="combobox"
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0"
              aria-label="Clear search"
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
              aria-label="Open search filters"
            >
              <Filter className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" aria-label="Searching..."></div>
          </div>
        )}
      </div>

      {/* Search Stats */}
      {showStats && query && (
        <div 
          id="search-stats"
          className="flex items-center justify-between mt-2 text-xs text-muted-foreground"
          aria-live="polite"
        >
          <span>
            {totalResults} results found in {searchTime.toFixed(1)} milliseconds
          </span>
          <div className="flex items-center gap-2">
            {isServerSearchEnabled && (
              <Badge variant="outline" className="text-xs">
                Server Search
              </Badge>
            )}
            <span>
              {searchStats.totalDocuments} documents indexed
            </span>
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg max-h-96 overflow-hidden"
          role="listbox"
          aria-label="Search suggestions"
        >
          <ul className="max-h-96 overflow-auto">
            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <li role="group" aria-labelledby="suggestions-heading">
                <div id="suggestions-heading" className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    ref={(el) => (suggestionRefs.current[index] = el)}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={activeSuggestionIndex === index}
                    className={cn(
                      "px-2 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-accent focus:bg-accent",
                      activeSuggestionIndex === index && "bg-accent"
                    )}
                    onClick={() => handleSearch(suggestion)}
                    onMouseEnter={() => setActiveSuggestionIndex(index)}
                  >
                    <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    {suggestion}
                  </div>
                ))}
              </li>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && (
              <li role="group" aria-labelledby="history-heading">
                <div id="history-heading" className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50">
                  Recent Searches
                </div>
                {searchHistory.slice(0, 5).map((historyItem, index) => {
                  const adjustedIndex = suggestions.length + index;
                  return (
                    <div
                      key={index}
                      ref={(el) => (suggestionRefs.current[adjustedIndex] = el)}
                      id={`suggestion-${adjustedIndex}`}
                      role="option"
                      aria-selected={activeSuggestionIndex === adjustedIndex}
                      className={cn(
                        "px-2 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-accent focus:bg-accent",
                        activeSuggestionIndex === adjustedIndex && "bg-accent"
                      )}
                      onClick={() => handleSearch(historyItem)}
                      onMouseEnter={() => setActiveSuggestionIndex(adjustedIndex)}
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      {historyItem}
                    </div>
                  );
                })}
              </li>
            )}

            {/* No suggestions */}
            {suggestions.length === 0 && searchHistory.length === 0 && (
              <li className="px-2 py-8 text-center text-sm text-muted-foreground">
                No suggestions available
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Click outside handler */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowSuggestions(false);
            setActiveSuggestionIndex(-1);
          }}
        />
      )}
    </div>
  );
};