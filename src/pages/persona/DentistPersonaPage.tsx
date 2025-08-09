import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Smile, Calculator, TrendingUp, Shield, Lock, FileText, Users, BarChart3, Brain, Award, DollarSign, Target } from 'lucide-react';

export const DentistPersonaPage = () => {
  const testimonials = [
    "The dental-specific tax strategies saved me thousands — I wish I'd found this platform years ago.",
    "Finally have a clear picture of when I can retire without worrying about practice transition.",
    "Having all our estate documents organized in one place gives my family peace of mind."
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
        <title>Dentist Wealth Management Portal | BFOCFO</title>
        <meta name="description" content="Wealth, tax, and estate planning tools designed for dental professionals." />
      </head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23000000%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Smile className="w-16 h-16 text-primary mx-auto mb-6" />
          </div>
          
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Build & Protect Your Wealth Beyond the Dental Chair
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            One portal for your investments, retirement, tax, and estate planning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg hover-scale"
              onClick={() => window.location.href = '/signup?persona=dentist'}
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
              <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Dental-Specific Tax Optimization</h3>
              <p className="text-muted-foreground">
                Leverage deductions and strategies unique to practice owners.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border animate-fade-in hover-scale" style={{ animationDelay: '0.1s' }}>
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Retirement & Investment Planning</h3>
              <p className="text-muted-foreground">
                Model your path to financial independence.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border animate-fade-in hover-scale" style={{ animationDelay: '0.2s' }}>
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Estate & Legacy Tools</h3>
              <p className="text-muted-foreground">
                Keep your most important documents and plans organized.
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
              Wealth Management Designed for Dental Professionals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized tools that understand the unique financial landscape of dental practice ownership
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Lock className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Secure Document Vault</h3>
                <p className="text-sm text-muted-foreground">Encrypted storage for legal and financial documents</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">SWAG™ Retirement Roadmap</h3>
                <p className="text-sm text-muted-foreground">Growth projections and retirement planning scenarios</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <DollarSign className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Dental Tax Savings Scenarios</h3>
                <p className="text-sm text-muted-foreground">Practice-specific deductions and optimization strategies</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <BarChart3 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Property & Investment Tracking</h3>
                <p className="text-sm text-muted-foreground">Comprehensive view of practice and personal assets</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Advisor Collaboration</h3>
                <p className="text-sm text-muted-foreground">Secure sharing with financial, legal, and tax advisors</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Practice Transition Planning</h3>
                <p className="text-sm text-muted-foreground">Exit strategies and succession planning tools</p>
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
              Advanced features designed for dental practice wealth management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Compliance Platform</h3>
              <p className="text-muted-foreground">Secure sharing with HIPAA-level protection for sensitive financial data</p>
            </div>

            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Calculator className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Estate Planning Calculators</h3>
              <p className="text-muted-foreground">Comprehensive tools for legacy and succession planning</p>
            </div>

            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Brain className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Linda AI Assistant</h3>
              <p className="text-muted-foreground">Meeting summaries, follow-ups, and financial planning insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-12">
            What Dental Professionals Say
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
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Plans starting at $49/month — one flat fee for all your wealth tools.
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
            Precision Matters in Dentistry — And in Your Financial Life.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Build, protect, and optimize your wealth with tools designed specifically for dental professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg hover-scale"
              onClick={() => window.location.href = '/signup?persona=dentist'}
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
            <span className="text-sm font-semibold text-foreground">Professional-Grade Security</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Bank-level encryption and compliance-ready document management for dental professionals
          </p>
        </div>
      </section>
    </div>
  );
};