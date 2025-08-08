import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, PhoneCall, Users, TrendingUp, FileText, CheckCircle2, Network } from 'lucide-react';

export const InsuranceWelcomeStep = () => {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Client Policy Vault",
      description: "Secure storage and sharing for all insurance policies and documents"
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: "Medicare Compliance Suite",
      description: "Complete CMS compliance tools with call recording and archiving"
    },
    {
      icon: <PhoneCall className="h-8 w-8 text-purple-600" />,
      title: "Call Recording & Archiving",
      description: "Automated Medicare call recording with timestamp compliance"
    },
    {
      icon: <Users className="h-8 w-8 text-amber-600" />,
      title: "Client CRM & Communication Hub",
      description: "Integrated client management with secure messaging platform"
    },
    {
      icon: <Network className="h-8 w-8 text-green-600" />,
      title: "Marketplace Access & Referrals",
      description: "Connect with financial advisors, CPAs, and attorneys for cross-referrals"
    }
  ];

  return (
    <div className="text-center">
      <div className="mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-100 to-emerald-100 p-4 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Welcome to Your Insurance & Medicare Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Here's how you can manage policies, ensure Medicare compliance, and expand into the BFO Marketplace:
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mb-8">
        {features.map((feature, index) => (
          <Card key={index} className="text-left hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                {feature.icon}
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              Medicare Compliance Made Simple
            </h3>
            <p className="text-blue-700 mb-4">
              Stay ahead of CMS requirements with automated call recording, secure storage, 
              and AI-powered compliance checks on every Medicare interaction.
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Automatic call recording and timestamping</li>
              <li>• CMS-compliant data storage and archiving</li>
              <li>• State-specific compliance rule enforcement</li>
              <li>• AI-powered transcript analysis and flagging</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-50 to-purple-50 border border-emerald-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-emerald-800">
              Integrated Wealth & Health Protection
            </h3>
            <p className="text-emerald-700 mb-4">
              Connect insurance and Medicare solutions with comprehensive wealth management 
              through our professional marketplace network.
            </p>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Cross-referrals with financial advisors</li>
              <li>• Estate planning integration with attorneys</li>
              <li>• Tax-efficient insurance strategies with CPAs</li>
              <li>• Holistic client protection planning</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};