import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExternalLink, Search, Filter, Clock, Crown, Star, Zap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import catalogConfig from '@/config/catalogConfig.json';

interface CatalogItem {
  key: string;
  label: string;
  summary: string;
  type: string;
  personas: string[];
  solutions: string[];
  goals: string[];
  tags: string[];
  route: string;
  status: string;
}

// Cast the imported config to our interface
const catalogItems: CatalogItem[] = catalogConfig as CatalogItem[];

// Extract unique values for filters
const personas = [...new Set(catalogItems.flatMap(item => item.personas))];
const types = [...new Set(catalogItems.map(item => item.type))];
const solutions = [...new Set(catalogItems.flatMap(item => item.solutions))];
const tags = [...new Set(catalogItems.flatMap(item => item.tags))];

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredItems = useMemo(() => {
    return catalogItems.filter(item => {
      // Search filter
      if (searchQuery && !item.label.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !item.summary.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Persona filter
      if (selectedPersonas.length > 0 && !selectedPersonas.some(p => item.personas.includes(p))) {
        return false;
      }

      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(item.type)) {
        return false;
      }

      // Solutions filter
      if (selectedSolutions.length > 0 && !selectedSolutions.some(s => item.solutions.includes(s))) {
        return false;
      }

      // Tag filter
      if (selectedTags.length > 0 && !selectedTags.some(t => item.tags.includes(t))) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedPersonas, selectedTypes, selectedSolutions, selectedTags]);

  const handleCardClick = (item: CatalogItem) => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.catalog.card.open', { 
        item: item.key, 
        route: item.route,
        comingSoon: item.status !== 'ready'
      });
    }

    if (item.status !== 'ready') {
      // Show coming soon message
      return;
    }

    // Navigate to item
    window.location.href = item.route;
  };

  const handleFilterChange = (filterType: 'personas' | 'types' | 'solutions' | 'tags', value: string, checked: boolean) => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics && checked) {
      (window as any).analytics.track('lp.catalog.filter', { 
        filterType, 
        value 
      });
    }

    const setters = {
      personas: setSelectedPersonas,
      types: setSelectedTypes,
      solutions: setSelectedSolutions,
      tags: setSelectedTags
    };

    const setter = setters[filterType];
    setter(prev => 
      checked 
        ? [...prev, value]
        : prev.filter(item => item !== value)
    );
  };

  const formatPersonaName = (persona: string) => {
    const names: Record<string, string> = {
      'family': 'Families',
      'aspiring': 'Aspiring Families',
      'retiree': 'Retirees',
      'advisor': 'Advisors',
      'cpa': 'CPAs',
      'attorney': 'Attorneys',
      'insurance': 'Insurance',
      'healthcare': 'Healthcare',
      'realtor': 'Realtors',
      'nil-athlete': 'NIL Athletes',
      'nil-school': 'NIL Schools'
    };
    return names[persona] || persona.charAt(0).toUpperCase() + persona.slice(1);
  };

  const activeFiltersCount = selectedPersonas.length + selectedTypes.length + selectedSolutions.length + selectedTags.length;

  return (
    <div className="page-surface">
      <div className="container mx-auto px-4 py-8 pt-[var(--header-stack)]">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Solution Catalog</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore our comprehensive collection of tools, courses, guides, and resources designed for families and financial professionals.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search tools, courses, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[hsl(210_65%_8%)] border-bfo-gold/30 text-white placeholder:text-white/60 focus:border-bfo-gold"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="whitespace-nowrap border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-bfo-gold text-black">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[hsl(210_65%_13%)] border-bfo-gold/30" align="end">
              <DropdownMenuLabel className="text-white">Filter by Persona</DropdownMenuLabel>
              {personas.map((persona) => (
                <DropdownMenuCheckboxItem
                  key={persona}
                  checked={selectedPersonas.includes(persona)}
                  onCheckedChange={(checked) => handleFilterChange('personas', persona, checked)}
                  className="text-white hover:bg-bfo-gold/10"
                >
                  {formatPersonaName(persona)}
                </DropdownMenuCheckboxItem>
              ))}
              
              <DropdownMenuSeparator className="bg-bfo-gold/30" />
              <DropdownMenuLabel className="text-white">Filter by Solution</DropdownMenuLabel>
              {solutions.map((solution) => (
                <DropdownMenuCheckboxItem
                  key={solution}
                  checked={selectedSolutions.includes(solution)}
                  onCheckedChange={(checked) => handleFilterChange('solutions', solution, checked)}
                  className="text-white hover:bg-bfo-gold/10"
                >
                  {solution.charAt(0).toUpperCase() + solution.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}

              <DropdownMenuSeparator className="bg-bfo-gold/30" />
              <DropdownMenuLabel className="text-white">Filter by Type</DropdownMenuLabel>
              {types.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={(checked) => handleFilterChange('types', type, checked)}
                  className="text-white hover:bg-bfo-gold/10"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
              
              <DropdownMenuSeparator className="bg-bfo-gold/30" />
              <DropdownMenuLabel className="text-white">Filter by Tags</DropdownMenuLabel>
              {tags.slice(0, 10).map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={(checked) => handleFilterChange('tags', tag, checked)}
                  className="text-white hover:bg-bfo-gold/10"
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results Count */}
        <div className="text-sm text-white/60 mb-6">
          Showing {filteredItems.length} of {catalogItems.length} items
        </div>

        {/* Catalog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.key}
              className="cursor-pointer bg-[hsl(210_65%_13%)] border-4 border-bfo-gold hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-bfo-gold/20"
              onClick={() => handleCardClick(item)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight text-white">{item.label}</CardTitle>
                  <div className="flex items-center gap-1">
                    {item.status !== 'ready' ? (
                      <Badge variant="secondary" className="bg-bfo-gold text-black">Coming Soon</Badge>
                    ) : (
                      <ExternalLink className="h-4 w-4 text-bfo-gold flex-shrink-0" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed text-white/80">
                  {item.summary}
                </CardDescription>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs border-bfo-gold/30 text-bfo-gold">
                      {item.type}
                    </Badge>
                    {item.solutions.map(solution => (
                      <Badge key={solution} variant="outline" className="text-xs border-bfo-gold/30 text-bfo-gold">
                        {solution}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-bfo-gold text-black">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-bfo-gold text-black">
                        +{item.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-white/60">
                    For: {item.personas.map(formatPersonaName).join(', ')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/80">No items match your current filters.</p>
            <Button 
              variant="ghost" 
              onClick={() => {
                setSearchQuery('');
                setSelectedPersonas([]);
                setSelectedTypes([]);
                setSelectedSolutions([]);
                setSelectedTags([]);
              }}
              className="mt-2 text-bfo-gold hover:bg-bfo-gold/10"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}