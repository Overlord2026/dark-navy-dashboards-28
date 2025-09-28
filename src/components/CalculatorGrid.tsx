import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PricingBadge from '@/components/pricing/PricingBadge';
import { 
  BarChart3, 
  Calculator, 
  PiggyBank, 
  Users, 
  Shield, 
  CreditCard,
  Heart,
  TrendingUp,
  Building2,
  Building,
  Layers,
  Crown,
  Briefcase,
  LayoutDashboard,
  Lock,
  Search,
  Filter
} from 'lucide-react';
import { usePersonalizationStore } from '@/features/personalization/store';
import { 
  getAvailableCalculators, 
  hasCalculatorAccess, 
  getPricingUrl,
  getCalculatorCounts,
  searchCalculators,
  CalcItem,
  Entitlement
} from '@/features/calculators/catalog';
import { toast } from 'sonner';

const iconMap = {
  BarChart3,
  Calculator,
  PiggyBank,
  Users,
  Shield,
  CreditCard,
  Heart,
  TrendingUp,
  Building2,
  Building,
  Layers,
  Crown,
  Briefcase,
  LayoutDashboard
};

const entitlementColors = {
  basic: 'bg-blue-100 text-blue-800 border-blue-200',
  premium: 'bg-purple-100 text-purple-800 border-purple-200',
  elite: 'bg-amber-100 text-amber-800 border-amber-200'
};

interface CalculatorGridProps {
  userEntitlement?: Entitlement;
  showGated?: boolean;
}

export function CalculatorGrid({ 
  userEntitlement = 'basic', 
  showGated = true 
}: CalculatorGridProps) {
  const navigate = useNavigate();
  const { persona, tier } = usePersonalizationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Get available calculators
  const allCalculators = getAvailableCalculators(persona, tier, 'elite');
  const counts = getCalculatorCounts(persona, tier);

  // Filter calculators based on search and category
  const filteredCalculators = React.useMemo(() => {
    let filtered = searchQuery 
      ? searchCalculators(searchQuery, persona, tier, 'elite')
      : allCalculators;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(calc => calc.category === categoryFilter);
    }

    return filtered;
  }, [searchQuery, categoryFilter, allCalculators, persona, tier]);

  const handleCalculatorClick = (calc: CalcItem) => {
    const hasAccess = hasCalculatorAccess(calc.key, userEntitlement);
    
    if (!hasAccess && showGated) {
      // Route to pricing with feature parameter
      const pricingUrl = getPricingUrl(calc.key);
      navigate(pricingUrl);
      
      // Show toast for gated access
      toast.info(`${calc.title} requires ${calc.entitlement} plan`, {
        description: 'Upgrading will unlock advanced calculators and planning tools.',
        action: {
          label: 'View Plans',
          onClick: () => navigate(pricingUrl)
        }
      });
    } else if (hasAccess) {
      // Navigate to calculator (mock for now)
      navigate(`/calculators/${calc.key}`);
      toast.success(`Opening ${calc.title}...`);
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Calculator;
    return <IconComponent className="h-5 w-5" />;
  };

  const categories = [...new Set(allCalculators.map(calc => calc.category))];

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Calculators</h2>
          <p className="text-muted-foreground">
            {counts.available} calculators available for {persona} persona
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {tier === 'advanced' ? 'Advanced' : 'Foundational'} Tier
          </Badge>
          <Badge variant="secondary">
            {userEntitlement} Plan
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search calculators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCalculators.map((calc) => {
          const hasAccess = hasCalculatorAccess(calc.key, userEntitlement);
          const isGated = !hasAccess;
          const entitlementColor = entitlementColors[calc.entitlement];

          return (
            <Card 
              key={calc.key}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isGated 
                  ? 'opacity-75 hover:opacity-100 border-dashed' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleCalculatorClick(calc)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${hasAccess ? 'bg-primary/10' : 'no-gray-bg'}`}>
                    {isGated ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      renderIcon(calc.icon)
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Badge className={entitlementColor} variant="outline">
                      {calc.entitlement}
                    </Badge>
                    {calc.advancedOnly && (
                      <Badge variant="secondary" className="text-xs">
                        Advanced
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {calc.title}
                    {isGated && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {calc.category} • {calc.estimatedTime}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {calc.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {calc.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant={hasAccess ? "default" : "outline"}
                    className="text-xs"
                  >
                    {isGated ? 'Upgrade' : 'Calculate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCalculators.length === 0 && (
        <div className="text-center py-12">
          <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No calculators found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or category filter.
          </p>
        </div>
      )}

      {/* Entitlement Summary */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Calculator Access Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <PricingBadge planKey="free" /> {counts.basic} calculators
            </div>
            <div>
              <PricingBadge planKey="premium" /> {counts.premium} calculators
            </div>
            <div>
              <PricingBadge planKey="pro" /> {counts.elite} calculators
            </div>
            <div>
              <span className="font-medium">Total:</span> {counts.total} available
            </div>
          </div>
          <div className="pt-2 border-t">
            <span className="font-medium">Current Access:</span> {userEntitlement} plan • 
            {hasCalculatorAccess('equity-comp-planner', userEntitlement) 
              ? ' Advanced calculators unlocked' 
              : ' Upgrade for advanced calculators'
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
}