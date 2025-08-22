import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExternalLink, Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CatalogItem {
  id: string;
  title: string;
  description: string;
  personas: string[];
  type: 'Tool' | 'Course' | 'Rail' | 'Guide' | 'Admin';
  tags: string[];
  route: string;
  comingSoon?: boolean;
}

const catalogItems: CatalogItem[] = [
  {
    id: 'value-calculator',
    title: 'Value Calculator',
    description: 'Calculate the value of advisory services for your situation',
    personas: ['families', 'advisors'],
    type: 'Tool',
    tags: ['Keep-Safe'],
    route: '/tools/value-calculator'
  },
  {
    id: 'target-analyzer',
    title: 'Retirement Target Analyzer',
    description: 'Analyze retirement income goals and strategies',
    personas: ['families', 'advisors'],
    type: 'Tool',
    tags: ['Hold'],
    route: '/tools/target-analyzer'
  },
  {
    id: 'estate-planner',
    title: 'Estate Planning Guide',
    description: 'Comprehensive estate planning guidance and tools',
    personas: ['families', 'attorneys'],
    type: 'Guide',
    tags: ['Keep-Safe', 'Anchored'],
    route: '/guides/estate-planning'
  },
  {
    id: 'tax-optimizer',
    title: 'Tax Optimization Suite',
    description: 'Advanced tax planning and optimization strategies',
    personas: ['families', 'cpas', 'advisors'],
    type: 'Tool',
    tags: ['Hold', 'Supervisor'],
    route: '/tools/tax-optimizer'
  },
  {
    id: 'compliance-rail',
    title: 'Compliance Management Rail',
    description: 'End-to-end compliance tracking and management',
    personas: ['advisors', 'cpas', 'attorneys'],
    type: 'Rail',
    tags: ['Anchored', 'Supervisor'],
    route: '/rails/compliance'
  },
  {
    id: 'investment-course',
    title: 'Investment Fundamentals Course',
    description: 'Learn the basics of investment planning and management',
    personas: ['families'],
    type: 'Course',
    tags: ['Keep-Safe'],
    route: '/courses/investment-fundamentals'
  },
  {
    id: 'nil-management',
    title: 'NIL Management Platform',
    description: 'Complete NIL offer and compliance management system',
    personas: ['nil-athlete', 'nil-school'],
    type: 'Rail',
    tags: ['Anchored', 'Supervisor'],
    route: '/nil/onboarding'
  },
  {
    id: 'document-vault',
    title: 'Secure Document Vault',
    description: 'Encrypted storage and sharing for sensitive documents',
    personas: ['families', 'advisors', 'attorneys', 'cpas'],
    type: 'Tool',
    tags: ['Keep-Safe', 'Anchored'],
    route: '/tools/document-vault'
  },
  {
    id: 'risk-assessor',
    title: 'Risk Assessment Tool',
    description: 'Comprehensive risk analysis for families and portfolios',
    personas: ['families', 'advisors', 'insurance'],
    type: 'Tool',
    tags: ['Hold'],
    route: '#soon',
    comingSoon: true
  },
  {
    id: 'healthcare-coordination',
    title: 'Healthcare Coordination Hub',
    description: 'Coordinate care among multiple healthcare providers',
    personas: ['families', 'healthcare'],
    type: 'Rail',
    tags: ['Keep-Safe', 'Supervisor'],
    route: '#soon',
    comingSoon: true
  },
  {
    id: 'real-estate-tracker',
    title: 'Real Estate Transaction Tracker',
    description: 'Track property transactions from listing to closing',
    personas: ['families', 'realtor'],
    type: 'Rail',
    tags: ['Anchored', 'Supervisor'],
    route: '#soon',
    comingSoon: true
  },
  {
    id: 'insurance-optimizer',
    title: 'Insurance Coverage Optimizer',
    description: 'Optimize insurance coverage across all policy types',
    personas: ['families', 'insurance'],
    type: 'Tool',
    tags: ['Hold', 'Supervisor'],
    route: '#soon',
    comingSoon: true
  }
];

const personas = ['families', 'advisors', 'cpas', 'attorneys', 'insurance', 'healthcare', 'realtor', 'nil-athlete', 'nil-school'];
const types = ['Tool', 'Course', 'Rail', 'Guide', 'Admin'];
const tags = ['Keep-Safe', 'Hold', 'Anchored', 'Supervisor'];

export const CatalogShelf: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredItems = useMemo(() => {
    return catalogItems.filter(item => {
      // Search filter
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
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

      // Tag filter
      if (selectedTags.length > 0 && !selectedTags.some(t => item.tags.includes(t))) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedPersonas, selectedTypes, selectedTags]);

  const handleCardClick = (item: CatalogItem) => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.catalog.card.open', { 
        item: item.id, 
        route: item.route,
        comingSoon: item.comingSoon 
      });
    }

    if (item.route === '#soon') {
      // Show coming soon message
      return;
    }

    // Navigate to item
    window.location.href = item.route;
  };

  const handleFilterChange = (filterType: 'personas' | 'types' | 'tags', value: string, checked: boolean) => {
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
    const names = {
      'families': 'Families',
      'advisors': 'Advisors',
      'cpas': 'CPAs',
      'attorneys': 'Attorneys',
      'insurance': 'Insurance',
      'healthcare': 'Healthcare',
      'realtor': 'Realtors',
      'nil-athlete': 'NIL Athletes',
      'nil-school': 'NIL Schools'
    };
    return names[persona as keyof typeof names] || persona;
  };

  const activeFiltersCount = selectedPersonas.length + selectedTypes.length + selectedTags.length;

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
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            {types.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={(checked) => handleFilterChange('types', type, checked)}
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
            {tags.map((tag) => (
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
                {item.comingSoon ? (
                  <Badge variant="secondary">Coming Soon</Badge>
                ) : (
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">
                {item.description}
              </CardDescription>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
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