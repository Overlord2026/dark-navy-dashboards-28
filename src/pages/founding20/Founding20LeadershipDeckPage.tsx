import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeadershipDeckGenerator } from '@/components/founding20/LeadershipDeckGenerator';
import { Presentation, Download, Share2, Eye, ArrowLeft } from 'lucide-react';
import { track } from '@/lib/analytics/track';
import { useNavigate } from 'react-router-dom';

const Founding20LeadershipDeckPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    track('leadership_deck_page_viewed', {
      utm_source: 'direct',
      utm_medium: 'web',
      utm_campaign: 'founding20_deck'
    });
  }, []);

  const handleShare = () => {
    track('leadership_deck_share_clicked');
    navigator.clipboard.writeText(window.location.href);
    // Could integrate with email sharing functionality
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black via-gold/10 to-black border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate('/founding20/overview')}
              variant="outline"
              size="sm"
              className="border-gold text-gold hover:bg-gold/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Overview
            </Button>
            
            <Badge className="bg-gold/20 text-gold border-gold/30">
              Leadership Briefing Deck
            </Badge>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                Leadership Briefing Deck
              </h1>
              <p className="text-xl text-gray-300 mb-6 max-w-3xl">
                Executive presentation for the Founding 20 launch — includes Overview, 
                Sequencing Checklist, Brand Guide, Visual Identity Showcase, and mockups for all segments.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-gold text-gold hover:bg-gold/10"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Generator */}
          <div className="lg:col-span-2">
            <LeadershipDeckGenerator />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Deck Contents */}
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Deck Contents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gold/5 rounded-lg border border-gold/20">
                    <div className="bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                    <div>
                      <h4 className="font-semibold text-white">Founding 20 Overview</h4>
                      <p className="text-sm text-white/70">ROI-ranked target list for Sports, Longevity, and RIA segments</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gold/5 rounded-lg border border-gold/20">
                    <div className="bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                    <div>
                      <h4 className="font-semibold text-white">Launch Sequencing Checklist</h4>
                      <p className="text-sm text-white/70">8-week execution roadmap for all segments</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gold/5 rounded-lg border border-gold/20">
                    <div className="bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                    <div>
                      <h4 className="font-semibold text-white">Visual Identity Showcase</h4>
                      <p className="text-sm text-white/70">App dashboard, PDF samples, email headers, advisor badges</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gold/5 rounded-lg border border-gold/20">
                    <div className="bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                    <div>
                      <h4 className="font-semibold text-white">Brand Color & Usage Guide</h4>
                      <p className="text-sm text-white/70">Primary/secondary palette, typography, iconography guidelines</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gold/5 rounded-lg border border-gold/20">
                    <div className="bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">5</div>
                    <div>
                      <h4 className="font-semibold text-white">Campaign Mockups</h4>
                      <p className="text-sm text-white/70">Sports, Longevity, and RIA campaign materials</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">Related Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate('/founding20/overview')}
                  variant="outline"
                  className="w-full justify-start border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Presentation className="mr-2 h-4 w-4" />
                  One-Page Overview
                </Button>

                <Button
                  onClick={() => navigate('/founding20/sports')}
                  variant="outline"
                  className="w-full justify-start border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Sports Campaign
                </Button>

                <Button
                  onClick={() => navigate('/admin/founding20-checklist')}
                  variant="outline"
                  className="w-full justify-start border-gold text-gold hover:bg-gold/10"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Launch Checklist
                </Button>
              </CardContent>
            </Card>

            {/* Usage Guidelines */}
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">Usage Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/70">
                <div>
                  <strong className="text-white">Digital PDF:</strong> Optimized for web sharing, email distribution, and screen presentation
                </div>
                <div>
                  <strong className="text-white">Print PDF:</strong> High-contrast design for physical materials and printed handouts
                </div>
                <div>
                  <strong className="text-white">PowerPoint:</strong> Fully editable format for customization and team presentations
                </div>
                <div>
                  <strong className="text-white">Preview PNG:</strong> Cover image for email previews and social sharing
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black border-t border-gold/30 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gold font-semibold mb-2">Boutique Family Office™</p>
          <p className="text-sm text-white/60">Healthspan + Wealthspan. One Platform.</p>
        </div>
      </div>
    </div>
  );
};

export default Founding20LeadershipDeckPage;