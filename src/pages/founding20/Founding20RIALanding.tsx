import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicReportWidget } from '@/components/founding20/PublicReportWidget';
import { trackFounding20Event } from '@/lib/analytics/trackFounding20';
import { Calendar, Download, Play, Users, Shield, TrendingUp, Building, DollarSign, BarChart3 } from 'lucide-react';

const Founding20RIALanding: React.FC = () => {
  const handleBookCall = async () => {
    await trackFounding20Event({
      event_name: 'call_booked',
      segment: 'ria',
      org_name: 'Landing Page',
      utm_source: 'landing_page',
      utm_medium: 'cta',
      utm_campaign: 'founding20_ria'
    });
    // Integration with Calendly or booking system
    window.open('https://calendly.com/bfo-founding20-ria', '_blank');
  };

  const handleDownloadPDF = async () => {
    await trackFounding20Event({
      event_name: 'pdf_downloaded',
      segment: 'ria',
      org_name: 'Landing Page',
      utm_source: 'landing_page',
      utm_medium: 'cta',
      utm_campaign: 'founding20_ria'
    });
    // Trigger PDF download
    window.open('/founding20/ria.pdf', '_blank');
  };

  const handleVideoPlay = async () => {
    await trackFounding20Event({
      event_name: 'video_played',
      segment: 'ria',
      org_name: 'Landing Page',
      utm_source: 'landing_page',
      utm_medium: 'video',
      utm_campaign: 'founding20_ria'
    });
  };

  const riaTiers = {
    gold: ["Crescent Wealth", "Mission Wealth", "Mercer Advisors", "Creative Planning", "Edelman Financial Engines"],
    silver: ["Carson Group", "Fisher Investments", "Mariner Wealth", "Buckingham", "Wealth Enhancement Group"],
    bronze: ["Savant Wealth", "Plancorp", "Brighton Jones", "Rebalance", "Facet"]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="outline" className="border-red text-red">
            Founding 20 • RIA
          </Badge>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red via-red-600 to-red bg-clip-text text-transparent">
            Enhance RIA Practices with Integrated Solutions
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive platform that unifies healthspan + wealthspan solutions, designed specifically for RIA practices and wealth management professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleBookCall}
              className="bg-red hover:bg-red/90 text-white"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book a 15-minute preview
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleDownloadPDF}
              className="border-red text-red hover:bg-red/10"
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
          <Card className="bg-card border-red/30">
            <CardContent className="p-8 text-center">
              <div className="relative aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors" onClick={handleVideoPlay}>
                <Play className="h-16 w-16 text-red" />
                <div className="absolute inset-0 bg-red/10 rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">60-Second RIA Platform Preview</h3>
              <p className="text-muted-foreground">
                See how BFO enhances traditional wealth management with integrated health-wealth solutions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Leading RIAs Choose BFO</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-card border-red/30">
              <CardHeader>
                <Building className="h-10 w-10 text-red mb-4" />
                <CardTitle className="text-xl">Integrated Wealth Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Combine traditional wealth management with health-focused financial planning modules and tools.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-red/30">
              <CardHeader>
                <Shield className="h-10 w-10 text-red mb-4" />
                <CardTitle className="text-xl">Compliance-Ready Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built with RIA compliance requirements in mind, including audit trails and regulatory reporting features.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-red/30">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-red mb-4" />
                <CardTitle className="text-xl">Enhanced Client Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Differentiate your practice with comprehensive healthspan + wealthspan planning services.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <DollarSign className="h-8 w-8 text-red mx-auto" />
              <p className="font-semibold">Fee-Based Integration</p>
              <p className="text-sm text-muted-foreground">Transparent pricing • No hidden costs</p>
            </div>
            <div className="space-y-2">
              <TrendingUp className="h-8 w-8 text-red mx-auto" />
              <p className="font-semibold">Client Retention Tools</p>
              <p className="text-sm text-muted-foreground">Enhanced engagement analytics</p>
            </div>
            <div className="space-y-2">
              <Users className="h-8 w-8 text-red mx-auto" />
              <p className="font-semibold">White-label Ready</p>
              <p className="text-sm text-muted-foreground">Seamless integration with your brand</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl font-bold">Founding 20 RIA Targets</h2>
          
          <div className="space-y-8">
            <Card className="bg-card border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold flex items-center justify-center gap-2">
                  <Badge className="bg-gold text-black">Gold Tier</Badge>
                  Enterprise Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-3">
                  {riaTiers.gold.map((org) => (
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
                  Strategic Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-3">
                  {riaTiers.silver.map((org) => (
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
                  {riaTiers.bronze.map((org) => (
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
        segment="ria"
        utm_source="founding20_page"
        utm_medium="cta"
        utm_campaign="public_wrapup_report"
      />

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">Ready to Transform Your RIA Practice?</h2>
          <p className="text-xl text-muted-foreground">
            Join the Founding 20 RIA partners and offer your clients the future of integrated wealth management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleBookCall}
              className="bg-red hover:bg-red/90 text-white"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Your Preview
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleDownloadPDF}
              className="border-red text-red hover:bg-red/10"
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

export default Founding20RIALanding;