import React, { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Shield, Heart, Calculator, FileText, Users, CheckCircle } from 'lucide-react';
import { CATALOG_TOOLS } from '@/data/catalogTools';
import { DemoLauncher } from '@/components/discover/DemoLauncher';
import ShareButton from '@/components/ui/ShareButton';
import { PUBLIC_CONFIG } from '@/config/publicConfig';
import ToolGate from '@/components/ToolGate';

const insuranceTypes = [
  { type: 'Life Insurance', description: 'Protect your family\'s financial future', icon: Shield },
  { type: 'Health Insurance', description: 'Medicare and health plan optimization', icon: Heart },
  { type: 'Long-Term Care', description: 'Plan for care costs and funding', icon: Users },
  { type: 'Disability', description: 'Income protection strategies', icon: CheckCircle }
];

export function SolutionsInsurancePage() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const insuranceTools = CATALOG_TOOLS.filter(tool => 
    tool.solutions.includes('insurance')
  );

  const handleDemo = () => {
    if (PUBLIC_CONFIG.DEMOS_ENABLED) {
      setSelectedDemo('insurance-solutions');
    }
  };

  if (!PUBLIC_CONFIG.SOLUTIONS_ENABLED) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Insurance Solutions Coming Soon</h1>
          <p className="text-muted-foreground">Our insurance platform is currently being prepared.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Insurance Solutions - Life, Health & Long-Term Care Planning"
        description="Comprehensive insurance planning tools including life needs analysis, Medicare comparison, and long-term care planning with fiduciary guidance."
        keywords={['insurance', 'life insurance', 'medicare', 'long-term care', 'health insurance', 'disability insurance']}
      />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-background to-green-50 dark:from-blue-950/20 dark:via-background dark:to-green-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Insurance Made Smart
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Protect what matters most with intelligent analysis, right-sizing tools, and transparent guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {PUBLIC_CONFIG.DEMOS_ENABLED && (
                <Button size="lg" onClick={handleDemo} className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  See 60-Second Demo
                </Button>
              )}
              
              <ShareButton
                title="Insurance Solutions"
                text="Smart insurance planning tools with life needs analysis and comprehensive coverage review"
                variant="outline"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Coverage Areas</h2>
            <p className="text-lg text-muted-foreground">
              Complete protection across all major insurance categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insuranceTypes.map((item) => (
              <Card key={item.type} className="text-center">
                <CardHeader>
                  <item.icon className="w-12 h-12 mx-auto text-primary mb-4" />
                  <CardTitle className="text-lg">{item.type}</CardTitle>
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
            <h2 className="text-3xl font-bold mb-4">Insurance Tools</h2>
            <p className="text-lg text-muted-foreground">
              Professional-grade tools for smart insurance decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {insuranceTools.map((tool) => (
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

      {/* Demo Launcher */}
      {selectedDemo && (
        <div key={selectedDemo}>
          <DemoLauncher demoId={selectedDemo} />
        </div>
      )}
    </div>
  );
}