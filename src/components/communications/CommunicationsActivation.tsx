import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Phone, 
  MessageSquare, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { NumberPortingWizard } from './NumberPortingWizard';
import { CommunicationsDashboard } from './CommunicationsDashboard';

interface CommunicationsActivationProps {
  persona: 'advisor' | 'attorney' | 'cpa' | 'client';
}

export function CommunicationsActivation({ persona }: CommunicationsActivationProps) {
  const [activationStep, setActivationStep] = useState<'intro' | 'setup' | 'active'>('intro');
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  const features = [
    {
      icon: Phone,
      title: "Unified Communications",
      description: "All calls, SMS, and voicemails in one secure dashboard"
    },
    {
      icon: Shield,
      title: "Compliance Ready",
      description: "SEC/FINRA compliant archiving and audit trails"
    },
    {
      icon: MessageSquare,
      title: "Professional Messaging",
      description: "Branded SMS campaigns and automated follow-ups"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share conversations and manage team communications"
    }
  ];

  const personaContent = {
    advisor: {
      title: "Activate Your Professional Communications Suite",
      subtitle: "Streamline client communications with your dedicated business line",
      benefits: [
        "Keep personal and business communications separate",
        "Automated lead nurturing and client follow-ups",
        "Compliance-ready call and message archiving",
        "Integration with CRM and calendar systems"
      ]
    },
    attorney: {
      title: "Secure Legal Communications Platform",
      subtitle: "Professional communications with built-in privilege protection",
      benefits: [
        "Attorney-client privilege compliant messaging",
        "Secure document sharing via SMS/calls",
        "Case-specific communication threading",
        "Automatic litigation hold capabilities"
      ]
    },
    cpa: {
      title: "Professional Tax & Accounting Communications",
      subtitle: "Secure client communications during tax season and beyond",
      benefits: [
        "Encrypted messaging for sensitive financial data",
        "Appointment reminders and document requests",
        "Multi-client communication management",
        "Integration with tax software and workflows"
      ]
    },
    client: {
      title: "Private Family Communications Hub",
      subtitle: "Secure messaging with your advisors and service providers",
      benefits: [
        "Direct line to your advisory team",
        "Secure messaging for sensitive topics",
        "Appointment scheduling and reminders",
        "Document sharing and approvals"
      ]
    }
  };

  const content = personaContent[persona];

  if (activationStep === 'active') {
    return <CommunicationsDashboard persona={persona} />;
  }

  if (activationStep === 'setup') {
    return (
      <NumberPortingWizard
        onComplete={(number) => {
          setPhoneNumber(number);
          setActivationStep('active');
        }}
        onCancel={() => setActivationStep('intro')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <Badge variant="secondary" className="text-sm">New Feature</Badge>
          </div>
          <CardTitle className="text-2xl mb-2">{content.title}</CardTitle>
          <CardDescription className="text-lg">{content.subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <strong>Launch Special:</strong> Get your first 3 months free with any new number activation. 
              Start building your professional communications platform today!
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">What You Get:</h3>
              <ul className="space-y-3">
                {content.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform Features:</h3>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-white/50 border">
                    <feature.icon className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-medium">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center pt-6 border-t">
            <Button 
              size="lg" 
              onClick={() => setActivationStep('setup')}
              className="text-lg px-8"
            >
              Activate Communications
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Setup takes less than 5 minutes • No contracts required • Cancel anytime
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-6">
            <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Port or Choose</h3>
            <p className="text-sm text-muted-foreground">
              Keep your existing number or select a new professional line
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Instant Activation</h3>
            <p className="text-sm text-muted-foreground">
              Start making calls and sending messages within minutes
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Always Compliant</h3>
            <p className="text-sm text-muted-foreground">
              Built-in archiving and security for professional standards
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}