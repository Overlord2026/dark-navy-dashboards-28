import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Shield, TrendingUp, Calendar, Building } from 'lucide-react';
import HeaderSpacer from '@/components/layout/HeaderSpacer';

const prosTools = [
  {
    title: "Client Portal",
    description: "Secure client communication and document sharing",
    icon: Users,
    href: "/pros/client-portal"
  },
  {
    title: "Compliance Dashboard",
    description: "Stay compliant with automated tracking and reporting",
    icon: Shield,
    href: "/pros/compliance"
  },
  {
    title: "Document Vault",
    description: "Professional document management and workflow",
    icon: FileText,
    href: "/pros/documents"
  },
  {
    title: "Practice Analytics",
    description: "Insights and metrics to grow your practice",
    icon: TrendingUp,
    href: "/pros/analytics"
  },
  {
    title: "Client Meetings",
    description: "Schedule and manage client interactions",
    icon: Calendar,
    href: "/pros/meetings"
  },
  {
    title: "Business Development",
    description: "Tools to expand and enhance your practice",
    icon: Building,
    href: "/pros/business-development"
  }
];

export default function ProsIndex() {
  const handleDemoClick = () => {
    console.log('Demo clicked');
  };

  return (
    <div className="page-surface">
      <HeaderSpacer />
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Professional Suite
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            Comprehensive tools for financial advisors, CPAs, attorneys, and insurance professionals to grow and manage their practice
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleDemoClick}
              className="bg-bfo-gold text-black hover:bg-bfo-gold/90 text-lg px-8 py-4"
            >
              Watch 60-sec demo
            </Button>
            
            <Button
              variant="outline"
              className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black text-lg px-8 py-4"
            >
              Explore tools
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Professional Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prosTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold hover:shadow-xl transition-all duration-300 group cursor-pointer shadow-lg shadow-bfo-gold/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-bfo-gold/10 group-hover:bg-bfo-gold/20 transition-colors">
                        <Icon className="h-6 w-6 text-bfo-gold" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-bfo-gold transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-white/80 text-sm leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}