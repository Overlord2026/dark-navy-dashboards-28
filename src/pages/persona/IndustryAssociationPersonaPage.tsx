import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, TrendingUp, Award, Shield, BarChart3, Globe, FileText, Brain, MessageSquare, Target, Crown } from 'lucide-react';

export const IndustryAssociationPersonaPage = () => {
  const testimonials = [
    "Offering wealth management tools increased our membership renewal rate by 18% in the first year.",
    "The white-labeled portal makes our association look like we built custom software for our members.",
    "New sponsorship opportunities from financial advisors generated $50K in additional revenue."
  ];

  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <head>
        <title>Industry Association Member Wealth Platform | BFOCFO</title>
        <meta name="description" content="Offer your members powerful wealth management tools as a value-added benefit." />
      </head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23000000%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Users className="w-16 h-16 text-primary mx-auto mb-6" />
          </div>
          
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Deliver Member Value Beyond the Profession
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Offer your members a premium, white-labeled wealth management portal.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg hover-scale"
              onClick={() => window.location.href = '/signup?persona=industry-association'}
            >
              Request Partnership Info
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg hover-scale"
            >
              See Member Benefits
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition Blocks */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border animate-fade-in hover-scale">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Exclusive Member Perk</h3>
              <p className="text-muted-foreground">
                Provide a branded wealth portal to increase retention and member satisfaction.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border animate-fade-in hover-scale" style={{ animationDelay: '0.1s' }}>
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">New Revenue Stream</h3>
              <p className="text-muted-foreground">
                Share in subscription revenue or unlock sponsorship opportunities.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border animate-fade-in hover-scale" style={{ animationDelay: '0.2s' }}>
              <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Brand Positioning</h3>
              <p className="text-muted-foreground">
                Elevate your association as a thought leader in member well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Complete White-Label Solution for Member Engagement
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to offer premium wealth management as a member benefit
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Globe className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Fully White-Labeled Portals</h3>
                <p className="text-sm text-muted-foreground">Your branding, your domain, your member experience</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Compliance-Ready Storage</h3>
                <p className="text-sm text-muted-foreground">Secure collaboration tools for member documents</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Planning Calculators</h3>
                <p className="text-sm text-muted-foreground">Retirement, tax, and estate planning tools</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <MessageSquare className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Marketing Support</h3>
                <p className="text-sm text-muted-foreground">Onboarding materials and promotional resources</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <BarChart3 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Engagement Analytics</h3>
                <p className="text-sm text-muted-foreground">Usage reports and member activity insights</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Member Onboarding</h3>
                <p className="text-sm text-muted-foreground">Seamless integration with existing systems</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrated Tools Callout */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Premium Tools for Your Members
            </h2>
            <p className="text-lg text-muted-foreground">
              Advanced features that add real value to membership
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Secure Portal & Document Vault</h3>
              <p className="text-muted-foreground">Bank-level security for member financial documents and planning</p>
            </div>

            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Target className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">SWAG™ Retirement Roadmap</h3>
              <p className="text-muted-foreground">Comprehensive retirement planning access for all members</p>
            </div>

            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Brain className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">AI-Powered Linda Assistant</h3>
              <p className="text-muted-foreground">Educational content and engagement tools for member value</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-12">
            What Industry Associations Say
          </h2>
          
          <div className="relative h-32 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 animate-fade-in">
              <blockquote className="text-xl text-muted-foreground italic max-w-2xl">
                "{testimonials[currentTestimonial]}"
              </blockquote>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors hover-scale ${
                  index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Models */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Flexible Partnership Models
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the model that works best for your association
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-card rounded-lg border">
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Revenue Share Model</h3>
              <p className="text-muted-foreground mb-4">Earn ongoing commission from member subscriptions</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 15-25% recurring commission</li>
                <li>• No upfront costs</li>
                <li>• Performance-based earnings</li>
              </ul>
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <Award className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Sponsorship Model</h3>
              <p className="text-muted-foreground mb-4">Offer as a sponsored member benefit</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Fixed annual sponsorship fee</li>
                <li>• Full white-label branding</li>
                <li>• Marketing co-op opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Enterprise Partnership Pricing
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Custom enterprise pricing for associations — flexible revenue share models available.
          </p>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover-scale"
          >
            Partner With Us
          </Button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
            Empower Your Members with More Than Industry Resources.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Offer comprehensive wealth management tools that increase retention and create new revenue streams.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg hover-scale"
              onClick={() => window.location.href = '/signup?persona=industry-association'}
            >
              Request Partnership Info
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg hover-scale"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Compliance Footer */}
      <section className="py-8 px-4 bg-muted/50 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Enterprise-Grade Security</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Bank-level encryption and compliance-ready infrastructure for association partnerships
          </p>
        </div>
      </section>
    </div>
  );
};