import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Star, Shield, Users, Target, Clock, TrendingUp } from 'lucide-react';

interface PersonaData {
  id: string;
  title: string;
  icon: any;
  benefits: string[];
  tools: {
    basic: string[];
    premium: string[];
  };
  pricing: {
    basic: number;
    premium: number;
  };
  dashboardRoute: string;
}

const personaData: Record<string, PersonaData> = {
  'client-family': {
    id: 'client-family',
    title: 'Client / Family',
    icon: Users,
    benefits: [
      'Secure wealth dashboard with real-time portfolio tracking',
      'Investment & lending marketplace access',
      'Tax optimization & estate planning tools',
      'Family vault for documents & legacy content'
    ],
    tools: {
      basic: ['Portfolio Dashboard', 'Document Vault (2GB)', 'Basic Reporting', 'Mobile App Access'],
      premium: ['Unlimited Storage', 'Advanced Analytics', 'Estate Planning Suite', 'Tax Optimization', 'Family Collaboration Tools', 'Priority Support']
    },
    pricing: { basic: 29, premium: 79 },
    dashboardRoute: '/client'
  },
  'financial-advisor': {
    id: 'financial-advisor',
    title: 'Financial Advisor',
    icon: Target,
    benefits: [
      'Complete practice management suite',
      'AI-powered lead scoring & conversion engine',
      'Compliance automation & client analytics',
      'Branded client portals & reporting'
    ],
    tools: {
      basic: ['CRM (up to 50 clients)', 'Basic Compliance Tools', 'Standard Reporting', 'Email Support'],
      premium: ['Unlimited Clients', 'AI Lead Scoring', 'Automated Compliance', 'Advanced Analytics', 'White-label Portals', 'Marketplace Listing', 'Priority Support']
    },
    pricing: { basic: 49, premium: 149 },
    dashboardRoute: '/advisor'
  },
  'cpa-accountant': {
    id: 'cpa-accountant',
    title: 'CPA / Accountant',
    icon: Target,
    benefits: [
      'Client tax portal & document management',
      'CE tracking & automated marketing engine',
      'Compliance dashboard with deadline alerts',
      'Tax planning & preparation tools'
    ],
    tools: {
      basic: ['Client Portal', 'Document Storage', 'Basic Tax Tools', 'CE Tracking'],
      premium: ['Advanced Tax Planning', 'Automated Marketing', 'Multi-entity Support', 'Custom Reports', 'Compliance Automation', 'Priority Support']
    },
    pricing: { basic: 39, premium: 99 },
    dashboardRoute: '/accountant'
  },
  'attorney-legal': {
    id: 'attorney-legal',
    title: 'Attorney / Legal',
    icon: Shield,
    benefits: [
      'Estate & trust management platform',
      'Secure client vault & CLE tracking',
      'Legal compliance & deadline management',
      'Document automation & collaboration'
    ],
    tools: {
      basic: ['Document Management', 'Client Portal', 'CLE Tracking', 'Basic Compliance'],
      premium: ['Estate Planning Suite', 'Trust Management', 'Document Automation', 'Advanced Compliance', 'Client Collaboration', 'Priority Support']
    },
    pricing: { basic: 59, premium: 159 },
    dashboardRoute: '/attorney'
  },
  'insurance-medicare': {
    id: 'insurance-medicare',
    title: 'Insurance + Medicare Agent',
    icon: Shield,
    benefits: [
      'Policy management & client communications',
      'Medicare call recording compliance',
      'Lead generation & marketing tools',
      'Commission tracking & reporting'
    ],
    tools: {
      basic: ['Policy Tracking', 'Client Communications', 'Basic Compliance', 'Lead Management'],
      premium: ['Call Recording Compliance', 'Advanced Marketing', 'Commission Optimization', 'Medicare Tools', 'Automated Follow-ups', 'Priority Support']
    },
    pricing: { basic: 45, premium: 119 },
    dashboardRoute: '/insurance'
  },
  'healthcare-longevity': {
    id: 'healthcare-longevity',
    title: 'Healthcare & Longevity',
    icon: Target,
    benefits: [
      'Patient record vault & wellness tracking',
      'Advanced diagnostics marketplace',
      'Longevity planning & health optimization',
      'Secure HIPAA-compliant platform'
    ],
    tools: {
      basic: ['Patient Portal', 'Basic Records', 'Wellness Tracking', 'HIPAA Compliance'],
      premium: ['Advanced Diagnostics', 'Longevity Planning', 'Health Analytics', 'Marketplace Access', 'Research Tools', 'Priority Support']
    },
    pricing: { basic: 69, premium: 179 },
    dashboardRoute: '/healthcare'
  },
  'real-estate': {
    id: 'real-estate',
    title: 'Real Estate / Property',
    icon: Target,
    benefits: [
      'Property listings & management platform',
      'Tenant management & communication tools',
      'Client portal & transaction tracking',
      'Market analytics & reporting'
    ],
    tools: {
      basic: ['Property Listings', 'Basic CRM', 'Document Storage', 'Client Portal'],
      premium: ['Advanced Analytics', 'Tenant Management', 'Transaction Tracking', 'Market Insights', 'Automated Marketing', 'Priority Support']
    },
    pricing: { basic: 35, premium: 89 },
    dashboardRoute: '/realtor'
  },
  'elite-family-office': {
    id: 'elite-family-office',
    title: 'Elite Family Office Executive',
    icon: Star,
    benefits: [
      'Multi-entity management & oversight',
      'Premium analytics & concierge services',
      'Global asset tracking & compliance',
      'Family legacy vault & governance tools'
    ],
    tools: {
      basic: ['Multi-Entity Dashboard', 'Global Reporting', 'Document Vault', 'Basic Analytics'],
      premium: ['Unlimited Entities', 'AI Concierge', 'Advanced Compliance', 'Legacy Tools', 'White-glove Support', 'Custom Development']
    },
    pricing: { basic: 199, premium: 499 },
    dashboardRoute: '/elite-family-office'
  },
  'coach-consultant': {
    id: 'coach-consultant',
    title: 'Coach / Consultant',
    icon: Target,
    benefits: [
      'Client portal & booking system',
      'Marketing automation & lead generation',
      'Revenue optimization & analytics',
      'Content delivery & progress tracking'
    ],
    tools: {
      basic: ['Client Portal', 'Basic Scheduling', 'Document Sharing', 'Payment Processing'],
      premium: ['Advanced Marketing', 'AI Lead Scoring', 'Revenue Analytics', 'Course Management', 'Automated Campaigns', 'Priority Support']
    },
    pricing: { basic: 39, premium: 99 },
    dashboardRoute: '/coach'
  }
};

interface PersonaOnboardingFlowProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const PersonaOnboardingFlow: React.FC<PersonaOnboardingFlowProps> = ({ isOpen, onClose }) => {
  const { personaId } = useParams<{ personaId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium'>('premium');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: ''
  });

  const persona = personaId ? personaData[personaId] : null;

  if (!persona) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-background to-navy">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Persona not found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const IconComponent = persona.icon;

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - redirect to dashboard
      navigate(persona.dashboardRoute);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center mx-auto mb-8">
              <IconComponent className="w-12 h-12 text-navy" />
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
              Welcome to {persona.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the specialized tools and features designed specifically for your profession.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
              {persona.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-card border border-gold/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald flex-shrink-0 mt-1" />
                  <span className="text-foreground leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                Your Professional Toolkit
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore the tools and features available in your personalized platform.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: TrendingUp, title: 'Growth Tools', desc: 'Scale your practice with advanced analytics' },
                { icon: Shield, title: 'Compliance', desc: 'Stay compliant with automated monitoring' },
                { icon: Users, title: 'Client Management', desc: 'Comprehensive CRM and communication tools' },
                { icon: Clock, title: 'Automation', desc: 'Streamline workflows and save time' },
                { icon: Star, title: 'Premium Features', desc: 'Access exclusive professional tools' },
                { icon: Target, title: 'Lead Generation', desc: 'AI-powered lead scoring and conversion' }
              ].map((tool, index) => (
                <Card key={index} className="hover:border-gold/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <tool.icon className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground">{tool.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                Choose Your Plan
              </h2>
              <p className="text-lg text-muted-foreground">
                Select the plan that best fits your needs. You can upgrade anytime.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Basic Plan */}
              <Card className={`cursor-pointer transition-all duration-300 ${selectedTier === 'basic' ? 'border-gold ring-2 ring-gold/20' : 'border-border hover:border-gold/50'}`}
                    onClick={() => setSelectedTier('basic')}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Basic</CardTitle>
                      <div className="text-3xl font-bold text-foreground mt-2">
                        ${persona.pricing.basic}<span className="text-lg text-muted-foreground">/month</span>
                      </div>
                    </div>
                    {selectedTier === 'basic' && (
                      <Badge className="bg-gold text-navy">Selected</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {persona.tools.basic.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className={`cursor-pointer transition-all duration-300 relative ${selectedTier === 'premium' ? 'border-gold ring-2 ring-gold/20' : 'border-border hover:border-gold/50'}`}
                    onClick={() => setSelectedTier('premium')}>
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald text-white">
                  Most Popular
                </Badge>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Premium</CardTitle>
                      <div className="text-3xl font-bold text-foreground mt-2">
                        ${persona.pricing.premium}<span className="text-lg text-muted-foreground">/month</span>
                      </div>
                    </div>
                    {selectedTier === 'premium' && (
                      <Badge className="bg-gold text-navy">Selected</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {persona.tools.premium.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-md mx-auto space-y-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                Create Your Account
              </h2>
              <p className="text-lg text-muted-foreground">
                Just a few details to get started with your {selectedTier} plan.
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                  <Input 
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                  <Input 
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Smith"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company/Organization</label>
                <Input 
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Your Company Name"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald to-emerald/80 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Welcome to the Platform!
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your {persona.title} account has been created successfully. You're all set to access your personalized dashboard and start using your professional tools.
            </p>
            <Card className="max-w-md mx-auto bg-card/50 border-gold/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Account Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="text-foreground capitalize">{selectedTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Cost:</span>
                    <span className="text-foreground">${persona.pricing[selectedTier]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="text-foreground">{formData.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy">
      <div className="container mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Step {currentStep} of 5</span>
            <span className="text-sm text-muted-foreground">{Math.round((currentStep / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-gold to-emerald h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-12 flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            {currentStep === 1 ? 'Back to Home' : 'Previous'}
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-gold to-gold/90 text-navy font-bold hover:from-gold/90 hover:to-gold"
            disabled={currentStep === 4 && (!formData.email || !formData.firstName || !formData.lastName)}
          >
            {currentStep === 5 ? 'Access Dashboard' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};