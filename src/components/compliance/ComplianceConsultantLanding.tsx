import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Shield, GraduationCap, AlertTriangle, FileText, Users, Zap, Database } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';

export const ComplianceConsultantLanding: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Calendar,
      title: "Automated Filing Calendar",
      description: "Never miss a deadline with smart calendar integration and automated reminders"
    },
    {
      icon: Shield,
      title: "Advisor & Firm Audit Trails",
      description: "Complete documentation and tracking for all compliance activities"
    },
    {
      icon: GraduationCap,
      title: "CE / License Tracking",
      description: "Monitor continuing education requirements and license renewals"
    },
    {
      icon: AlertTriangle,
      title: "Risk Flag Alerts",
      description: "Proactive notifications for potential compliance issues"
    }
  ];

  const premiumFeatures = [
    {
      icon: FileText,
      title: "Jurisdiction-specific Filing Templates",
      description: "Pre-built templates for all major regulatory jurisdictions"
    },
    {
      icon: Zap,
      title: "AI-powered Document Review",
      description: "Automated compliance checking with intelligent recommendations"
    },
    {
      icon: Database,
      title: "Bulk Compliance Report Generation",
      description: "Generate comprehensive reports across multiple clients"
    },
    {
      icon: Users,
      title: "Multi-Tenant Client Portals",
      description: "Secure client access with role-based permissions"
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
                    Your Compliance Command Center
                  </h1>
                  <h2 className="text-xl lg:text-2xl text-muted-foreground font-medium">
                    Built for the Modern Advisor
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Track, audit, and document compliance activities seamlessly across clients, teams, and jurisdictions.
                  </p>
                </div>

                <Button
                  onClick={() => navigate('/compliance-consultant/onboarding')}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary text-lg px-8 py-6"
                >
                  Join as a Compliance Consultant
                </Button>
              </div>

              {/* Dashboard Mockup */}
              <div className="relative">
                <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-4">
                        <h3 className="font-semibold">Compliance Dashboard</h3>
                        <div className="flex gap-2">
                          <div className="w-3 h-3 bg-destructive rounded-full" />
                          <div className="w-3 h-3 bg-warning rounded-full" />
                          <div className="w-3 h-3 bg-primary rounded-full" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-primary/10 p-3 rounded">
                          <Calendar className="w-6 h-6 text-primary mb-2" />
                          <div className="text-sm font-medium">Filing Calendar</div>
                        </div>
                        <div className="bg-accent/10 p-3 rounded">
                          <AlertTriangle className="w-6 h-6 text-accent mb-2" />
                          <div className="text-sm font-medium">Risk Alerts</div>
                        </div>
                        <div className="bg-primary/10 p-3 rounded">
                          <Shield className="w-6 h-6 text-primary mb-2" />
                          <div className="text-sm font-medium">Audit Trails</div>
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
              <h2 className="text-3xl font-bold mb-4">Streamline Your Compliance Practice</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to manage compliance efficiently
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
                Advanced tools for enterprise-level compliance management
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
              <h2 className="text-3xl font-bold">Ready to Transform Your Compliance Practice?</h2>
              <p className="text-lg text-muted-foreground">
                Join the Boutique Family Office™ marketplace and access the tools you need to excel.
              </p>
              <Button
                onClick={() => navigate('/compliance-consultant/onboarding')}
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