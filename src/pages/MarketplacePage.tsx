import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Star, 
  MapPin, 
  Users, 
  ArrowRight,
  Shield,
  Award,
  Clock,
  TrendingUp,
  FileText,
  BookOpen,
  Play,
  Filter,
  ChevronRight,
  Building2,
  Calculator,
  Scale,
  HeartHandshake,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [userType, setUserType] = useState<'family' | 'professional'>('family');
  const [activeTab, setActiveTab] = useState('professionals');

  // Hero Section Component
  const HeroSection = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Premium Family Office Network
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Family Office
              <span className="block text-primary">Marketplace</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with elite financial advisors, wealth managers, and specialized professionals 
              exclusively serving high-net-worth families and institutions.
            </p>
          </div>

          {/* Quick Filter Toggle */}
          <div className="flex justify-center">
            <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg p-1 flex">
              <Button
                variant={userType === 'family' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setUserType('family')}
                className="px-6"
              >
                For Families
              </Button>
              <Button
                variant={userType === 'professional' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setUserType('professional')}
                className="px-6"
              >
                For Professionals
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search services, professionals, or firms..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-background/80 backdrop-blur-sm border-border/50"
              />
            </div>
            <Button size="lg" className="gap-2 whitespace-nowrap">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>

          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4 text-green-500" />
              Verified Professionals
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="w-4 h-4 text-blue-500" />
              Elite Credentials
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 text-purple-500" />
              White-Glove Service
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="gap-2 bg-primary hover:bg-primary/90 px-8"
            onClick={() => setActiveTab('professionals')}
          >
            Start Exploring
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Professional Cards Data
  const featuredProfessionals = [
    {
      id: '1',
      name: 'Jennifer Walsh',
      title: 'Senior Portfolio Manager',
      firm: 'Walsh Wealth Management',
      location: 'Boston, MA',
      rating: 4.9,
      reviews: 89,
      specialties: ['ESG Investing', 'Risk Management'],
      category: 'Financial Advisor',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      minAssets: '$3M+'
    },
    {
      id: '2',
      name: 'David Kim',
      title: 'International Tax Specialist',
      firm: 'Kim Tax Advisory',
      location: 'Los Angeles, CA',
      rating: 4.8,
      reviews: 124,
      specialties: ['Cross-Border Tax', 'FBAR Compliance'],
      category: 'CPA',
      imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      minAssets: '$1M+'
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      title: 'Estate Planning Counsel',
      firm: 'Rodriguez Law Group',
      location: 'Miami, FL',
      rating: 5.0,
      reviews: 67,
      specialties: ['Dynasty Trusts', 'International Estate'],
      category: 'Attorney',
      imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
      minAssets: '$5M+'
    },
    {
      id: '4',
      name: 'Thomas Anderson',
      title: 'Management Consultant',
      firm: 'Anderson Consulting',
      location: 'Dallas, TX',
      rating: 4.7,
      reviews: 156,
      specialties: ['Family Governance', 'Next-Gen Planning'],
      category: 'Consultant',
      imageUrl: 'https://images.unsplash.com/photo-1527576539890-dfa815648363',
      minAssets: '$2M+'
    }
  ];

  const popularServices = [
    {
      id: '1',
      title: 'Tax Filing & Planning',
      description: 'Comprehensive tax preparation and strategic planning',
      icon: Calculator,
      price: 'From $2,500',
      providers: 47,
      rating: 4.8,
      popular: true
    },
    {
      id: '2',
      title: 'Legal Documentation',
      description: 'Estate planning, trusts, and legal structures',
      icon: Scale,
      price: 'From $5,000',
      providers: 23,
      rating: 4.9,
      popular: true
    },
    {
      id: '3',
      title: 'Portfolio Review',
      description: 'Investment analysis and portfolio optimization',
      icon: TrendingUp,
      price: 'From $1,500',
      providers: 89,
      rating: 4.7,
      popular: false
    },
    {
      id: '4',
      title: 'Insurance Review',
      description: 'Life, disability, and property insurance analysis',
      icon: Shield,
      price: 'From $1,000',
      providers: 34,
      rating: 4.6,
      popular: false
    }
  ];

  const marketplaceResources = [
    {
      id: '1',
      title: 'Family Office Setup Guide',
      type: 'Guide',
      description: 'Complete guide to establishing your family office',
      icon: FileText,
      readTime: '15 min read',
      downloads: 2847
    },
    {
      id: '2',
      title: 'Estate Planning Case Study',
      type: 'Case Study',
      description: 'Real-world example of multi-generational planning',
      icon: BookOpen,
      readTime: '8 min read',
      downloads: 1924
    },
    {
      id: '3',
      title: 'Tax Strategy Webinar',
      type: 'Video',
      description: 'Advanced tax strategies for HNW families',
      icon: Play,
      readTime: '45 min',
      downloads: 3156
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-12">
            <TabsTrigger value="professionals">Professionals</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Featured Professionals Tab */}
          <TabsContent value="professionals" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Featured Professionals</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connect with top-rated advisors, CPAs, attorneys, and consultants serving high-net-worth families
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProfessionals.map((professional) => (
                <Card 
                  key={professional.id}
                  className="cursor-pointer hover-scale transition-all duration-200 border-border/50"
                  onClick={() => navigate(`/marketplace/professional/${professional.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Avatar className="w-12 h-12 border border-border">
                          <AvatarImage src={professional.imageUrl} alt={professional.name} />
                          <AvatarFallback>
                            {professional.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Badge variant="outline" className="text-xs">
                          {professional.category}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="font-bold hover:text-primary transition-colors">
                          {professional.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{professional.title}</p>
                        <p className="text-sm font-medium">{professional.firm}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {professional.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          {professional.rating}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Specialties</div>
                        <div className="flex flex-wrap gap-1">
                          {professional.specialties.slice(0, 2).map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">{professional.minAssets}</span>
                        <Button size="sm" variant="ghost" className="gap-1">
                          View <ChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" className="gap-2">
                <Users className="w-5 h-5" />
                View All Professionals
              </Button>
            </div>
          </TabsContent>

          {/* Popular Services Tab */}
          <TabsContent value="services" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Popular Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the most requested services for tax filing, legal work, portfolio reviews, and insurance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularServices.map((service) => (
                <Card 
                  key={service.id}
                  className="cursor-pointer hover-scale transition-all duration-200 border-border/50"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <service.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold">{service.title}</h3>
                            {service.popular && (
                              <Badge variant="secondary" className="text-xs mt-1">Popular</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{service.price}</div>
                          <div className="text-xs text-muted-foreground">{service.providers} providers</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{service.rating}</span>
                        </div>
                        <Button size="sm" className="gap-1">
                          Get Started <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" className="gap-2">
                <Briefcase className="w-5 h-5" />
                Browse All Services
              </Button>
            </div>
          </TabsContent>

          {/* Marketplace Resources Tab */}
          <TabsContent value="resources" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Marketplace Resources</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Access guides, case studies, and educational videos to help you make informed decisions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {marketplaceResources.map((resource) => (
                <Card 
                  key={resource.id}
                  className="cursor-pointer hover-scale transition-all duration-200 border-border/50"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                        <resource.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      
                      <div>
                        <h3 className="font-bold mb-2">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">{resource.readTime}</span>
                        <div className="text-xs text-muted-foreground">
                          {resource.downloads.toLocaleString()} downloads
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" className="gap-2">
                <GraduationCap className="w-5 h-5" />
                View Resource Library
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}