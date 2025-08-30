import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  DollarSign, 
  BookOpen,
  Building2,
  Shield,
  TrendingUp,
  GraduationCap,
  FileText,
  Calculator
} from 'lucide-react';

interface CatalogItem {
  id: string;
  name: string;
  description: string;
  category: 'solution' | 'tool' | 'ce' | 'service';
  price: number;
  recurring: boolean;
  personas: string[];
  features: string[];
  provider: string;
  rating: number;
  users: number;
  icon: React.ReactNode;
  tags: string[];
}

const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'portfolio-optimizer',
    name: 'AI Portfolio Optimizer',
    description: 'Machine learning-powered portfolio optimization with risk management',
    category: 'solution',
    price: 2500,
    recurring: true,
    personas: ['advisor', 'family'],
    features: ['ML Optimization', 'Risk Analytics', 'ESG Integration', 'Tax-Loss Harvesting'],
    provider: 'BFO Labs',
    rating: 4.8,
    users: 1250,
    icon: <TrendingUp className="h-6 w-6" />,
    tags: ['ai', 'portfolio', 'optimization', 'risk']
  },
  {
    id: 'compliance-suite',
    name: 'Regulatory Compliance Suite',
    description: 'Comprehensive compliance management for RIAs and broker-dealers',
    category: 'solution',
    price: 5000,
    recurring: true,
    personas: ['advisor', 'attorney'],
    features: ['ADV Management', 'Surveillance', 'Risk Assessment', 'Reporting'],
    provider: 'ComplianceMax',
    rating: 4.6,
    users: 850,
    icon: <Shield className="h-6 w-6" />,
    tags: ['compliance', 'regulatory', 'surveillance', 'ria']
  },
  {
    id: 'estate-planner',
    name: 'Digital Estate Planner',
    description: 'End-to-end estate planning with document automation',
    category: 'tool',
    price: 150,
    recurring: false,
    personas: ['attorney', 'family'],
    features: ['Document Generation', 'Tax Optimization', 'Trust Management', 'Beneficiary Tracking'],
    provider: 'LegalTech Solutions',
    rating: 4.7,
    users: 2100,
    icon: <FileText className="h-6 w-6" />,
    tags: ['estate', 'legal', 'documents', 'trusts']
  },
  {
    id: 'cpa-ce-program',
    name: 'CPA CE Accelerated Program',
    description: '40-hour CPA continuing education with ethics and tax updates',
    category: 'ce',
    price: 299,
    recurring: false,
    personas: ['cpa'],
    features: ['40 CE Hours', 'Ethics Credit', 'Self-Paced', 'Certificate'],
    provider: 'ProEducation',
    rating: 4.4,
    users: 5200,
    icon: <GraduationCap className="h-6 w-6" />,
    tags: ['education', 'cpa', 'ethics', 'tax']
  },
  {
    id: 'insurance-analytics',
    name: 'Insurance Analytics Platform',
    description: 'Comprehensive analytics for P&C and life insurance portfolios',
    category: 'solution',
    price: 1800,
    recurring: true,
    personas: ['insurance'],
    features: ['Claims Analytics', 'Risk Modeling', 'Underwriting Support', 'Fraud Detection'],
    provider: 'InsurTech Pro',
    rating: 4.5,
    users: 650,
    icon: <Building2 className="h-6 w-6" />,
    tags: ['insurance', 'analytics', 'claims', 'underwriting']
  },
  {
    id: 'tax-projector',
    name: 'Multi-Year Tax Projector',
    description: 'Advanced tax planning and projection software',
    category: 'tool',
    price: 450,
    recurring: true,
    personas: ['cpa', 'advisor'],
    features: ['5-Year Projections', 'Scenario Analysis', 'State Tax Support', 'AMT Planning'],
    provider: 'TaxPlan Solutions',
    rating: 4.6,
    users: 1850,
    icon: <Calculator className="h-6 w-6" />,
    tags: ['tax', 'planning', 'projections', 'amt']
  },
  {
    id: 'investment-research',
    name: 'Investment Research Service',
    description: 'Professional investment research and due diligence reports',
    category: 'service',
    price: 2000,
    recurring: true,
    personas: ['advisor'],
    features: ['Weekly Reports', 'Due Diligence', 'Manager Analysis', 'ESG Research'],
    provider: 'Research Partners',
    rating: 4.7,
    users: 420,
    icon: <BookOpen className="h-6 w-6" />,
    tags: ['research', 'investments', 'due-diligence', 'esg']
  },
  {
    id: 'attorney-ce-ethics',
    name: 'Attorney Ethics & Professional Responsibility',
    description: 'Required ethics training for attorneys with state-specific content',
    category: 'ce',
    price: 199,
    recurring: false,
    personas: ['attorney'],
    features: ['Ethics Credit', 'State Specific', 'Interactive', 'Certificate'],
    provider: 'Legal Education Hub',
    rating: 4.3,
    users: 3100,
    icon: <GraduationCap className="h-6 w-6" />,
    tags: ['ethics', 'attorney', 'professional', 'responsibility']
  }
];

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'solution', label: 'Solutions' },
  { value: 'tool', label: 'Tools' },
  { value: 'ce', label: 'Continuing Education' },
  { value: 'service', label: 'Services' }
];

const PERSONAS = [
  { value: 'all', label: 'All Personas' },
  { value: 'advisor', label: 'Advisor' },
  { value: 'cpa', label: 'CPA' },
  { value: 'attorney', label: 'Attorney' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'family', label: 'Family' }
];

export function DiscoverCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPersona, setSelectedPersona] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'solution': return <Building2 className="h-4 w-4" />;
      case 'tool': return <Calculator className="h-4 w-4" />;
      case 'ce': return <GraduationCap className="h-4 w-4" />;
      case 'service': return <Users className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number, recurring: boolean) => {
    const formatted = price === 0 ? 'Free' : `$${price.toLocaleString()}`;
    return recurring ? `${formatted}/month` : formatted;
  };

  const filteredItems = CATALOG_ITEMS
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      const matchesPersona = selectedPersona === 'all' || 
                             item.personas.includes(selectedPersona) ||
                             item.personas.includes('all');
      
      return matchesSearch && matchesCategory && matchesPersona;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'users':
          return b.users - a.users;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discover Catalog</h1>
          <p className="text-muted-foreground">
            Explore solutions, tools, and services for financial professionals
          </p>
        </div>
        
        <Badge variant="outline" className="gap-2">
          <Star className="h-4 w-4" />
          {CATALOG_ITEMS.length} items available
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search solutions, tools, and services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPersona} onValueChange={setSelectedPersona}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Persona" />
          </SelectTrigger>
          <SelectContent>
            {PERSONAS.map(persona => (
              <SelectItem key={persona.value} value={persona.value}>
                {persona.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-muted-foreground">
            {filteredItems.length} of {CATALOG_ITEMS.length} items
          </div>
        </div>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <CatalogItemCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            {filteredItems.map(item => (
              <CatalogItemRow key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
}

function CatalogItemCard({ item }: { item: CatalogItem }) {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {item.icon}
            </div>
            <div>
              <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="gap-1">
                  {getCategoryIcon(item.category)}
                  {item.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {item.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(item.price, item.recurring)}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {item.users.toLocaleString()}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Key Features:</div>
          <div className="flex flex-wrap gap-1">
            {item.features.slice(0, 3).map(feature => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {item.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">For:</div>
          <div className="flex flex-wrap gap-1">
            {item.personas.map(persona => (
              <Badge key={persona} variant="outline" className="text-xs capitalize">
                {persona}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button className="w-full" size="sm">
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CatalogItemRow({ item }: { item: CatalogItem }) {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-3 bg-primary/10 rounded-lg">
              {item.icon}
            </div>
            
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <Badge variant="outline" className="gap-1">
                  {getCategoryIcon(item.category)}
                  {item.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
              </div>
              
              <p className="text-muted-foreground">{item.description}</p>
              
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {item.users.toLocaleString()} users
                </div>
                
                <div className="text-sm text-muted-foreground">
                  by {item.provider}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(item.price, item.recurring)}
            </div>
            
            <Button size="sm">
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}