import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SchemaLocalBusiness from '@/components/seo/SchemaLocalBusiness';
import { getFlag } from '@/config/flags';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Target, 
  Users, 
  DollarSign,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface OnboardingData {
  // Step 1: Business basics
  businessName: string;
  website: string;
  businessType: 'local' | 'enterprise' | '';
  
  // Step 2: Campaign template
  selectedTemplate: string;
}

const businessTypes = [
  { value: 'local', label: 'Local Business', description: 'Community-focused campaigns and local partnerships' },
  { value: 'enterprise', label: 'National Brand', description: 'Multi-market campaigns with complex compliance needs' }
];

const campaignTemplates = [
  {
    id: 'local-sponsor',
    title: 'Local Sponsor',
    description: 'Support local athletes and events with authentic partnerships',
    features: ['Local athlete partnerships', 'Event sponsorships', 'Community engagement']
  },
  {
    id: 'giveaway',
    title: 'Giveaway Campaign',
    description: 'Boost engagement with athlete-powered product giveaways',
    features: ['Product giveaways', 'Contest mechanics', 'Social amplification']
  },
  {
    id: 'ambassador',
    title: 'Brand Ambassador',
    description: 'Long-term partnerships with athletes as brand representatives',
    features: ['Ongoing partnerships', 'Content creation', 'Performance tracking']
  },
  {
    id: 'event-appearance',
    title: 'Event Appearance',
    description: 'Book athletes for events, grand openings, and activations',
    features: ['Event appearances', 'Meet & greets', 'Photo/video content']
  }
];

export function BrandOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    businessName: '',
    website: '',
    businessType: '',
    selectedTemplate: ''
  });

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      if (step === 1) {
        (window as any).analytics.track('onboard.brand.segment', { 
          businessType: data.businessType 
        });
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('onboard.brand.start', { 
        businessName: data.businessName,
        businessType: data.businessType 
      });
      (window as any).analytics.track('onboard.brand.template', { 
        template: data.selectedTemplate 
      });
      (window as any).analytics.track('onboard.brand.complete', { 
        businessType: data.businessType,
        template: data.selectedTemplate
      });
    }

    // Save onboarding data
    localStorage.setItem('brand_onboarding', JSON.stringify(data));
    
    // Navigate to brand hub with template pre-loaded
    const hubRoute = data.businessType === 'enterprise' ? '/brand/enterprise' : '/brand/local';
    navigate(hubRoute, { 
      state: { 
        selectedTemplate: data.selectedTemplate,
        onboardingData: data 
      }
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.businessName && data.businessType;
      case 2:
        return data.selectedTemplate;
      default:
        return false;
    }
  };

  return (
    <>
      <Helmet>
        <title>Start NIL Campaign — Brands & Local Businesses | myBFOCFO</title>
        <meta name="description" content="Quick 2-step setup to launch NIL campaigns. Connect with athletes for sponsorships, giveaways, ambassador programs, and event appearances." />
        <meta property="og:title" content="Start NIL Campaign — Brands & Local Businesses | myBFOCFO" />
        <meta property="og:description" content="Quick 2-step setup to launch NIL campaigns. Connect with athletes for sponsorships, giveaways, ambassador programs, and event appearances." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      {/* LocalBusiness Schema - Static */}
      {getFlag('BRAND_PUBLIC_ENABLED') && (
        <SchemaLocalBusiness
          name="Brands & Local Businesses — myBFOCFO NIL"
          url={`${window.location.origin}/start/brand`}
          logo={`${window.location.origin}/og/brand.png`}
          category="Marketing"
          priceRange="$$"
        />
      )}

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Progress Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold">Brand Campaign Setup</h1>
              </div>
              <Progress value={progress} className="mb-2" />
              <p className="text-sm text-muted-foreground">Step {step} of {totalSteps}</p>
            </div>

            {/* Step 1: Business Basics */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Tell us about your business
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={data.businessName}
                      onChange={(e) => setData({...data, businessName: e.target.value})}
                      placeholder="Enter your business name"
                    />
                  </div>

                    <div className="space-y-3">
                      <Label>Local or National? *</Label>
                      <div className="grid gap-3">
                        {businessTypes.map((type) => (
                          <Card 
                            key={type.value}
                            className={`cursor-pointer transition-all ${
                              data.businessType === type.value 
                                ? 'ring-2 ring-primary bg-primary/5' 
                                : 'hover:shadow-md'
                            }`}
                            onClick={() => setData({...data, businessType: type.value as 'local' | 'enterprise'})}
                          >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                              <div>
                                <h4 className="font-medium">{type.label}</h4>
                                <p className="text-sm text-muted-foreground">{type.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={data.website}
                      onChange={(e) => setData({...data, website: e.target.value})}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Choose Campaign Template */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Choose a campaign template
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    {campaignTemplates.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-all ${
                          data.selectedTemplate === template.id 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setData({...data, selectedTemplate: template.id})}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                            <div className="flex-1">
                              <h4 className="font-medium mb-2">{template.title}</h4>
                              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {template.features.map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handlePrevious} 
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button 
                onClick={handleNext} 
                disabled={!canProceed()}
              >
                {step === totalSteps ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}