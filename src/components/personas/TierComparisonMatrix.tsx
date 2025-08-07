import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Crown, Lock, Star } from "lucide-react";

interface Feature {
  name: string;
  basic: boolean;
  premium: boolean;
  description?: string;
}

interface PersonaFeatures {
  persona: string;
  icon: React.ReactNode;
  color: string;
  features: Feature[];
}

const personaFeatures: PersonaFeatures[] = [
  {
    persona: "Advisors/RIAs",
    icon: "📊",
    color: "blue",
    features: [
      { name: "Dashboard & CRM", basic: true, premium: true },
      { name: "Client Onboarding (Magic Link)", basic: true, premium: true },
      { name: "Practice Library & Document Vault", basic: true, premium: true },
      { name: "Portfolio & Risk Analysis", basic: true, premium: true },
      { name: "CE/ADV Tracking & Automation", basic: false, premium: true },
      { name: "Lead to Sales Engine", basic: false, premium: true },
      { name: "Campaign Management/Tracking", basic: false, premium: true },
      { name: "Custom Reports & Branding", basic: false, premium: true },
      { name: "AI Copilot/Meeting Analytics", basic: false, premium: true },
      { name: "Bulk/White-label Invites", basic: false, premium: true },
      { name: "Family/Household Portals", basic: true, premium: true },
      { name: "Mobile App Access", basic: true, premium: true },
      { name: "Email/SMS Integration", basic: true, premium: true },
      { name: "Referral & Leaderboard System", basic: true, premium: true },
      { name: "Compliance Dashboard", basic: true, premium: true, description: "Limited in Basic, Full in Premium" },
      { name: "Concierge Support", basic: false, premium: true }
    ]
  },
  {
    persona: "Accountants/CPAs",
    icon: "🧮",
    color: "green",
    features: [
      { name: "Client Management Dashboard", basic: true, premium: true },
      { name: "Secure Document Upload/Vault", basic: true, premium: true },
      { name: "File Sharing & eSign", basic: true, premium: true },
      { name: "Tax Planning & Calculators", basic: true, premium: true },
      { name: "CE Tracker/Automation", basic: false, premium: true },
      { name: "Lead to Sales Engine", basic: false, premium: true },
      { name: "Campaign Tracking/Analytics", basic: false, premium: true },
      { name: "Bulk Client Onboarding", basic: false, premium: true },
      { name: "Practice Insights & Analytics", basic: true, premium: true, description: "Basic insights vs Advanced analytics" },
      { name: "Integration with QuickBooks, Gusto", basic: false, premium: true },
      { name: "AI-Powered Tax Scanning", basic: false, premium: true },
      { name: "SMS/Voice Integration", basic: true, premium: true },
      { name: "Compliance Audit Log", basic: true, premium: true, description: "Basic logging vs Full audit trail" }
    ]
  },
  {
    persona: "Attorneys/Legal",
    icon: "⚖️",
    color: "purple",
    features: [
      { name: "Client & Matter Dashboard", basic: true, premium: true },
      { name: "Contract & Doc Library", basic: true, premium: true },
      { name: "CLE Tracker/Alert", basic: true, premium: true },
      { name: "ADV/Regulatory Automation", basic: false, premium: true },
      { name: "Lead to Sales Engine", basic: false, premium: true },
      { name: "Referral CRM", basic: true, premium: true },
      { name: "Client Portal & Messaging", basic: true, premium: true },
      { name: "Advanced Workflow Automation", basic: false, premium: true },
      { name: "Team Collaboration", basic: true, premium: true },
      { name: "Invoice/Payment Integration", basic: true, premium: true }
    ]
  },
  {
    persona: "Realtors/Property Managers",
    icon: "🏡",
    color: "orange",
    features: [
      { name: "Property Listings Dashboard", basic: true, premium: true },
      { name: "Rent/Bill Tracker", basic: true, premium: true },
      { name: "Owner/Client Portal", basic: true, premium: true },
      { name: "File & Doc Management", basic: true, premium: true },
      { name: "Lead to Sales Engine", basic: false, premium: true },
      { name: "Campaign/Marketing Automation", basic: false, premium: true },
      { name: "eSign Rental Agreements", basic: false, premium: true },
      { name: "Tenant Screening Integration", basic: true, premium: true },
      { name: "Task Scheduling", basic: true, premium: true }
    ]
  },
  {
    persona: "Consultants/Coaches/Healthcare",
    icon: "💡",
    color: "teal",
    features: [
      { name: "Project/Client Dashboard", basic: true, premium: true },
      { name: "Practice Resource Library", basic: true, premium: true },
      { name: "Secure Messaging", basic: true, premium: true },
      { name: "Lead to Sales Engine", basic: false, premium: true },
      { name: "Bulk Invite & Portal Creation", basic: false, premium: true },
      { name: "Campaign Analytics", basic: false, premium: true },
      { name: "CE/CME/CLE Tracker (as needed)", basic: false, premium: true },
      { name: "Outcome/Engagement Analytics", basic: true, premium: true },
      { name: "Mobile App Access", basic: true, premium: true }
    ]
  }
];

export const TierComparisonMatrix: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState(0);

  const FeatureRow = ({ feature }: { feature: Feature }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-border last:border-b-0">
      <div className="flex flex-col">
        <span className="font-medium text-sm">{feature.name}</span>
        {feature.description && (
          <span className="text-xs text-muted-foreground">{feature.description}</span>
        )}
      </div>
      <div className="flex items-center justify-center">
        {feature.basic ? (
          <Check className="h-5 w-5 text-green-600" />
        ) : (
          <X className="h-5 w-5 text-red-500" />
        )}
      </div>
      <div className="flex items-center justify-center">
        {feature.premium ? (
          <div className="flex items-center gap-1">
            <Check className="h-5 w-5 text-green-600" />
            {!feature.basic && <Crown className="h-4 w-4 text-yellow-500" />}
          </div>
        ) : (
          <X className="h-5 w-5 text-red-500" />
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Practice Management Feature Matrix</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Compare Basic vs Premium features across all professional personas. 
          Each practice type has specialized tools designed for their unique needs.
        </p>
      </div>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comparison">Feature Comparison</TabsTrigger>
          <TabsTrigger value="benefits">Upgrade Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          {/* Persona Selector */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {personaFeatures.map((persona, index) => (
              <Button
                key={index}
                variant={selectedPersona === index ? "default" : "outline"}
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => setSelectedPersona(index)}
              >
                <span className="text-2xl">{persona.icon}</span>
                <span className="text-sm font-medium text-center">
                  {persona.persona}
                </span>
              </Button>
            ))}
          </div>

          {/* Feature Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{personaFeatures[selectedPersona].icon}</span>
                {personaFeatures[selectedPersona].persona} Features
              </CardTitle>
              <CardDescription>
                Compare Basic and Premium plan features for {personaFeatures[selectedPersona].persona.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4 pb-3 border-b border-border font-semibold">
                <div>Feature</div>
                <div className="text-center">
                  <Badge variant="outline">Basic Plan</Badge>
                </div>
                <div className="text-center">
                  <Badge className="bg-primary text-primary-foreground">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium Plan
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-0">
                {personaFeatures[selectedPersona].features.map((feature, index) => (
                  <FeatureRow key={index} feature={feature} />
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Premium Upgrade Benefits</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Unlock all premium features marked with <Crown className="inline h-3 w-3 mx-1 text-yellow-500" /></li>
                  <li>• Advanced automation and AI-powered tools</li>
                  <li>• Enhanced analytics and reporting</li>
                  <li>• Priority support and dedicated assistance</li>
                  <li>• White-label capabilities for your brand</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Plan Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-500" />
                  Basic Plan Benefits
                </CardTitle>
                <CardDescription>Essential tools for professional practice management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Complete dashboard and client management system
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Secure document vault and file sharing
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Client portal and messaging system
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Basic compliance tracking and alerts
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Mobile app access for on-the-go management
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Standard email and SMS integration
                  </li>
                </ul>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium">Perfect for:</p>
                  <p className="text-xs text-muted-foreground">
                    Solo practitioners and small practices getting started with digital practice management
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Premium Plan Benefits */}
            <Card className="border-primary bg-gradient-to-b from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Premium Plan Benefits
                </CardTitle>
                <CardDescription>Advanced automation and growth tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Crown className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    AI-powered automation and analytics
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Advanced lead generation and sales engine
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Bulk operations and white-label capabilities
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Campaign management and tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Advanced compliance automation
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Priority support and dedicated assistance
                  </li>
                </ul>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium">Perfect for:</p>
                  <p className="text-xs text-muted-foreground">
                    Growing practices ready to scale with automation, advanced analytics, and premium features
                  </p>
                </div>
                <Button className="w-full gap-2 mt-4">
                  <Crown className="h-4 w-4" />
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about our pricing tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How do I upgrade to Premium?</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the "Upgrade to Premium" button in your dashboard or contact our support team. 
                    Upgrades are processed immediately and you'll have access to all premium features.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What's included in Premium?</h4>
                  <p className="text-sm text-muted-foreground">
                    Premium includes all Basic features plus advanced automation, AI-powered tools, 
                    campaign management, bulk operations, priority support, and white-label capabilities.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I purchase Premium seats for my team?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! Practice managers and admins can bulk purchase Premium seats for their team members. 
                    Contact us for volume pricing and team management options.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Is there a trial period for Premium?</h4>
                  <p className="text-sm text-muted-foreground">
                    New users get a 30-day trial of Premium features. Existing Basic users can upgrade 
                    and try Premium for 14 days with a money-back guarantee.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};