import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Target, Brain, Calendar, FileText, CreditCard, Shield, MessageSquare, Phone, TrendingUp } from 'lucide-react';

export const CoachConsultantPersonaPage = () => {
  const testimonials = [
    "I save 5+ hours a week on admin tasks — more time with clients!",
    "The AI follow-up summaries are a game changer for my coaching practice.",
    "I can track progress and send reminders without juggling multiple tools."
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
        <title>Coach & Consultant Practice Platform | BFOCFO</title>
        <meta name="description" content="Client onboarding, goal tracking, AI follow-ups, and payment tools for coaches and consultants — all in one secure platform." />
      </head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23000000%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Target className="w-16 h-16 text-primary mx-auto mb-6" />
          </div>
          
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Grow Your Coaching & Consulting Business with an All-in-One Client Success Platform
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            From onboarding to goal tracking, session notes, and payment management — everything you need in one secure, AI-powered hub.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
              onClick={() => window.location.href = '/signup?persona=coach-consultant'}
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
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Client Onboarding & Profiles</h3>
              <p className="text-muted-foreground">
                Quickly capture client goals, background, and preferences in a secure profile.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Goal & Progress Tracking</h3>
              <p className="text-muted-foreground">
                Set milestones, track results, and share visual progress updates.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg shadow-sm border">
              <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">AI-Powered Session Support</h3>
              <p className="text-muted-foreground">
                Auto-generate follow-up notes, resources, and action items from each meeting.
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
              Everything You Need to Scale Your Practice
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for coaches and consultants
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
              <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Customizable Client Intake Forms</h3>
                <p className="text-sm text-muted-foreground">Streamline onboarding with tailored questionnaires</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
              <Calendar className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Session Scheduling with Reminders</h3>
                <p className="text-sm text-muted-foreground">Integrated calendar with automated notifications</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
              <Brain className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">AI-Generated Meeting Summaries</h3>
                <p className="text-sm text-muted-foreground">Auto-create notes and resource recommendations</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
              <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Goal Tracking Dashboard</h3>
                <p className="text-sm text-muted-foreground">Visual progress tracking with milestone celebrations</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
              <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Secure Document Sharing</h3>
                <p className="text-sm text-muted-foreground">Collaboration tools with privacy protection</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
              <CreditCard className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Built-in Invoicing & Payments</h3>
                <p className="text-sm text-muted-foreground">Streamlined billing with payment tracking</p>
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
              <p className="text-muted-foreground">Session prep, follow-ups, and personalized content generation</p>
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Twilio Integration</h3>
              <p className="text-muted-foreground">SMS/voice reminders and quick client touchpoints</p>
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Lead-to-Sales Closure Engine</h3>
              <p className="text-muted-foreground">For consultants managing their own client acquisition funnels</p>
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <Target className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">SWAG™ Retirement Roadmap</h3>
              <p className="text-muted-foreground">Optional tool for consultants offering financial wellness guidance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-12">
            What Coaches & Consultants Say
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
            Simple, Scalable Pricing
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Plans starting at $29/month — scale your coaching business with tools that grow with you.
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
            Empower Your Coaching & Consulting Practice
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Streamline client management, boost engagement, and scale with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
              onClick={() => window.location.href = '/signup?persona=coach-consultant'}
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
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Compliance Ready</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Fully compliant with GDPR, CCPA, and data privacy regulations
          </p>
        </div>
      </section>
    </div>
  );
};