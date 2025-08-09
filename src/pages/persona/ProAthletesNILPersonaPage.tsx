import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy, Shield, Target, FileText, TrendingUp, Calculator, Bell, Brain, Users, Lock, Award, DollarSign } from 'lucide-react';

export const ProAthletesNILPersonaPage = () => {
  const testimonials = [
    "Having all my contracts and financial data organized gives me confidence in every negotiation.",
    "The early retirement planning helped me understand exactly what I need to save during my playing years.",
    "Never miss a payment deadline or contract renewal date — the alerts saved me from losing out on bonuses."
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
        <title>Professional Athlete & NIL Wealth Platform | BFOCFO</title>
        <meta name="description" content="Contracts, investments, taxes, and estate tools for professional athletes and NIL earners — all in one secure hub." />
      </head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23000000%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
          </div>
          
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Secure Your Future — On and Off the Field
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            From peak-earning years to post-career planning — take control of your wealth, contracts, and legacy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg hover-scale"
              onClick={() => window.location.href = '/signup?persona=pro-athletes-nil'}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg hover-scale"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition Blocks */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border animate-fade-in hover-scale">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Manage Contracts & Endorsements</h3>
              <p className="text-muted-foreground">
                Track deal terms, payments, and renewal dates in one secure place.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border animate-fade-in hover-scale" style={{ animationDelay: '0.1s' }}>
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Plan for Long-Term Wealth</h3>
              <p className="text-muted-foreground">
                Model investments, taxes, and retirement scenarios tailored for short career spans.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border animate-fade-in hover-scale" style={{ animationDelay: '0.2s' }}>
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Protect Your Legacy</h3>
              <p className="text-muted-foreground">
                Organize estate, trust, and family protection documents in the Family Legacy Box™.
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
              Wealth Management Built for Athletic Careers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized tools that understand the unique financial challenges of professional athletes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">SWAG™ Retirement Roadmap</h3>
                <p className="text-sm text-muted-foreground">Early retirement modeling for short career spans</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">NIL & Endorsement Tracker</h3>
                <p className="text-sm text-muted-foreground">Manage all contracts, deals, and payment schedules</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <TrendingUp className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Income Volatility Planning</h3>
                <p className="text-sm text-muted-foreground">Tools designed for variable, high-earning periods</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Lock className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Secure Document Vault</h3>
                <p className="text-sm text-muted-foreground">Restricted access controls for sensitive contracts</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Brain className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">AI-Powered Linda Assistant</h3>
                <p className="text-sm text-muted-foreground">Meeting summaries and contract review notes</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Calculator className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Athlete Tax Optimization</h3>
                <p className="text-sm text-muted-foreground">Strategies for multi-state earnings and endorsements</p>
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
              Integrated Professional Tools
            </h2>
            <p className="text-lg text-muted-foreground">
              Advanced features designed for the unique needs of professional athletes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Compliance Platform</h3>
              <p className="text-muted-foreground">Secure handling of contracts and sensitive financial documents</p>
            </div>

            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Bell className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Twilio-Powered Alerts</h3>
              <p className="text-muted-foreground">Never miss contract deadlines, payments, or renewal dates</p>
            </div>

            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Calculator className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Built-in Calculators</h3>
              <p className="text-muted-foreground">Investment, estate, and tax planning tools all in one platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-12">
            What Professional Athletes Say
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

      {/* Career Planning Spotlight */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Plan for Every Stage of Your Career
            </h2>
            <p className="text-lg text-muted-foreground">
              From rookie contracts to post-career business ventures
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-card rounded-lg border">
              <Trophy className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Peak Earning Years</h3>
              <p className="text-muted-foreground mb-4">Maximize and protect your highest income periods</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Contract negotiation data</li>
                <li>• Tax optimization strategies</li>
                <li>• Investment diversification</li>
              </ul>
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <Target className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Post-Career Transition</h3>
              <p className="text-muted-foreground mb-4">Prepare for life after professional sports</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Early retirement modeling</li>
                <li>• Business venture planning</li>
                <li>• Legacy wealth protection</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Investment-Grade Wealth Management
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Plans starting at $99/month — protect your career earnings and build your future.
          </p>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover-scale"
          >
            View Plans & Features
          </Button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
            Your Career Has a Season — Your Wealth Should Last a Lifetime.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Take control of your contracts, investments, and legacy with tools built for professional athletes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg hover-scale"
              onClick={() => window.location.href = '/signup?persona=pro-athletes-nil'}
            >
              Start Now
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
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Athlete-Grade Security</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Bank-level encryption and compliance-ready document management for professional athletes
          </p>
        </div>
      </section>
    </div>
  );
};