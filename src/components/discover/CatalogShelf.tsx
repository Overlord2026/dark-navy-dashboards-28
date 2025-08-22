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
  id: string;
  title: string;
  description: string;
  type: 'calculator' | 'tool' | 'course' | 'guide' | 'admin';
  category: string;
  persona: string[];
  tags: string[];
  route: string;
  status: 'active' | 'soon';
  tier: 'basic' | 'premium' | 'elite';
  estimatedTime?: string;
}

// Cast the imported config to our interface
const catalogItems: CatalogItem[] = catalogConfig as CatalogItem[];

// Extract unique values for filters
const personas = [...new Set(catalogItems.flatMap(item => item.persona))];
const types = [...new Set(catalogItems.map(item => item.type))];
const categories = [...new Set(catalogItems.map(item => item.category))];
const tags = [...new Set(catalogItems.flatMap(item => item.tags))];
const tiers = ['basic', 'premium', 'elite'];

export const CatalogShelf: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

  const filteredItems = useMemo(() => {
    return catalogItems.filter(item => {
      // Search filter
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !item.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Persona filter
      if (selectedPersonas.length > 0 && !selectedPersonas.some(p => item.persona.includes(p))) {
        return false;
      }

      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(item.type)) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
        return false;
      }

      // Tag filter
      if (selectedTags.length > 0 && !selectedTags.some(t => item.tags.includes(t))) {
        return false;
      }

      // Tier filter
      if (selectedTiers.length > 0 && !selectedTiers.includes(item.tier)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedPersonas, selectedTypes, selectedCategories, selectedTags, selectedTiers]);

  const handleCardClick = (item: CatalogItem) => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.catalog.card.open', { 
        item: item.id, 
        route: item.route,
        comingSoon: item.status === 'soon'
      });
    }

    if (item.route === '#soon' || item.status === 'soon') {
      // Show coming soon message
      return;
    }

    // Navigate to item
    window.location.href = item.route;
  };

  const handleFilterChange = (filterType: 'personas' | 'types' | 'categories' | 'tags' | 'tiers', value: string, checked: boolean) => {
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
      categories: setSelectedCategories,
      tags: setSelectedTags,
      tiers: setSelectedTiers
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

  const activeFiltersCount = selectedPersonas.length + selectedTypes.length + selectedCategories.length + selectedTags.length + selectedTiers.length;

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
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleFilterChange('categories', category, checked)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
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
            <DropdownMenuLabel>Filter by Tier</DropdownMenuLabel>
            {tiers.map((tier) => (
              <DropdownMenuCheckboxItem
                key={tier}
                checked={selectedTiers.includes(tier)}
                onCheckedChange={(checked) => handleFilterChange('tiers', tier, checked)}
              >
                <div className="flex items-center gap-2">
                  {getTierIcon(tier)}
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </div>
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
            key={item.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick(item)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                <div className="flex items-center gap-1">
                  {item.status === 'soon' ? (
                    <Badge variant="secondary">Coming Soon</Badge>
                  ) : (
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">
                {item.description}
              </CardDescription>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  <Badge className={`text-xs flex items-center gap-1 ${getTierColor(item.tier)}`} variant="outline">
                    {getTierIcon(item.tier)}
                    {item.tier}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  {item.estimatedTime && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.estimatedTime}
                    </Badge>
                  )}
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
                  For: {item.persona.map(formatPersonaName).join(', ')}
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
              setSelectedCategories([]);
              setSelectedTags([]);
              setSelectedTiers([]);
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