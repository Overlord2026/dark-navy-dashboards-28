import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, BarChart3, Target, Zap, Globe, MessageSquare, Brain, Shield, Award, DollarSign } from 'lucide-react';

export const MarketingLeadGenAgencyPersonaPage = () => {
  const testimonials = [
    "Our clients finally see exactly where their ad dollars go — and the ROI they're getting.",
    "Automated lead scoring and instant SMS follow-ups boosted our conversion rates by 35%.",
    "Branded dashboards make our agency look like we built custom software."
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
        <title>Marketing & Lead Generation Agency Platform | BFOCFO</title>
        <meta name="description" content="Multi-channel campaign management, AI lead scoring, ROI dashboards, and client reporting — all in one secure platform." />
      </head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23000000%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-6" />
          </div>
          
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Scale Campaign Results and Prove ROI with a Unified Marketing Operations Hub
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            From ad spend tracking to lead scoring, automated follow-ups, and client reporting — manage everything in one platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg hover-scale"
              onClick={() => window.location.href = '/signup?persona=marketing-lead-gen-agency'}
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
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Campaign Creation & Tracking</h3>
              <p className="text-muted-foreground">
                Launch and monitor multi-channel campaigns with real-time analytics.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border animate-fade-in hover-scale" style={{ animationDelay: '0.1s' }}>
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Lead Capture & Qualification</h3>
              <p className="text-muted-foreground">
                Collect, score, and assign leads automatically using AI insights.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border animate-fade-in hover-scale" style={{ animationDelay: '0.2s' }}>
              <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Client Reporting & ROI</h3>
              <p className="text-muted-foreground">
                Provide branded, transparent performance dashboards to clients.
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
              Complete Marketing Operations Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run successful campaigns and prove value to clients
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Globe className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Multi-Channel Campaign Management</h3>
                <p className="text-sm text-muted-foreground">Google Ads, Facebook, LinkedIn integration</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Brain className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">AI Lead Scoring</h3>
                <p className="text-sm text-muted-foreground">Persona segmentation and priority ranking</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <Zap className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Landing Page Builder</h3>
                <p className="text-sm text-muted-foreground">Integrated lead magnets and conversion optimization</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <MessageSquare className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Automated Follow-ups</h3>
                <p className="text-sm text-muted-foreground">Email and SMS nurture sequences</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <BarChart3 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Client ROI Dashboards</h3>
                <p className="text-sm text-muted-foreground">Cohort analysis and performance metrics</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover-scale">
              <DollarSign className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Ad Spend Tracking</h3>
                <p className="text-sm text-muted-foreground">CPL, CPC, CPA metrics and optimization</p>
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
              Advanced features that amplify your marketing results
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Brain className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Linda AI Assistant</h3>
              <p className="text-muted-foreground">Generate ad copy, campaign briefs, and performance summaries</p>
            </div>

            <div className="p-6 bg-card rounded-lg border hover-scale">
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Twilio Integration</h3>
              <p className="text-muted-foreground">SMS/voice lead outreach and automated touchpoints</p>
            </div>

            <div className="p-6 bg-card rounded-lg border hover-scale">
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Lead-to-Sales Closure Engine</h3>
              <p className="text-muted-foreground">Connect marketing performance with client revenue outcomes</p>
            </div>

            <div className="p-6 bg-card rounded-lg border hover-scale">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Built-in Compliance Platform</h3>
              <p className="text-muted-foreground">Data privacy compliance for GDPR and CCPA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-12">
            What Marketing Agencies Say
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
            Scalable Pricing for Growing Agencies
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Plans starting at $59/month — scale campaigns and client accounts with ease.
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
            Turn Marketing Spend into Measurable Growth
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Run campaigns, manage leads, and prove value — all from one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg hover-scale"
              onClick={() => window.location.href = '/signup?persona=marketing-lead-gen-agency'}
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
            <span className="text-sm font-semibold text-foreground">Marketing Compliance Ready</span>
          </div>
          <p className="text-sm text-muted-foreground">
            GDPR and CCPA compliant data processing with secure client reporting
          </p>
        </div>
      </section>
    </div>
  );
};