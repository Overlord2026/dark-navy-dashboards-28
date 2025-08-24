import React, { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Receipt, Calculator, FileText, DollarSign, TrendingDown } from 'lucide-react';
import { CATALOG_TOOLS } from '@/data/catalogTools';
import { DemoLauncher } from '@/components/discover/DemoLauncher';
import ShareButton from '@/components/ui/ShareButton';
import { PUBLIC_CONFIG } from '@/config/publicConfig';
import ToolGate from '@/components/ToolGate';

const taxStrategies = [
  { strategy: 'Roth Conversions', description: 'Strategic tax-advantaged transfers', icon: TrendingDown },
  { strategy: 'Tax Loss Harvesting', description: 'Offset gains with strategic losses', icon: Calculator },
  { strategy: 'Charitable Giving', description: 'Maximize deductions while giving back', icon: FileText },
  { strategy: 'Retirement Planning', description: 'Optimize withdrawal strategies', icon: DollarSign }
];

export function SolutionsTaxPage() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const taxTools = CATALOG_TOOLS.filter(tool => 
    tool.solutions.includes('tax')
  );

  const handleDemo = () => {
    if (PUBLIC_CONFIG.DEMOS_ENABLED) {
      setSelectedDemo('tax-solutions');
    }
  };

  if (!PUBLIC_CONFIG.SOLUTIONS_ENABLED) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tax Planning Solutions Coming Soon</h1>
          <p className="text-muted-foreground">Our tax planning platform is currently being prepared.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Tax Planning Solutions - Roth Conversions, Charitable Giving & Optimization"
        description="Proactive tax planning tools including Roth conversion ladders, charitable giving strategies, and comprehensive tax optimization for wealth preservation."
        keywords={['tax planning', 'roth conversion', 'tax optimization', 'charitable giving', 'tax strategies']}
      />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Proactive Tax Planning
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Keep more of what you earn with strategic tax planning tools and multi-year optimization strategies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {PUBLIC_CONFIG.DEMOS_ENABLED && (
                <Button size="lg" onClick={handleDemo} className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  See 60-Second Demo
                </Button>
              )}
              
              <ShareButton
                title="Tax Planning Solutions"
                text="Proactive tax planning tools for wealth optimization and strategic tax reduction"
                variant="outline"
                size="lg"
                persona="advisor"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tax Strategies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tax Optimization Strategies</h2>
            <p className="text-lg text-muted-foreground">
              Proven strategies to minimize your lifetime tax burden
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {taxStrategies.map((item) => (
              <Card key={item.strategy} className="text-center">
                <CardHeader>
                  <item.icon className="w-12 h-12 mx-auto text-primary mb-4" />
                  <CardTitle className="text-lg">{item.strategy}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tax Planning Tools</h2>
            <p className="text-lg text-muted-foreground">
              Professional-grade tools for strategic tax optimization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {taxTools.map((tool) => (
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
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Save Thousands in Taxes</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Our clients typically save 15-30% on their annual tax bill through strategic planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Get Tax Analysis
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
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