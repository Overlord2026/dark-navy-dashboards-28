import React, { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, TrendingUp, Shield, Calculator, Star, AlertTriangle, Diamond } from 'lucide-react';
import { CATALOG_TOOLS } from '@/data/catalogTools';
import { DemoLauncher } from '@/components/discover/DemoLauncher';
import ShareButton from '@/components/ui/ShareButton';
import { PUBLIC_CONFIG } from '@/config/publicConfig';
import ToolGate from '@/components/ToolGate';

export function SolutionsInvestmentsPage() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const investmentTools = CATALOG_TOOLS.filter(tool => 
    tool.solutions.includes('investments')
  );

  const coreTools = investmentTools.filter(tool => !tool.key.includes('private'));
  const privateMarketTools = investmentTools.filter(tool => tool.key.includes('private') || tool.key.includes('capital-calls'));

  const handleDemo = () => {
    if (PUBLIC_CONFIG.DEMOS_ENABLED) {
      setSelectedDemo('investments-solutions');
    }
  };

  if (!PUBLIC_CONFIG.SOLUTIONS_ENABLED) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Investment Solutions Coming Soon</h1>
          <p className="text-muted-foreground">Our investment platform is currently being prepared.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Investment Solutions - Portfolio Management & Private Markets Access"
        description="Professional investment tools including retirement planning, portfolio optimization, and exclusive private market opportunities for sophisticated investors."
        keywords={['investments', 'portfolio management', 'private markets', 'retirement planning', 'asset allocation']}
      />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Investment Excellence
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Build and preserve wealth with professional-grade investment tools and exclusive access to private markets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {PUBLIC_CONFIG.DEMOS_ENABLED && (
                <Button size="lg" onClick={handleDemo} className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  See 60-Second Demo
                </Button>
              )}
              
              <ShareButton
                title="Investment Solutions"
                text="Professional investment tools and private market access for sophisticated investors"
                variant="outline"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Investment Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="core" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="core">Core Investments</TabsTrigger>
              <TabsTrigger value="private">Private Markets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="core" className="mt-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Core Investment Tools</h2>
                <p className="text-muted-foreground">
                  Essential tools for retirement planning and portfolio management
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coreTools.map((tool) => (
                  <ToolGate key={tool.key} toolKey={tool.key}>
                    {({onClick}) => (
                      <Card 
                        className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col"
                        onClick={onClick}
                        data-tool-card={tool.key}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{tool.label}</CardTitle>
                            <Badge variant={tool.status === 'ready' ? 'default' : 'secondary'}>
                              {tool.status === 'ready' ? 'Ready' : 'Coming Soon'}
                            </Badge>
                          </div>
                          <CardDescription className="flex-1">
                            {tool.summary}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto">
                          <Button variant="outline" className="w-full">
                            {tool.status === 'ready' ? 'Open Tool' : 'Preview'}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </ToolGate>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="private" className="mt-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                  <Diamond className="w-6 h-6 text-primary" />
                  Private Markets Access
                </h2>
                <p className="text-muted-foreground">
                  Exclusive investment opportunities previously reserved for institutional investors
                </p>
              </div>

              <Alert className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Private investments involve significant risks and are suitable only for sophisticated investors. 
                  All investments are subject to loss and past performance does not guarantee future results.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {privateMarketTools.map((tool) => (
                  <ToolGate key={tool.key} toolKey={tool.key}>
                    {({onClick}) => (
                      <Card 
                        className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col border-primary/20"
                        onClick={onClick}
                        data-tool-card={tool.key}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Diamond className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">{tool.label}</CardTitle>
                            <Badge variant="default">Premium</Badge>
                          </div>
                          <CardDescription className="flex-1">
                            {tool.summary}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto">
                          <Button className="w-full">
                            Access Private Markets
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </ToolGate>
                ))}
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4 text-center">Private Market Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Real Estate</h4>
                    <p className="text-sm text-muted-foreground">Commercial properties, REITs, and development projects</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Private Equity</h4>
                    <p className="text-sm text-muted-foreground">Growth companies and buyout opportunities</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Alternative Funds</h4>
                    <p className="text-sm text-muted-foreground">Hedge funds, commodities, and structured products</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Investment Platform</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fiduciary Standard</h3>
              <p className="text-muted-foreground">All recommendations are made in your best interest</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparent Analysis</h3>
              <p className="text-muted-foreground">Clear calculations and performance tracking</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Access</h3>
              <p className="text-muted-foreground">Private market opportunities not available elsewhere</p>
            </div>
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