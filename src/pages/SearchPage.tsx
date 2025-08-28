import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchIcon, ArrowRight, User, Briefcase, Calculator, BookOpen, Shield, Star } from 'lucide-react';
import { buildSearchIndex, SearchItem } from '@/lib/searchIndex';
import { scoreItems } from '@/lib/searchScore';
import SEOHead from '@/components/seo/SEOHead';
import { PublicNavigation } from '@/components/discover/PublicNavigation';
import { FooterMinimal } from '@/components/discover/FooterMinimal';
import { sanitizeHtml } from '@/lib/sanitize';

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

const ALL = 'All';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [kind, setKind] = useState(searchParams.get('type') || ALL);
  const [persona, setPersona] = useState(searchParams.get('persona') || ALL);
  const [solution, setSolution] = useState(searchParams.get('solution') || ALL);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const searchIndex = buildSearchIndex();
  
  const filtered = useMemo(() => {
    let items = searchIndex;
    if (kind !== ALL) items = items.filter(i => i.kind === kind.toLowerCase());
    if (persona !== ALL) items = items.filter(i => (i.personas || []).includes(persona));
    if (solution !== ALL) items = items.filter(i => (i.solutions || []).includes(solution));
    return items;
  }, [searchIndex, kind, persona, solution]);

  const results = useMemo(() => 
    query.trim() ? scoreItems(filtered, query) : filtered.map(item => ({item, score: 0, hl: { label: item.label, summary: item.summary }})), 
    [filtered, query]
  );

  // Filter options
  const types = [ALL, 'Persona', 'Solution', 'Tool', 'Course', 'Rail', 'Guide', 'Admin'];
  const personaOpts = [ALL, 'family', 'retiree', 'advisor', 'cpa', 'attorney', 'insurance', 'healthcare', 'realtor', 'nil', 'school', 'brand'];
  const solutionOpts = [ALL, 'insurance', 'annuities', 'lending', 'investments', 'tax', 'estate', 'health', 'nil'];

  useEffect(() => {
    // Focus search input on mount
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Update URL params and page title
    const params: any = { q: query };
    if (kind !== ALL) params.type = kind;
    if (persona !== ALL) params.persona = persona;
    if (solution !== ALL) params.solution = solution;
    
    if (query) {
      setSearchParams(params);
    } else {
      setSearchParams({});
    }

    document.title = `Search — ${query || ''}`.trim() + ' | myBFOCFO';
    
    // Set noindex for search results
    const robotsMeta = document.querySelector('meta[name="robots"]') || document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    robotsMeta.setAttribute('content', 'noindex,follow');
    if (!robotsMeta.parentNode) document.head.appendChild(robotsMeta);
  }, [query, kind, persona, solution, setSearchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('search.submit', { 
        q: query, 
        type: kind, 
        persona, 
        solution 
      });
    }
  };

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
        handleResultClick(results[selectedIndex].item);
      }
    }
  };

  const handleResultClick = (item: SearchItem) => {
    // Analytics for result clicks
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('search.result.click', {
        id: item.id,
        kind: item.kind,
        route: item.route
      });
    }
    
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
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Search Header */}
          <div className="py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Search</h1>
            
            {/* Search Form */}
            <form 
              role="search" 
              aria-label="Site search" 
              onSubmit={handleSubmit} 
              className="space-y-4"
            >
              {/* Main Search Input */}
              <div className="relative max-w-2xl">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search tools, solutions, personas…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-12 pr-4 py-3 text-lg"
                  aria-label="Search"
                />
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
                <Select value={kind} onValueChange={setKind}>
                  <SelectTrigger aria-label="Type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={persona} onValueChange={setPersona}>
                  <SelectTrigger aria-label="Persona">
                    <SelectValue placeholder="All Personas" />
                  </SelectTrigger>
                  <SelectContent>
                    {personaOpts.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={solution} onValueChange={setSolution}>
                  <SelectTrigger aria-label="Solution">
                    <SelectValue placeholder="All Solutions" />
                  </SelectTrigger>
                  <SelectContent>
                    {solutionOpts.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button type="submit" className="bg-gold hover:bg-gold-hover text-navy">
                  Search
                </Button>
              </div>
            </form>

            {!query && (
              <p className="text-sm text-muted-foreground mt-4">
                Tip: try "annuities", "Roth ladder", "NIL athlete"
              </p>
            )}
          </div>

          {/* Search Results */}
          <div ref={resultsRef} className="space-y-4">
            {query && results.length === 0 && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold">No results for "{query}"</h3>
                <p className="text-sm text-muted-foreground mt-1">Try a different term or browse featured areas:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to="/solutions/annuities" className="text-primary hover:underline">Annuities</Link>
                  <Link to="/solutions/investments" className="text-primary hover:underline">Investments</Link>
                  <Link to="/personas/families?seg=retirees" className="text-primary hover:underline">Retiree Family</Link>
                  <Link to="/nil/index" className="text-primary hover:underline">NIL Index</Link>
                </div>
              </div>
            )}

            {results.slice(0, 200).map((result, index) => {
              const { item, score, hl } = result;
              const IconComponent = kindIcons[item.kind] || Calculator;
              const isSelected = index === selectedIndex;
              
              return (
                <Card 
                  key={item.id + '_' + index}
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
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${kindColors[item.kind]}`}
                            >
                              {item.kind}
                            </Badge>
                            {score > 0 && (
                              <div className="text-xs text-muted-foreground">score {score}</div>
                            )}
                          </div>
                          <CardTitle 
                            className="text-lg"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(hl?.label || item.label) }}
                          />
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.solutions?.map(sol => (
                              <Badge key={sol} variant="outline" className="text-xs">
                                {sol}
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
                      <CardDescription 
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(hl?.summary || item.summary) }}
                      />
                      {item.tags?.length && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {item.tags.join(' • ')}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Popular Items (when no search) */}
          {!query && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Popular Personas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchIndex
                    .filter(item => item.kind === 'persona')
                    .slice(0, 6)
                    .map(item => (
                      <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleResultClick(item)}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">{item.label}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="text-sm">{item.summary}</CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-6">Popular Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchIndex
                    .filter(item => item.kind === 'tool')
                    .slice(0, 6)
                    .map(item => (
                      <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleResultClick(item)}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">{item.label}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="text-sm">{item.summary}</CardDescription>
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
              <li>• Filter by type, persona, or solution area</li>
            </ul>
          </div>
        </div>
      </main>

      <FooterMinimal />
    </div>
  );
}