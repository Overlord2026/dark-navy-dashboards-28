import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Target, Users } from 'lucide-react';

const GuidesIndexPage: React.FC = () => {
  const guides = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of wealth management and financial planning',
      icon: BookOpen,
      category: 'Beginner'
    },
    {
      title: 'Investment Strategies',
      description: 'Comprehensive guide to investment approaches and portfolio management',
      icon: Target,
      category: 'Intermediate'
    },
    {
      title: 'Estate Planning Basics',
      description: 'Understanding wills, trusts, and legacy planning fundamentals',
      icon: FileText,
      category: 'Intermediate'
    },
    {
      title: 'Family Office Setup',
      description: 'How to establish and manage a family office structure',
      icon: Users,
      category: 'Advanced'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Guides & Resources
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Step-by-step guides to help you navigate complex financial decisions and strategies.
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <Card key={guide.title} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary/10">
                          <Icon className="h-6 w-6 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{guide.title}</CardTitle>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            guide.category === 'Beginner' 
                              ? 'bg-green-100 text-green-800'
                              : guide.category === 'Intermediate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {guide.category}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground">
                        {guide.description}
                      </CardDescription>
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

export default GuidesIndexPage;