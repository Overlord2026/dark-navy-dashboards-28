import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, ExternalLink } from 'lucide-react';
import { CATALOG_TOOLS, CATALOG_CATEGORIES, getToolsByCategory } from '@/data/catalogTools';
import { getSolutionByKey } from '@/config/solutionsConfig';
import SEOHead from '@/components/seo/SEOHead';
import ShareButton from '@/components/ui/ShareButton';
import { DemoLauncher } from '@/components/discover/DemoLauncher';
import { PUBLIC_CONFIG } from '@/config/publicConfig';
import { routeExists } from '@/tools/routeMap';

export default function SolutionCategoryPage() {
  const { solutionKey } = useParams<{ solutionKey: string }>();
  const navigate = useNavigate();
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  if (!solutionKey) {
    return <div>Solution not found</div>;
  }

  const solution = getSolutionByKey(solutionKey);
  const category = CATALOG_CATEGORIES[solutionKey as keyof typeof CATALOG_CATEGORIES];
  const tools = getToolsByCategory(solutionKey as any);

  if (!solution || !category) {
    return <div>Solution not found</div>;
  }

  const handleDemo = () => {
    if (PUBLIC_CONFIG.DEMOS_ENABLED) {
      setSelectedDemo(`${solutionKey}-solutions`);
    }
  };

  const handleToolClick = (tool: typeof CATALOG_TOOLS[0]) => {
    // Check if route exists, if not redirect to preview
    if (routeExists(tool.route)) {
      navigate(tool.route);
    } else {
      navigate(`/preview/${tool.key}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Ready</Badge>;
      case 'beta':
        return <Badge variant="secondary">Beta</Badge>;
      case 'coming-soon':
        return <Badge variant="outline">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${category.title} Solutions - ${category.description}`}
        description={`${category.description}. Comprehensive ${category.title.toLowerCase()} tools and solutions for families and financial professionals.`}
        keywords={[category.title.toLowerCase(), 'financial tools', 'planning', 'compliance']}
      />
      
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back button */}
              <button 
                onClick={() => navigate('/solutions')}
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Solutions
              </button>
              
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {category.title} Solutions
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {category.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {PUBLIC_CONFIG.DEMOS_ENABLED && (
                    <Button size="lg" onClick={handleDemo} className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      See 60-Second Demo
                    </Button>
                  )}
                  
                  <ShareButton
                    title={`${category.title} Solutions`}
                    text={category.description}
                    variant="outline"
                    size="lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Available Tools</h2>
              <p className="text-lg text-muted-foreground">
                {tools.length} tools available in {category.title.toLowerCase()}
              </p>
            </div>
            
            {tools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {tools.map((tool) => (
                  <Card 
                    key={tool.key} 
                    className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col"
                    onClick={() => handleToolClick(tool)}
                  >
                    <CardHeader className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {tool.type}
                        </Badge>
                        {getStatusBadge(tool.status)}
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {tool.label}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {tool.summary}
                      </CardDescription>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {tool.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        {tool.status === 'ready' ? 'Open Tool' : 'Learn More'}
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
                <p className="text-muted-foreground mb-6">
                  Tools for {category.title.toLowerCase()} are currently being developed.
                </p>
                <Button variant="outline" onClick={() => navigate('/solutions')}>
                  Explore Other Solutions
                </Button>
              </div>
            )}
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
}