import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Share2, ArrowRight, Shield, FileText, Building, Calculator } from 'lucide-react';
import catalogConfig from '@/config/catalogConfig.json';
import { routeExists } from '@/tools/routeMap';

const solutionMeta = {
  investments: {
    title: 'Investment Solutions',
    description: 'Portfolio optimization, private markets, and wealth management tools',
    keywords: ['investments', 'portfolio optimization', 'private markets', 'wealth management']
  },
  annuities: {
    title: 'Annuities Solutions', 
    description: 'Income planning, suitability analysis, and product comparison tools',
    keywords: ['annuities', 'retirement income', 'SPIA', 'DIA', 'MYGA', 'FIA']
  },
  insurance: {
    title: 'Insurance Solutions',
    description: 'Life, disability, LTC needs analysis and Medicare guidance',
    keywords: ['life insurance', 'disability insurance', 'long term care', 'medicare']
  },
  tax: {
    title: 'Tax Planning Solutions',
    description: 'Roth conversions, tax-loss harvesting, and compliance tools',
    keywords: ['tax planning', 'roth conversion', 'tax optimization', 'compliance']
  },
  estate: {
    title: 'Estate Planning Solutions',
    description: 'Trusts, beneficiaries, POA, and wealth transfer strategies',
    keywords: ['estate planning', 'trusts', 'beneficiaries', 'wealth transfer']
  },
  health: {
    title: 'Health & Longevity Solutions',
    description: 'Protocols, screenings, and healthcare coordination',
    keywords: ['health', 'longevity', 'healthcare', 'wellness protocols']
  },
  practice: {
    title: 'Practice Management Solutions',
    description: 'Client engagement, compliance, and workflow automation',
    keywords: ['practice management', 'client engagement', 'compliance', 'workflow']
  },
  nil: {
    title: 'NIL Solutions',
    description: 'Name, Image, Likeness compliance and deal management',
    keywords: ['NIL', 'name image likeness', 'athlete marketing', 'compliance']
  }
};

export default function SolutionCategoryPage() {
  const { category } = useParams<{ category: string }>();
  
  if (!category || !solutionMeta[category as keyof typeof solutionMeta]) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Solution Category Not Found</h1>
          <p className="text-muted-foreground">The requested solution category could not be found.</p>
          <Link to="/solutions">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Solutions
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const meta = solutionMeta[category as keyof typeof solutionMeta];
  
  // Get tools for this solution category
  const categoryTools = (catalogConfig as any[])
    .filter(item => item.solutions?.includes(category))
    .sort((a, b) => {
      // Sort by status: ready first, then by label
      if (a.status === 'ready' && b.status !== 'ready') return -1;
      if (a.status !== 'ready' && b.status === 'ready') return 1;
      return a.label.localeCompare(b.label);
    });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${meta.title} - MyBFOCFO`,
          text: meta.description,
          url: window.location.href
        });
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <Helmet>
        <title>{meta.title} | MyBFOCFO</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords.join(', ')} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
          
          {/* Breadcrumb */}
          <div className="container mx-auto px-4 py-4">
            <Link to="/solutions" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Solutions
            </Link>
          </div>

          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 capitalize">
                  {meta.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {meta.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    See 60-Second Demo
                  </Button>
                  
                  <Button variant="outline" size="lg" onClick={handleShare} className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Category
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Tools Grid */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Available Tools
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {categoryTools.length} professional tools in this category
                </p>
              </div>

              {categoryTools.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No tools available in this category yet.</p>
                  <Link to="/solutions">
                    <Button variant="outline" className="mt-4">
                      Explore Other Categories
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((tool) => (
                    <Card key={tool.key} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{tool.label}</CardTitle>
                            <Badge 
                              variant={tool.status === 'ready' ? 'default' : 'secondary'} 
                              className="mt-2"
                            >
                              {tool.status === 'ready' ? 'Ready' : 'Coming Soon'}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {tool.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {tool.summary}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {tool.tags?.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Action Button */}
                        <Link to={routeExists(tool.route) ? tool.route : `/preview/${tool.key}`}>
                          <Button 
                            variant={tool.status === 'ready' ? 'default' : 'outline'} 
                            className="w-full"
                          >
                            {tool.status === 'ready' ? 'Open Tool' : 'See Preview'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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