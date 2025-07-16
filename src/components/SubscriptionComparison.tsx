import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Star } from 'lucide-react';

export function SubscriptionComparison() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Basic Subscription Card */}
      <Card className="p-6 bg-card shadow-lg rounded-2xl border-border">
        <h3 className="text-xl font-bold mb-4 text-foreground">Basic Subscription</h3>
        <ul className="mb-6 text-base list-disc ml-5 space-y-2 text-muted-foreground">
          <li>Net Worth & Account Aggregation</li>
          <li>Retirement & Goal Tracking</li>
          <li>Secure Document Vault</li>
          <li>Investment & Real Estate Tracking</li>
          <li>Social Security Optimizer</li>
          <li>Core Tax Planning Tools</li>
          <li>Education Library & Custom Guides</li>
          <li>Personalized Dashboard & Alerts</li>
          <li>Concierge Support</li>
        </ul>
        <Button variant="outline" disabled className="w-full">
          Included with Registration
        </Button>
      </Card>

      {/* Premium Services Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-lg rounded-2xl">
        <h3 className="text-xl font-bold mb-4 text-foreground flex items-center">
          Premium Services 
          <Star className="ml-2 h-5 w-5 text-primary fill-current" />
        </h3>
        <ul className="mb-6 text-base list-disc ml-5 space-y-2 text-muted-foreground">
          <li>Advanced Estate & Trust Planning</li>
          <li>Family Legacy Box™</li>
          <li>Private Market Alpha™ Access</li>
          <li>Healthcare Integration (HSA, advanced planning)</li>
          <li>Advanced Property Management</li>
          <li>Priority Advisor Access</li>
          <li>Concierge Family Support</li>
          <li>White-glove Onboarding</li>
        </ul>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank')}
        >
          <Lock className="inline mr-2 h-4 w-4" />
          Schedule Premium Review
        </Button>
      </Card>
    </div>
  );
}