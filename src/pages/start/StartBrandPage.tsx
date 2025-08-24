import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Trophy, Zap, MapPin, Phone, Globe, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import analytics from '@/lib/analytics';

const StartBrandPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [businessData, setBusinessData] = useState({
    name: '',
    industry: '',
    location: '',
    phone: '',
    website: '',
    campaignType: ''
  });

  const handleBusinessSubmit = () => {
    if (!businessData.name || !businessData.industry || !businessData.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    analytics.track('brand.onboarding.business.completed', businessData);
    setStep(2);
  };

  const handleCampaignSelect = (campaignType: string) => {
    setBusinessData(prev => ({ ...prev, campaignType }));
    analytics.track('brand.onboarding.campaign.selected', { campaignType });
    toast.success('Setting up your brand workspace...');
    localStorage.setItem('brand_business_data', JSON.stringify({ ...businessData, campaignType }));
    navigate('/brand/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Building2 className="text-sm font-bold text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Brand Workspace Setup</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Welcome to Local Brand Management</h1>
                <p className="text-xl text-muted-foreground">
                  Set up your business profile and launch targeted local campaigns with automatic compliance tracking.
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Name *</label>
                    <Input
                      placeholder="Your Local Business"
                      value={businessData.name}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industry *</label>
                    <Input
                      placeholder="e.g., Restaurant, Retail, Professional Services"
                      value={businessData.industry}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, industry: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location *</label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="City, State"
                        value={businessData.location}
                        onChange={(e) => setBusinessData(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="(555) 123-4567"
                          value={businessData.phone}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Website</label>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="yoursite.com"
                          value={businessData.website}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, website: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleBusinessSubmit} className="w-full">
                    Continue to Campaign Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Choose Your Campaign Template</h1>
                <p className="text-xl text-muted-foreground">
                  Select a campaign type that best fits your business goals. Templates include compliance-ready content.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                  onClick={() => handleCampaignSelect('local_awareness')}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Local Awareness</h3>
                    <p className="text-muted-foreground">Drive foot traffic and local brand recognition with geo-targeted campaigns</p>
                    <div className="text-sm text-primary font-medium">Perfect for: Restaurants, Retail, Services</div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                  onClick={() => handleCampaignSelect('grand_opening')}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Trophy className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Grand Opening</h3>
                    <p className="text-muted-foreground">Launch with a splash using event-driven marketing and special offers</p>
                    <div className="text-sm text-primary font-medium">Perfect for: New businesses, Expansions</div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                  onClick={() => handleCampaignSelect('seasonal_promotion')}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Seasonal Promotion</h3>
                    <p className="text-muted-foreground">Time-sensitive offers and holiday-themed marketing campaigns</p>
                    <div className="text-sm text-primary font-medium">Perfect for: Sales, Events, Holidays</div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back to Business Info
                </Button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default StartBrandPage;