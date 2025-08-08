import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Users, 
  TrendingUp, 
  Shield, 
  Crown, 
  Play,
  Download,
  BarChart3,
  MessageSquare,
  Calendar,
  Star
} from 'lucide-react';

export const CoachPersonaLanding: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Users,
      title: 'Client Management Simplified',
      description: 'All client profiles, documents, and communications in one place'
    },
    {
      icon: BarChart3,
      title: 'Performance Tracking',
      description: 'Custom KPIs, goal tracking, and automated progress reports'
    },
    {
      icon: Shield,
      title: 'Branded Client Portal',
      description: 'Offer a secure, professional platform for your clients'
    },
    {
      icon: Crown,
      title: 'Premium Growth Tools',
      description: 'AI-driven lead generation, marketing automation, and revenue tracking'
    },
    {
      icon: Target,
      title: 'Referral System',
      description: 'Grow your network with built-in referral rewards'
    }
  ];

  const features = [
    {
      title: 'Client Management',
      description: 'Comprehensive client profiles and communication',
      icon: Users
    },
    {
      title: 'Performance Analytics',
      description: 'KPI tracking and progress monitoring',
      icon: BarChart3
    },
    {
      title: 'Communication Hub',
      description: 'Secure messaging and document sharing',
      icon: MessageSquare
    },
    {
      title: 'Practice Growth',
      description: 'Marketing tools and referral system',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Boutique Family Office™</span>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
            <Target className="h-3 w-3 mr-1 text-purple-600" />
            <span className="text-purple-800 font-medium">Coach Platform</span>
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="outline" className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <Target className="h-3 w-3 mr-1 text-primary" />
            Business Coach & Consultant
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            Empower Your Clients. Grow Your Practice. All in One Place.
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The BFO Platform gives business coaches and consultants the tools to manage clients, 
            track performance, and expand your reach — all from one secure dashboard.
          </p>
          
          <div className="bg-card border rounded-xl p-8 mb-12 text-left">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Client Progress Tracker</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Revenue Growth</span>
                    <span className="text-sm text-green-600">+23%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Business KPIs</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="font-semibold">Customer Retention</div>
                    <div className="text-primary">94%</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="font-semibold">Goal Completion</div>
                    <div className="text-primary">87%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => navigate('/coach-onboarding')}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              Get Started as a Business Coach
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
              onClick={() => navigate('/coach-marketing-kit')}
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
          <h2 className="text-3xl font-bold text-center mb-12">Transform Your Coaching Practice</h2>
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

      {/* Success Stories */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Join Successful Coaches & Consultants</h2>
            <p className="text-xl text-muted-foreground mb-8">
              "This platform has completely transformed how I manage my coaching practice. 
              Client progress tracking and automated reports save me hours every week."
            </p>
            <div className="flex items-center justify-center space-x-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">4.9/5 from 500+ coaches</span>
            </div>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/marketplace')}
              className="border-primary/20 hover:bg-primary/5"
            >
              Connect with Other Professionals
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-to-r from-primary to-accent p-8 rounded-2xl text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Coaching Business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of coaches who trust our platform to manage clients and grow their practice.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/coach-onboarding')}
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