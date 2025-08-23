import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
  // Business basics
  businessName: string;
  businessType: 'enterprise' | 'local-business' | '';
  industry: string;
  location: string;
  size: string;
  
  // Campaign basics
  campaignType: string;
  targetAudience: string;
  budget: string;
  timeline: string;
  
  // Template selection
  selectedTemplate: string;
  templateCustomization: string;
}

const businessTypes = [
  { value: 'enterprise', label: 'Enterprise Brand', description: 'Multi-market campaigns with complex compliance needs' },
  { value: 'local-business', label: 'Local Business', description: 'Community-focused campaigns and local influencer partnerships' }
];

const campaignTemplates = [
  {
    id: 'product-launch',
    title: 'Product Launch Campaign',
    description: 'Multi-phase campaign for new product introduction',
    features: ['Teaser phase', 'Launch phase', 'Follow-up engagement', 'Performance tracking']
  },
  {
    id: 'brand-awareness',
    title: 'Brand Awareness Campaign',
    description: 'Build brand recognition and reach new audiences',
    features: ['Content strategy', 'Influencer partnerships', 'Community engagement', 'Brand metrics']
  },
  {
    id: 'local-event',
    title: 'Local Event Promotion',
    description: 'Drive attendance for local events and activations',
    features: ['Local influencers', 'Event countdown', 'Live coverage', 'Post-event content']
  },
  {
    id: 'seasonal-promo',
    title: 'Seasonal Promotion',
    description: 'Holiday and seasonal marketing campaigns',
    features: ['Seasonal content', 'Time-sensitive offers', 'Holiday themes', 'Gift guides']
  }
];

export function BrandOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    businessName: '',
    businessType: '',
    industry: '',
    location: '',
    size: '',
    campaignType: '',
    targetAudience: '',
    budget: '',
    timeline: '',
    selectedTemplate: '',
    templateCustomization: ''
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
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
    // Save onboarding data
    localStorage.setItem('brand_onboarding', JSON.stringify(data));
    
    // Navigate to appropriate brand hub
    const hubRoute = data.businessType === 'enterprise' ? '/brand/enterprise' : '/brand/local';
    navigate(hubRoute);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.businessName && data.businessType && data.industry && data.location;
      case 2:
        return data.campaignType && data.targetAudience && data.budget && data.timeline;
      case 3:
        return data.selectedTemplate;
      default:
        return false;
    }
  };

  return (
    <>
      <Helmet>
        <title>Brand Onboarding | Family Office Marketplace</title>
        <meta name="description" content="Get started with your brand campaign management workspace" />
      </Helmet>

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
                    <Label>Business Type *</Label>
                    <div className="grid gap-3">
                      {businessTypes.map((type) => (
                        <Card 
                          key={type.value}
                          className={`cursor-pointer transition-all ${
                            data.businessType === type.value 
                              ? 'ring-2 ring-primary bg-primary/5' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setData({...data, businessType: type.value as 'enterprise' | 'local-business'})}
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <Select onValueChange={(value) => setData({...data, industry: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                          <SelectItem value="fashion">Fashion</SelectItem>
                          <SelectItem value="automotive">Automotive</SelectItem>
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Primary Location *</Label>
                      <Input
                        id="location"
                        value={data.location}
                        onChange={(e) => setData({...data, location: e.target.value})}
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <Select onValueChange={(value) => setData({...data, size: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Campaign Basics */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Your first campaign
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="campaignType">Campaign Type *</Label>
                    <Select onValueChange={(value) => setData({...data, campaignType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="What type of campaign?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product-launch">Product Launch</SelectItem>
                        <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                        <SelectItem value="local-event">Local Event</SelectItem>
                        <SelectItem value="seasonal">Seasonal Promotion</SelectItem>
                        <SelectItem value="ongoing">Ongoing Content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience *</Label>
                    <Textarea
                      id="targetAudience"
                      value={data.targetAudience}
                      onChange={(e) => setData({...data, targetAudience: e.target.value})}
                      placeholder="Describe your ideal audience (age, interests, location, etc.)"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Campaign Budget *</Label>
                      <Select onValueChange={(value) => setData({...data, budget: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-5k">Under $5,000</SelectItem>
                          <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                          <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                          <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                          <SelectItem value="over-100k">Over $100,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline *</Label>
                      <Select onValueChange={(value) => setData({...data, timeline: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Campaign length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-week">1 week</SelectItem>
                          <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                          <SelectItem value="1-3-months">1-3 months</SelectItem>
                          <SelectItem value="3-6-months">3-6 months</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Template Selection */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Choose your campaign template
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

                  {data.selectedTemplate && (
                    <div className="space-y-2">
                      <Label htmlFor="customization">Template Customization (Optional)</Label>
                      <Textarea
                        id="customization"
                        value={data.templateCustomization}
                        onChange={(e) => setData({...data, templateCustomization: e.target.value})}
                        placeholder="Any specific requirements or modifications for your campaign template?"
                        rows={3}
                      />
                    </div>
                  )}
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