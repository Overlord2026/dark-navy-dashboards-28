import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, BookOpen, HelpCircle, Shield } from 'lucide-react';

const ResourcesPage: React.FC = () => {
  const navigate = useNavigate();

  const resourceCards = [
    {
      title: 'Calculators',
      description: 'Financial calculators and planning tools',
      icon: Calculator,
      route: '/resources/calculators',
      color: 'from-primary/20 to-primary/10'
    },
    {
      title: 'Guides',
      description: 'Step-by-step guides and best practices',
      icon: BookOpen,
      route: '/resources/guides',
      color: 'from-secondary/20 to-secondary/10'
    },
    {
      title: 'Glossary',
      description: 'Financial terms and definitions',
      icon: HelpCircle,
      route: '/resources/glossary',
      color: 'from-accent/20 to-accent/10'
    },
    {
      title: 'Security & Compliance',
      description: 'Security protocols and compliance information',
      icon: Shield,
      route: '/resources/security',
      color: 'from-muted/20 to-muted/10'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Resources
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Access financial calculators, guides, glossary, and security information to support your wealth management journey.
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resourceCards.map((resource) => {
                const Icon = resource.icon;
                return (
                  <Card 
                    key={resource.title}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br"
                    style={{ background: `linear-gradient(to bottom right, hsl(var(--${resource.color.split('/')[0].replace('from-', '')})), hsl(var(--${resource.color.split('/')[1].replace('to-', '')})))` }}
                    onClick={() => navigate(resource.route)}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-background/80 backdrop-blur-sm w-fit">
                        <Icon className="h-8 w-8 text-foreground" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-center">
                        <span className="text-sm font-medium text-primary group-hover:underline">
                          Explore →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage;