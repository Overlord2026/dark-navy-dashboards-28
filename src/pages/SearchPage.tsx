import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchIcon, ArrowRight, User, Briefcase, Calculator, BookOpen, Shield, Star } from 'lucide-react';
import { buildSearchIndex, searchItems, SearchItem } from '@/lib/searchIndex';
import SEOHead from '@/components/seo/SEOHead';
import { PublicNavigation } from '@/components/discover/PublicNavigation';
import { FooterMinimal } from '@/components/discover/FooterMinimal';

const kindIcons = {
  persona: User,
  solution: Briefcase,
  tool: Calculator,
  course: BookOpen,
  guide: BookOpen,
  rail: Shield,
  admin: Star
};

const kindColors = {
  persona: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  solution: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  tool: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  course: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  guide: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  rail: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  admin: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const searchIndex = buildSearchIndex();

  useEffect(() => {
    const searchResults = searchItems(query, searchIndex);
    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, searchIndex]);

  useEffect(() => {
    // Focus search input on mount
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Update URL params
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  }, [query, setSearchParams]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(Math.min(selectedIndex + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(Math.max(selectedIndex - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      }
    }
  };

  const handleResultClick = (item: SearchItem) => {
    // Safe routing - prefer public routes
    navigate(item.route);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Search | myBFOCFO"
        description="Search personas, solutions, tools, courses, and guides on the myBFOCFO platform."
        keywords={['search', 'personas', 'solutions', 'tools', 'financial planning']}
        noIndex={true}
      />
      
      <PublicNavigation />
      
      <main className="pt-[var(--header-stack)] pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Search Header */}
          <div className="text-center py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Search</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find personas, solutions, tools, courses, and guides
            </p>
            
            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search for tools, personas, solutions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-12 pr-4 py-3 text-lg"
                aria-label="Search"
              />
            </div>
          </div>

          {/* Search Results */}
          <div ref={resultsRef} className="space-y-4">
            {query && results.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No results found for "{query}"</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try different keywords or browse our{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/solutions')}>
                    solutions
                  </Button>
                </p>
              </div>
            )}

            {results.map((item, index) => {
              const IconComponent = kindIcons[item.kind] || Calculator;
              const isSelected = index === selectedIndex;
              
              return (
                <Card 
                  key={item.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary shadow-md' : ''
                  }`}
                  onClick={() => handleResultClick(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.label}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${kindColors[item.kind]}`}
                            >
                              {item.kind}
                            </Badge>
                            {item.solutions?.map(solution => (
                              <Badge key={solution} variant="outline" className="text-xs">
                                {solution}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardHeader>
                  {item.summary && (
                    <CardContent className="pt-0">
                      <CardDescription>{item.summary}</CardDescription>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Popular Items (when no search) */}
          {!query && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Popular Personas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchIndex
                    .filter(item => item.kind === 'persona')
                    .slice(0, 6)
                    .map(item => (
                      <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleResultClick(item)}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <CardTitle className="text-sm">{item.label}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="text-xs">{item.summary}</CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Popular Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchIndex
                    .filter(item => item.kind === 'tool')
                    .slice(0, 6)
                    .map(item => (
                      <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleResultClick(item)}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            <CardTitle className="text-sm">{item.label}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="text-xs">{item.summary}</CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Tips */}
          <div className="mt-12 p-6 bg-muted/30 rounded-lg">
            <h3 className="font-semibold mb-2">Search Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use keywords like "retirement", "tax", "annuities", "advisor"</li>
              <li>• Search by persona: "families", "advisors", "cpas", "attorneys"</li>
              <li>• Find tools by solution: "investments", "estate", "insurance"</li>
              <li>• Use arrow keys to navigate results, Enter to select</li>
            </ul>
          </div>
        </div>
      </main>

      <FooterMinimal />
    </div>
  );
}