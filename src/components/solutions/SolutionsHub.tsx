import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Shield, 
  CreditCard, 
  PiggyBank, 
  Calculator, 
  Building,
  Play,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import catalogConfig from '@/config/catalogConfig.json';

const solutionCategories = [
  {
    key: 'investments',
    title: 'Investments',
    description: 'Portfolio optimization, private markets, and investment strategies',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    route: '/solutions/investments'
  },
  {
    key: 'annuities',
    title: 'Annuities',
    description: 'Income planning, product comparison, and fiduciary guidance',
    icon: PiggyBank,
    color: 'text-green-600', 
    bgColor: 'bg-green-50 dark:bg-green-950/50',
    route: '/solutions/annuities'
  },
  {
    key: 'insurance',
    title: 'Insurance',
    description: 'Life, disability, long-term care, and Medicare planning',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/50', 
    route: '/solutions/insurance'
  },
  {
    key: 'lending',
    title: 'Lending',
    description: 'Mortgage optimization, private lending, and credit strategies',
    icon: CreditCard,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/50',
    route: '/solutions/lending'
  },
  {
    key: 'tax',
    title: 'Tax Planning',
    description: 'Optimization strategies, compliance, and advanced planning',
    icon: Calculator,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/50',
    route: '/solutions/tax'
  },
  {
    key: 'estate',
    title: 'Estate Planning',
    description: 'Wealth transfer, trust strategies, and legacy planning',
    icon: Building,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
    route: '/solutions/estate'
  }
];

export function SolutionsHub() {
  const navigate = useNavigate();

  const getSolutionTools = (solutionKey: string) => {
    return (catalogConfig as any[]).filter(tool => 
      tool.solutions && tool.solutions.includes(solutionKey)
    );
  };

  const handleSolutionClick = (solution: typeof solutionCategories[0]) => {
    navigate(solution.route);
  };

  const handleDemoClick = (solutionKey: string) => {
    navigate(`/demos/solution-${solutionKey}`);
  };

  return (
    <>
      <Helmet>
        <title>Financial Solutions Hub | Family Office Marketplace</title>
        <meta name="description" content="Comprehensive financial solutions including investments, insurance, lending, tax planning, and estate strategies" />
        <meta name="keywords" content="financial planning, investment solutions, insurance, tax planning, estate planning, family office" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">
                Financial Solutions Hub
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Comprehensive financial solutions with professional-grade tools, 
                educational resources, and expert guidance all in one place.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/start/families')}>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => handleDemoClick('overview')}>
                  <Play className="w-4 h-4 mr-2" />
                  Watch Overview
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutionCategories.map((solution) => {
              const IconComponent = solution.icon;
              const toolCount = getSolutionTools(solution.key).length;
              
              return (
                <Card 
                  key={solution.key}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                  onClick={() => handleSolutionClick(solution)}
                >
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-lg ${solution.bgColor} flex items-center justify-center mb-4`}>
                      <IconComponent className={`w-6 h-6 ${solution.color}`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {solution.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {solution.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {toolCount} {toolCount === 1 ? 'Tool' : 'Tools'}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDemoClick(solution.key);
                          }}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Demo
                        </Button>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="border-t bg-muted/50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Ready to explore our solutions?
              </h2>
              <p className="text-muted-foreground mb-8">
                Start with our family onboarding to get personalized tool recommendations, 
                or browse our full catalog of professional-grade financial planning tools.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/start/families')}>
                  Start Family Onboarding
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/discover')}>
                  Browse All Tools
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}