import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Play, Users, TrendingUp, Calculator, Shield, Receipt, FileText, Heart, CheckCircle, Award } from 'lucide-react';
import { CATALOG_CATEGORIES } from '@/data/catalogTools';
import { SOLUTIONS_CONFIG } from '@/config/solutionsConfig';
import SEOHead from '@/components/seo/SEOHead';
import ShareButton from '@/components/ui/ShareButton';
import { DemoLauncher } from '@/components/discover/DemoLauncher';
import { PUBLIC_CONFIG } from '@/config/publicConfig';

const iconMap = {
  TrendingUp,
  Calculator, 
  Shield,
  Receipt,
  FileText,
  Heart,
  Users,
  CheckCircle,
  Award
};

const SolutionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDemo, setSelectedDemo] = React.useState<string | null>(null);

  const handleDemo = () => {
    if (PUBLIC_CONFIG.DEMOS_ENABLED) {
      setSelectedDemo('solutions-hub');
    }
  };

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Financial Solutions Hub - Investment, Tax, Estate & Insurance Tools"
        description="Comprehensive financial solutions platform with tools for investments, tax planning, estate planning, insurance, and more. Built for families and financial professionals."
        keywords={['financial solutions', 'investment tools', 'tax planning', 'estate planning', 'insurance', 'annuities']}
      />
      
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Financial Solutions Hub
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Technology platforms and solutions designed for financial professionals and family offices.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {PUBLIC_CONFIG.DEMOS_ENABLED && (
                  <Button size="lg" onClick={handleDemo} className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    See 60-Second Demo
                  </Button>
                )}
                
                <ShareButton
                  title="Financial Solutions Hub"
                  text="Comprehensive financial solutions platform with tools for investments, tax planning, estate planning, and more"
                  variant="outline"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Solution Categories</h2>
              <p className="text-lg text-muted-foreground">
                Explore our comprehensive suite of financial planning tools
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {SOLUTIONS_CONFIG.map((solution) => {
                const category = CATALOG_CATEGORIES[solution.key as keyof typeof CATALOG_CATEGORIES];
                if (!category) return null;
                
                const IconComponent = iconMap[category.icon as keyof typeof iconMap] || FileText;
                
                return (
                  <Card 
                    key={solution.key} 
                    className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => handleCategoryClick(solution.route)}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors w-fit">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription className="text-center">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Explore {category.title}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Tools */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Tools</h2>
              <p className="text-lg text-muted-foreground">
                Popular tools across all solution categories
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[
                { title: 'Retirement Roadmap', description: 'Turn assets into lifetime income', category: 'Investments' },
                { title: 'Annuity Calculators', description: 'Compare SPIA, DIA, MYGA features', category: 'Annuities' },
                { title: 'Life Needs Analysis', description: 'Right-size coverage with sliders', category: 'Insurance' },
                { title: 'Roth Conversion Ladder', description: 'Multi-year conversion planning', category: 'Tax Planning' }
              ].map((tool, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <Badge variant="secondary" className="mx-auto mb-2 w-fit">
                      {tool.category}
                    </Badge>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Demo Launcher */}
      {selectedDemo && (
        <div key={selectedDemo}>
          <DemoLauncher demoId={selectedDemo} />
        </div>
      )}
    </div>
  );
};

export default SolutionsPage;