import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Star, TrendingUp, Eye, Filter, Search } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  assetClass: string;
  strategy: string;
  minInvestment: string;
  liquidity: string;
  tier: 'standard' | 'premium' | 'elite';
  vetted: boolean;
  rating: number;
  trackRecord: string;
  aum: string;
  founded: number;
}

const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Meridian Capital Partners',
    logo: 'MCP',
    description: 'Focused on middle-market buyouts with operational expertise in healthcare and technology sectors.',
    assetClass: 'Private Equity',
    strategy: 'Buyout',
    minInvestment: '$5M',
    liquidity: 'Quarterly',
    tier: 'elite',
    vetted: true,
    rating: 4.8,
    trackRecord: '15.3% IRR',
    aum: '$2.4B',
    founded: 2008
  },
  {
    id: '2',
    name: 'Evergreen Real Estate Fund',
    logo: 'ERE',
    description: 'Core-plus real estate investments in major metropolitan markets with focus on sustainability.',
    assetClass: 'Real Estate',
    strategy: 'Core Plus',
    minInvestment: '$1M',
    liquidity: 'Annual',
    tier: 'premium',
    vetted: true,
    rating: 4.6,
    trackRecord: '12.8% IRR',
    aum: '$850M',
    founded: 2012
  },
  {
    id: '3',
    name: 'Atlas Growth Partners',
    logo: 'AGP',
    description: 'Early-stage venture capital focusing on B2B SaaS and fintech companies across North America.',
    assetClass: 'Venture Capital',
    strategy: 'Growth',
    minInvestment: '$500K',
    liquidity: 'Illiquid',
    tier: 'premium',
    vetted: true,
    rating: 4.7,
    trackRecord: '22.1% IRR',
    aum: '$420M',
    founded: 2015
  },
  {
    id: '4',
    name: 'Sovereign Credit Fund',
    logo: 'SCF',
    description: 'Distressed debt and special situations across corporate and real estate credit markets.',
    assetClass: 'Credit',
    strategy: 'Distressed',
    minInvestment: '$2M',
    liquidity: 'Monthly',
    tier: 'standard',
    vetted: true,
    rating: 4.4,
    trackRecord: '11.2% IRR',
    aum: '$1.2B',
    founded: 2010
  },
  {
    id: '5',
    name: 'Infrastructure Capital LLC',
    logo: 'ICL',
    description: 'Core infrastructure investments in renewable energy, transportation, and digital infrastructure.',
    assetClass: 'Infrastructure',
    strategy: 'Core',
    minInvestment: '$10M',
    liquidity: 'Annual',
    tier: 'elite',
    vetted: true,
    rating: 4.9,
    trackRecord: '13.7% IRR',
    aum: '$3.8B',
    founded: 2005
  },
  {
    id: '6',
    name: 'Apex Hedge Strategies',
    logo: 'AHS',
    description: 'Multi-strategy hedge fund with focus on equity long/short, event-driven, and macro strategies.',
    assetClass: 'Hedge Fund',
    strategy: 'Multi-Strategy',
    minInvestment: '$1M',
    liquidity: 'Monthly',
    tier: 'premium',
    vetted: true,
    rating: 4.5,
    trackRecord: '14.6% Net',
    aum: '$950M',
    founded: 2018
  }
];

const tierColors = {
  standard: 'bg-secondary text-secondary-foreground',
  premium: 'bg-gold-premium/20 text-gold-dark border border-gold-premium/30',
  elite: 'bg-gradient-to-r from-gold-premium to-gold-dark text-primary'
};

export const CuratedPartners = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssetClass, setSelectedAssetClass] = useState('all');
  const [selectedStrategy, setSelectedStrategy] = useState('all');
  const [selectedLiquidity, setSelectedLiquidity] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');

  const filteredPartners = mockPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAssetClass = selectedAssetClass === 'all' || partner.assetClass === selectedAssetClass;
    const matchesStrategy = selectedStrategy === 'all' || partner.strategy === selectedStrategy;
    const matchesLiquidity = selectedLiquidity === 'all' || partner.liquidity === selectedLiquidity;
    const matchesTier = selectedTier === 'all' || partner.tier === selectedTier;

    return matchesSearch && matchesAssetClass && matchesStrategy && matchesLiquidity && matchesTier;
  });

  const handleRequestInfo = (partnerId: string, partnerName: string) => {
    console.log(`Info requested for partner: ${partnerName} (${partnerId})`);
    // Track analytics and trigger contact flow
  };

  const handleViewDetails = (partnerId: string, partnerName: string) => {
    console.log(`Details viewed for partner: ${partnerName} (${partnerId})`);
    // Track analytics and open detailed view
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Curated Private Market Partners</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Access our vetted network of institutional-quality investment managers. Each partner 
          undergoes rigorous due diligence including regulatory review, performance analysis, and operational assessment.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Filter Partners</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Asset Class Filter */}
            <Select value={selectedAssetClass} onValueChange={setSelectedAssetClass}>
              <SelectTrigger>
                <SelectValue placeholder="Asset Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Asset Classes</SelectItem>
                <SelectItem value="Private Equity">Private Equity</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="Hedge Fund">Hedge Fund</SelectItem>
              </SelectContent>
            </Select>

            {/* Strategy Filter */}
            <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
              <SelectTrigger>
                <SelectValue placeholder="Strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strategies</SelectItem>
                <SelectItem value="Buyout">Buyout</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
                <SelectItem value="Core Plus">Core Plus</SelectItem>
                <SelectItem value="Distressed">Distressed</SelectItem>
                <SelectItem value="Core">Core</SelectItem>
                <SelectItem value="Multi-Strategy">Multi-Strategy</SelectItem>
              </SelectContent>
            </Select>

            {/* Liquidity Filter */}
            <Select value={selectedLiquidity} onValueChange={setSelectedLiquidity}>
              <SelectTrigger>
                <SelectValue placeholder="Liquidity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Liquidity</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
                <SelectItem value="Illiquid">Illiquid</SelectItem>
              </SelectContent>
            </Select>

            {/* Tier Filter */}
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger>
                <SelectValue placeholder="Placement Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="elite">Elite</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredPartners.length} of {mockPartners.length} partners
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4" />
          All partners are compliance-reviewed
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Logo Placeholder */}
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
                    {partner.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-gold-dark transition-colors">
                      {partner.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-gold-premium text-gold-premium" />
                        <span className="text-sm font-medium">{partner.rating}</span>
                      </div>
                      {partner.vetted && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Vetted
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className={tierColors[partner.tier]}>
                  {partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {partner.description}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground">Asset Class</div>
                  <div className="text-sm font-medium">{partner.assetClass}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Strategy</div>
                  <div className="text-sm font-medium">{partner.strategy}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Min Investment</div>
                  <div className="text-sm font-medium">{partner.minInvestment}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Liquidity</div>
                  <div className="text-sm font-medium">{partner.liquidity}</div>
                </div>
              </div>

              {/* Performance */}
              <div className="flex items-center justify-between mb-4 p-3 bg-secondary/50 rounded-lg">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Track Record</div>
                  <div className="text-sm font-semibold text-success">{partner.trackRecord}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">AUM</div>
                  <div className="text-sm font-semibold">{partner.aum}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Founded</div>
                  <div className="text-sm font-semibold">{partner.founded}</div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 space-y-3">
              <Button 
                className="w-full bg-gold-premium text-primary hover:bg-gold-dark font-semibold"
                onClick={() => handleRequestInfo(partner.id, partner.name)}
              >
                Request Information
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleViewDetails(partner.id, partner.name)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredPartners.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No partners match your criteria</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};