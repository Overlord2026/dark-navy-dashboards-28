import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronRight, Search, Bookmark, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Professional {
  id: string;
  name: string;
  title: string;
  company: string;
  rating: number;
  specialties: string[];
  isBookmarked: boolean;
  image: string;
}

interface MarketplaceSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  professionals: Professional[];
}

export function SegmentedMarketplace() {
  const { userProfile } = useUser();
  const [activeTab, setActiveTab] = useState('wealth');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedPros, setBookmarkedPros] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Professional[]>([]);

  // Mock data - would come from API
  const sections: MarketplaceSection[] = [
    {
      id: 'wealth',
      title: 'Wealth Management',
      icon: '💼',
      description: 'Financial advisors, private bankers, and wealth strategists',
      professionals: [
        {
          id: '1',
          name: 'Sarah Johnson',
          title: 'Private Wealth Advisor',
          company: 'Goldman Sachs Private Wealth',
          rating: 4.9,
          specialties: ['Estate Planning', 'Tax Optimization', 'Investment Management'],
          isBookmarked: false,
          image: '/placeholder.svg'
        },
        {
          id: '2',
          name: 'Michael Chen',
          title: 'Family Office Advisor',
          company: 'Morgan Stanley',
          rating: 4.8,
          specialties: ['Multi-Generation Planning', 'Philanthropy', 'Alternative Investments'],
          isBookmarked: true,
          image: '/placeholder.svg'
        }
      ]
    },
    {
      id: 'tax',
      title: 'Tax & Accounting',
      icon: '📊',
      description: 'CPAs, tax attorneys, and financial consultants',
      professionals: [
        {
          id: '3',
          name: 'Robert Martinez',
          title: 'Tax Partner',
          company: 'KPMG',
          rating: 4.7,
          specialties: ['Corporate Tax', 'International Tax', 'Estate Tax'],
          isBookmarked: false,
          image: '/placeholder.svg'
        }
      ]
    },
    {
      id: 'legal',
      title: 'Legal Services',
      icon: '⚖️',
      description: 'Estate attorneys, business lawyers, and legal advisors',
      professionals: [
        {
          id: '4',
          name: 'Amanda Thompson',
          title: 'Estate Planning Attorney',
          company: 'Thompson & Associates',
          rating: 4.9,
          specialties: ['Trusts', 'Wills', 'Business Succession'],
          isBookmarked: true,
          image: '/placeholder.svg'
        }
      ]
    },
    {
      id: 'insurance',
      title: 'Insurance & Risk',
      icon: '🛡️',
      description: 'Insurance specialists and risk management experts',
      professionals: []
    },
    {
      id: 'concierge',
      title: 'Concierge Services',
      icon: '🌟',
      description: 'Luxury services, travel, and lifestyle management',
      professionals: []
    }
  ];

  const toggleBookmark = (professionalId: string) => {
    setBookmarkedPros(prev => 
      prev.includes(professionalId) 
        ? prev.filter(id => id !== professionalId)
        : [...prev, professionalId]
    );
  };

  const handleViewProfessional = (professional: Professional) => {
    setRecentlyViewed(prev => {
      const updated = prev.filter(p => p.id !== professional.id);
      return [professional, ...updated].slice(0, 5);
    });
  };

  const currentSection = sections.find(s => s.id === activeTab);
  const filteredProfessionals = currentSection?.professionals.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const getWelcomeMessage = () => {
    const firstName = userProfile?.firstName || 'Valued Client';
    const role = userProfile?.role;
    
    if (role === 'client') {
      return `Welcome, ${firstName}!`;
    } else if (role === 'advisor') {
      return `Your Professional Network, ${firstName}`;
    } else {
      return `Family Office Marketplace`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header Section */}
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {getWelcomeMessage()}
              </h1>
              <p className="text-muted-foreground text-lg">
                Your trusted network of family office professionals
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Quick Match
              </Button>
              <Button size="sm">
                Schedule Consultation
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search professionals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Your Team */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Trusted Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    💼
                  </div>
                  <div>
                    <p className="font-medium text-sm">Primary Advisor</p>
                    <p className="text-xs text-muted-foreground">Sarah Johnson</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    📊
                  </div>
                  <div>
                    <p className="font-medium text-sm">Tax Advisor</p>
                    <p className="text-xs text-muted-foreground">Robert Martinez</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recently Viewed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recentlyViewed.map(prof => (
                    <div key={prof.id} className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-muted"></div>
                      <span className="truncate">{prof.name}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Schedule a Call
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Request Proposal
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Upload Documents
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 mb-8">
                {sections.map(section => (
                  <TabsTrigger key={section.id} value={section.id} className="text-xs">
                    <span className="mr-1">{section.icon}</span>
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {sections.map(section => (
                <TabsContent key={section.id} value={section.id} className="space-y-6">
                  <div className="text-center py-6">
                    <div className="text-4xl mb-3">{section.icon}</div>
                    <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                    <p className="text-muted-foreground mb-6">{section.description}</p>
                  </div>

                  {/* Professionals Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProfessionals.map(professional => (
                      <Card 
                        key={professional.id} 
                        className="hover:shadow-lg transition-shadow cursor-pointer group"
                        onClick={() => handleViewProfessional(professional)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-muted"></div>
                              <div>
                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                  {professional.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">{professional.title}</p>
                                <p className="text-xs text-muted-foreground">{professional.company}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(professional.id);
                                }}
                              >
                                <Bookmark 
                                  className={`h-4 w-4 ${
                                    bookmarkedPros.includes(professional.id) 
                                      ? 'fill-current text-primary' 
                                      : ''
                                  }`} 
                                />
                              </Button>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-current text-yellow-400" />
                                <span className="text-sm font-medium">{professional.rating}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-1">
                              {professional.specialties.slice(0, 3).map(specialty => (
                                <Badge key={specialty} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                              <Button variant="outline" size="sm">
                                View Profile
                              </Button>
                              <Button size="sm">
                                Connect
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredProfessionals.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold mb-2">No professionals found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery 
                          ? "Try adjusting your search criteria" 
                          : "We're building our network in this category"
                        }
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}