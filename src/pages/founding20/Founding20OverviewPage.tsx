import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, Mail, FileText, Image, QrCode } from 'lucide-react';
import { OnePageOverviewGenerator } from '@/components/founding20/OnePageOverviewGenerator';
import { track } from '@/lib/analytics/track';
import { supabase } from '@/integrations/supabase/client';

const Founding20OverviewPage: React.FC = () => {
  useEffect(() => {
    const trackPageView = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      
      track('overview_viewed', {
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        utm_content: urlParams.get('utm_content')
      });

      // Track in Supabase
      await supabase.from('overview_analytics').insert({
        segment: 'all',
        action: 'page_viewed',
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        utm_content: urlParams.get('utm_content')
      });
    };

    trackPageView();
  }, []);

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Founding 20 Overview — Sports | Longevity | RIA');
    const body = encodeURIComponent(`Hi,

Here's a quick look at the Founding 20 across our three key segments — Sports, Longevity, and RIA.

View the complete overview: ${window.location.href}

Each segment includes links to full PDFs and detailed analysis.

— Boutique Family Office™`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
    
    track('overview_email_shared', { method: 'mailto' });
  };

  const handleAssetDownload = (type: string) => {
    track('overview_asset_downloaded', { asset_type: type });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="border-gold text-gold mb-4">
              Founding 20 Overview
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="text-gold">Founding 20</span> Overview
              <br />
              <span className="text-emerald">Sports</span> | <span className="text-dark-navy">Longevity</span> | <span className="text-red">RIA</span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              A strategic snapshot of the top 20 targets in each segment, ROI-ranked and color-coded. 
              Download the full overview or access individual segment PDFs below.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button 
                onClick={handleEmailShare}
                size="lg" 
                className="bg-gold text-black hover:bg-gold/90 px-8 py-4"
              >
                <Mail className="h-5 w-5 mr-2" />
                Email This Overview
              </Button>
              
              <Button 
                onClick={() => handleAssetDownload('link')}
                variant="outline" 
                size="lg"
                className="border-gold text-gold hover:bg-gold/10 px-8 py-4"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share Link
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Downloads */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-8 mb-12">
            <h2 className="text-3xl font-bold text-foreground">Download Assets</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from multiple formats to suit your needs. All assets include QR codes linking to full segment PDFs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <OnePageOverviewGenerator format="pdf" theme="print" />
            <OnePageOverviewGenerator format="pdf" theme="digital" />
            <OnePageOverviewGenerator format="png" theme="digital" />
            
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code Access
                </CardTitle>
                <CardDescription className="text-white/70">
                  Individual segment QR codes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-emerald text-emerald hover:bg-emerald/10"
                  onClick={() => window.open('/founding20/sports', '_blank')}
                >
                  🏆 Sports QR
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-blue-800 text-blue-200 hover:bg-blue-800/10"
                  onClick={() => window.open('/founding20/longevity', '_blank')}
                >
                  🧬 Longevity QR  
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-red-600 text-red-400 hover:bg-red-600/10"
                  onClick={() => window.open('/founding20/ria', '_blank')}
                >
                  💼 RIA QR
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Segment Preview */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-8 mb-12">
            <h2 className="text-3xl font-bold text-gold">Segment Breakdown</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Each segment contains 20 carefully selected organizations ranked by ROI potential and strategic value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sports */}
            <Card className="bg-black border-2 border-emerald">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏆</span>
                </div>
                <CardTitle className="text-emerald text-2xl">Sports</CardTitle>
                <CardDescription className="text-white/70">
                  Global leagues, tours, and sports enterprises
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-gold font-medium">🥇 Gold: NFL, NBA, FIFA, UFC, MLB</p>
                  <p className="text-white/60 text-sm">Premier global leagues with massive athlete populations</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-emerald text-emerald hover:bg-emerald/10"
                  onClick={() => window.open('/founding20/sports', '_blank')}
                >
                  View Full Sports PDF
                </Button>
              </CardContent>
            </Card>

            {/* Longevity */}
            <Card className="bg-black border-2 border-blue-800">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-800/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🧬</span>
                </div>
                <CardTitle className="text-blue-200 text-2xl">Longevity</CardTitle>
                <CardDescription className="text-white/70">
                  Health optimization and longevity leaders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-gold font-medium">🥇 Gold: Tony Robbins, Peter Diamandis, David Sinclair</p>
                  <p className="text-white/60 text-sm">Thought leaders and health optimization pioneers</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-800 text-blue-200 hover:bg-blue-800/10"
                  onClick={() => window.open('/founding20/longevity', '_blank')}
                >
                  View Full Longevity PDF
                </Button>
              </CardContent>
            </Card>

            {/* RIA */}
            <Card className="bg-black border-2 border-red-600">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💼</span>
                </div>
                <CardTitle className="text-red-400 text-2xl">RIA</CardTitle>
                <CardDescription className="text-white/70">
                  Registered Investment Advisor firms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-gold font-medium">🥇 Gold: Crescent Wealth, Mission Wealth, Mercer</p>
                  <p className="text-white/60 text-sm">Leading RIA firms with high-net-worth focus</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-red-600 text-red-400 hover:bg-red-600/10"
                  onClick={() => window.open('/founding20/ria', '_blank')}
                >
                  View Full RIA PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl font-bold text-foreground">Ready to Explore?</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Visit the main Founding 20 hub to access interactive checklists, detailed analysis, 
            and the complete partnership strategy.
          </p>
          
          <Button 
            size="lg" 
            className="bg-gold text-black hover:bg-gold/90 px-8 py-4 text-lg"
            onClick={() => window.open('/admin/founding20-checklist', '_blank')}
          >
            <FileText className="h-5 w-5 mr-2" />
            Access Founding 20 Hub
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gold/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gold">Boutique Family Office™</h3>
            <p className="text-white/70">Healthspan + Wealthspan. One Platform.</p>
            <div className="flex justify-center space-x-6 text-sm text-white/60">
              <span>ROI-ranked partnerships</span>
              <span>•</span>
              <span>Strategic outreach</span>
              <span>•</span>
              <span>Measurable outcomes</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Founding20OverviewPage;