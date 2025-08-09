import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, Users, Brain, Map, Star, Calendar, FileText, Shield, MessageSquare, TrendingUp, Award } from 'lucide-react';

export const RealtorRealEstatePersonaPage = () => {
  const testimonials = [
    "I converted more leads in my first month using the AI lead scoring than in the previous three combined.",
    "The property management dashboard keeps every transaction step in order — no missed deadlines.",
    "Clients love the instant updates and personalized reports."
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
        <title>Real Estate Agent & Realtor Business Platform | BFOCFO</title>
        <meta name="description" content="Lead management, property tracking, AI client updates, and compliance tools for real estate professionals — all in one secure platform." />
      </head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23000000%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Home className="w-16 h-16 text-primary mx-auto mb-6" />
          </div>
          
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Close More Deals and Manage Your Real Estate Business in One Powerful Platform
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            From lead capture to client communication, property tracking, and closing coordination — streamline your workflow with AI-driven tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
              onClick={() => window.location.href = '/signup?persona=realtor-real-estate-professional'}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg"
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
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Lead Capture & Nurturing</h3>
              <p className="text-muted-foreground">
                Collect, score, and follow up with buyer and seller leads automatically.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border">
              <Map className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Property & Transaction Management</h3>
              <p className="text-muted-foreground">
                Track listings, showings, offers, and closing steps in one place.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border">
              <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">AI-Powered Client Communication</h3>
              <p className="text-muted-foreground">
                Generate personalized property updates, follow-ups, and market insights.
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
              Everything You Need to Succeed in Real Estate
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for modern real estate professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
              <Map className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Integrated MLS Data Feed</h3>
                <p className="text-sm text-muted-foreground">Real-time property tracking and market data</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
              <Star className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">AI-Driven Lead Scoring</h3>
                <p className="text-sm text-muted-foreground">Priority ranking and automated follow-up</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
              <Calendar className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Automated Showing Scheduling</h3>
                <p className="text-sm text-muted-foreground">Smart calendar with client reminders</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
              <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Secure Document Vault</h3>
                <p className="text-sm text-muted-foreground">Contracts, disclosures, and transaction records</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
              <TrendingUp className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Pipeline Kanban Board</h3>
                <p className="text-sm text-muted-foreground">Track buyer and seller clients visually</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
              <MessageSquare className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Marketing Automation</h3>
                <p className="text-sm text-muted-foreground">Listings and open house promotion</p>
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
              Advanced features that work seamlessly together
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-card rounded-lg border">
              <Brain className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Linda AI Assistant</h3>
              <p className="text-muted-foreground">Create property descriptions, follow-up messages, and market reports</p>
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Twilio Integration</h3>
              <p className="text-muted-foreground">Instant SMS/voice updates to clients about properties and showings</p>
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Lead-to-Sales Closure Engine</h3>
              <p className="text-muted-foreground">Track every lead from inquiry to signed contract</p>
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Built-in Compliance Platform</h3>
              <p className="text-muted-foreground">Meet state and brokerage record-keeping regulations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-12">
            What Real Estate Professionals Say
          </h2>
          
          <div className="relative h-32 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-500">
              <blockquote className="text-xl text-muted-foreground italic max-w-2xl">
                "{testimonials[currentTestimonial]}"
              </blockquote>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
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
            Flexible Pricing for Growing Agents
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Plans starting at $39/month — upgrade as your portfolio grows.
          </p>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View Plans & Features
          </Button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
            Streamline Your Real Estate Success
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Manage leads, clients, and closings with a platform built for modern real estate professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
              onClick={() => window.location.href = '/signup?persona=realtor-real-estate-professional'}
            >
              Start Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg"
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
            <span className="text-sm font-semibold text-foreground">Real Estate Compliance Ready</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Meeting state and brokerage record-keeping regulations with secure transaction management
          </p>
        </div>
      </section>
    </div>
  );
};