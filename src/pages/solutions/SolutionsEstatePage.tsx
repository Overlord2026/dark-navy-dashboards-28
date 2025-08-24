import React, { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, FileText, Shield, Users, Lock, Building } from 'lucide-react';
import { CATALOG_TOOLS } from '@/data/catalogTools';
import { DemoLauncher } from '@/components/discover/DemoLauncher';
import ShareButton from '@/components/ui/ShareButton';
import { PUBLIC_CONFIG } from '@/config/publicConfig';
import ToolGate from '@/components/ToolGate';

const estateElements = [
  { element: 'Wills & Trusts', description: 'Secure document storage and management', icon: FileText },
  { element: 'Beneficiary Management', description: 'Coordinate beneficiaries across all accounts', icon: Users },
  { element: 'Powers of Attorney', description: 'Financial and healthcare authority delegation', icon: Shield },
  { element: 'Entity Structures', description: 'Business and investment entity organization', icon: Building }
];

export function SolutionsEstatePage() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const estateTools = CATALOG_TOOLS.filter(tool => 
    tool.solutions.includes('estate')
  );

  const handleDemo = () => {
    if (PUBLIC_CONFIG.DEMOS_ENABLED) {
      setSelectedDemo('estate-solutions');
    }
  };

  if (!PUBLIC_CONFIG.SOLUTIONS_ENABLED) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Estate Planning Solutions Coming Soon</h1>
          <p className="text-muted-foreground">Our estate planning platform is currently being prepared.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Estate Planning Solutions - Wills, Trusts & Wealth Transfer"
        description="Comprehensive estate planning tools including document management, beneficiary coordination, and wealth transfer strategies for family legacy preservation."
        keywords={['estate planning', 'wills', 'trusts', 'beneficiaries', 'wealth transfer', 'family legacy']}
      />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-background to-orange-50 dark:from-amber-950/20 dark:via-background dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Preserve Your Legacy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Organize, protect, and efficiently transfer your wealth to future generations with comprehensive estate planning tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {PUBLIC_CONFIG.DEMOS_ENABLED && (
                <Button size="lg" onClick={handleDemo} className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  See 60-Second Demo
                </Button>
              )}
              
              <ShareButton
                title="Estate Planning Solutions"
                text="Comprehensive estate planning and wealth transfer tools for family legacy preservation"
                variant="outline"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Estate Elements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Estate Planning Elements</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for comprehensive estate planning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {estateElements.map((item) => (
              <Card key={item.element} className="text-center">
                <CardHeader>
                  <item.icon className="w-12 h-12 mx-auto text-primary mb-4" />
                  <CardTitle className="text-lg">{item.element}</CardTitle>
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
            <h2 className="text-3xl font-bold mb-4">Estate Planning Tools</h2>
            <p className="text-lg text-muted-foreground">
              Professional-grade tools for comprehensive estate management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {estateTools.map((tool) => (
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

      {/* Security & Privacy */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Bank-Level Security</h2>
            <p className="text-lg text-muted-foreground">
              Your most sensitive documents deserve the highest level of protection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Encrypted Storage</h3>
              <p className="text-muted-foreground">256-bit encryption for all documents and data</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Access Control</h3>
              <p className="text-muted-foreground">Granular permissions and audit trails</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Family Sharing</h3>
              <p className="text-muted-foreground">Secure sharing with trusted family members</p>
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