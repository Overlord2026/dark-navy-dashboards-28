import { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ExternalLink, Calculator, TrendingUp, Building, FileText, Shield, Heart } from 'lucide-react';
import { SOLUTIONS_CONFIG } from '@/config/solutionsConfig';
import { CATALOG_TOOLS } from '@/data/catalogTools';
import { getDemoById } from '@/config/demoConfig';
import DemoLauncher from '@/components/demos/DemoLauncher';
import ShareButton from '@/components/ui/ShareButton';
import { PUBLIC_CONFIG } from '@/config/publicConfig';

const IconMap = {
  insurance: Shield,
  annuities: Calculator,
  lending: Building,
  investments: TrendingUp,
  tax: FileText,
  estate: FileText
};

const BenefitMap = {
  insurance: "Comprehensive coverage analysis and compliance tools",
  annuities: "Education, calculators, and fiduciary guidance",
  lending: "Credit analysis and loan structuring tools",
  investments: "Portfolio planning and retirement income strategies",
  tax: "Tax optimization and compliance automation",
  estate: "Estate planning and wealth transfer tools"
};

export default function Solutions() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const handleDemo = (solutionKey: string) => {
    // Map solution keys to demo IDs
    const demoMap: { [key: string]: string } = {
      annuities: 'annuities-solutions',
      investments: 'families-retirees',
      insurance: 'insurance-life-annuity'
    };
    
    const demoId = demoMap[solutionKey];
    if (demoId && PUBLIC_CONFIG.DEMOS_ENABLED) {
      setSelectedDemo(demoId);
    }
  };

  const getToolsForSolution = (solutionKey: string) => {
    return CATALOG_TOOLS.filter(tool => 
      tool.solutions.includes(solutionKey as any)
    ).slice(0, 6);
  };

  if (!PUBLIC_CONFIG.SOLUTIONS_ENABLED) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Solutions Coming Soon</h1>
          <p className="text-muted-foreground">Our solutions hub is currently being prepared.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Financial Solutions Hub - Insurance, Investments, Tax & Estate"
        description="Complete financial solutions for professionals and families. Insurance, annuities, investments, tax planning, estate management, and compliance tools."
        keywords={['financial solutions', 'insurance tools', 'investment platform', 'tax planning', 'estate planning', 'annuities']}
      />
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Complete Solutions for Financial Professionals
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Integrated tools and workflows for insurance, investments, tax planning, and more—all in one platform.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Solution</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {SOLUTIONS_CONFIG.map((solution) => {
              const Icon = IconMap[solution.key as keyof typeof IconMap] || Building;
              const benefit = BenefitMap[solution.key as keyof typeof BenefitMap] || "Professional tools and workflows";
              const tools = getToolsForSolution(solution.key);
              const hasDemo = ['annuities', 'investments', 'insurance'].includes(solution.key);

              return (
                <Card key={solution.key} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{solution.label}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {benefit}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Featured Tools */}
                    <div>
                      <h4 className="font-medium mb-2 text-sm text-muted-foreground">Featured Tools:</h4>
                      <div className="space-y-1">
                        {tools.slice(0, 3).map((tool) => (
                          <div key={tool.key} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span>{tool.label}</span>
                            {tool.status === 'coming-soon' && (
                              <Badge variant="secondary" className="text-xs">Soon</Badge>
                            )}
                          </div>
                        ))}
                        {tools.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{tools.length - 3} more tools
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                      {hasDemo && PUBLIC_CONFIG.DEMOS_ENABLED && (
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center gap-2"
                          onClick={() => handleDemo(solution.key)}
                        >
                          <Play className="w-4 h-4" />
                          See 60-sec Demo
                        </Button>
                      )}
                      
                      <Button 
                        className="w-full flex items-center gap-2"
                        onClick={() => window.open(solution.route, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Catalog
                      </Button>

                      <ShareButton
                        title={`${solution.label} Solutions`}
                        text={`Check out our ${solution.label.toLowerCase()} solutions - ${benefit}`}
                        url={`${window.location.origin}${solution.route}`}
                        variant="ghost"
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Launcher */}
      {selectedDemo && (
        <DemoLauncher
          demoId={selectedDemo}
          open={!!selectedDemo}
          onClose={() => setSelectedDemo(null)}
        />
      )}
    </div>
  );
}