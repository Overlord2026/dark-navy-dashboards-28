import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Trophy, DollarSign, Heart, GraduationCap, CheckCircle, X } from 'lucide-react';

export const SportsAgentPersonaLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/sports-agent-onboarding');
  };

  const benefits = [
    {
      icon: Users,
      title: "Centralized Athlete Management",
      description: "Keep all athlete profiles, contracts, and deals in one secure place"
    },
    {
      icon: Trophy,
      title: "NIL Deal Tracker",
      description: "Organize, approve, and manage Name, Image & Likeness agreements"
    },
    {
      icon: FileText,
      title: "Contract Vault",
      description: "Secure storage with e-signature & compliance logging"
    },
    {
      icon: DollarSign,
      title: "Financial & Health Dashboard",
      description: "Connect to athlete bank accounts, investments, and health tracking"
    },
    {
      icon: GraduationCap,
      title: "Post-Career Transition Planning",
      description: "Education modules and career coaching tools"
    },
    {
      icon: Heart,
      title: "Referral Revenue",
      description: "Earn when your athletes and their advisors subscribe to BFO services"
    }
  ];

  const whoWeServe = [
    "Player Agents (all major leagues + Olympic sports)",
    "Athlete Representatives (PR & branding managers)",
    "NIL Representatives (college athletes)",
    "Sponsorship Brokers"
  ];

  const featureComparison = [
    { feature: "Athlete Profile Manager", basic: true, premium: true },
    { feature: "Contract Storage", basic: true, premium: true },
    { feature: "Athlete Education Access", basic: true, premium: true },
    { feature: "NIL Deal Tracker", basic: false, premium: true },
    { feature: "Advanced Compliance Calendar", basic: false, premium: true },
    { feature: "Sponsorship Revenue Analytics", basic: false, premium: true },
    { feature: "Athlete Health & Wellness Portal", basic: false, premium: true },
    { feature: "Custom Athlete Dashboards", basic: false, premium: true },
    { feature: "Multi-Athlete Team View", basic: false, premium: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 text-sm font-medium">
            Sports Agent Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            The Ultimate Platform for Sports Agents to Manage, Grow, and Protect Your Athletes' Careers
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto">
            From contract negotiation to NIL deal tracking, financial wellness, and post-career planning — all in one secure, compliant portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4"
              onClick={handleGetStarted}
            >
              Get Started (Free)
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4"
              onClick={handleGetStarted}
            >
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Who We Serve</h2>
            <p className="text-xl text-muted-foreground">
              Built specifically for sports industry professionals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whoWeServe.map((role, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <p className="font-medium text-foreground">{role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Sports Agents Choose BFO</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to manage elite athletes and grow your practice
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="h-full hover-scale">
                <CardHeader>
                  <benefit.icon className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-8">
              <blockquote className="text-xl md:text-2xl text-center italic text-foreground mb-6">
                "BFO has been game-changing for our agency. We can now track every NIL deal, manage compliance deadlines, and give our athletes the financial wellness tools they need for long-term success."
              </blockquote>
              <div className="text-center">
                <p className="font-semibold text-foreground">Marcus Rivera</p>
                <p className="text-muted-foreground">Elite Sports Management</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Basic vs Premium Features</h2>
            <p className="text-xl text-muted-foreground">
              Start free, upgrade when you're ready to unlock advanced tools
            </p>
          </div>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold">Basic (Free)</th>
                      <th className="text-center p-4 font-semibold">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureComparison.map((item, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-4 font-medium">{item.feature}</td>
                        <td className="p-4 text-center">
                          {item.basic ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Revolutionize Your Sports Agency?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the platform trusted by elite sports agents to manage contracts, track NIL deals, and build lasting athlete relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4"
              onClick={handleGetStarted}
            >
              Start Free Today
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4"
            >
              Download Marketing Kit
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};