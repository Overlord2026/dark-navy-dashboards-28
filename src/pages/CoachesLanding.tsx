import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, TrendingUp, DollarSign, Calendar, Video, Mail, Award, Star } from "lucide-react";

export default function CoachesLanding() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDemoSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // TODO: Integrate with actual signup API
  };

  const features = [
    {
      icon: Users,
      title: "Advisor Management",
      description: "Track and manage your advisor roster with detailed performance metrics"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Monitor advisor progress, conversion rates, and revenue impact"
    },
    {
      icon: DollarSign,
      title: "Outcome-Based Payouts",
      description: "Get paid for real results - tracked conversions and client success"
    },
    {
      icon: Award,
      title: "Coaching Resources",
      description: "Upload and share playbooks, webinars, and training materials"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      title: "Financial Services Coach",
      company: "Elite Advisor Training",
      quote: "The platform has revolutionized how I track my advisors' success. I can see real ROI from my coaching efforts.",
      rating: 5
    },
    {
      name: "Michael Chen",
      title: "Wealth Management Consultant", 
      company: "Peak Performance Coaching",
      quote: "Finally, a way to prove the value of coaching with hard data. My clients love the transparency.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      title: "RIA Practice Coach",
      company: "Growth Partners",
      quote: "The outcome-based compensation model has doubled my coaching revenue. Game changer!",
      rating: 5
    }
  ];

  const outreachStrategies = [
    {
      icon: Mail,
      title: "Email Campaigns",
      description: "Targeted outreach to financial services coaches and consultants"
    },
    {
      icon: Video,
      title: "Webinar Series",
      description: "Monthly educational webinars on advisor performance and coaching ROI"
    },
    {
      icon: Calendar,
      title: "Conference Presence",
      description: "Speaking at industry events and coaching conferences"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            For Financial Services Coaches
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Empower Your Advisors,{" "}
            <span className="text-primary">Track Their Success</span>,{" "}
            <span className="text-gold-primary">Get Paid for Outcomes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The first platform designed specifically for financial services coaches. 
            Monitor advisor performance, deliver proven results, and earn outcome-based compensation.
          </p>
          
          {/* Demo Signup Form */}
          <Card className="max-w-md mx-auto mb-12">
            <CardHeader>
              <CardTitle>Request Demo Access</CardTitle>
              <CardDescription>Join our early access program</CardDescription>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleDemoSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="coach@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" variant="premium">
                    Get Demo Access
                  </Button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-2" />
                  <p className="text-success font-medium">Thanks! We'll be in touch soon.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Scale Your Coaching Practice
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Why Choose Our Platform?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Proven Results</h3>
                <p className="text-muted-foreground">
                  Coaches using our platform see 40% higher advisor performance and 25% better client retention
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-gold-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <DollarSign className="h-8 w-8 text-gold-primary" />
                </div>
                <h3 className="text-xl font-semibold">Outcome-Based Pay</h3>
                <p className="text-muted-foreground">
                  Get compensated for real results - track conversions, client success, and revenue impact
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-success/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold">Scalable Impact</h3>
                <p className="text-muted-foreground">
                  Manage unlimited advisors with automated tracking and personalized coaching workflows
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trusted by Leading Financial Services Coaches
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-primary text-gold-primary" />
                  ))}
                </div>
                <CardDescription>"{testimonial.quote}"</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Outreach Strategy */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Join Our Partner Network</h2>
            <p className="text-xl text-muted-foreground mb-12">
              We're building strategic partnerships with industry-leading coaches and training organizations
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {outreachStrategies.map((strategy, index) => (
                <div key={index} className="space-y-4">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <strategy.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{strategy.title}</h3>
                  <p className="text-muted-foreground">{strategy.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Coaching Practice?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our early access program and be among the first coaches to benefit from outcome-based compensation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Schedule a Demo
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              Download Partner Kit
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}