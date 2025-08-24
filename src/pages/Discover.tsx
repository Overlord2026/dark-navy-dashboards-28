import React, { useEffect } from 'react';
import { PersonaCarousel } from '@/components/discover/PersonaCarousel';
import { CatalogShelf } from '@/components/discover/CatalogShelf';
import { TrustExplainer } from '@/components/discover/TrustExplainer';
import { CTAStickyBar } from '@/components/discover/CTAStickyBar';
import { FooterMinimal } from '@/components/discover/FooterMinimal';
import { PublicNavigation } from '@/components/discover/PublicNavigation';
import { ShareButton } from '@/components/discover/ShareButton';
import { DemoLauncher } from '@/components/discover/DemoLauncher';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ArrowRight, Shield, Users, Zap } from 'lucide-react';
import { PUBLIC_CONFIG, withFeatureFlag } from '@/config/publicConfig';
import SchemaOrganization from '@/components/seo/SchemaOrganization';
import SchemaWebSite from '@/components/seo/SchemaWebSite';
import SEOHead from '@/components/seo/SEOHead';

const Discover: React.FC = () => {

  const handleStartWorkspace = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.hero.cta', { source: 'hero' });
    }
    
    window.location.href = '/onboarding';
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="myBFOCFO — One shared workspace for families & pros"
        description="One shared workspace for families and their trusted professionals. AI you can trust, receipts you can prove. Organize everything securely with compliance built-in."
        keywords={['family office', 'financial planning', 'wealth management', 'compliance', 'secure workspace']}
        ogImage="/og/discover.png"
      />
      {PUBLIC_CONFIG.DISCOVER_ENABLED && <SchemaOrganization />}
      {PUBLIC_CONFIG.DISCOVER_ENABLED && <SchemaWebSite />}
      <PublicNavigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-light to-navy/90 pt-20 pb-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              One shared workspace for{' '}
              <span className="bg-gradient-to-r from-gold via-gold-hover to-accent bg-clip-text text-transparent">
                families and their trusted pros
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
              AI you can trust, receipts you can prove.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-gold hover:bg-gold-hover text-navy font-semibold px-8 py-4" onClick={handleStartWorkspace}>
                <ArrowRight className="mr-2 h-5 w-5" />
                Start your workspace
              </Button>
              {withFeatureFlag('DEMOS_ENABLED',
                <DemoLauncher 
                  demoId="overview"
                  trigger={
                    <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4">
                      <Play className="mr-2 h-5 w-5" />
                      See 60-second demo
                    </Button>
                  }
                />
              )}
            </div>
            
            <div className="pt-8">
              <ShareButton 
                text="Check this out — a secure platform to organize everything in one place and keep a record you can trust"
                url={window.location.href}
                className="text-white/60 hover:text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Persona Carousel */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose your path</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every persona gets the tools they need, with compliance and proof built in.
            </p>
          </div>
          <PersonaCarousel />
        </div>
      </section>

      {/* Benefits Strip */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-gold" />
              <span className="font-semibold">Everything in one place</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gold" />
              <span className="font-semibold">Invite your people</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gold" />
              <span className="font-semibold">Compliance built-in</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Shelf */}
      {withFeatureFlag('CATALOG_ENABLED',
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore our catalog</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tools, courses, guides, and rails to help you succeed.
              </p>
            </div>
            <CatalogShelf />
          </div>
        </section>
      )}

      {/* Trust Explainer */}
      {withFeatureFlag('TRUST_EXPLAINER_ENABLED',
        <section className="py-16 bg-muted/30">
          <TrustExplainer />
        </section>
      )}

      {/* About & Tools Strip */}
      <section className="py-16 bg-background border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">About us</h3>
              <p className="text-muted-foreground mb-4">
                We're building the future of family office technology—where every family 
                can have enterprise-grade tools and their trusted professionals can collaborate 
                seamlessly.
              </p>
              <Button variant="outline" asChild>
                <a href="/about">Learn more</a>
              </Button>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Tools & Calculators</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Value Calculator", href: "/tools/value-calculator", toolKey: "value-calculator" },
                  { title: "Target Analyzer", href: "/tools/target-analyzer", toolKey: "target-analyzer" },
                  { title: "Tax Optimizer", href: "/tools/tax-optimizer", toolKey: "tax-optimizer" },
                  { title: "Estate Planner", href: "/tools/estate-planner", toolKey: "estate-planner" },
                  { title: "Risk Assessor", href: "/tools/risk-assessor", toolKey: "risk-assessor" },
                  { title: "Portfolio Tracker", href: "/tools/portfolio-tracker", toolKey: "portfolio-tracker" },
                  { title: "Income Planner", href: "/tools/income-planner", toolKey: "income-planner" },
                  { title: "Document Vault", href: "/tools/document-vault", toolKey: "wealth-vault" },
                ].map((tool) => (
                  <Button key={tool.title} variant="ghost" asChild className="justify-start">
                    <a href={tool.href || `/preview/${tool.toolKey}`}>
                      {tool.title}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterMinimal />
      {withFeatureFlag('CTA_BAR_ENABLED', <CTAStickyBar />)}
      
      {/* Patent Footer */}
      <div className="border-t bg-muted/30 py-6">
        <div className="container mx-auto px-6">
          <p className="text-sm text-muted-foreground text-center max-w-4xl mx-auto">
            Certain features are the subject of pending patent applications. 
            This presentation does not disclose proprietary algorithms or trade secrets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Discover;