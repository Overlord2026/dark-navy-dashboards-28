import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneCall, Shield, Users, TrendingUp, CheckCircle2 } from 'lucide-react';

export const MedicareWelcomeStep = () => {
  const features = [
    {
      icon: <PhoneCall className="h-8 w-8 text-blue-600" />,
      title: "Record and store all Medicare calls automatically",
      description: "Twilio integration ensures compliance from day one"
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: "Manage your clients, leads, and compliance forms",
      description: "Everything organized in your secure vault"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Grow your business with built-in marketing tools",
      description: "Lead-to-sales engine and analytics included"
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
          Welcome to Your Medicare Compliance Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Here's what you'll be able to do:
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

      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg p-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">
          CMS Compliance Made Simple
        </h3>
        <p className="text-blue-700">
          Stay ahead of Medicare regulations with automated recording, secure storage, 
          and AI-powered compliance checks on every call.
        </p>
      </div>
    </div>
  );
};