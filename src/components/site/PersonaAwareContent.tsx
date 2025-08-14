"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, TrendingUp, Shield, Calendar, DollarSign } from "lucide-react";
import AudienceGuard from "@/components/AudienceGuard";

export function PersonaAwareContent() {
  const navigate = useNavigate();
  const [group, setGroup] = useState<"family" | "pro">("family");
  
  useEffect(() => {
    const v = (localStorage.getItem("persona_group") as "family" | "pro") || "family";
    setGroup(v);
    const handler = (e: any) => setGroup(e.detail?.group ?? "family");
    window.addEventListener("persona-switched", handler);
    return () => window.removeEventListener("persona-switched", handler);
  }, []);

  return (
    <div className="space-y-16 py-16">
      {/* Professional Paths - Only for Pros */}
      <AudienceGuard audience="pro">
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Professional Path</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tailored tools and workflows for every type of financial services professional
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Financial Advisors",
                description: "Client management, compliance tools, and automated workflows",
                href: "/advisor",
                badge: "Most Popular",
                icon: TrendingUp
              },
              {
                title: "CPAs & Accountants", 
                description: "Tax planning, bookkeeping integration, and client portals",
                href: "/accountant",
                icon: DollarSign
              },
              {
                title: "Estate Attorneys",
                description: "Document management, client communication, and estate workflows",
                href: "/attorney",
                icon: Shield
              },
              {
                title: "Insurance Agents",
                description: "Policy management, client tracking, and sales automation",
                href: "/insurance",
                icon: Users
              },
              {
                title: "Healthcare Professionals",
                description: "Patient financial wellness and retirement planning tools",
                href: "/healthcare",
                icon: Calendar
              },
              {
                title: "Real Estate Professionals",
                description: "Client referrals, investment tracking, and market insights",
                href: "/realtor",
                icon: CheckCircle
              }
            ].map((path) => (
              <Card key={path.title} className="relative hover:shadow-lg transition-shadow">
                {path.badge && (
                  <Badge className="absolute -top-2 left-4 bg-blue-600 text-white">
                    {path.badge}
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <path.icon className="h-8 w-8 text-blue-600" />
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                  </div>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Professional Benefits */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Built for Growth & Compliance</h2>
              <p className="text-muted-foreground text-lg">
                Everything you need to scale your practice while staying compliant
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  title: "Win Ideal Clients",
                  description: "Advanced lead scoring and automated follow-ups"
                },
                {
                  title: "Streamline Operations", 
                  description: "Workflow automation and client management tools"
                },
                {
                  title: "Stay Compliant",
                  description: "Built-in compliance monitoring and reporting"
                },
                {
                  title: "Grow Revenue",
                  description: "Referral networks and cross-selling opportunities"
                }
              ].map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AudienceGuard>

      {/* Family Content - Only for Families */}
      <AudienceGuard audience="family">
        {/* How It Works */}
        <section id="how-it-works" className="container mx-auto px-4 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to coordinate your family's financial future
            </p>
          </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Capture",
              description: "We help you organize your current financial picture—assets, goals, team members, and priorities."
            },
            {
              step: "2", 
              title: "Meet",
              description: "Connect with vetted professionals who understand your family's unique needs and values."
            },
            {
              step: "3",
              title: "Plan",
              description: "Coordinate investments, tax strategies, estate planning, and insurance for generational wealth."
            }
          ].map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value Calculator Preview */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Calculate Your Family Office Value</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            See how much you could save and what your family office could accomplish
          </p>
          <Button 
            size="lg" 
            className="px-8 py-3"
            onClick={() => navigate("/tools/value-calculator")}
          >
            Try the Calculator
          </Button>
        </div>
      </section>

      {/* Trust Marks */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-8">Trusted by Leading Families</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {[
              "Family Office Network",
              "Private Wealth Magazine", 
              "UHNW Advisor",
              "Trust & Estate"
            ].map((publication) => (
              <div key={publication} className="text-sm font-medium">
                {publication}
              </div>
            ))}
          </div>
        </div>
      </section>
      </AudienceGuard>
    </div>
  );
}