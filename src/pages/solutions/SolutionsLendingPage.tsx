import React, { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Banknote, Home, Car, CreditCard, Building } from 'lucide-react';
import { DemoLauncher } from '@/components/discover/DemoLauncher';
import ShareButton from '@/components/ui/ShareButton';
import { PUBLIC_CONFIG } from '@/config/publicConfig';

const lendingProducts = [
  { type: 'Mortgages', description: 'Home purchase and refinancing', icon: Home },
  { type: 'Securities-Based Lending', description: 'Liquidity without selling investments', icon: Banknote },
  { type: 'Auto Loans', description: 'Vehicle financing optimization', icon: Car },
  { type: 'Credit Optimization', description: 'Strategic credit management', icon: CreditCard },
  { type: 'Commercial Real Estate', description: 'Investment property financing', icon: Building }
];

export function SolutionsLendingPage() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const handleDemo = () => {
    if (PUBLIC_CONFIG.DEMOS_ENABLED) {
      setSelectedDemo('lending-solutions');
    }
  };

  if (!PUBLIC_CONFIG.SOLUTIONS_ENABLED) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lending Solutions Coming Soon</h1>
          <p className="text-muted-foreground">Our lending platform is currently being prepared.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Lending Solutions - Mortgages, Credit & Securities-Based Lending"
        description="Access capital efficiently with mortgage optimization, securities-based lending, and credit management tools designed for wealth preservation."
        keywords={['lending', 'mortgages', 'securities-based lending', 'credit optimization', 'commercial real estate']}
      />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-background to-blue-50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Smart Capital Access
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Access capital when you need it while preserving your investment portfolio and optimizing your overall financial strategy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {PUBLIC_CONFIG.DEMOS_ENABLED && (
                <Button size="lg" onClick={handleDemo} className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  See 60-Second Demo
                </Button>
              )}
              
              <ShareButton
                title="Lending Solutions"
                text="Smart lending and credit optimization tools for wealth preservation"
                variant="outline"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lending Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lending Products</h2>
            <p className="text-lg text-muted-foreground">
              Strategic financing solutions for every need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {lendingProducts.map((product) => (
              <Card key={product.type} className="text-center">
                <CardHeader>
                  <product.icon className="w-12 h-12 mx-auto text-primary mb-4" />
                  <CardTitle className="text-lg">{product.type}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Lending Solutions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Banknote className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Preserve Investments</h3>
              <p className="text-muted-foreground">Access capital without disrupting your investment strategy</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Optimize Terms</h3>
              <p className="text-muted-foreground">Get the best rates and terms for your situation</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Strategic Planning</h3>
              <p className="text-muted-foreground">Integrate lending into your overall wealth strategy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Our comprehensive lending platform is being finalized. Get notified when it launches.
            </p>
            <Button size="lg">
              Join Waitlist
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Launcher */}
      {selectedDemo && (
        <div key={selectedDemo}>
          <DemoLauncher demoId={selectedDemo} />
        </div>
      )}
    </div>
  );
}