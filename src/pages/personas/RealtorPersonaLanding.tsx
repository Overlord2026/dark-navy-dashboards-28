import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, TrendingUp, Shield, Calculator, MessageSquare } from 'lucide-react';

const RealtorPersonaLanding: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Building2,
      title: "MLS Sync & Listing Builder",
      description: "Connect your MLS, sync listings automatically, and create stunning property packs with cap-rate calculations."
    },
    {
      icon: Users,
      title: "Owner/Investor CRM + Entity Linking",
      description: "Manage your client relationships, track property ownership through LLCs, and automate compliance reminders."
    },
    {
      icon: TrendingUp,
      title: "Cap-Rate & Cash-Flow Insights",
      description: "Generate instant investment analysis, market comps, and rental projections to wow your clients."
    },
    {
      icon: Shield,
      title: "Client Portals & Secure Vault",
      description: "Share deeds, settlement statements, and reports through secure client portals with white-label branding."
    },
    {
      icon: Calculator,
      title: "Retirement Roadmap Integration",
      description: "Map property cash flows into retirement income phases (Now/Later/Growth/Legacy) for comprehensive planning."
    },
    {
      icon: MessageSquare,
      title: "Communications Suite",
      description: "Unified SMS, voice, and email with call recording, templates, and automated follow-ups."
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur border-b border-brand-primary/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-brand-primary text-xl font-bold">BFO</div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/realtor/onboarding')}
            className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark"
          >
            Get Started (Free)
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-brand-text mb-6">
            Turn listings into lifetime clients.
          </h1>
          <p className="text-xl text-brand-text/80 mb-8 max-w-2xl mx-auto">
            One platform for listings, owners, analytics, and wealth planning—powered by BFO.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              onClick={() => navigate('/realtor/onboarding')}
              className="bg-brand-primary hover:bg-brand-primary/90 text-brand-dark font-semibold px-8 py-3"
            >
              Get Started (Free)
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/realtor/dashboard?demo=true')}
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark px-8 py-3"
            >
              See Live Demo
            </Button>
          </div>

          {/* Trust Row */}
          <p className="text-brand-text/60 text-sm">
            Fiduciary-driven. SOC2-minded. White-label ready.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-brand-bg border-brand-primary/20 hover:border-brand-primary/40 transition-colors">
                <CardContent className="p-6">
                  <benefit.icon className="w-12 h-12 text-brand-primary mb-4" />
                  <h3 className="text-brand-text font-semibold text-lg mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-brand-text/70">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-brand-primary/5">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-brand-text mb-6">
            Ready to transform your real estate business?
          </h2>
          <p className="text-brand-text/80 mb-8">
            Join realtors and property managers who are building lasting client relationships through comprehensive wealth planning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/realtor/onboarding')}
              className="bg-brand-primary hover:bg-brand-primary/90 text-brand-dark font-semibold px-8 py-3"
            >
              Get Started (Free)
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/realtor/dashboard?demo=true')}
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark px-8 py-3"
            >
              See Live Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RealtorPersonaLanding;