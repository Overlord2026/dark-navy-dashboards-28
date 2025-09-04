import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  BarChart3, 
  Shield, 
  Users, 
  FileText,
  ArrowRight,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RetirementConfidenceScorecardPage() {
  const valueProps = [
    {
      icon: Clock,
      title: "Fast & Easy",
      description: "Complete in just 2 minutes with simple questions."
    },
    {
      icon: Target,
      title: "Actionable Results", 
      description: "Get a clear score from 0–100 showing your retirement confidence."
    },
    {
      icon: TrendingUp,
      title: "Your Next Step",
      description: "See exactly how to boost your score with a customized SWAG™ Retirement Roadmap."
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: "10 simple questions designed for pre-retirees and retirees"
    },
    {
      icon: BarChart3,
      title: "Instant scoring with easy-to-read results"
    },
    {
      icon: FileText,
      title: "Covers income planning, expenses, Social Security, investments, taxes, healthcare, and more"
    },
    {
      icon: TrendingUp,
      title: "Direct integration with SWAG™ Retirement Roadmap for deeper planning"
    },
    {
      icon: Users,
      title: "Optional follow-up with a licensed fiduciary advisor"
    },
    {
      icon: Shield,
      title: "Educational purpose only — fully compliant with SEC/FINRA guidance"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Answer 10 quick questions about your retirement readiness"
    },
    {
      number: "2", 
      title: "Get your Retirement Confidence Score instantly"
    },
    {
      number: "3",
      title: "Request your SWAG™ Retirement Roadmap to fill any gaps"
    },
    {
      number: "4",
      title: "Retire once. Stay retired."
    }
  ];

  const tools = [
    {
      title: "SWAG™ Retirement Roadmap",
      description: "Full Monte Carlo analysis, stress testing, and GPS-style planning phases"
    },
    {
      title: "Secure Legacy Vault™",
      description: "Organize your estate documents, beneficiaries, and digital assets"
    },
    {
      title: "Retirement Confidence Scorecard™",
      description: "Baseline your readiness before deeper planning"
    },
    {
      title: "Fiduciary Duty Principles™",
      description: "Always in your best interest"
    }
  ];

  const testimonials = [
    {
      quote: "This scorecard made me realize I needed to plan for healthcare costs. The SWAG™ Roadmap showed me exactly how.",
      author: "Mark T."
    },
    {
      quote: "I thought I was ready, but my score was 55/100. Now I have a plan to reach 100% confidence.",
      author: "Susan P."
    },
    {
      quote: "Quick, clear, and a great way to start the conversation with my spouse.",
      author: "David R."
    }
  ];

  return (
    <div className="min-h-screen bg-bfo-navy">
      {/* Hero Section */}
      <section className="relative bg-bfo-navy py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Are You Ready to Retire and Stay Retired?
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-4xl mx-auto mb-8">
            Take our 2-minute, 10-question Retirement Confidence Scorecard™ to see where you stand — and discover the steps to make your money last to age 100 and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-bfo-gold text-black hover:bg-bfo-gold/90"
            >
              <Link to="/scorecard/start?tool=retirement-confidence&persona=client-family">
                Start My Scorecard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black">
              <Link to="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition Blocks */}
      <section className="py-16 px-4 bg-bfo-navy">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => (
              <Card key={index} className="text-center bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20 hover:shadow-bfo-gold/30 transition-all">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-bfo-gold/20 rounded-full flex items-center justify-center">
                    <prop.icon className="h-8 w-8 text-bfo-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{prop.title}</h3>
                  <p className="text-white/70">{prop.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-4 bg-[hsl(210_65%_15%)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Key Features
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Everything you need to assess your retirement confidence
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-[hsl(210_65%_13%)] rounded-lg border border-bfo-gold/30">
                <feature.icon className="h-6 w-6 text-bfo-gold mt-1 flex-shrink-0" />
                <p className="text-white">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-bfo-navy">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-white/70">
              Simple steps to retirement confidence
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-bfo-gold rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">{step.number}</span>
                </div>
                <p className="text-white font-medium">{step.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrated Tools Callout */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Integrated Tools
            </h2>
            <p className="text-lg text-muted-foreground">
              Your complete retirement planning ecosystem
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{tool.title}</h3>
                  <p className="text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-foreground mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <footer className="text-muted-foreground">— {testimonial.author}</footer>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-muted">
            <CardContent className="p-8">
              <Badge variant="secondary" className="mb-4">Free Tool</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Start Free, Plan Smart
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                The Retirement Confidence Scorecard™ is free — and your SWAG™ Retirement Roadmap is available starting at $497 or complimentary for qualified clients.
              </p>
              <Button asChild size="lg" variant="outline">
                <Link to="/services/swag-retirement-roadmap">Get My Roadmap</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Retire Once. Stay Retired.
          </h2>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
            Know your score, close your gaps, and plan your future with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90"
            >
              <Link to="/scorecard/start?tool=retirement-confidence&persona=client-family">
                Start My Scorecard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/services/swag-retirement-roadmap">Learn More About SWAG™</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}