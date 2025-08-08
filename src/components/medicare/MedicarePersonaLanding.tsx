import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  PhoneCall, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  FileText,
  ArrowRight
} from 'lucide-react';

export const MedicarePersonaLanding = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <PhoneCall className="h-8 w-8 text-blue-600" />,
      title: "Call Recording & Archiving",
      description: "CMS-compliant recording with secure storage"
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: "Secure Document Vault",
      description: "Bank-level storage for client files"
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-purple-600" />,
      title: "Integrated SMS & Voice",
      description: "Twilio-powered communication platform"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Lead-to-Sales Engine",
      description: "Multi-channel marketing automation"
    },
    {
      icon: <Users className="h-8 w-8 text-amber-600" />,
      title: "Client Portal Access",
      description: "Education hub and secure communication"
    }
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: "Onboard & Import Clients",
      description: "Set up your compliance-ready workspace"
    },
    {
      step: 2,
      title: "Set Up Compliance Recording",
      description: "Connect Twilio for automatic call capture"
    },
    {
      step: 3,
      title: "Share Educational Content",
      description: "Provide value through client portal"
    },
    {
      step: 4,
      title: "Track Leads & Conversions",
      description: "Monitor performance with built-in analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
            Medicare Insurance Professional
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Compliance, Connection, and Client Care — All in One Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Designed for Medicare specialists who demand efficiency, compliance, and client trust.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/medicare-onboarding')}
              className="text-lg px-8 py-6"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/medicare-onboarding')}
              className="text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-blue-200">
            <CardContent className="p-12 text-center">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <PhoneCall className="h-16 w-16 text-blue-600" />
                <Shield className="h-16 w-16 text-emerald-600" />
                <FileText className="h-16 w-16 text-purple-600" />
              </div>
              <p className="text-lg text-muted-foreground">
                Agent on call with compliance checklist & secure vault integration
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Strip */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-sm mb-2">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Marketplace Teaser */}
        <Card className="mb-16 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-emerald-800">Expand Your Network</h3>
            <p className="text-lg text-emerald-700 mb-6">
              Connect with Advisors, Attorneys, and CPAs to expand your referral network 
              and provide comprehensive service to your Medicare clients.
            </p>
            <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
              Explore Marketplace
            </Button>
          </CardContent>
        </Card>

        {/* Persona Selector */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">Not a Medicare agent?</p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/personas')}
                className="w-full"
              >
                See All Personas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};