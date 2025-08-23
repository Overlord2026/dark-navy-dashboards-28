import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Share2, ArrowRight, TrendingUp, Shield, Calculator, BookOpen, Users, FileText, Heart, Building } from 'lucide-react';
import catalogConfig from '@/config/catalogConfig.json';
import { routeExists } from '@/tools/routeMap';

const solutionsCategories = [
  {
    key: 'investments',
    title: 'Investments',
    icon: TrendingUp,
    description: 'Portfolio optimization, private markets, and wealth management tools',
    color: 'bg-green-500',
    route: '/solutions/investments'
  },
  {
    key: 'annuities',
    title: 'Annuities',
    icon: Shield,
    description: 'Income planning, suitability analysis, and product comparison',
    color: 'bg-blue-500',
    route: '/solutions/annuities'
  },
  {
    key: 'insurance',
    title: 'Insurance',
    icon: Heart,
    description: 'Life, disability, LTC needs analysis and Medicare guidance',
    color: 'bg-red-500',
    route: '/solutions/insurance'
  },
  {
    key: 'tax',
    title: 'Tax Planning',
    icon: Calculator,
    description: 'Roth conversions, tax-loss harvesting, and compliance tools',
    color: 'bg-purple-500',
    route: '/solutions/tax'
  },
  {
    key: 'estate',
    title: 'Estate',
    icon: Building,
    description: 'Trusts, beneficiaries, POA, and wealth transfer strategies',
    color: 'bg-indigo-500',
    route: '/solutions/estate'
  },
  {
    key: 'health',
    title: 'Health & Longevity',
    icon: Heart,
    description: 'Protocols, screenings, and healthcare coordination',
    color: 'bg-emerald-500',
    route: '/solutions/health'
  },
  {
    key: 'practice',
    title: 'Practice Management',
    icon: Users,
    description: 'Client engagement, compliance, and workflow automation',
    color: 'bg-orange-500',
    route: '/solutions/practice'
  },
  {
    key: 'nil',
    title: 'NIL',
    icon: FileText,
    description: 'Name, Image, Likeness compliance and deal management',
    color: 'bg-cyan-500',
    route: '/solutions/nil'
  }
];

export default function SolutionsHub() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Financial Solutions Hub - MyBFOCFO',
          text: 'Comprehensive financial solutions for families and professionals',
          url: window.location.href
        });
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Get featured tools from catalog
  const featuredTools = (catalogConfig as any[])
    .filter(item => item.status === 'ready')
    .slice(0, 6);

  return (
    <>
      <Helmet>
        <title>Solutions Hub - Comprehensive Financial Tools | MyBFOCFO</title>
        <meta name="description" content="Technology platforms and solutions designed for financial professionals and family offices. Investments, insurance, tax planning, estate, and more." />
        <meta name="keywords" content="financial solutions, investment tools, insurance, tax planning, estate planning, practice management" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
          
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Financial Solutions Hub
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Technology platforms and solutions designed for financial professionals and family offices.
                  From investments to estate planning—all integrated, compliant, and audit-ready.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    See 60-Second Demo
                  </Button>
                  
                  <Button variant="outline" size="lg" onClick={handleShare} className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Solutions
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Solutions Categories Grid */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Solution Categories
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Professional-grade tools organized by practice area
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {solutionsCategories.map((category) => {
                  const IconComponent = category.icon;
                  const toolCount = (catalogConfig as any[])
                    .filter(item => item.solutions?.includes(category.key)).length;
                  
                  return (
                    <Card key={category.key} className="group hover:shadow-lg transition-shadow">
                      <CardHeader className="text-center">
                        <div className={`w-12 h-12 rounded-lg ${category.color} mx-auto mb-4 flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {toolCount} tools
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {category.description}
                        </p>
                        <Link to={routeExists(category.route) ? category.route : `/preview/${category.key}`}>
                          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            Explore Tools
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
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
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Featured Tools
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Ready-to-use tools that professionals love
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTools.map((tool) => (
                  <Card key={tool.key} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{tool.label}</CardTitle>
                          <Badge variant={tool.status === 'ready' ? 'default' : 'secondary'} className="mt-2">
                            {tool.status === 'ready' ? 'Ready' : 'Coming Soon'}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          {tool.solutions?.slice(0, 2).map((solution: string) => (
                            <Badge key={solution} variant="outline" className="text-xs">
                              {solution}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {tool.summary}
                      </p>
                      <Link to={routeExists(tool.route) ? tool.route : `/preview/${tool.key}`}>
                        <Button variant="outline" className="w-full">
                          Open Tool
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Trust Footer */}
          <section className="py-12 border-t">
            <div className="container mx-auto px-4">
              <div className="text-center text-sm text-muted-foreground space-y-2">
                <div className="flex items-center justify-center gap-6 text-xs">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Smart Checks
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Proof Slips
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    Vault
                  </span>
                  <span className="flex items-center gap-1">
                    <Calculator className="w-3 h-3" />
                    Time-Stamp
                  </span>
                </div>
                <div>
                  Built with enterprise-grade security and audit trails
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}