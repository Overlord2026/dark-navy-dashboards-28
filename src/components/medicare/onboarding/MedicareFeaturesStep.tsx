import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  PhoneCall, 
  Shield, 
  FileText, 
  Mail, 
  Bot, 
  BarChart3, 
  Users, 
  Crown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const MedicareFeaturesStep = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const basicFeatures = [
    {
      id: 'call-recording',
      icon: <PhoneCall className="h-6 w-6" />,
      title: "Compliance Call Recording",
      description: "Twilio integration for automatic recording",
      details: "Every Medicare call is automatically recorded and timestamped with CMS-compliant metadata. Works for both inbound and outbound calls."
    },
    {
      id: 'secure-vault',
      icon: <Shield className="h-6 w-6" />,
      title: "Automatic Save to Secure Vault",
      description: "Date/time stamped storage",
      details: "All recordings are automatically saved to your secure, encrypted vault with proper categorization and search capabilities."
    },
    {
      id: 'compliance-folder',
      icon: <FileText className="h-6 w-6" />,
      title: "Medicare Compliance Folder",
      description: "Pre-configured organization",
      details: "Your vault comes pre-configured with Medicare-specific folders for SOA forms, call recordings, and compliance documents."
    },
    {
      id: 'soa-uploads',
      icon: <FileText className="h-6 w-6" />,
      title: "Basic SOA Form Uploads",
      description: "Manual form management",
      details: "Upload and organize Scope of Appointment forms with basic tagging and search functionality."
    },
    {
      id: 'email-templates',
      icon: <Mail className="h-6 w-6" />,
      title: "Starter Email/LinkedIn Templates",
      description: "Basic outreach tools",
      details: "Pre-built templates for Medicare prospect outreach via email and LinkedIn messaging."
    }
  ];

  const premiumFeatures = [
    {
      id: 'ai-assistant',
      icon: <Bot className="h-6 w-6" />,
      title: "AI Compliance Assistant 'Linda'",
      description: "Real-time disclosure checks",
      details: "AI-powered assistant provides real-time compliance guidance during calls, ensuring all required disclosures are made."
    },
    {
      id: 'analytics',
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics Dashboard",
      description: "Call counts, compliance, conversions",
      details: "Comprehensive analytics showing call volume, compliance pass/fail rates, conversion metrics, and ROI tracking."
    },
    {
      id: 'automated-soa',
      icon: <FileText className="h-6 w-6" />,
      title: "Automated SOA E-signature",
      description: "Digital workflow automation",
      details: "Automated SOA form generation, e-signature collection, and secure storage with audit trails."
    },
    {
      id: 'lead-engine',
      icon: <Mail className="h-6 w-6" />,
      title: "Lead-to-Sales Engine",
      description: "Multi-channel campaigns",
      details: "Advanced marketing automation with email, SMS, and LinkedIn campaigns, lead scoring, and nurture sequences."
    },
    {
      id: 'campaign-analytics',
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Campaign Analytics",
      description: "ROI and performance tracking",
      details: "Detailed campaign performance metrics, ROI calculations, and lead attribution across all channels."
    },
    {
      id: 'team-management',
      icon: <Users className="h-6 w-6" />,
      title: "Multi-Agent Team Management",
      description: "Team collaboration tools",
      details: "Manage multiple agents, assign leads, track performance, and collaborate on compliance requirements."
    }
  ];

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const FeatureCard = ({ feature, isPremium = false }: { feature: any, isPremium?: boolean }) => (
    <Card 
      key={feature.id} 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isPremium ? 'border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50' : ''
      }`}
      onClick={() => toggleCard(feature.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isPremium && <Crown className="h-5 w-5 text-yellow-600" />}
            {feature.icon}
            <CardTitle className="text-base">{feature.title}</CardTitle>
          </div>
          {expandedCard === feature.id ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        {isPremium && (
          <Badge variant="secondary" className="w-fit bg-yellow-100 text-yellow-800">
            Premium
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
        {expandedCard === feature.id && (
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm">{feature.details}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-xl text-muted-foreground">
          Start with our basic features or unlock the full power of Medicare compliance automation
        </p>
      </div>

      {/* Basic Features */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Badge variant="outline" className="mr-3 bg-blue-50 text-blue-700 border-blue-200">
            Basic (Free)
          </Badge>
          <h3 className="text-2xl font-semibold">Essential Compliance Tools</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {basicFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>

      {/* Premium Features */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Badge className="mr-3 bg-yellow-100 text-yellow-800 border-yellow-300">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
          <h3 className="text-2xl font-semibold">Advanced Growth & Automation</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {premiumFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} isPremium={true} />
          ))}
        </div>
      </div>

      <div className="text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-blue-200">
          <CardContent className="p-6">
            <p className="text-lg font-medium text-blue-800 mb-2">
              Ready to streamline your Medicare business?
            </p>
            <p className="text-blue-700">
              Click any card above to see detailed features, then proceed to account setup.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};