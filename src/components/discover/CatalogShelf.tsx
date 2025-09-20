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

export const CatalogShelf: React.FC = () => {
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
      ...((window as any).__ENABLE_NIL__ ? {
        'nil-athlete': 'NIL Athletes',
        'nil-school': 'NIL Schools'
      } : {})
    };
    return names[persona] || persona.charAt(0).toUpperCase() + persona.slice(1);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'basic': return <Star className="h-3 w-3" />;
      case 'premium': return <Zap className="h-3 w-3" />;
      case 'elite': return <Crown className="h-3 w-3" />;
      default: return null;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'elite': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const activeFiltersCount = selectedPersonas.length + selectedTypes.length + selectedSolutions.length + selectedTags.length;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools, courses, and guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="whitespace-nowrap">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Filter by Persona</DropdownMenuLabel>
            {personas.map((persona) => (
              <DropdownMenuCheckboxItem
                key={persona}
                checked={selectedPersonas.includes(persona)}
                onCheckedChange={(checked) => handleFilterChange('personas', persona, checked)}
              >
                {formatPersonaName(persona)}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Solution</DropdownMenuLabel>
            {solutions.map((solution) => (
              <DropdownMenuCheckboxItem
                key={solution}
                checked={selectedSolutions.includes(solution)}
                onCheckedChange={(checked) => handleFilterChange('solutions', solution, checked)}
              >
                {solution.charAt(0).toUpperCase() + solution.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            {types.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={(checked) => handleFilterChange('types', type, checked)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
            {tags.slice(0, 10).map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={(checked) => handleFilterChange('tags', tag, checked)}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredItems.length} of {catalogItems.length} items
      </div>

      {/* Catalog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card 
            key={item.key}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick(item)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg leading-tight">{item.label}</CardTitle>
                <div className="flex items-center gap-1">
                  {item.status !== 'ready' ? (
                    <Badge variant="secondary">Coming Soon</Badge>
                  ) : (
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">
                {item.summary}
              </CardDescription>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                  {item.solutions.map(solution => (
                    <Badge key={solution} variant="outline" className="text-xs">
                      {solution}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  For: {item.personas.map(formatPersonaName).join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items match your current filters.</p>
          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchQuery('');
              setSelectedPersonas([]);
              setSelectedTypes([]);
              setSelectedSolutions([]);
              setSelectedTags([]);
            }}
            className="mt-2"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};