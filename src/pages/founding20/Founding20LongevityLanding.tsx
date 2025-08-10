import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicReportWidget } from '@/components/founding20/PublicReportWidget';
import { trackFounding20Event } from '@/lib/analytics/trackFounding20';
import { Calendar, Download, Play, Users, Shield, TrendingUp, Heart, Brain, Activity } from 'lucide-react';

const Founding20LongevityLanding: React.FC = () => {
  const handleBookCall = async () => {
    await trackFounding20Event({
      event_name: 'call_booked',
      segment: 'longevity',
      org_name: 'Landing Page',
      utm_source: 'landing_page',
      utm_medium: 'cta',
      utm_campaign: 'founding20_longevity'
    });
    // Integration with Calendly or booking system
    window.open('https://calendly.com/bfo-founding20-longevity', '_blank');
  };

  const handleDownloadPDF = async () => {
    await trackFounding20Event({
      event_name: 'pdf_downloaded',
      segment: 'longevity',
      org_name: 'Landing Page',
      utm_source: 'landing_page',
      utm_medium: 'cta',
      utm_campaign: 'founding20_longevity'
    });
    // Trigger PDF download
    window.open('/founding20/longevity.pdf', '_blank');
  };

  const handleVideoPlay = async () => {
    await trackFounding20Event({
      event_name: 'video_played',
      segment: 'longevity',
      org_name: 'Landing Page',
      utm_source: 'landing_page',
      utm_medium: 'video',
      utm_campaign: 'founding20_longevity'
    });
  };

  const longevityTiers = {
    gold: ["Tony Robbins", "Peter Diamandis", "David Sinclair", "Andrew Huberman", "Dr. Mark Hyman"],
    silver: ["Ben Greenfield", "Dr. Rhonda Patrick", "Peter Attia", "Fountain Life", "Human Longevity"],
    bronze: ["Thorne", "Levels", "Lifespan.io", "Bryan Johnson", "Precision Health Alliance"]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="outline" className="border-primary text-primary">
            Founding 20 • Longevity
          </Badge>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
            Integrate Healthspan Research with Wealth Management
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A unified platform for longevity optimization, combining cutting-edge health research with comprehensive financial planning for extended lifespans.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleBookCall}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book a 15-minute preview
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleDownloadPDF}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Download className="h-5 w-5 mr-2" />
              Download the one-pager
            </Button>
          </div>
        </div>
      </section>

      {/* Video Preview Section */}
      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-primary/30">
            <CardContent className="p-8 text-center">
              <div className="relative aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors" onClick={handleVideoPlay}>
                <Play className="h-16 w-16 text-primary" />
                <div className="absolute inset-0 bg-primary/10 rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">60-Second Longevity Platform Preview</h3>
              <p className="text-muted-foreground">
                See how BFO integrates healthspan optimization with wealth management for longevity-focused organizations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Longevity Leaders Choose BFO</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-card border-primary/30">
              <CardHeader>
                <Brain className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl">Health-Wealth Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Science-based modules connecting longevity research with financial planning for extended lifespans.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-primary/30">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl">Secure Research Vault™</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Protected storage for health data, research protocols, and financial documents with enterprise-grade security.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-primary/30">
              <CardHeader>
                <Activity className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl">Longevity Roadmap™</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Personalized planning for health optimization, research funding, and wealth preservation across extended timelines.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <Heart className="h-8 w-8 text-primary mx-auto" />
              <p className="font-semibold">Research-Grade Security</p>
              <p className="text-sm text-muted-foreground">HIPAA-compliant • Audit logging</p>
            </div>
            <div className="space-y-2">
              <TrendingUp className="h-8 w-8 text-primary mx-auto" />
              <p className="font-semibold">Longevity-Focused Analytics</p>
              <p className="text-sm text-muted-foreground">Extended timeline modeling</p>
            </div>
            <div className="space-y-2">
              <Users className="h-8 w-8 text-primary mx-auto" />
              <p className="font-semibold">White-label Ready</p>
              <p className="text-sm text-muted-foreground">For health organizations & research groups</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl font-bold">Founding 20 Longevity Targets</h2>
          
          <div className="space-y-8">
            <Card className="bg-card border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold flex items-center justify-center gap-2">
                  <Badge className="bg-gold text-black">Gold Tier</Badge>
                  Premium Partnerships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-3">
                  {longevityTiers.gold.map((org) => (
                    <Badge key={org} variant="outline" className="border-gold text-gold">
                      {org}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-silver/30">
              <CardHeader>
                <CardTitle className="text-silver flex items-center justify-center gap-2">
                  <Badge className="bg-silver text-black">Silver Tier</Badge>
                  Strategic Alliances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-3">
                  {longevityTiers.silver.map((org) => (
                    <Badge key={org} variant="outline" className="border-silver text-silver">
                      {org}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-bronze/30">
              <CardHeader>
                <CardTitle className="text-bronze flex items-center justify-center gap-2">
                  <Badge className="bg-bronze text-black">Bronze Tier</Badge>
                  Growth Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-3">
                  {longevityTiers.bronze.map((org) => (
                    <Badge key={org} variant="outline" className="border-bronze text-bronze">
                      {org}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Public Report Widget */}
      <PublicReportWidget 
        segment="longevity"
        utm_source="founding20_page"
        utm_medium="cta"
        utm_campaign="public_wrapup_report"
      />

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">Ready to Optimize Healthspan + Wealthspan?</h2>
          <p className="text-xl text-muted-foreground">
            Join the Founding 20 Longevity partners and shape the future of integrated health-wealth management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleBookCall}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Your Preview
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleDownloadPDF}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Download className="h-5 w-5 mr-2" />
              Get the Full Report
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Founding20LongevityLanding;