import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Shield, ArrowRight, Vault, Building, MapPin, Calculator, FileText, Calendar } from 'lucide-react';
import PricingBadge from '@/components/pricing/PricingBadge';

const Slide = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`min-h-screen w-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-surface via-navy to-cardBg ${className}`}>
    {children}
  </div>
);

const FeatureIcon = ({ type }: { type: string }) => {
  const icons = {
    vault: <Vault className="h-8 w-8 text-gold" />,
    property: <Building className="h-8 w-8 text-aqua" />,
    roadmap: <MapPin className="h-8 w-8 text-success" />,
    tax: <Calculator className="h-8 w-8 text-gold" />,
    estate: <FileText className="h-8 w-8 text-aqua" />,
    calendar: <Calendar className="h-8 w-8 text-success" />
  };
  return icons[type as keyof typeof icons] || <FileText className="h-8 w-8 text-gold" />;
};

export default function ClientFamilySolutionsDeck() {
  return (
    <div className="deck-container font-body text-textPrimary">
      {/* Slide 1: Title & Value Proposition */}
      <Slide className="text-center">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold text-textPrimary leading-tight">
              Your Entire Family's<br />
              <span className="text-gold">Wealth, Health & Legacy</span><br />
              In One Secure Platform
            </h1>
            <p className="text-2xl text-textSecondary max-w-4xl mx-auto leading-relaxed">
              From daily finances to 100-year plans, everything you need to protect and grow your life's work.
            </p>
          </div>
          
          <div className="bg-cardBg/50 rounded-2xl p-8 border border-border">
            <img 
              src="/api/placeholder/800/400" 
              alt="Family Dashboard Screenshot" 
              className="w-full rounded-xl shadow-2xl"
            />
          </div>
          
          <Button size="lg" className="bg-gold text-navy font-bold px-12 py-6 text-xl rounded-xl hover:bg-gold/90 shadow-2xl">
            Start with a 90-day free trial
          </Button>
        </div>
      </Slide>

      {/* Slide 2: The Problems Families Face */}
      <Slide className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-surface/90" />
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold text-textPrimary mb-12">
            The Problems Families Face
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Scattered accounts, documents, and advisors",
              "Multiple logins and subscriptions for budgeting, retirement planning, estate planning, and property management", 
              "No single place to track, store, and plan",
              "Expensive, redundant tools without integration"
            ].map((problem, index) => (
              <Card key={index} className="bg-cardBg/80 border-border/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-error/20 rounded-full flex items-center justify-center">
                      <X className="h-5 w-5 text-error" />
                    </div>
                    <p className="text-lg text-textPrimary leading-relaxed">{problem}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Slide>

      {/* Slide 3: Our All-in-One Solution */}
      <Slide>
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <h2 className="text-5xl font-bold text-textPrimary mb-16">
            Our All-in-One Solution
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Family Vault™",
                description: "Secure storage for wills, trusts, healthcare directives",
                icon: "vault"
              },
              {
                name: "Property & Asset Manager", 
                description: "Track homes, rentals, collectibles, digital assets",
                icon: "property"
              },
              {
                name: "SWAG™ Retirement Roadmap",
                description: "Stress test and scenario model your future",
                icon: "roadmap"
              },
              {
                name: "Advanced Tax Planning",
                description: "Roth conversion analyzer, state residency optimization",
                icon: "tax"
              },
              {
                name: "Estate Planning Suite",
                description: "From basic wills to advanced trust calculators",
                icon: "estate"
              },
              {
                name: "Integrated Family Calendar & Budgeting",
                description: "Unified financial and life management tools",
                icon: "calendar"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-cardBg border-border hover:border-gold/50 transition-all group">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex justify-center mb-4">
                    <FeatureIcon type={feature.icon} />
                  </div>
                  <h3 className="text-xl font-bold text-textPrimary group-hover:text-gold transition-colors">
                    {feature.name}
                  </h3>
                  <p className="text-textSecondary leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Slide>

      {/* Slide 4: Platform in Action */}
      <Slide>
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <h2 className="text-5xl font-bold text-textPrimary mb-16">
            Platform in Action
          </h2>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              { step: 1, title: "Log in to your Family Dashboard", desc: "Single secure access point" },
              { step: 2, title: "View Net Worth & Key Alerts", desc: "e.g., upcoming tax deadlines" },
              { step: 3, title: "Scenario Test Your Retirement in SWAG", desc: "Model different scenarios" },
              { step: 4, title: "Store or Update Estate Documents", desc: "In Family Vault" },
              { step: 5, title: "Share Access with Trusted Advisors", desc: "Or heirs securely" }
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <Card className="bg-cardBg border-border w-80">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-gold text-navy rounded-full flex items-center justify-center font-bold text-lg mx-auto">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-textPrimary">{item.title}</h3>
                    <p className="text-sm text-textSecondary">{item.desc}</p>
                    <img src="/api/placeholder/300/200" alt={`Step ${item.step}`} className="w-full rounded-lg" />
                  </CardContent>
                </Card>
                {index < 4 && <ArrowRight className="h-8 w-8 text-gold mx-4" />}
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* Slide 5: Core Features by Tier */}
      <Slide>
        <div className="max-w-6xl mx-auto space-y-12">
          <h2 className="text-5xl font-bold text-textPrimary text-center mb-16">
            Core Features by Tier
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Basic",
                price: "$19/mo",
                features: {
                  "Net worth tracking": true,
                  "Family Vault storage": true,
                  "Budget tool": true,
                  "SWAG Retirement Roadmap": false,
                  "Advanced Tax Planning": false,
                  "Property Manager": false,
                  "Dedicated Advisor Access": false,
                  "Custom Reports": false,
                  "Unlimited Storage & Concierge": false
                }
              },
              {
                name: "Premium",
                price: "$49/mo",
                popular: true,
                features: {
                  "Net worth tracking": true,
                  "Family Vault storage": true,
                  "Budget tool": true,
                  "SWAG Retirement Roadmap": true,
                  "Advanced Tax Planning": true,
                  "Property Manager": true,
                  "Dedicated Advisor Access": true,
                  "Custom Reports": false,
                  "Unlimited Storage & Concierge": false
                }
              },
              {
                name: "Elite",
                price: "$99/mo",
                features: {
                  "Net worth tracking": true,
                  "Family Vault storage": true,
                  "Budget tool": true,
                  "SWAG Retirement Roadmap": true,
                  "Advanced Tax Planning": true,
                  "Property Manager": true,
                  "Dedicated Advisor Access": true,
                  "Custom Reports": true,
                  "Unlimited Storage & Concierge": true
                }
              }
            ].map((tier, index) => (
              <Card key={index} className={`${tier.popular ? 'ring-2 ring-gold' : ''} bg-cardBg border-border relative`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gold text-navy font-bold px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-textPrimary">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-gold">{tier.price}</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(tier.features).map(([feature, included]) => (
                    <div key={feature} className="flex items-center space-x-3">
                      {included ? (
                        <Check className="h-5 w-5 text-success" />
                      ) : (
                        <X className="h-5 w-5 text-error" />
                      )}
                      <span className={`text-sm ${included ? 'text-textPrimary' : 'text-textSecondary'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Slide>

      {/* Slide 6: Pricing & Savings */}
      <Slide>
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <h2 className="text-5xl font-bold text-textPrimary mb-16">
            Pricing & Savings
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-cardBg border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-textPrimary">Monthly Billing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-surface rounded-lg">
                  <PricingBadge planKey="free" />
                  <span className="text-xl font-bold text-gold">$19</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-surface rounded-lg">
                  <PricingBadge planKey="premium" />
                  <span className="text-xl font-bold text-gold">$49</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-surface rounded-lg">
                  <PricingBadge planKey="pro" />
                  <span className="text-xl font-bold text-gold">$99</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cardBg border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-textPrimary">Annual Billing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-surface rounded-lg">
                  <PricingBadge planKey="free" />
                  <span className="text-xl font-bold text-gold">$200</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-surface rounded-lg">
                  <PricingBadge planKey="premium" />
                  <span className="text-xl font-bold text-gold">$500</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-surface rounded-lg">
                  <PricingBadge planKey="pro" />
                  <span className="text-xl font-bold text-gold">$1,000</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-success/20 border border-success/50 rounded-xl p-6">
            <p className="text-xl font-bold text-success">
              Save up to 16% when billed annually
            </p>
          </div>
        </div>
      </Slide>

      {/* Slide 7: Compliance & Security */}
      <Slide className="relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Shield className="h-96 w-96 text-textPrimary" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
          <h2 className="text-5xl font-bold text-textPrimary mb-16">
            Compliance & Security
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "End-to-end encryption",
              "FINRA & SEC best-practice compliant for financial data retention",
              "HIPAA-aligned health records protection", 
              "Audit-ready storage and activity logs"
            ].map((feature, index) => (
              <Card key={index} className="bg-cardBg/80 border-border/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                      <Check className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-lg text-textPrimary leading-relaxed">{feature}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Slide>

      {/* Slide 8: TCO Advantage */}
      <Slide>
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-5xl font-bold text-textPrimary text-center mb-16">
            TCO Advantage: All-in-One vs Separate Tools
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-error/10 border-error/30">
              <CardHeader>
                <CardTitle className="text-2xl text-textPrimary text-center">Without Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Budgeting App", cost: "$10/mo" },
                  { name: "Retirement Planner", cost: "$30/mo" },
                  { name: "Estate Planning Service", cost: "$25/mo" },
                  { name: "Secure Document Vault", cost: "$15/mo" },
                  { name: "Tax Planning Tool", cost: "$20/mo" }
                ].map((tool, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-surface/50 rounded-lg">
                    <span className="text-textPrimary">{tool.name}</span>
                    <span className="text-error font-bold">{tool.cost}</span>
                  </div>
                ))}
                <div className="border-t border-error/30 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-textPrimary">Total:</span>
                    <span className="text-2xl font-bold text-error">~$1,200/year</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-success/10 border-success/30">
              <CardHeader>
                <CardTitle className="text-2xl text-textPrimary text-center">With Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-success">Premium Plan: $500/year</div>
                  <div className="text-xl text-textPrimary">
                    <span className="text-success font-bold">Savings: ~$700/year</span><br />
                    + full integration, single login, compliance included
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-success/30">
                  <Button size="lg" className="w-full bg-success text-textPrimary font-bold py-4 text-xl hover:bg-success/90">
                    Join Now – Your First 90 Days Are On Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Slide>
    </div>
  );
}