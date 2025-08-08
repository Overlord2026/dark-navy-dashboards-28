import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, ArrowRight, Gift } from 'lucide-react';

interface ThankYouPageProps {
  userName: string;
  persona: string;
  downloadUrl: string;
  onAccessDashboard: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  userName,
  persona,
  downloadUrl,
  onAccessDashboard
}) => {
  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">B</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Boutique Family Office™</h1>
              <p className="text-sm text-muted-foreground">Marketplace</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-6 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Welcome, {userName}!
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Your download is ready! We've also set up your complimentary BFO Marketplace account 
              so you can explore tools right away.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Download Card */}
            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Get Your Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Download the complete Wealth & Health Playbook with insider strategies from ultra-wealthy families.
                </p>
                <Button 
                  onClick={handleDownload}
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Guide
                </Button>
              </CardContent>
            </Card>

            {/* Dashboard Access Card */}
            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 mx-auto rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Access Your Tools</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Explore your personalized dashboard with calculators, resources, and tools designed for {persona.replace('_', ' ')}s.
                </p>
                <Button 
                  onClick={onAccessDashboard}
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Access My Free Tools
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* What's Next */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Welcome Email</h3>
                  <p className="text-sm text-muted-foreground">
                    Check your inbox for download link and platform overview
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Video Walkthrough</h3>
                  <p className="text-sm text-muted-foreground">
                    Get a personalized tour of tools for your specific role
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Success Stories</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn how others achieved results with our platform
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Questions? Email us at <span className="text-primary">support@boutiquefamilyoffice.com</span> or call <span className="text-primary">(555) 123-4567</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};