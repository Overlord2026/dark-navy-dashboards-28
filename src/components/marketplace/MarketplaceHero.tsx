import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Star, Users, TrendingUp, ArrowRight, Shield, Award, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MarketplaceHero() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Premium Family Office Network
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Family Office
                <span className="block text-primary">Marketplace</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                Access elite financial advisors, wealth managers, and specialized professionals 
                exclusively serving high-net-worth families and ultra-high-net-worth individuals.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search advisors, CPAs, attorneys..." 
                  className="pl-10 h-12 bg-background/80 backdrop-blur-sm border-border/50"
                />
              </div>
              <Button size="lg" className="gap-2 whitespace-nowrap">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap gap-6 text-sm">
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

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={() => navigate('/marketplace/advisors')}
              >
                Browse Advisors
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/marketplace/professionals')}
              >
                View All Professionals
              </Button>
            </div>
          </div>

          {/* Hero Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-primary" />
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Verified Advisors</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <Badge variant="secondary">Growing</Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">$50B+</div>
                  <div className="text-sm text-muted-foreground">Assets Under Management</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <Badge variant="secondary">Excellence</Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="w-8 h-8 text-blue-500" />
                  <Badge variant="secondary">Secure</Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">Background Verified</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}