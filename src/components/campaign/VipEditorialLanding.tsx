import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Award, Calendar, Download, Users, Zap, Shield, TrendingUp } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface VipEditorialLandingProps {
  editorName?: string;
  publication?: string;
  region?: string;
}

const VipEditorialLanding: React.FC<VipEditorialLandingProps> = ({
  editorName,
  publication,
  region
}) => {
  const { t } = useTranslation();

  const handleClaimAccess = () => {
    // Navigate to VIP signup/onboarding
    console.log('Claiming VIP access for:', editorName);
  };

  const handleDownloadPressKit = () => {
    // Download press kit
    console.log('Downloading press kit');
  };

  const handleBookInterview = () => {
    // Open calendar booking
    console.log('Booking interview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* VIP Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5" />
            <span className="font-semibold">VIP Editorial Access</span>
            {region && <Badge variant="secondary">{region}</Badge>}
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <span className="text-xl font-bold">BFOCFO</span>
              <span className="text-xs text-muted-foreground ml-2">Global Launch</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Press Kit</Button>
            <Button variant="ghost" size="sm">Media Center</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {editorName && (
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-primary">
                Welcome, {editorName}
              </h1>
              {publication && (
                <p className="text-muted-foreground">
                  {publication} • World's Leading Financial Journalism
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Globe className="h-4 w-4 mr-2" />
              Global Editorial VIP Preview
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              The Future of Family Wealth is Here
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              You've been selected as one of the first 100 global leaders in financial journalism 
              to receive exclusive access to the world's first AI-enabled family office marketplace.
            </p>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid md:grid-cols-4 gap-6 my-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">First-of-its-Kind</h3>
                <p className="text-sm text-muted-foreground">
                  AI-enabled platform uniting wealth, health, and legacy
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Global Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Launching in US, Canada, UK, and international markets
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Exclusive Access</h3>
                <p className="text-sm text-muted-foreground">
                  Custom VIP profile and founder interview access
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Market Leadership</h3>
                <p className="text-sm text-muted-foreground">
                  Cover the next generation of wealth management
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleClaimAccess} className="text-lg px-8 py-4">
              <Award className="h-5 w-5 mr-2" />
              Claim Your VIP Access
            </Button>
            
            <Button variant="outline" size="lg" onClick={handleDownloadPressKit} className="text-lg px-8 py-4">
              <Download className="h-5 w-5 mr-2" />
              Download Press Kit
            </Button>
            
            <Button variant="secondary" size="lg" onClick={handleBookInterview} className="text-lg px-8 py-4">
              <Calendar className="h-5 w-5 mr-2" />
              Book Founder Interview
            </Button>
          </div>
        </div>
      </section>

      {/* Why Cover Us Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-3xl font-bold text-center">Why Cover BFOCFO?</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Market Innovation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• First integrated wealth + health + compliance platform</li>
                    <li>• AI copilots for all professional personas</li>
                    <li>• Real-time CE/CLE tracking and automation</li>
                    <li>• SWAG Lead Score™ proprietary technology</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Global Scale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Multi-language, multi-currency support</li>
                    <li>• International compliance frameworks</li>
                    <li>• Cross-border family office solutions</li>
                    <li>• Regional customization capabilities</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            For press inquiries: press@bfocfo.com | 
            Interview requests: media@bfocfo.com
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Boutique Family Office Marketplace™ - Patent Pending
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VipEditorialLanding;