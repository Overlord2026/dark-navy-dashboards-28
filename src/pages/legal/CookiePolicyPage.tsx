import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Cookie, Settings, BarChart, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CookiePolicyPage() {
  const navigate = useNavigate();

  const cookieTypes = [
    {
      icon: Shield,
      name: "Essential Cookies",
      purpose: "Required for platform functionality",
      examples: "Authentication, security, session management",
      canDisable: false,
      color: "bg-green-100 text-green-800"
    },
    {
      icon: BarChart,
      name: "Analytics Cookies",
      purpose: "Help us understand usage patterns",
      examples: "Page views, user flows, performance metrics",
      canDisable: true,
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: Settings,
      name: "Functional Cookies",
      purpose: "Remember your preferences",
      examples: "Language, dashboard layout, notification settings",
      canDisable: true,
      color: "bg-purple-100 text-purple-800"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <Cookie className="h-8 w-8 text-primary" />
              Cookie Policy
            </CardTitle>
            <p className="text-muted-foreground">How we use cookies and similar technologies</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm">
                We use cookies to enhance your experience, provide secure access to your account, and improve our services. 
                You can manage your cookie preferences through your browser settings.
              </p>
            </div>

            <div className="grid gap-4">
              {cookieTypes.map((type, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <type.icon className="h-6 w-6 text-primary mt-1" />
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{type.name}</h3>
                            <Badge className={type.color}>
                              {type.canDisable ? "Optional" : "Required"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{type.purpose}</p>
                          <p className="text-xs text-gray-500">Examples: {type.examples}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="prose prose-sm max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Managing Cookies</h2>
                <p>You can control cookies through:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Browser settings to block or delete cookies</li>
                  <li>Our cookie banner when you first visit</li>
                  <li>Account settings for functional preferences</li>
                  <li>Opt-out links for third-party analytics</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Third-Party Cookies</h2>
                <p>We may use services that set their own cookies:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Google Analytics (with IP anonymization)</li>
                  <li>Stripe for payment processing</li>
                  <li>Customer support chat services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Cookie Retention</h2>
                <p>Different cookies have different lifespans:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Session cookies: Deleted when you close your browser</li>
                  <li>Persistent cookies: Stored for up to 2 years</li>
                  <li>Analytics cookies: 24 months maximum</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Contact</h2>
                <p>Questions about cookies? Contact privacy@familyoffice.com</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}