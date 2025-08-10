import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Download, Calendar, Trophy, Shield, Target } from 'lucide-react';
import { track } from '@/lib/analytics/track';

const SportsFounding20Landing: React.FC = () => {
  useEffect(() => {
    track('sports_landing_viewed', {
      segment: 'sports',
      utm_source: 'direct',
      utm_medium: 'web',
      utm_campaign: 'founding20_sports'
    });
  }, []);

  const handleBookPreview = () => {
    track('sports_book_preview_clicked', {
      segment: 'sports',
      action: 'book_preview'
    });
    window.open('https://calendly.com/bfo-preview', '_blank');
  };

  const handleDownload = () => {
    track('sports_download_clicked', {
      segment: 'sports',
      action: 'download_onepager'
    });
    // Generate and download PDF
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-black via-emerald-900/20 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(4,107,77,0.3),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Founding 20 • Sports
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
              Partner with BFO to<br />Elevate Player Care
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              A unified platform for healthspan + wealthspan, built for athlete programs, 
              NIL education, and long-term financial wellbeing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleBookPreview}
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book a 15-minute preview
              </Button>
              
              <Button 
                onClick={handleDownload}
                variant="outline" 
                size="lg"
                className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Download the one-pager
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-900 border-emerald-500/30">
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">NIL & Financial Education</h3>
              <p className="text-gray-300">
                Athlete-friendly modules, built with compliance in mind.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-emerald-500/30">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Secure Legacy Vault™</h3>
              <p className="text-gray-300">
                Documents, permissions, audit trail — enterprise-grade.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-emerald-500/30">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">SWAG™ Retirement Roadmap</h3>
              <p className="text-gray-300">
                Science-based planning for short, mid, and long horizons.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ROI Section */}
      <div className="bg-gradient-to-r from-emerald-900/20 to-black py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Why Sports Leagues Choose BFO
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-400">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Player Engagement</h3>
              <p className="text-gray-300">+ measurable literacy outcomes</p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-400">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Co-created Modules</h3>
              <p className="text-gray-300">and private program spaces</p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">National Brand</h3>
              <p className="text-gray-300">local delivery via licensed advisors</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-20 border-t border-emerald-500/30">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Player Financial Wellbeing?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the Founding 20 and help shape the future of athlete financial education.
          </p>
          
          <Button 
            onClick={handleBookPreview}
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 text-lg"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 mb-2">Boutique Family Office™</p>
          <p className="text-sm text-gray-500">Healthspan + Wealthspan. One Platform.</p>
        </div>
      </div>
    </div>
  );
};

export default SportsFounding20Landing;