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
      icon: <CheckCircle2 className="h-8 w-8 text-emerald-600" />,
      title: "Compliance-Ready from Day One",
      description: "Built-in CMS compliance tools and workflows"
    },
    {
      icon: <PhoneCall className="h-8 w-8 text-blue-600" />,
      title: "Automatic Call Recording & Storage",
      description: "Secure, timestamped recordings in your vault"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Client & Lead Management",
      description: "CRM designed for Medicare agents"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Growth Tools",
      description: "Marketing automation to expand your book"
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
            Your All-In-One Medicare Compliance & Growth Hub
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Stay compliant, close more sales, and grow your Medicare book with ease.
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

        {/* Benefits Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

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