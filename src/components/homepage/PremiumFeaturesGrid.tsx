import React from "react";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, CheckCircle } from "lucide-react";

const basicFeatures = [
  "Financial Planning Tools",
  "Basic Investment Tracking", 
  "Expense Management",
  "Document Storage",
  "Mobile App Access",
  "Email Support"
];

const premiumFeatures = [
  { name: "Advanced Estate Planning", locked: true },
  { name: "Private Market Alpha™", locked: true },
  { name: "Family Legacy Box™", locked: true },
  { name: "Concierge Family Support", locked: true },
  { name: "Tax Optimization Engine", locked: true },
  { name: "Dedicated Family Office Advisor", locked: true }
];

export const PremiumFeaturesGrid = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need. All in One Place.
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Compare our Basic Subscription with Premium Family Office Services
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic Subscription */}
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-2">Basic Subscription</h3>
              <p className="text-muted-foreground">Essential financial tools</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {basicFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              Current Plan
            </Button>
          </div>

          {/* Premium Services */}
          <div className="bg-card border border-primary/20 rounded-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium">
              Premium
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-2">Premium Family Office</h3>
              <p className="text-muted-foreground">Comprehensive wealth management</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {basicFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
              
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 relative">
                  {feature.locked ? (
                    <>
                      <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground filter blur-sm">{feature.name}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-foreground">{feature.name}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Unlock Premium
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Premium CTA Section */}
        <div className="mt-16 text-center bg-primary/5 rounded-lg p-8 border border-primary/20">
          <h3 className="text-2xl font-semibold mb-4">
            Ready to Access Premium Services?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Unlock advanced estate planning, private market opportunities, and dedicated family office support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Book Complimentary Review
            </Button>
            <Button variant="outline">
              Learn More About Premium
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};