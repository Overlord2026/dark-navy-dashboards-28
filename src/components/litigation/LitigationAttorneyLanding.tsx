import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Lock, CheckSquare, MessageCircle, Calendar, Zap, Video, Database } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';

export const LitigationAttorneyLanding: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Clock,
      title: "Case Timeline Builder",
      description: "Visualize case progression with interactive timelines and milestone tracking"
    },
    {
      icon: Lock,
      title: "Secure Evidence Vault",
      description: "Bank-level security for sensitive documents and digital evidence"
    },
    {
      icon: CheckSquare,
      title: "Task Assignment & Tracking",
      description: "Collaborate with your team and track case progress in real-time"
    },
    {
      icon: MessageCircle,
      title: "Integrated Client Messaging",
      description: "Secure, privileged communication with clients and co-counsel"
    }
  ];

  const premiumFeatures = [
    {
      icon: Calendar,
      title: "Court Deadline Auto-Importer",
      description: "Automatically sync court deadlines from major case management systems"
    },
    {
      icon: Zap,
      title: "AI Legal Brief Generator",
      description: "AI-powered drafting assistance for motions and briefs"
    },
    {
      icon: Video,
      title: "Secure Video Deposition Storage",
      description: "High-resolution video storage with transcript synchronization"
    },
    {
      icon: Database,
      title: "Expert Witness Database Access",
      description: "Comprehensive database of vetted expert witnesses and consultants"
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero Section */}
        <section className="relative px-4 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          
          <div className="container mx-auto relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Litigation Management, Simplified
                  </h1>
                  <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                    Organize case files, deadlines, and client communication in one secure hub.
                  </p>
                </div>

                <Button
                  onClick={() => navigate('/litigation-attorney/onboarding')}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary text-lg px-8 py-6"
                >
                  Join as a Litigation Attorney
                </Button>
              </div>

              {/* Dashboard Mockup */}
              <div className="relative">
                <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-4">
                        <h3 className="font-semibold">Case Management Dashboard</h3>
                        <div className="flex gap-2">
                          <div className="w-3 h-3 bg-destructive rounded-full" />
                          <div className="w-3 h-3 bg-warning rounded-full" />
                          <div className="w-3 h-3 bg-primary rounded-full" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-primary/5 rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-destructive rounded-full" />
                            <span className="text-sm font-medium">Smith v. Johnson</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Due: 3 days</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-accent/5 rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-warning rounded-full" />
                            <span className="text-sm font-medium">Estate of Williams</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Due: 1 week</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-primary/5 rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-sm font-medium">ABC Corp Litigation</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Due: 2 weeks</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-4 py-16">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Streamline Your Litigation Practice</h2>
              <p className="text-lg text-muted-foreground">
                Powerful tools designed specifically for litigation attorneys
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <benefit.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Features Section */}
        <section className="px-4 py-16 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Premium Features</h2>
              <p className="text-lg text-muted-foreground">
                Advanced capabilities for complex litigation matters
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {premiumFeatures.map((feature, index) => (
                <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-accent/20">
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Premium
                  </div>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                      <feature.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16">
          <div className="container mx-auto text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">Ready to Modernize Your Practice?</h2>
              <p className="text-lg text-muted-foreground">
                Join the Boutique Family Office™ marketplace and access cutting-edge litigation tools.
              </p>
              <Button
                onClick={() => navigate('/litigation-attorney/onboarding')}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary text-lg px-8 py-6"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};