import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Users, 
  Award,
  ArrowRight,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FeaturedServices() {
  const navigate = useNavigate();

  const featuredAdvisors = [
    {
      id: '1',
      name: 'Michael Sterling',
      title: 'Senior Wealth Advisor',
      firm: 'Sterling Family Advisors',
      location: 'New York, NY',
      rating: 4.9,
      reviews: 127,
      aum: '$2.8B',
      clients: 85,
      minInvestment: '$5M',
      specialties: ['Ultra High Net Worth', 'Multi-Generation Planning', 'Tax Optimization'],
      experience: '20+ years',
      credentials: ['CFP®', 'CFA®', 'CPWA®'],
      imageUrl: '/api/placeholder/64/64',
      responseTime: '< 2 hours',
      featured: true
    },
    {
      id: '2',
      name: 'Sarah Chen',
      title: 'Tax Strategy Partner',
      firm: 'Chen & Associates CPA',
      location: 'San Francisco, CA',
      rating: 5.0,
      reviews: 89,
      aum: 'N/A',
      clients: 45,
      minInvestment: '$2M',
      specialties: ['International Tax', 'State Tax Optimization', 'Estate Tax'],
      experience: '15+ years',
      credentials: ['CPA', 'MST', 'CFP®'],
      imageUrl: '/api/placeholder/64/64',
      responseTime: '< 4 hours',
      featured: true
    },
    {
      id: '3',
      name: 'Robert Harrison',
      title: 'Estate Planning Attorney',
      firm: 'Harrison Estate Law',
      location: 'Chicago, IL',
      rating: 4.8,
      reviews: 156,
      aum: 'N/A',
      clients: 120,
      minInvestment: '$10M',
      specialties: ['Complex Trusts', 'Business Succession', 'Charitable Planning'],
      experience: '25+ years',
      credentials: ['JD', 'LLM Tax', 'ACTEC Fellow'],
      imageUrl: '/api/placeholder/64/64',
      responseTime: '< 6 hours',
      featured: true
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Top Rated Professionals
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Featured Advisors & Specialists
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hand-selected professionals who consistently deliver exceptional results 
            for high-net-worth families and ultra-high-net-worth individuals.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {featuredAdvisors.map((advisor) => (
            <Card 
              key={advisor.id} 
              className="group cursor-pointer hover-scale transition-all duration-300 hover:shadow-xl border-border/50 bg-background relative overflow-hidden"
              onClick={() => navigate(`/marketplace/advisor/${advisor.id}`)}
            >
              {advisor.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}

              <CardHeader className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 border-2 border-border">
                    <AvatarImage src={advisor.imageUrl} alt={advisor.name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {advisor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {advisor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{advisor.title}</p>
                    <p className="text-sm font-medium">{advisor.firm}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {advisor.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {advisor.responseTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(advisor.rating) 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="font-medium">{advisor.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({advisor.reviews} reviews)
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Experience</div>
                    <div className="font-medium">{advisor.experience}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Min. Assets</div>
                    <div className="font-medium">{advisor.minInvestment}</div>
                  </div>
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
                </div>

                {/* Credentials */}
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Credentials</div>
                  <div className="flex flex-wrap gap-1">
                    {advisor.credentials.map((credential, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {credential}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-1">
                    {advisor.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {advisor.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{advisor.specialties.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground"
                  variant="outline"
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Browse All CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/marketplace/advisors')}
            className="gap-2"
          >
            <Users className="w-5 h-5" />
            Browse All Professionals
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}