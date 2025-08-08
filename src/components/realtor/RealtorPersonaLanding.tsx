import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  TrendingUp, 
  FileCheck, 
  Crown, 
  Play,
  Download,
  Building2,
  Shield,
  Calendar,
  BarChart3
} from 'lucide-react';

export const RealtorPersonaLanding: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Building2,
      title: 'Manage All Properties in One Place',
      description: 'Residential, commercial, rentals, and land — track details, documents, and valuations'
    },
    {
      icon: Users,
      title: 'Client Portal Access',
      description: 'Give clients secure, branded portals to view their listings, documents, and updates'
    },
    {
      icon: TrendingUp,
      title: 'Integrated Marketing Engine',
      description: 'Launch and track campaigns directly from your dashboard'
    },
    {
      icon: Calendar,
      title: 'Automated Reminders & Compliance',
      description: 'Never miss a filing, inspection, or renewal'
    },
    {
      icon: Crown,
      title: 'Premium Tools for Growth',
      description: 'Upgrade for lead-to-sale automation, analytics, and unlimited client seats'
    }
  ];

  const features = [
    {
      title: 'Property Management',
      description: 'Complete property tracking and management',
      icon: Home
    },
    {
      title: 'Client Relationship Management',
      description: 'Secure client portals and communication',
      icon: Users
    },
    {
      title: 'Marketing & Analytics',
      description: 'Campaign management and performance tracking',
      icon: BarChart3
    },
    {
      title: 'Compliance & Documentation',
      description: 'Automated compliance and document management',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Boutique Family Office™</span>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <Home className="h-3 w-3 mr-1 text-blue-600" />
            <span className="text-blue-800 font-medium">Realtor Platform</span>
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="outline" className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <Home className="h-3 w-3 mr-1 text-primary" />
            Realtor & Property Manager
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            The Realtor's Digital Command Center
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect clients, manage properties, and grow your business — all in one secure platform built for modern real estate professionals.
          </p>
          
          <div className="bg-card border rounded-xl p-8 mb-12 text-left">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're managing a handful of listings or overseeing a large portfolio, this platform gives you 
              the same professional tools used by elite family offices — customized for real estate professionals 
              who want to deliver exceptional client experiences while growing their business.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => navigate('/realtor-onboarding')}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              Get Started as a Realtor
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="h-4 w-4 mr-2" />
              Watch Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/realtor-marketing-kit')}
            >
              <Download className="h-4 w-4 mr-2" />
              Marketing Kit
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section id="features" className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription className="text-sm">{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Teaser */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Connect to the Professional Network</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Access vetted financial advisors, attorneys, and service providers to better serve your clients' complete wealth needs.
            </p>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/marketplace')}
              className="border-primary/20 hover:bg-primary/5"
            >
              Explore Marketplace
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-to-r from-primary to-accent p-8 rounded-2xl text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Real Estate Business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of realtors who trust our platform to manage their properties and grow their business.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/realtor-onboarding')}
              className="bg-background text-foreground hover:bg-background/90"
            >
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};