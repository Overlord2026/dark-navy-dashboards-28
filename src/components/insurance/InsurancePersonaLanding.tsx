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
  ArrowRight,
  Heart,
  DollarSign,
  Network
} from 'lucide-react';

export const InsurancePersonaLanding = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Client Policy Vault",
      description: "Secure storage for all insurance documents"
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: "Medicare Compliance Suite",
      description: "Complete CMS compliance tools and tracking"
    },
    {
      icon: <PhoneCall className="h-8 w-8 text-purple-600" />,
      title: "Call Recording & Archiving",
      description: "Automated compliance recording with timestamps"
    },
    {
      icon: <Users className="h-8 w-8 text-amber-600" />,
      title: "Client CRM & Communication",
      description: "Integrated client management and messaging"
    },
    {
      icon: <Network className="h-8 w-8 text-green-600" />,
      title: "Marketplace Access & Referrals",
      description: "Connect with advisors, CPAs, and attorneys"
    }
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: "Onboard & Invite Clients",
      description: "Set up your compliance-ready workspace and invite clients to their secure portal"
    },
    {
      step: 2,
      title: "Upload Policy & Health Data",
      description: "Store policies, Medicare plans, and health records securely"
    },
    {
      step: 3,
      title: "Automate Compliance & Follow-ups",
      description: "Enable call recording and set up automated client communications"
    },
    {
      step: 4,
      title: "Connect to Professional Network",
      description: "Join the BFO marketplace to expand your referral network"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
            Insurance + Medicare Professional
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Protect Health. Protect Wealth. All in One Place.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            For insurance professionals and Medicare experts who want to serve clients with next-level tools, 
            compliance-ready call recording, and direct integration with wealth & healthcare services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/insurance-onboarding')}
              className="text-lg px-8 py-6"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
            >
              See Premium Features
            </Button>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 via-emerald-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="p-12 text-center">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="flex flex-col items-center">
                  <Heart className="h-16 w-16 text-red-500 mb-2" />
                  <span className="text-sm font-medium">Health</span>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-green-500"></div>
                <div className="flex flex-col items-center">
                  <Shield className="h-16 w-16 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Protection</span>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-emerald-600"></div>
                <div className="flex flex-col items-center">
                  <DollarSign className="h-16 w-16 text-emerald-600 mb-2" />
                  <span className="text-sm font-medium">Wealth</span>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">
                Comprehensive insurance and Medicare solutions with wealth integration
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
            <h3 className="text-2xl font-bold mb-4 text-emerald-800">Join the Professional Network</h3>
            <p className="text-lg text-emerald-700 mb-6">
              Join forces with advisors, CPAs, and attorneys to support every dimension of your clients' 
              wealth and health. Create comprehensive protection strategies that go beyond insurance.
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <span className="text-sm font-medium">Financial Advisors</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <span className="text-sm font-medium">CPAs</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Attorneys</span>
              </div>
            </div>
            <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
              Explore Marketplace
            </Button>
          </CardContent>
        </Card>

        {/* Persona Selector */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">Not an insurance professional?</p>
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