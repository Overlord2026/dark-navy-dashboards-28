import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Star,
  Building,
  MapPin,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Heart,
  Filter
} from 'lucide-react';

interface InvestmentAccessProps {
  isPremium?: boolean;
}

export const InvestmentAccess: React.FC<InvestmentAccessProps> = ({ isPremium = false }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const investments = [
    {
      id: 1,
      name: 'Multifamily Real Estate Fund III',
      category: 'Real Estate',
      minimumInvestment: 250000,
      targetReturn: '12-15%',
      term: '5-7 years',
      riskLevel: 'Medium',
      sponsorRating: 4.8,
      funding: 75,
      location: 'Sunbelt Markets',
      status: 'open',
      description: 'Value-add multifamily properties in high-growth markets',
      allocatedClients: 8,
      totalAllocated: 2400000
    },
    {
      id: 2,
      name: 'Private Credit Opportunity Fund',
      category: 'Credit',
      minimumInvestment: 500000,
      targetReturn: '10-12%',
      term: '3-5 years',
      riskLevel: 'Low-Medium',
      sponsorRating: 4.9,
      funding: 90,
      location: 'North America',
      status: 'open',
      description: 'Senior secured lending to middle-market companies',
      allocatedClients: 12,
      totalAllocated: 6800000
    },
    {
      id: 3,
      name: 'Growth Equity Tech Fund II',
      category: 'Private Equity',
      minimumInvestment: 1000000,
      targetReturn: '18-25%',
      term: '7-10 years',
      riskLevel: 'High',
      sponsorRating: 4.7,
      funding: 60,
      location: 'Silicon Valley',
      status: 'filling_fast',
      description: 'Late-stage SaaS and fintech companies',
      allocatedClients: 5,
      totalAllocated: 8500000
    },
    {
      id: 4,
      name: 'Infrastructure Debt Fund',
      category: 'Infrastructure',
      minimumInvestment: 100000,
      targetReturn: '8-10%',
      term: '10-15 years',
      riskLevel: 'Low',
      sponsorRating: 4.6,
      funding: 45,
      location: 'US & Canada',
      status: 'open',
      description: 'Core infrastructure debt investments',
      allocatedClients: 15,
      totalAllocated: 3200000
    }
  ];

  const portfolioSummary = {
    totalAllocated: 21900000,
    clientsInvested: 40,
    averageReturn: 11.4,
    activeInvestments: 12
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      open: 'default',
      filling_fast: 'destructive',
      closed: 'outline',
      pending: 'secondary'
    };
    const labels: Record<string, string> = {
      open: 'Open',
      filling_fast: 'Filling Fast',
      closed: 'Closed',
      pending: 'Pending'
    };
    return <Badge variant={variants[status] || 'secondary'}>
      {labels[status] || status}
    </Badge>;
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      'Low': 'text-green-600',
      'Low-Medium': 'text-yellow-600',
      'Medium': 'text-orange-600',
      'High': 'text-red-600'
    };
    return colors[risk as keyof typeof colors] || 'text-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const categories = ['all', 'Real Estate', 'Credit', 'Private Equity', 'Infrastructure'];

  const filteredInvestments = activeFilter === 'all' 
    ? investments 
    : investments.filter(inv => inv.category === activeFilter);

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{formatCurrency(portfolioSummary.totalAllocated)}</div>
            <div className="text-sm text-muted-foreground">Total Allocated</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{portfolioSummary.clientsInvested}</div>
            <div className="text-sm text-muted-foreground">Clients Invested</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{portfolioSummary.averageReturn}%</div>
            <div className="text-sm text-muted-foreground">Avg Return</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Building className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{portfolioSummary.activeInvestments}</div>
            <div className="text-sm text-muted-foreground">Active Investments</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Investment Opportunities</TabsTrigger>
          <TabsTrigger value="allocated">Client Allocations</TabsTrigger>
          <TabsTrigger value="performance">Performance Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Private Market Alpha Opportunities</h3>
            <div className="flex gap-2">
              <div className="flex gap-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeFilter === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredInvestments.map((investment) => (
              <Card key={investment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{investment.name}</h3>
                        {getStatusBadge(investment.status)}
                        <Badge variant="outline">{investment.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {investment.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium">Minimum Investment</div>
                          <div className="text-lg font-bold text-primary">
                            {formatCurrency(investment.minimumInvestment)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">Target Return</div>
                          <div className="text-lg font-bold text-green-600">
                            {investment.targetReturn}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">Term</div>
                          <div className="text-lg font-bold">
                            {investment.term}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">Risk Level</div>
                          <div className={`text-lg font-bold ${getRiskColor(investment.riskLevel)}`}>
                            {investment.riskLevel}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{investment.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{investment.sponsorRating}</span>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            {investment.funding}% funded
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1">
                            <Eye className="h-4 w-4" />
                            Details
                          </Button>
                          <Button size="sm" className="gap-1">
                            <Heart className="h-4 w-4" />
                            Add to Client Portfolio
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="allocated" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Client Investment Allocations</h3>
            <Button className="gap-2">
              <DollarSign className="h-4 w-4" />
              New Allocation
            </Button>
          </div>

          <div className="grid gap-4">
            {investments.map((investment) => (
              <Card key={investment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{investment.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {investment.allocatedClients} clients • {formatCurrency(investment.totalAllocated)} allocated
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">
                          {investment.allocatedClients}
                        </div>
                        <div className="text-xs text-muted-foreground">Clients</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(investment.totalAllocated)}
                        </div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {formatCurrency(investment.totalAllocated / investment.allocatedClients)}
                        </div>
                        <div className="text-xs text-muted-foreground">Avg per Client</div>
                      </div>

                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <h3 className="text-lg font-semibold">Investment Performance Tracking</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Private Credit Fund</span>
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">+14.2%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Real Estate Fund III</span>
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">+12.8%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Infrastructure Debt</span>
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">+9.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Upcoming Distributions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Real Estate Fund II</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">$245K</div>
                    <div className="text-xs text-muted-foreground">Feb 15</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Credit Opportunity</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">$180K</div>
                    <div className="text-xs text-muted-foreground">Mar 1</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Infrastructure Fund</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">$92K</div>
                    <div className="text-xs text-muted-foreground">Mar 15</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <TrendingUp className="h-8 w-8 mr-2" />
                Interactive performance charts would be rendered here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};