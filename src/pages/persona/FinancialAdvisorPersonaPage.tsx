import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  MessageSquare,
  BarChart3,
  FileText,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinancialAdvisorPersonaPage() {
  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "SWAG™ Retirement Roadmap",
      description: "Advanced scenario modeling and stress testing for comprehensive retirement planning"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Lead-to-Close CRM",
      description: "Integrated SMS/voice communication with automated follow-up sequences"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Marketing Compliance",
      description: "SEC/FINRA approval workflows with 7-year retention archive"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "CE Tracking & Certificates",
      description: "Automated continuing education management with certificate generation"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Deck Hub",
      description: "Consistent client presentations with compliance-approved templates"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Role-Based Access",
      description: "Secure audit logs and granular permissions for team management"
    }
  ];

  const tools = [
    {
      title: "Linda AI Assistant",
      description: "AI-powered summaries, scripts, and training recommendations"
    },
    {
      title: "Compliance Platform",
      description: "Built-in 7-year retention defaults for SEC/FINRA requirements"
    },
    {
      title: "Expert Marketplace",
      description: "Vetted network of legal, accounting, and tax professionals"
    }
  ];

  const testimonials = [
    {
      quote: "Our team runs 30% more efficiently with streamlined workflows and automated compliance.",
      author: "Sarah Chen",
      role: "Senior Partner",
      firm: "Wealth Strategies Group"
    },
    {
      quote: "Compliance reviews that used to take days now happen in hours. Game changer.",
      author: "Michael Rodriguez",
      role: "Compliance Officer",
      firm: "Advisory Partners LLC"
    },
    {
      quote: "The career development tools helped us scale from 3 to 15 advisors seamlessly.",
      author: "Jennifer Walsh",
      role: "Managing Director",
      firm: "Family Wealth Advisors"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/wealth-office-hero.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Run Your Advisory Firm
              <span className="block text-primary">on Rails</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Workflows, compliance, training, and client engagement — all in one hub.
              Transform your practice with enterprise-grade tools designed for growing advisory firms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/signup?persona=financial-advisor">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link to="#demo">
                  <Play className="mr-2 h-5 w-5" />
                  See How It Works
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Unified Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  From lead capture to close and onboarding — streamline every step of your client journey with automated workflows and smart integrations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Built-in Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  SEC/FINRA/DOL-ready workflows with automated documentation, approval processes, and 7-year retention archives built right in.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Team Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Onboard assistants to partners with structured career tracks, role-based training, and performance management tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful tools designed specifically for financial advisory practices, 
              from solo practitioners to multi-advisor firms.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrated Tools */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Integrated Intelligence
            </h2>
            <p className="text-xl text-muted-foreground">
              AI-powered assistance and expert networks at your fingertips
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <div key={index} className="text-center p-6 rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                <h3 className="text-lg font-semibold mb-3">{tool.title}</h3>
                <p className="text-muted-foreground">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Growing Firms
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.firm}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Plans Starting at $99/Month
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Scale as you grow — from solo practices to enterprise firms
              </p>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link to="/pricing">
                  View Plans & Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Transform Your Advisory Practice
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of advisors who've streamlined their operations and accelerated growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-6 bg-background text-primary hover:bg-background/90" 
              asChild
            >
              <Link to="/signup?persona=financial-advisor">
                Start Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" 
              asChild
            >
              <Link to="/demo">
                <MessageSquare className="mr-2 h-5 w-5" />
                Book a Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}