import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, TrendingUp, BookOpen, Award, Calendar } from 'lucide-react';
import { track } from '@/lib/analytics/track';

const SportsFounding20LandingPage: React.FC = () => {
  useEffect(() => {
    // Track page view
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source');
    const utm_medium = urlParams.get('utm_medium');
    const utm_campaign = urlParams.get('utm_campaign');
    const utm_content = urlParams.get('utm_content');
    const org_name = urlParams.get('org') || utm_content;

    track('landing_viewed', {
      segment: 'sports',
      org_name,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      path: '/founding20/sports'
    });
  }, []);

  const handleCTAClick = (action: string) => {
    track('cta_clicked', {
      segment: 'sports',
      action,
      source: 'landing_page'
    });

    if (action === 'book_preview') {
      // Open Calendly or booking system
      window.open('https://calendly.com/bfo-founding20/15min-preview', '_blank');
    } else if (action === 'download_onepager') {
      // Trigger PDF download
      track('pdf_download_requested', { segment: 'sports', type: 'onepager' });
    }
  };

  const valueBullets = [
    {
      icon: BookOpen,
      title: "NIL & Financial Education",
      description: "Athlete‑friendly modules, built with compliance in mind."
    },
    {
      icon: Shield,
      title: "Secure Legacy Vault™",
      description: "Documents, permissions, audit trail — enterprise‑grade."
    },
    {
      icon: TrendingUp,
      title: "SWAG™ Retirement Roadmap",
      description: "Science‑based planning for short, mid, and long horizons."
    }
  ];

  const roiPoints = [
    "Player engagement + measurable literacy outcomes",
    "Co‑created modules and private program spaces",
    "National brand, local delivery via licensed advisors"
  ];

  const trustBadges = [
    "Multi‑tenant RBAC • Audit logging",
    "PII‑sanitized analytics",
    "White‑label ready for leagues & player programs"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Bleed Black with Gold accents */}
      <section className="bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-emerald/10" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="border-gold text-gold bg-black/50">
                  Founding 20 • Sports
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-serif font-bold text-white leading-tight">
                  Partner with BFO to{' '}
                  <span className="text-gold">Elevate Player Care</span>
                </h1>
                <p className="text-xl text-white/80 leading-relaxed">
                  A unified platform for healthspan + wealthspan, built for athlete programs, 
                  NIL education, and long-term financial wellbeing.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gold text-black hover:bg-gold/90 font-bold px-8 py-6 text-lg"
                  onClick={() => handleCTAClick('book_preview')}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a 15‑minute preview
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-gold text-gold hover:bg-gold/10 px-8 py-6 text-lg"
                  onClick={() => handleCTAClick('download_onepager')}
                >
                  Download the one‑pager
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-gold/20 to-emerald/20 rounded-3xl flex items-center justify-center">
                <Award className="h-32 w-32 text-gold" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {valueBullets.map((bullet, index) => (
              <Card key={index} className="bg-black border-gold/30 hover:border-gold/60 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20">
                <CardHeader className="text-center">
                  <bullet.icon className="h-12 w-12 text-gold mx-auto mb-4" />
                  <CardTitle className="text-xl text-white">{bullet.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-white/70 text-base leading-relaxed">
                    {bullet.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-5xl font-serif font-bold">
                Why Sports Leagues Choose BFO
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {roiPoints.map((point, index) => (
                <div key={index} className="space-y-4">
                  <div className="w-16 h-16 bg-emerald rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-lg text-white/90">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-background border-t border-gold/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {trustBadges.map((badge, index) => (
              <div key={index} className="space-y-2">
                <Shield className="h-8 w-8 text-gold mx-auto" />
                <p className="text-sm text-muted-foreground">{badge}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Block */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <Card className="bg-black border-gold max-w-4xl mx-auto">
            <CardContent className="p-12 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white">
                  Be one of the <span className="text-gold">Founding 20</span>
                </h2>
                <p className="text-xl text-white/80 leading-relaxed">
                  Get concierge onboarding, priority roadmap input, and a preferred partnership tier.
                </p>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gold text-black hover:bg-gold/90 font-bold px-12 py-6 text-xl"
                onClick={() => handleCTAClick('book_preview')}
              >
                <Calendar className="mr-2 h-6 w-6" />
                Book a 15‑minute preview
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-gold/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="text-gold font-bold">Boutique Family Office™</span> • Healthspan + Wealthspan. One Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SportsFounding20LandingPage;