import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Building2, 
  FileCheck, 
  Vault, 
  Bot, 
  Palette,
  Users,
  TrendingUp,
  Star,
  Crown
} from 'lucide-react';

export const EliteFamilyOfficePersonaLanding: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Users,
      title: 'Multi-Client Oversight',
      description: 'View and manage all client dashboards from one control panel'
    },
    {
      icon: Building2,
      title: 'Entity & Property Integration',
      description: 'Link entities, properties, and assets for a clear ownership picture'
    },
    {
      icon: FileCheck,
      title: 'Advanced Compliance',
      description: 'Automated filing calendars and alerts for every client'
    },
    {
      icon: Vault,
      title: 'Secure Document Vault',
      description: 'Encrypted storage for legal, tax, and investment records'
    },
    {
      icon: Bot,
      title: 'AI Concierge',
      description: 'Virtual assistant to coordinate meetings, reminders, and reports'
    },
    {
      icon: Palette,
      title: 'White-Label Experience',
      description: 'Brand the portal for your family office'
    }
  ];

  const features = [
    {
      title: 'Client & Entity Management',
      description: 'Comprehensive oversight of family structures',
      icon: Building2
    },
    {
      title: 'Compliance & Reporting',
      description: 'Automated deadlines and regulatory requirements',
      icon: FileCheck
    },
    {
      title: 'Investment Oversight',
      description: 'Portfolio monitoring and performance tracking',
      icon: TrendingUp
    },
    {
      title: 'AI Concierge',
      description: 'Intelligent task automation and coordination',
      icon: Bot
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Crown className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Boutique Family Office™</span>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
            <Crown className="h-3 w-3 mr-1 text-amber-600" />
            <span className="text-amber-800 font-medium">Elite Executive Platform</span>
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="outline" className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <Star className="h-3 w-3 mr-1 text-primary" />
            Elite Family Office Executive
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            The Ultimate Command Center for Multi-Generational Wealth
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Manage multiple families, entities, and assets in one secure, integrated platform.
          </p>
          
          <div className="bg-card border rounded-xl p-8 mb-12 text-left">
            <p className="text-lg text-muted-foreground leading-relaxed">
              As an Elite Family Office Executive, you need a unified platform to oversee complex wealth structures, 
              ensure compliance, and deliver exceptional client service. Our system gives you premium oversight tools, 
              secure collaboration, and automated compliance in a single, intuitive dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => navigate('/elite-family-office-onboarding')}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Comprehensive Wealth Management Platform</h2>
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
            <h2 className="text-3xl font-bold mb-6">Connect to the Elite Network</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join forces with advisors, CPAs, and attorneys to support every dimension of your clients' wealth and health.
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
            <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Family Office?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join elite executives who trust our platform with their most complex wealth structures.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/elite-family-office-onboarding')}
              className="bg-background text-foreground hover:bg-background/90"
            >
              Start Your Elite Experience
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};