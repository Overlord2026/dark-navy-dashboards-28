import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoldButton, GoldOutlineButton, GoldRouterLink, GoldOutlineRouterLink } from '@/components/ui/brandButtons';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calculator, Users, TrendingUp, Shield, Heart, Briefcase, Building, Activity, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsEvents } from '@/analytics/events';

const personaCards = [
  {
    id: 'client-family',
    title: 'Client & Family',
    description: 'Comprehensive wealth management and legacy planning for families',
    icon: Users,
    color: 'bg-blue-500',
    features: ['Family Legacy Vault', 'Goal Tracking', 'SWAG™ Retirement Roadmap'],
    route: '/persona-preview/client-family',
    badge: 'Most Popular'
  },
  {
    id: 'advisor',
    title: 'Financial Advisor',
    description: 'Advanced tools for client management and portfolio analysis',
    icon: TrendingUp,
    color: 'bg-green-500',
    features: ['CRM Dashboard', 'Client Analytics', 'Marketing Materials'],
    route: '/persona-preview/advisor',
    badge: 'Professional'
  },
  {
    id: 'accountant',
    title: 'CPA & Accountant',
    description: 'Tax optimization and compliance tools for accounting professionals',
    icon: Calculator,
    color: 'bg-purple-500',
    features: ['Tax Planning', 'Entity Management', 'Compliance Tools'],
    route: '/persona-preview/accountant'
  },
  {
    id: 'attorney',
    title: 'Estate Attorney',
    description: 'Estate planning and document management for legal professionals',
    icon: Shield,
    color: 'bg-amber-500',
    features: ['Document Vault', 'Estate Planning', 'Client Portal'],
    route: '/persona-preview/attorney'
  },
  {
    id: 'insurance',
    title: 'Insurance Professional',
    description: 'Risk management and insurance planning tools',
    icon: Heart,
    color: 'bg-red-500',
    features: ['Policy Management', 'Risk Analysis', 'Client Needs Assessment'],
    route: '/persona-preview/insurance'
  },
  {
    id: 'coach',
    title: 'Coach & Consultant',
    description: 'Financial coaching and consulting practice management',
    icon: Star,
    color: 'bg-indigo-500',
    features: ['Client Programs', 'Progress Tracking', 'Resource Library'],
    route: '/persona-preview/coach'
  }
];

const calculatorCards = [
  {
    title: 'Value Calculator',
    description: 'Compare AUM fees vs value-based pricing',
    icon: Calculator,
    route: '/value-calculator',
    color: 'from-blue-500 to-cyan-500',
    estimatedTime: '2 min'
  },
  {
    title: 'SWAG™ Retirement Analyzer',
    description: 'Complete retirement readiness analysis',
    icon: TrendingUp,
    route: '/retirement-analyzer',
    color: 'from-green-500 to-emerald-500',
    estimatedTime: '5 min'
  },
  {
    title: 'Income Gap Calculator',
    description: 'Identify your retirement income shortfall',
    icon: Activity,
    route: '/analyzer/retirement-income-gap',
    color: 'from-purple-500 to-violet-500',
    estimatedTime: '3 min'
  }
];

export default function WelcomePage() {
  const trackPersonaClick = (personaId: string) => {
    analyticsEvents.trackNavigationClick(
      `persona_${personaId}`,
      `/persona-preview/${personaId}`,
      'persona_grid'
    );
  };

  const trackCalculatorClick = (calculatorName: string, route: string) => {
    analyticsEvents.trackNavigationClick(
      `calculator_${calculatorName.toLowerCase().replace(/\s+/g, '_')}`,
      route,
      'calculator_grid'
    );
  };

  React.useEffect(() => {
    analyticsEvents.trackPageView({
      page_name: 'welcome',
      page_path: '/welcome',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Health + Wealth
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Your comprehensive family office platform for managing wealth, health, and legacy across generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <GoldRouterLink to="/value-calculator" className="text-lg px-8 py-3">
              Try the Calculator
              <Calculator className="ml-2 h-5 w-5" />
            </GoldRouterLink>
            <GoldOutlineRouterLink to="/persona-preview/client-family" className="text-lg px-8 py-3">
              Explore Platform
              <ArrowRight className="ml-2 h-5 w-5" />
            </GoldOutlineRouterLink>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Family-Centric</CardTitle>
              <CardDescription>
                Built for multi-generational wealth management and family coordination
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Bank-Grade Security</CardTitle>
              <CardDescription>
                Enterprise-level security for your most sensitive financial and health information
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Advanced analytics and recommendations powered by our SWAG™ methodology
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Calculators Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Try Our Calculators
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant insights into your financial situation with our free calculators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {calculatorCards.map((calculator) => {
              const IconComponent = calculator.icon;
              return (
                <Link 
                  key={calculator.title}
                  to={calculator.route}
                  onClick={() => trackCalculatorClick(calculator.title, calculator.route)}
                  className="group"
                >
                  <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${calculator.color} flex items-center justify-center mb-4`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{calculator.title}</CardTitle>
                        <Badge variant="secondary">{calculator.estimatedTime}</Badge>
                      </div>
                      <CardDescription className="text-base">
                        {calculator.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Try Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Persona Selection */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Path
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each persona offers tailored tools and workflows designed for your specific needs and role
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personaCards.map((persona) => {
              const IconComponent = persona.icon;
              return (
                <Link 
                  key={persona.id}
                  to={persona.route}
                  onClick={() => trackPersonaClick(persona.id)}
                  className="group"
                >
                  <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${persona.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        {persona.badge && (
                          <Badge variant="default">{persona.badge}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{persona.title}</CardTitle>
                      <CardDescription className="text-base">
                        {persona.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {persona.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Explore
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="text-center shadow-lg bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl md:text-3xl mb-4">
              Ready to Transform Your Financial Future?
            </CardTitle>
            <CardDescription className="text-lg max-w-2xl mx-auto">
              Join thousands of families and professionals who trust our platform for comprehensive wealth and health management.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GoldRouterLink to="/auth/signup" className="text-lg px-8 py-3">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </GoldRouterLink>
              <GoldOutlineRouterLink to="/retirement-analyzer" className="text-lg px-8 py-3">
                Try Demo First
              </GoldOutlineRouterLink>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sticky CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <GoldRouterLink 
          to="/value-calculator"
          className="shadow-lg hover:shadow-xl transition-shadow rounded-full px-6 py-3"
          onClick={() => analyticsEvents.trackNavigationClick('sticky_calculator_cta', '/value-calculator', 'sticky_button')}
        >
          <Calculator className="mr-2 h-5 w-5" />
          Try Calculator
        </GoldRouterLink>
      </div>
    </div>
  );
}