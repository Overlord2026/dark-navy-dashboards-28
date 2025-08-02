import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  TrendingUp, 
  Users, 
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AdvisorDirectory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const advisors = [
    {
      id: '1',
      name: 'Jennifer Walsh',
      title: 'Senior Portfolio Manager',
      firm: 'Walsh Wealth Management',
      location: 'Boston, MA',
      rating: 4.9,
      reviews: 89,
      aum: '$1.2B',
      clients: 65,
      minInvestment: '$3M',
      specialties: ['ESG Investing', 'Risk Management', 'Tax Planning'],
      category: 'wealth-advisor',
      responseTime: '< 3 hours',
      imageUrl: '/api/placeholder/48/48'
    },
    {
      id: '2',
      name: 'David Kim',
      title: 'International Tax Specialist',
      firm: 'Kim Tax Advisory',
      location: 'Los Angeles, CA',
      rating: 4.8,
      reviews: 124,
      aum: 'N/A',
      clients: 78,
      minInvestment: '$1M',
      specialties: ['Cross-Border Tax', 'FBAR Compliance', 'Treaty Planning'],
      category: 'tax-specialist',
      responseTime: '< 4 hours',
      imageUrl: '/api/placeholder/48/48'
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      title: 'Estate Planning Counsel',
      firm: 'Rodriguez Law Group',
      location: 'Miami, FL',
      rating: 5.0,
      reviews: 67,
      aum: 'N/A',
      clients: 45,
      minInvestment: '$5M',
      specialties: ['Dynasty Trusts', 'International Estate', 'Philanthropy'],
      category: 'estate-attorney',
      responseTime: '< 6 hours',
      imageUrl: '/api/placeholder/48/48'
    },
    {
      id: '4',
      name: 'Thomas Anderson',
      title: 'Life Insurance Strategist',
      firm: 'Anderson Insurance Solutions',
      location: 'Dallas, TX',
      rating: 4.7,
      reviews: 156,
      aum: 'N/A',
      clients: 89,
      minInvestment: '$2M',
      specialties: ['PPLI', 'Estate Liquidity', 'Business Protection'],
      category: 'insurance-specialist',
      responseTime: '< 5 hours',
      imageUrl: '/api/placeholder/48/48'
    },
    {
      id: '5',
      name: 'Catherine Brooks',
      title: 'Family Office Director',
      firm: 'Brooks Family Office',
      location: 'Greenwich, CT',
      rating: 4.9,
      reviews: 34,
      aum: '$850M',
      clients: 12,
      minInvestment: '$25M',
      specialties: ['Multi-Family Office', 'Governance', 'Next-Gen Education'],
      category: 'family-office',
      responseTime: '< 24 hours',
      imageUrl: '/api/placeholder/48/48'
    },
    {
      id: '6',
      name: 'Alexander Wright',
      title: 'Private Banking Director',
      firm: 'Wright Private Bank',
      location: 'San Francisco, CA',
      rating: 4.8,
      reviews: 92,
      aum: '$2.1B',
      clients: 156,
      minInvestment: '$5M',
      specialties: ['Credit Solutions', 'Cash Management', 'International Banking'],
      category: 'private-banking',
      responseTime: '< 2 hours',
      imageUrl: '/api/placeholder/48/48'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'wealth-advisor', label: 'Wealth Advisors' },
    { value: 'tax-specialist', label: 'Tax Specialists' },
    { value: 'estate-attorney', label: 'Estate Attorneys' },
    { value: 'insurance-specialist', label: 'Insurance Specialists' },
    { value: 'family-office', label: 'Family Office' },
    { value: 'private-banking', label: 'Private Banking' }
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'ny', label: 'New York' },
    { value: 'ca', label: 'California' },
    { value: 'fl', label: 'Florida' },
    { value: 'tx', label: 'Texas' },
    { value: 'ct', label: 'Connecticut' },
    { value: 'ma', label: 'Massachusetts' }
  ];

  const filteredAdvisors = advisors.filter(advisor => {
    const matchesSearch = searchTerm === '' || 
      advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || advisor.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">
            Advisor Directory
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse our comprehensive directory of verified financial professionals. 
            Use filters to find specialists that match your specific requirements.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name, firm, or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {filteredAdvisors.length} professionals found
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advisor List */}
        <div className="grid gap-6">
          {filteredAdvisors.map((advisor) => (
            <Card 
              key={advisor.id}
              className="cursor-pointer hover-scale transition-all duration-200 border-border/50"
              onClick={() => navigate(`/marketplace/advisor/${advisor.id}`)}
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                  {/* Advisor Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 border border-border">
                        <AvatarImage src={advisor.imageUrl} alt={advisor.name} />
                        <AvatarFallback>
                          {advisor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg hover:text-primary transition-colors">
                          {advisor.name}
                        </h3>
                        <p className="text-muted-foreground">{advisor.title}</p>
                        <p className="font-medium">{advisor.firm}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {advisor.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            {advisor.rating} ({advisor.reviews} reviews)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 text-sm">
                    {advisor.aum !== 'N/A' && (
                      <div>
                        <div className="text-muted-foreground">AUM</div>
                        <div className="font-medium">{advisor.aum}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-muted-foreground">Clients</div>
                      <div className="font-medium">{advisor.clients}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Min. Assets</div>
                      <div className="font-medium">{advisor.minInvestment}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Response</div>
                      <div className="font-medium">{advisor.responseTime}</div>
                    </div>
                  </div>

                  {/* Specialties & CTA */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Specialties</div>
                      <div className="flex flex-wrap gap-1">
                        {advisor.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full justify-between gap-2">
                      View Profile
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="gap-2">
            <Users className="w-5 h-5" />
            Load More Professionals
          </Button>
        </div>
      </div>
    </section>
  );
}