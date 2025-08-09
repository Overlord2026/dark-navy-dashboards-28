import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, TrendingUp, Calculator, FileText, Users, Lock, BarChart3, Award, DollarSign, BookOpen } from 'lucide-react';

export const PhysicianPersonaPage = () => {
  const testimonials = [
    "Finally have a clear picture of my entire financial situation — saved me hours of spreadsheet tracking.",
    "The physician-specific tax strategies helped me save $15K last year alone.",
    "Having all our estate documents organized gives my family peace of mind."
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
        <title>Physician Wealth Management Portal | BFOCFO</title>
        <meta name="description" content="Comprehensive wealth, tax, and estate tools for physicians in one secure platform." />
      </head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23000000%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
          </div>
          
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            A Private Wealth & Legacy Hub Designed for Physicians
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Protect, grow, and organize your financial life — so you can focus on patient care.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg hover-scale"
              onClick={() => window.location.href = '/signup?persona=physician'}
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
              <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Comprehensive Financial Dashboard</h3>
              <p className="text-muted-foreground">
                Track investments, property, retirement, and liabilities in one secure portal.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border animate-fade-in hover-scale" style={{ animationDelay: '0.1s' }}>
              <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Strategic Tax & Retirement Planning</h3>
              <p className="text-muted-foreground">
                Physician-specific strategies to minimize taxes and optimize retirement timelines.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border animate-fade-in hover-scale" style={{ animationDelay: '0.2s' }}>
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Legacy & Estate Protection</h3>
              <p className="text-muted-foreground">
                Organize wills, trusts, and beneficiary documents in a secure Family Legacy Box™.
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
              Wealth Management Built for Physicians
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized tools that understand the unique financial needs of medical professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Lock className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Bank-Level Security & Compliance</h3>
                <p className="text-sm text-muted-foreground">HIPAA-ready encryption and secure document storage</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <TrendingUp className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">SWAG™ Retirement Roadmap</h3>
                <p className="text-sm text-muted-foreground">Scenario modeling for physician retirement planning</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Calculator className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Physician Tax Optimization</h3>
                <p className="text-sm text-muted-foreground">Strategies specific to medical practice ownership</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Estate Planning Calculators</h3>
                <p className="text-sm text-muted-foreground">Integrated tools and checklists for legacy planning</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <BarChart3 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Investment & Property Tracking</h3>
                <p className="text-sm text-muted-foreground">Consolidated view of all assets and liabilities</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Advisor & CPA Collaboration</h3>
                <p className="text-sm text-muted-foreground">Secure sharing and professional coordination tools</p>
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
              Advanced features designed for physician wealth management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Lock className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Compliance-Ready Document Vault</h3>
              <p className="text-muted-foreground">Secure storage with HIPAA-level protection for all financial documents</p>
            </div>

            <div className="p-6 bg-card rounded-lg border hover-scale">
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">SWAG™ Retirement Roadmap</h3>
              <p className="text-muted-foreground">Physician-specific retirement planning with practice transition modeling</p>
            </div>

            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Secure Communication Hub</h3>
              <p className="text-muted-foreground">Twilio-powered secure messaging and meeting summaries with advisors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-12">
            What Physicians Say
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

      {/* Pricing Teaser */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Professional Wealth Management, Accessible Pricing
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Plans starting at $49/month — physician-specific planning without the advisor markup.
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
            Your Practice Focuses on Health — Your Portal Focuses on Wealth.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Secure, comprehensive wealth management designed specifically for physicians and their families.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg hover-scale"
              onClick={() => window.location.href = '/signup?persona=physician'}
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
            <span className="text-sm font-semibold text-foreground">HIPAA-Ready Security</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Bank-level encryption and compliance-ready document management for medical professionals
          </p>
        </div>
      </section>
    </div>
  );
};